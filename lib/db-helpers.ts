// Helper functions for CRUD operations
import db from './db';

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Generic CRUD operations
export function getAll(table: string, filters?: Record<string, any>) {
  let query = `SELECT * FROM ${table} WHERE 1=1`;
  const params: any[] = [];

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        query += ` AND ${key} = ?`;
        params.push(value);
      }
    });
  }

  query += ' ORDER BY created_at DESC';
  return db.prepare(query).all(...params);
}

export function getById(table: string, id: string) {
  return db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
}

export function create(table: string, data: Record<string, any>) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map(() => '?').join(', ');
  
  db.prepare(`
    INSERT INTO ${table} (${keys.join(', ')})
    VALUES (${placeholders})
  `).run(...values);
  
  return getById(table, data.id);
}

export function update(table: string, id: string, data: Record<string, any>) {
  const updates = Object.keys(data).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(data), id];
  
  db.prepare(`
    UPDATE ${table} SET ${updates} WHERE id = ?
  `).run(...values);
  
  return getById(table, id);
}

export function deleteRecord(table: string, id: string) {
  db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
  return { success: true };
}

export function search(table: string, searchFields: string[], searchTerm: string) {
  const conditions = searchFields.map(field => `${field} LIKE ?`).join(' OR ');
  const params = searchFields.map(() => `%${searchTerm}%`);
  
  return db.prepare(`
    SELECT * FROM ${table}
    WHERE ${conditions}
    ORDER BY created_at DESC
  `).all(...params);
}

// Authentication helper
export function authenticateUser(email: string, password: string) {
  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    
    if (!user) {
      return null;
    }

    // Em produção, use bcryptjs para comparar senhas
    // const isValidPassword = await compare(password, user.password);
    // Por enquanto, comparação simples para desenvolvimento
    const isValidPassword = password === 'admin123'; // Simplificado para desenvolvimento
    
    if (!isValidPassword) {
      return null;
    }

    // Não retornar a senha
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      active: user.active === 1,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}
