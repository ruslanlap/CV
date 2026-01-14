/**
 * Cleanup test data from Upstash Redis
 * Run: node cleanup-redis.js
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

async function cleanup() {
    console.log('🧹 Cleaning up test data from Redis...\n');

    // Get all keys
    const keys = await redisCommand(['KEYS', '*']);

    if (!keys || keys.length === 0) {
        console.log('✅ Database is already clean - no keys found\n');
        return;
    }

    console.log(`Found ${keys.length} key(s):\n`);

    // Show all keys
    for (const key of keys) {
        const type = await redisCommand(['TYPE', key]);
        const ttl = await redisCommand(['TTL', key]);

        let value;
        if (type === 'string') {
            value = await redisCommand(['GET', key]);
        } else {
            value = `(${type})`;
        }

        const ttlStr = ttl === -1 ? 'no expiry' : `${ttl}s`;
        console.log(`  ${key}`);
        console.log(`    Type: ${type}`);
        console.log(`    Value: ${value}`);
        console.log(`    TTL: ${ttlStr}`);
        console.log('');
    }

    // Ask which keys to delete
    const testKeys = keys.filter(k =>
        k.startsWith('test:') ||
        k.startsWith('rl:test:') ||
        k.includes('192.168.1.100') // Test IP
    );

    if (testKeys.length > 0) {
        console.log(`\n🗑️  Deleting ${testKeys.length} test key(s)...\n`);

        for (const key of testKeys) {
            await redisCommand(['DEL', key]);
            console.log(`  ✅ Deleted: ${key}`);
        }

        console.log('\n✅ Cleanup complete!\n');
    } else {
        console.log('ℹ️  No test keys found to delete\n');
    }

    // Show remaining keys
    const remainingKeys = await redisCommand(['KEYS', '*']);

    if (remainingKeys && remainingKeys.length > 0) {
        console.log(`\n📊 Remaining keys (${remainingKeys.length}):`);
        for (const key of remainingKeys) {
            console.log(`  - ${key}`);
        }
        console.log('\nThese are production rate limit counters - they will auto-expire.\n');
    } else {
        console.log('✅ Database is now completely clean\n');
    }
}

cleanup().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
