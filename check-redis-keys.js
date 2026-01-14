/**
 * Check Redis Keys in Real-Time
 * Shows all active keys with their TTL
 * Run: node check-redis-keys.js
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
    console.error('❌ Missing environment variables');
    process.exit(1);
}

// Execute Redis command
async function redisCommand(command) {
    return new Promise((resolve, reject) => {
        const url = new URL(REDIS_URL);
        const body = JSON.stringify(command);

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
                    resolve(response.result);
                } else {
                    reject(new Error(`Command failed: ${res.statusCode} ${data}`));
                }
            });
        });

        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

// Get all keys matching pattern
async function getKeys(pattern = '*') {
    try {
        const keys = await redisCommand(['KEYS', pattern]);
        return keys || [];
    } catch (error) {
        console.error('Error getting keys:', error.message);
        return [];
    }
}

// Get key type
async function getType(key) {
    try {
        const type = await redisCommand(['TYPE', key]);
        return type;
    } catch (error) {
        return 'unknown';
    }
}

// Get hash fields (for @upstash/ratelimit sliding window)
async function getHash(key) {
    try {
        const hash = await redisCommand(['HGETALL', key]);
        return hash;
    } catch (error) {
        return null;
    }
}

// Get TTL for a key
async function getTTL(key) {
    try {
        const ttl = await redisCommand(['TTL', key]);
        return ttl;
    } catch (error) {
        return -1;
    }
}

// Get value for a key
async function getValue(key) {
    try {
        const value = await redisCommand(['GET', key]);
        return value;
    } catch (error) {
        return null;
    }
}

// Main function
async function checkRedis() {
    console.log('🔍 Checking Redis Database...\n');

    // Get all keys
    const allKeys = await getKeys('*');

    if (allKeys.length === 0) {
        console.log('📭 Database is empty (0 keys)');
        console.log('\n💡 This is normal! Rate limit keys are created when:');
        console.log('   1. Someone submits the contact form');
        console.log('   2. Keys expire automatically after 1 hour');
        console.log('\n🧪 To test rate limiting:');
        console.log('   1. Submit the contact form 3 times');
        console.log('   2. Run this script again to see the keys');
        console.log('   3. Try submitting again - you should be rate limited\n');
        return;
    }

    console.log(`📊 Found ${allKeys.length} key(s):\n`);

    // Check each key
    for (const key of allKeys) {
        const ttl = await getTTL(key);
        const value = await getValue(key);

        console.log(`🔑 Key: ${key}`);
        console.log(`   Value: ${value}`);

        if (ttl === -1) {
            console.log(`   TTL: No expiration`);
        } else if (ttl === -2) {
            console.log(`   TTL: Key doesn't exist`);
        } else {
            const minutes = Math.floor(ttl / 60);
            const seconds = ttl % 60;
            console.log(`   TTL: ${minutes}m ${seconds}s (${ttl} seconds)`);
        }
        console.log('');
    }

    // Show rate limit specific keys
    const rateLimitKeys = allKeys.filter(k => k.includes('ratelimit') || k.includes('rl:'));
    if (rateLimitKeys.length > 0) {
        console.log(`\n🚦 Rate Limit Keys: ${rateLimitKeys.length}`);
        rateLimitKeys.forEach(k => console.log(`   - ${k}`));
    }
}

// Run with auto-refresh option
async function runWithRefresh() {
    const args = process.argv.slice(2);
    const watchMode = args.includes('--watch') || args.includes('-w');

    if (watchMode) {
        console.log('👀 Watch mode enabled. Press Ctrl+C to exit.\n');

        // Run immediately
        await checkRedis();

        // Then run every 5 seconds
        setInterval(async () => {
            console.log('\n' + '='.repeat(60));
            console.log('🔄 Refreshing... ' + new Date().toLocaleTimeString());
            console.log('='.repeat(60) + '\n');
            await checkRedis();
        }, 5000);
    } else {
        await checkRedis();
        console.log('💡 Tip: Use --watch flag to monitor keys in real-time');
        console.log('   Example: node check-redis-keys.js --watch\n');
    }
}

runWithRefresh();
