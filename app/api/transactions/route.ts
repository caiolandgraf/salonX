import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { generateId } from '@/lib/db-helpers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let query = 'SELECT * FROM transactions WHERE 1=1';
    const params: any[] = [];

    if (type && type !== 'ALL') {
      query += ' AND type = ?';
      params.push(type);
    }

    if (status && status !== 'ALL') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (startDate) {
      query += ' AND due_date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND due_date <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY due_date DESC, created_at DESC';

    const transactions = db.prepare(query).all(...params);

    const formatted = transactions.map((txn: any) => ({
      id: txn.id,
      type: txn.type,
      category: txn.category,
      description: txn.description,
      amount: txn.amount,
      status: txn.status,
      paymentMethod: txn.payment_method,
      dueDate: txn.due_date,
      paidDate: txn.paid_date,
      clientId: txn.client_id,
      professionalId: txn.professional_id,
      notes: txn.notes,
      createdAt: txn.created_at,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    return NextResponse.json({ error: 'Erro ao buscar transações' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, category, description, amount, dueDate } = body;

    if (!type || !category || !description || !amount || !dueDate) {
      return NextResponse.json(
        { error: 'Tipo, categoria, descrição, valor e data de vencimento são obrigatórios' },
        { status: 400 }
      );
    }

    const id = generateId('txn');

    db.prepare(`
      INSERT INTO transactions (
        id, type, category, description, amount, status, payment_method,
        due_date, paid_date, client_id, professional_id, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      type,
      category,
      description,
      amount,
      body.status || 'PENDING',
      body.paymentMethod || null,
      dueDate,
      body.paidDate || null,
      body.clientId || null,
      body.professionalId || null,
      body.notes || null
    );

    const newTransaction = db.prepare('SELECT * FROM transactions WHERE id = ?').get(id) as any;

    return NextResponse.json({
      id: newTransaction.id,
      type: newTransaction.type,
      category: newTransaction.category,
      description: newTransaction.description,
      amount: newTransaction.amount,
      status: newTransaction.status,
      paymentMethod: newTransaction.payment_method,
      dueDate: newTransaction.due_date,
      paidDate: newTransaction.paid_date,
      clientId: newTransaction.client_id,
      professionalId: newTransaction.professional_id,
      notes: newTransaction.notes,
      createdAt: newTransaction.created_at,
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    return NextResponse.json({ error: 'Erro ao criar transação' }, { status: 500 });
  }
}
