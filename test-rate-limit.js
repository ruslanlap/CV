/**
 * Test script for Contact Form Rate Limiting
 * Run: node test-rate-limit.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

function loadEnv() {
    const envPath = path.join(__dirname, '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        line = line.trim();
        if (line && !line.startsWith('#')) {
            const [key, ...valueParts] = line.split('=');
            const value = valueParts.join('=');
            if (key && value) process.env[key.trim()] = value.trim();
        }
    });
}

loadEnv();

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

console.log('🧪 Testing Rate Limiting\n');

async function redisCommand(command) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify(command);
        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${REDIS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(REDIS_URL, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(JSON.parse(data).result);
                } else {
                    reject(new Error(`${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

async function checkRateLimit(ip, attempt) {
    const key = `rl:contact:${ip}`;

    const count = await redisCommand(['INCR', key]);

    if (count === 1) {
        await redisCommand(['EXPIRE', key, '3600']);
    }

    const ttl = await redisCommand(['TTL', key]);
    const allowed = count <= 3;
    const remaining = Math.max(0, 3 - count);

    console.log(`Attempt ${attempt}: Count=${count}/3, Remaining=${remaining}, TTL=${ttl}s, ${allowed ? '✅ ALLOWED' : '❌ BLOCKED'}`);

    return { allowed, count };
}

async function cleanup(ip) {
    await redisCommand(['DEL', `rl:contact:${ip}`]);
    console.log('🧹 Cleaned up\n');
}

async function runTest() {
    const testIP = '192.168.1.100';

    console.log(`Testing IP: ${testIP}\n`);

    await cleanup(testIP);

    for (let i = 1; i <= 5; i++) {
        const result = await checkRateLimit(testIP, i);

        if (i <= 3 && !result.allowed) {
            console.error(`\n❌ Failed: Request ${i} should be allowed`);
            process.exit(1);
        }
        if (i > 3 && result.allowed) {
            console.error(`\n❌ Failed: Request ${i} should be blocked`);
            process.exit(1);
        }

        await new Promise(r => setTimeout(r, 100));
    }

    console.log('\n✅ Rate limiting works correctly!');
    console.log('- Requests 1-3: ✅ Allowed');
    console.log('- Requests 4-5: ❌ Blocked\n');

    await cleanup(testIP);
}

runTest().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
