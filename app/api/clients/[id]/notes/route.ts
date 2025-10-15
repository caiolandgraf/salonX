import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { generateId } from '@/lib/db-helpers';

// GET - Listar notas do cliente
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const notes = db.prepare(`
      SELECT 
        cn.id,
        cn.client_id as clientId,
        cn.user_id as userId,
        u.name as userName,
        cn.content,
        cn.type,
        cn.created_at as createdAt
      FROM client_notes cn
      LEFT JOIN users u ON cn.user_id = u.id
      WHERE cn.client_id = ?
      ORDER BY cn.created_at DESC
    `).all(id);

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching client notes:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar notas do cliente' },
      { status: 500 }
    );
  }
}

// POST - Criar nova nota
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: clientId } = await params;
    const body = await request.json();
    const { content, type } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Conteúdo é obrigatório' },
        { status: 400 }
      );
    }

    const id = generateId('note');
    // Em produção, você pegaria o userId da sessão
    const userId = 'admin-1';

    db.prepare(`
      INSERT INTO client_notes (id, client_id, user_id, content, type)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, clientId, userId, content, type || 'NOTE');

    const note = db.prepare(`
      SELECT 
        cn.id,
        cn.client_id as clientId,
        cn.user_id as userId,
        u.name as userName,
        cn.content,
        cn.type,
        cn.created_at as createdAt
      FROM client_notes cn
      LEFT JOIN users u ON cn.user_id = u.id
      WHERE cn.id = ?
    `).get(id);

    return NextResponse.json(note);
  } catch (error) {
    console.error('Error creating client note:', error);
    return NextResponse.json(
      { error: 'Erro ao criar nota' },
      { status: 500 }
    );
  }
}
