import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { hash } from 'bcryptjs';
import { randomUUID } from 'crypto';

export const dynamic = 'force-dynamic';

// GET - Listar todos os usuários
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const active = searchParams.get('active');
    const search = searchParams.get('search');

    let query = `
      SELECT id, name, email, role, phone, active, created_at
      FROM users
      WHERE 1=1
    `;
    const params: any[] = [];

    if (role && role !== 'all') {
      query += ' AND role = ?';
      params.push(role);
    }

    if (active && active !== 'all') {
      query += ' AND active = ?';
      params.push(active === 'true' ? 1 : 0);
    }

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC';

    const users = db.prepare(query).all(...params);

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar usuários' },
      { status: 500 }
    );
  }
}

// POST - Criar novo usuário
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role, phone, active = true } = body;

    // Validações
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: name, email, password, role' },
        { status: 400 }
      );
    }

    // Verificar se email já existe
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 409 }
      );
    }

    // Hash da senha
    const hashedPassword = await hash(password, 10);

    // Criar usuário
    const userId = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO users (id, name, email, password, role, phone, active, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `);

    stmt.run(userId, name, email, hashedPassword, role, phone || null, active ? 1 : 0);

    // Buscar usuário criado
    const newUser = db.prepare(`
      SELECT id, name, email, role, phone, active, created_at
      FROM users WHERE id = ?
    `).get(userId);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    if (error.message && error.message.includes('UNIQUE')) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 409 });
    }
    return NextResponse.json(
      { error: 'Erro ao criar usuário' },
      { status: 500 }
    );
  }
}
