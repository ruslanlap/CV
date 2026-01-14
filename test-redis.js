/**
 * Test script for Upstash Redis connection
 * Run: node test-redis.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
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

if (!REDIS_URL || !REDIS_TOKEN) {
    console.error('❌ Missing environment variables:');
    console.error('   UPSTASH_REDIS_REST_URL:', REDIS_URL ? '✓' : '✗');
    console.error('   UPSTASH_REDIS_REST_TOKEN:', REDIS_TOKEN ? '✓' : '✗');
    process.exit(1);
}

console.log('🔍 Testing Upstash Redis connection...\n');
console.log('URL:', REDIS_URL);
console.log('Token:', REDIS_TOKEN.substring(0, 10) + '...\n');

// Test 1: PING
function testPing() {
    return new Promise((resolve, reject) => {
        const url = new URL('/ping', REDIS_URL);

        const options = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${REDIS_TOKEN}`
            }
        };

        console.log('Test 1: PING');
        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log('✅ PING successful:', data);
                    resolve();
                } else {
                    console.error('❌ PING failed:', res.statusCode, data);
                    reject(new Error(`PING failed: ${res.statusCode}`));
                }
            });
        });

        req.on('error', (error) => {
            console.error('❌ Request error:', error.message);
            reject(error);
        });

        req.end();
    });
}

// Test 2: SET a test key
function testSet() {
    return new Promise((resolve, reject) => {
        const url = new URL(REDIS_URL);
        const testKey = 'test:connection:' + Date.now();
        const testValue = 'Hello from test script!';

        const body = JSON.stringify(['SET', testKey, testValue, 'EX', '60']);

        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${REDIS_TOKEN}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            }
        };

        console.log('\nTest 2: SET key');
        console.log('Key:', testKey);

        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log('✅ SET successful:', data);
                    resolve(testKey);
                } else {
                    console.error('❌ SET failed:', res.statusCode, data);
                    reject(new Error(`SET failed: ${res.statusCode}`));
                }
            });
        });

        req.on('error', (error) => {
            console.error('❌ Request error:', error.message);
            reject(error);
        });

        req.write(body);
        req.end();
    });
}

// Test 3: GET the test key
function testGet(key) {
    return new Promise((resolve, reject) => {
        const url = new URL(REDIS_URL);
        const body = JSON.stringify(['GET', key]);

        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${REDIS_TOKEN}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            }
        };

        console.log('\nTest 3: GET key');

        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log('✅ GET successful:', data);
                    resolve();
                } else {
                    console.error('❌ GET failed:', res.statusCode, data);
                    reject(new Error(`GET failed: ${res.statusCode}`));
                }
            });
        });

        req.on('error', (error) => {
            console.error('❌ Request error:', error.message);
            reject(error);
        });

        req.write(body);
        req.end();
    });
}

// Test 4: Rate limiting simulation
function testRateLimit() {
    return new Promise((resolve, reject) => {
        const url = new URL(REDIS_URL);
        const testKey = 'rl:test:' + Date.now();

        // Increment counter
        const body = JSON.stringify(['INCR', testKey]);

        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${REDIS_TOKEN}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            }
        };

        console.log('\nTest 4: Rate limiting (INCR)');

        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    const response = JSON.parse(data);
                    console.log('✅ INCR successful. Counter value:', response.result);
                    resolve();
                } else {
                    console.error('❌ INCR failed:', res.statusCode, data);
                    reject(new Error(`INCR failed: ${res.statusCode}`));
                }
            });
        });

        req.on('error', (error) => {
            console.error('❌ Request error:', error.message);
            reject(error);
        });

        req.write(body);
        req.end();
    });
}

// Run all tests
async function runTests() {
    try {
        await testPing();
        const testKey = await testSet();
        await testGet(testKey);
        await testRateLimit();

        console.log('\n✅ All tests passed! Upstash Redis is working correctly.\n');
        console.log('You can now use the contact form with rate limiting.');
    } catch (error) {
        console.error('\n❌ Tests failed:', error.message);
        console.error('\nTroubleshooting:');
        console.error('1. Check your UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env.local');
        console.error('2. Verify the Redis database is active in Upstash console');
        console.error('3. Check if your IP is allowed (if IP restrictions are enabled)');
        process.exit(1);
    }
}

runTests();
