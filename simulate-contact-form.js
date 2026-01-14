/**
 * Simulate Contact Form Submissions
 * Tests rate limiting by making multiple requests
 * Run: node simulate-contact-form.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables
function loadEnv() {
    const envPath = path.join(__dirname, '.env.local');
    if (!fs.existsSync(envPath)) {
        console.error('❌ .env.local file not found');
        process.exit(1);
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');

    lines.forEach(line => {
        line = line.trim();
        if (line && !line.startsWith('#')) {
            const [key, ...valueParts] = line.split('=');
            const value = valueParts.join('=');
            if (key && value) {
                process.env[key.trim()] = value.trim();
            }
        }
    });
}

loadEnv();

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// Simulate rate limit check (like the real API does)
async function checkRateLimit(ip) {
    return new Promise((resolve, reject) => {
        const url = new URL(REDIS_URL);

        // This simulates what @upstash/ratelimit does internally
        const key = `ratelimit:contact:${ip}`;
        const body = JSON.stringify(['INCR', key]);

        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${REDIS_TOKEN}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            }
        };

        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    const response = JSON.parse(data);
                    const count = response.result;

                    // Set expiry on first request
                    if (count === 1) {
                        setExpiry(key, 3600); // 1 hour
                    }

                    resolve({
                        count,
                        allowed: count <= 3,
                        remaining: Math.max(0, 3 - count)
                    });
                } else {
                    reject(new Error(`Failed: ${res.statusCode}`));
                }
            });
        });

        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

// Set expiry for a key
async function setExpiry(key, seconds) {
    return new Promise((resolve, reject) => {
        const url = new URL(REDIS_URL);
        const body = JSON.stringify(['EXPIRE', key, seconds]);

        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${REDIS_TOKEN}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            }
        };

        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve());
        });

        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

// Get all keys
async function getKeys() {
    return new Promise((resolve, reject) => {
        const url = new URL(REDIS_URL);
        const body = JSON.stringify(['KEYS', '*']);

        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${REDIS_TOKEN}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            }
        };

        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    const response = JSON.parse(data);
                    resolve(response.result || []);
                } else {
                    resolve([]);
                }
            });
        });

        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

// Main test
async function runTest() {
    console.log('🧪 Simulating Contact Form Submissions\n');

    const testIP = '192.168.1.100'; // Test IP address

    console.log(`Testing with IP: ${testIP}\n`);
    console.log('Making 5 requests...\n');

    for (let i = 1; i <= 5; i++) {
        try {
            const result = await checkRateLimit(testIP);

            if (result.allowed) {
                console.log(`✅ Request ${i}: ALLOWED (${result.remaining} remaining)`);
            } else {
                console.log(`❌ Request ${i}: BLOCKED (rate limit exceeded)`);
            }

            // Small delay between requests
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            console.error(`❌ Request ${i}: ERROR -`, error.message);
        }
    }

    // Check what keys were created
    console.log('\n📊 Checking Redis keys...\n');
    const keys = await getKeys();

    if (keys.length > 0) {
        console.log(`Found ${keys.length} key(s):`);
        keys.forEach(key => console.log(`   - ${key}`));
    } else {
        console.log('No keys found (they may have expired)');
    }

    console.log('\n✅ Test complete!');
    console.log('\n💡 Now check your Redis Data Browser - you should see the keys!');
    console.log('   Or run: node check-redis-keys.js\n');
}

runTest().catch(console.error);
