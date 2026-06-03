import pg from 'pg';
import fs from 'fs';
import path from 'path';

// Parse .env file manually
const envPath = path.resolve('.env');
let databaseUrl = process.env.DATABASE_URL;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/^DATABASE_URL\s*=\s*["']?([^"'\r\n]+)["']?/m);
  if (match) {
    databaseUrl = match[1];
  }
}

console.log('Testing connection to database...');
console.log('Connection URL (masked):', databaseUrl ? databaseUrl.replace(/:[^:@]+@/, ':****@') : 'Undefined');

const client = new pg.Client({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false
  }
});

async function run() {
  try {
    await client.connect();
    console.log('🎉 Successfully connected using node-postgres (pg)!');
    
    const res = await client.query('SELECT NOW(), version();');
    console.log('Database server time:', res.rows[0].now);
    console.log('Database server version:', res.rows[0].version);
  } catch (err) {
    console.error('❌ Connection failed:');
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
