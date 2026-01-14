/**
 * Advanced Redis Monitor
 * Shows all keys with detailed information including hash types
 * Run: node monitor-redis.js [--watch]
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
                    reject(new Error(`Command failed: ${res.statusCode}`));
                }
            });
        });

        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

// Get all keys
async function getKeys() {
    try {
        return await redisCommand(['KEYS', '*']) || [];
    } catch (error) {
        return [];
    }
}

// Get key type
async function getType(key) {
    try {
        return await redisCommand(['TYPE', key]);
    } catch (error) {
        return 'unknown';
    }
}

// Get TTL
async function getTTL(key) {
    try {
        return await redisCommand(['TTL', key]);
    } catch (error) {
        return -1;
    }
}

// Get string value
async function getString(key) {
    try {
        return await redisCommand(['GET', key]);
    } catch (error) {
        return null;
    }
}

// Get hash value
async function getHash(key) {
    try {
        return await redisCommand(['HGETALL', key]);
    } catch (error) {
        return null;
    }
}

// Format TTL
function formatTTL(ttl) {
    if (ttl === -1) return 'No expiration';
    if (ttl === -2) return 'Key expired';

    const hours = Math.floor(ttl / 3600);
    const minutes = Math.floor((ttl % 3600) / 60);
    const seconds = ttl % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    } else {
        return `${seconds}s`;
    }
}

// Main monitoring function
async function monitor() {
    const keys = await getKeys();

    console.log(`\n${'='.repeat(70)}`);
    console.log(`📊 Redis Monitor - ${new Date().toLocaleString()}`);
    console.log(`${'='.repeat(70)}\n`);

    if (keys.length === 0) {
        console.log('📭 Database is empty (0 keys)\n');
        console.log('💡 Keys are created when:');
        console.log('   • Contact form is submitted');
        console.log('   • AI chat is used');
        console.log('   • Any rate-limited endpoint is accessed\n');
        console.log('🧪 To test: Submit the contact form or use AI chat\n');
        return;
    }

    console.log(`Found ${keys.length} key(s):\n`);

    // Group keys by prefix
    const grouped = {};
    keys.forEach(key => {
        const prefix = key.split(':')[0];
        if (!grouped[prefix]) grouped[prefix] = [];
        grouped[prefix].push(key);
    });

    // Display grouped keys
    for (const [prefix, prefixKeys] of Object.entries(grouped)) {
        console.log(`\n📁 ${prefix.toUpperCase()} (${prefixKeys.length} keys)`);
        console.log('─'.repeat(70));

        for (const key of prefixKeys) {
            const type = await getType(key);
            const ttl = await getTTL(key);

            console.log(`\n🔑 ${key}`);
            console.log(`   Type: ${type}`);
            console.log(`   TTL:  ${formatTTL(ttl)} (${ttl}s)`);

            if (type === 'string') {
                const value = await getString(key);
                console.log(`   Value: ${value}`);
            } else if (type === 'hash') {
                const hash = await getHash(key);
                if (hash) {
                    const fields = Object.keys(hash);
                    console.log(`   Fields: ${fields.length}`);

                    // Show first few fields
                    const preview = fields.slice(0, 5);
                    preview.forEach(field => {
                        const val = hash[field];
                        const display = val.length > 50 ? val.substring(0, 50) + '...' : val;
                        console.log(`     ${field}: ${display}`);
                    });

                    if (fields.length > 5) {
                        console.log(`     ... and ${fields.length - 5} more fields`);
                    }
                }
            }
        }
    }

    console.log(`\n${'='.repeat(70)}\n`);
}

// Run with optional watch mode
async function run() {
    const args = process.argv.slice(2);
    const watchMode = args.includes('--watch') || args.includes('-w');

    if (watchMode) {
        console.log('👀 Watch mode enabled. Press Ctrl+C to exit.');

        // Run immediately
        await monitor();

        // Then every 3 seconds
        setInterval(monitor, 3000);
    } else {
        await monitor();
        console.log('💡 Tip: Use --watch to monitor in real-time');
        console.log('   Example: node monitor-redis.js --watch\n');
    }
}

run().catch(console.error);
