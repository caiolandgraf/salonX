import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET - Buscar serviço por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const service = db.prepare(`
      SELECT * FROM services WHERE id = ?
    `).get(id);

    if (!service) {
      return NextResponse.json(
        { error: 'Serviço não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar serviço' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar serviço
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { name, description, duration, price, category, active } = body;

    // Verificar se serviço existe
    const existingService = db.prepare('SELECT id FROM services WHERE id = ?').get(id);
    if (!existingService) {
      return NextResponse.json(
        { error: 'Serviço não encontrado' },
        { status: 404 }
      );
    }

    // Build update query
    const updates: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (duration !== undefined) {
      updates.push('duration = ?');
      values.push(duration);
    }
    if (price !== undefined) {
      updates.push('price = ?');
      values.push(price);
    }
    if (category !== undefined) {
      updates.push('category = ?');
      values.push(category);
    }
    if (active !== undefined) {
      updates.push('active = ?');
      values.push(active ? 1 : 0);
    }

    if (updates.length > 0) {
      values.push(id);
      db.prepare(`
        UPDATE services SET ${updates.join(', ')} WHERE id = ?
      `).run(...values);
    }

    // Retornar serviço atualizado
    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(id);

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar serviço' },
      { status: 500 }
    );
  }
}

// DELETE - Excluir serviço
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Verificar se serviço existe
    const service = db.prepare('SELECT id FROM services WHERE id = ?').get(id);

    if (!service) {
      return NextResponse.json(
        { error: 'Serviço não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se há agendamentos usando este serviço
    const appointments = db.prepare('SELECT COUNT(*) as count FROM appointments WHERE service_id = ?').get(id) as { count: number };
    
    if (appointments.count > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir serviço com agendamentos vinculados. Desative-o em vez de excluir.' },
        { status: 400 }
      );
    }

    db.prepare('DELETE FROM services WHERE id = ?').run(id);

    return NextResponse.json({ success: true, message: 'Serviço excluído com sucesso' });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir serviço' },
      { status: 500 }
    );
  }
}
