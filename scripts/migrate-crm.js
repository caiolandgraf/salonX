// Script para executar a migração do CRM
const { migrateCRMTables } = require('./lib/migrate-crm.ts');

console.log('🚀 Executando migração do banco de dados para CRM...\n');

try {
  const result = migrateCRMTables();
  
  if (result.success) {
    console.log('\n✅ Migração concluída com sucesso!');
    process.exit(0);
  } else {
    console.error('\n❌ Erro na migração:', result.error);
    process.exit(1);
  }
} catch (error) {
  console.error('\n❌ Erro ao executar migração:', error);
  process.exit(1);
}
