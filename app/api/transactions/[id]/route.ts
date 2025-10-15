import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const transaction = db.prepare('SELECT * FROM transactions WHERE id = ?').get(id);
    if (!transaction) {
      return NextResponse.json({ error: 'Transação não encontrada' }, { status: 404 });
    }
    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json({ error: 'Erro ao buscar transação' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    
    const transaction = db.prepare('SELECT id FROM transactions WHERE id = ?').get(id);
    if (!transaction) {
      return NextResponse.json({ error: 'Transação não encontrada' }, { status: 404 });
    }

    // Map frontend fields (camelCase) to database fields (snake_case)
    const fieldMap: Record<string, string> = {
      type: 'type',
      category: 'category',
      description: 'description',
      amount: 'amount',
      status: 'status',
      paymentMethod: 'payment_method',
      dueDate: 'due_date',
      paidDate: 'paid_date',
      clientId: 'client_id',
      professionalId: 'professional_id',
      notes: 'notes',
    };

    const dbData: any = {};
    for (const [key, value] of Object.entries(body)) {
      const dbKey = fieldMap[key] || key;
      dbData[dbKey] = value;
    }

    const updates = Object.keys(dbData).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(dbData), id];
    
    db.prepare(`UPDATE transactions SET ${updates} WHERE id = ?`).run(...values);
    
    const updated = db.prepare('SELECT * FROM transactions WHERE id = ?').get(id);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json({ error: 'Erro ao atualizar transação' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const transaction = db.prepare('SELECT id FROM transactions WHERE id = ?').get(id);
    if (!transaction) {
      return NextResponse.json({ error: 'Transação não encontrada' }, { status: 404 });
    }
    
    db.prepare('DELETE FROM transactions WHERE id = ?').run(id);
    return NextResponse.json({ success: true, message: 'Transação excluída com sucesso' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json({ error: 'Erro ao excluir transação' }, { status: 500 });
  }
}
