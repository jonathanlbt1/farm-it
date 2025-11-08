const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

async function runMigrations() {
  try {
    console.log('🔄 Iniciando migrations...');

    const migrationsDir = __dirname;
    const files = fs.readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort(); // alphabetical order ensures numeric prefix order

    if (files.length === 0) {
      console.log('Nenhuma migration encontrada em', migrationsDir);
      process.exit(0);
    }

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      console.log(`➡️  Executando migration: ${file}`);
      const sql = fs.readFileSync(filePath, 'utf8');
      await pool.query(sql);
      console.log(`   ✅ ${file} executada`);
    }

    console.log('✅ Todas as migrations executadas com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar migrations:', error);
    process.exit(1);
  }
}

runMigrations();

