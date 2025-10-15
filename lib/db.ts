import { hashSync } from 'bcryptjs';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'grace.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database tables
export function initializeDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      phone TEXT,
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Clients table
  db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      birthdate TEXT,
      address TEXT,
      city TEXT,
      state TEXT,
      zip_code TEXT,
      notes TEXT,
      total_visits INTEGER DEFAULT 0,
      total_spent REAL DEFAULT 0,
      last_visit TEXT,
      segment TEXT DEFAULT 'NEW',
      tags TEXT,
      source TEXT,
      lifetime_value REAL DEFAULT 0,
      average_ticket REAL DEFAULT 0,
      last_contact_date TEXT,
      next_follow_up TEXT,
      assigned_to TEXT,
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (assigned_to) REFERENCES users(id)
    )
  `);

  // Client notes table
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

  // Client tags table
  db.exec(`
    CREATE TABLE IF NOT EXISTS client_tags (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      color TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Client interactions table
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

  // Professionals table
  db.exec(`
    CREATE TABLE IF NOT EXISTS professionals (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      specialties TEXT,
      commission_rate REAL DEFAULT 30,
      work_schedule TEXT,
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Services table
  db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      duration INTEGER NOT NULL,
      category TEXT,
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Appointments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      client_id TEXT,
      client_name TEXT NOT NULL,
      professional_id TEXT,
      professional_name TEXT NOT NULL,
      service_id TEXT,
      service_name TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      duration INTEGER NOT NULL,
      price REAL NOT NULL,
      status TEXT DEFAULT 'CONFIRMED',
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients(id),
      FOREIGN KEY (professional_id) REFERENCES professionals(id),
      FOREIGN KEY (service_id) REFERENCES services(id)
    )
  `);

  // Products table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      brand TEXT,
      sku TEXT UNIQUE NOT NULL,
      current_stock REAL DEFAULT 0,
      min_stock REAL DEFAULT 10,
      max_stock REAL DEFAULT 50,
      unit TEXT DEFAULT 'UN',
      cost_price REAL NOT NULL,
      sale_price REAL,
      supplier TEXT,
      location TEXT,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Stock movements table
  db.exec(`
    CREATE TABLE IF NOT EXISTS stock_movements (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      type TEXT NOT NULL,
      quantity REAL NOT NULL,
      reason TEXT,
      user_id TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Transactions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      status TEXT DEFAULT 'PENDING',
      payment_method TEXT,
      due_date TEXT NOT NULL,
      paid_date TEXT,
      client_id TEXT,
      professional_id TEXT,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients(id),
      FOREIGN KEY (professional_id) REFERENCES professionals(id)
    )
  `);

  // Sales table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sales (
      id TEXT PRIMARY KEY,
      client_id TEXT,
      professional_id TEXT,
      subtotal REAL NOT NULL,
      discount REAL DEFAULT 0,
      total REAL NOT NULL,
      status TEXT DEFAULT 'COMPLETED',
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients(id),
      FOREIGN KEY (professional_id) REFERENCES professionals(id)
    )
  `);

  // Sale items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sale_items (
      id TEXT PRIMARY KEY,
      sale_id TEXT NOT NULL,
      type TEXT NOT NULL,
      item_id TEXT NOT NULL,
      item_name TEXT NOT NULL,
      quantity REAL NOT NULL,
      price REAL NOT NULL,
      discount REAL DEFAULT 0,
      total REAL NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sale_id) REFERENCES sales(id)
    )
  `);

  // Sale payments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sale_payments (
      id TEXT PRIMARY KEY,
      sale_id TEXT NOT NULL,
      method TEXT NOT NULL,
      amount REAL NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sale_id) REFERENCES sales(id)
    )
  `);

  // Insert default admin user if not exists
  const adminExists = db.prepare('SELECT id FROM users WHERE id = ? OR email = ?').get('admin-1', 'admin@bunx.io');

  if (!adminExists) {
    const hashedPassword = hashSync('admin123', 10);
    db.prepare(`
      INSERT INTO users (id, name, email, password, role, phone, active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      'admin-1',
      'Administrador',
      'admin@bunx.io',
      hashedPassword,
      'ADMIN',
      '(11) 99999-9999',
      1
    );
  }

  // Insert default services
  const servicesCount = db.prepare('SELECT COUNT(*) as count FROM services').get() as { count: number };

  if (servicesCount.count === 0) {
    const services = [
      { id: 's1', name: 'Corte Feminino', description: 'Corte completo', price: 80, duration: 60, category: 'Cabelo' },
      { id: 's2', name: 'Corte Masculino', description: 'Corte masculino', price: 50, duration: 30, category: 'Cabelo' },
      { id: 's3', name: 'Coloração', description: 'Coloração completa', price: 200, duration: 120, category: 'Cabelo' },
      { id: 's4', name: 'Escova', description: 'Escova modeladora', price: 60, duration: 45, category: 'Cabelo' },
      { id: 's5', name: 'Manicure', description: 'Manicure completa', price: 40, duration: 45, category: 'Unhas' },
      { id: 's6', name: 'Pedicure', description: 'Pedicure completa', price: 50, duration: 60, category: 'Unhas' },
    ];

    const stmt = db.prepare(`
      INSERT INTO services (id, name, description, price, duration, category, active)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `);

    for (const service of services) {
      stmt.run(service.id, service.name, service.description, service.price, service.duration, service.category);
    }
  }
}

// Initialize only when not building
if (process.env.NEXT_PHASE !== 'phase-production-build') {
  initializeDatabase();
}

// Seed function can be called manually from a script if needed
// Example: node -e "require('./lib/seed').seedDatabase()"

export default db;
