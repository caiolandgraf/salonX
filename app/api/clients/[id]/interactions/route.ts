import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET - Listar interações do cliente
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const interactions = db.prepare(`
      SELECT 
        id,
        client_id as clientId,
        type,
        description,
        amount,
        date,
        created_at as createdAt
      FROM client_interactions
      WHERE client_id = ?
      ORDER BY date DESC
      LIMIT 50
    `).all(id);

    return NextResponse.json(interactions);
  } catch (error) {
    console.error('Error fetching client interactions:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar interações do cliente' },
      { status: 500 }
    );
  }
}
