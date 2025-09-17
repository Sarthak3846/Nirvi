#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple migration runner for development
async function runMigrations() {
  const migrationsDir = path.join(__dirname, '..', 'migrations');
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();

  console.log('Running migrations...');
  
  for (const file of migrationFiles) {
    console.log(`Running ${file}...`);
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    console.log(sql);
    console.log('---');
  }
  
  console.log('Migration files prepared. Run these SQL commands in your database.');
}

runMigrations().catch(console.error);
