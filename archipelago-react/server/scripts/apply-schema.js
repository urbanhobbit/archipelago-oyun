// Supabase (veya herhangi bir Postgres) üzerine server/schema.sql'i uygular.
// Kullanım: server/.env dosyasında DATABASE_URL (ve gerekiyorsa DB_SSL=true) ayarlı olmalı.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const connectionString = process.env.DATABASE_URL;
if (!connectionString || connectionString.includes('[YOUR-PASSWORD]')) {
  console.error('HATA: server/.env icinde DATABASE_URL ayarli degil (veya hala placeholder icinde).');
  console.error('Supabase Dashboard > Project Settings > Database > Connection string > URI (Direct connection) degerini kullan.');
  process.exit(1);
}

const schemaPath = path.join(__dirname, '..', 'schema.sql');
const sql = fs.readFileSync(schemaPath, 'utf8');

const client = new pg.Client({
  connectionString,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

try {
  await client.connect();
  console.log('Baglanti kuruldu, schema.sql uygulaniyor...');
  await client.query(sql);
  console.log('Basarili: schema.sql uygulandi.');
} catch (err) {
  console.error('HATA:', err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
