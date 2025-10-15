import db from './db';

// Script para migrar o banco de dados com as novas tabelas do CRM
// Execute este script uma vez para atualizar o banco de dados

export function migrateCRMTables() {
  console.log('Iniciando migração das tabelas do CRM...');

  try {
    // Verificar se as colunas já existem
    const tableInfo = db.prepare("PRAGMA table_info(clients)").all() as any[];
    const columns = tableInfo.map((col: any) => col.name);

    // Adicionar novas colunas se não existirem
    if (!columns.includes('city')) {
      console.log('Adicionando coluna city...');
      db.exec('ALTER TABLE clients ADD COLUMN city TEXT');
    }

    if (!columns.includes('state')) {
      console.log('Adicionando coluna state...');
      db.exec('ALTER TABLE clients ADD COLUMN state TEXT');
    }

    if (!columns.includes('zip_code')) {
      console.log('Adicionando coluna zip_code...');
      db.exec('ALTER TABLE clients ADD COLUMN zip_code TEXT');
    }

    if (!columns.includes('segment')) {
      console.log('Adicionando coluna segment...');
      db.exec("ALTER TABLE clients ADD COLUMN segment TEXT DEFAULT 'NEW'");
    }

    if (!columns.includes('tags')) {
      console.log('Adicionando coluna tags...');
      db.exec('ALTER TABLE clients ADD COLUMN tags TEXT');
    }

    if (!columns.includes('source')) {
      console.log('Adicionando coluna source...');
      db.exec('ALTER TABLE clients ADD COLUMN source TEXT');
    }

    if (!columns.includes('lifetime_value')) {
      console.log('Adicionando coluna lifetime_value...');
      db.exec('ALTER TABLE clients ADD COLUMN lifetime_value REAL DEFAULT 0');
    }

    if (!columns.includes('average_ticket')) {
      console.log('Adicionando coluna average_ticket...');
      db.exec('ALTER TABLE clients ADD COLUMN average_ticket REAL DEFAULT 0');
    }

    if (!columns.includes('last_contact_date')) {
      console.log('Adicionando coluna last_contact_date...');
      db.exec('ALTER TABLE clients ADD COLUMN last_contact_date TEXT');
    }

    if (!columns.includes('next_follow_up')) {
      console.log('Adicionando coluna next_follow_up...');
      db.exec('ALTER TABLE clients ADD COLUMN next_follow_up TEXT');
    }

    if (!columns.includes('assigned_to')) {
      console.log('Adicionando coluna assigned_to...');
      db.exec('ALTER TABLE clients ADD COLUMN assigned_to TEXT');
    }

    if (!columns.includes('active')) {
      console.log('Adicionando coluna active...');
      db.exec('ALTER TABLE clients ADD COLUMN active INTEGER DEFAULT 1');
    }

    // Criar tabelas de notas de clientes
    console.log('Criando tabela client_notes...');
    db.exec(`
      CREATE TABLE IF NOT EXISTS client_notes (
        id TEXT PRIMARY KEY,
        client_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        content TEXT NOT NULL,
        type TEXT DEFAULT 'NOTE',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Criar tabelas de tags de clientes
    console.log('Criando tabela client_tags...');
    db.exec(`
      CREATE TABLE IF NOT EXISTS client_tags (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        color TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criar tabela de interações com clientes
    console.log('Criando tabela client_interactions...');
    db.exec(`
      CREATE TABLE IF NOT EXISTS client_interactions (
        id TEXT PRIMARY KEY,
        client_id TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT NOT NULL,
        amount REAL,
        date TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
      )
    `);

    // Inserir tags padrão
    const existingTags = db.prepare('SELECT COUNT(*) as count FROM client_tags').get() as { count: number };
    if (existingTags.count === 0) {
      console.log('Inserindo tags padrão...');
      const defaultTags = [
        { id: 'tag-1', name: 'VIP', color: '#9333ea' },
        { id: 'tag-2', name: 'Fidelizado', color: '#3b82f6' },
        { id: 'tag-3', name: 'Novo', color: '#10b981' },
        { id: 'tag-4', name: 'Promoção', color: '#f59e0b' },
        { id: 'tag-5', name: 'Aniversariante', color: '#ec4899' },
      ];

      const stmt = db.prepare('INSERT INTO client_tags (id, name, color) VALUES (?, ?, ?)');
      for (const tag of defaultTags) {
        stmt.run(tag.id, tag.name, tag.color);
      }
    }

    // Atualizar clientes existentes com segmento padrão
    console.log('Atualizando segmentos dos clientes existentes...');
    db.exec("UPDATE clients SET segment = 'NEW' WHERE segment IS NULL");

    // Calcular valores para clientes existentes
    console.log('Calculando valores de clientes...');
    const clients = db.prepare('SELECT id, total_spent, total_visits FROM clients').all() as any[];
    
    const updateStmt = db.prepare(`
      UPDATE clients 
      SET lifetime_value = ?, 
          average_ticket = ?,
          segment = ?
      WHERE id = ?
    `);

    for (const client of clients) {
      const lifetimeValue = client.total_spent || 0;
      const averageTicket = client.total_visits > 0 
        ? (client.total_spent || 0) / client.total_visits 
        : 0;
      
      // Determinar segmento baseado no gasto total
      let segment = 'NEW';
      if (client.total_visits === 0) {
        segment = 'NEW';
      } else if (lifetimeValue >= 1000) {
        segment = 'VIP';
      } else if (client.total_visits >= 5) {
        segment = 'REGULAR';
      }

      updateStmt.run(lifetimeValue, averageTicket, segment, client.id);
    }

    console.log('✅ Migração do CRM concluída com sucesso!');
    console.log(`Total de clientes atualizados: ${clients.length}`);
    
    return {
      success: true,
      message: 'Migração concluída com sucesso',
      clientsUpdated: clients.length
    };
  } catch (error) {
    console.error('❌ Erro na migração:', error);
    return {
      success: false,
      message: 'Erro na migração',
      error: error
    };
  }
}

// Executar migração se chamado diretamente
if (require.main === module) {
  migrateCRMTables();
}
