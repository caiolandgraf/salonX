import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { generateId } from '@/lib/db-helpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, clientId, professionalId, payments, subtotal, discount, total, notes } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'A venda deve ter pelo menos um item' }, { status: 400 });
    }

    if (!payments || payments.length === 0) {
      return NextResponse.json({ error: 'A venda deve ter pelo menos uma forma de pagamento' }, { status: 400 });
    }

    const saleId = generateId('sal');

    // Create sale
    db.prepare(`
      INSERT INTO sales (id, client_id, professional_id, subtotal, discount, total, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      saleId,
      clientId || null,
      professionalId || null,
      subtotal,
      discount || 0,
      total,
      'COMPLETED',
      notes || null
    );

    // Insert sale items
    for (const item of items) {
      const itemId = generateId('itm');
      db.prepare(`
        INSERT INTO sale_items (id, sale_id, type, item_id, item_name, quantity, price, discount, total)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        itemId,
        saleId,
        item.type,
        item.itemId,
        item.name,
        item.quantity,
        item.price,
        item.discount || 0,
        item.total
      );

      // Update product stock if it's a product
      if (item.type === 'PRODUCT') {
        const product = db.prepare('SELECT current_stock FROM products WHERE id = ?').get(item.itemId) as any;
        if (product) {
          const newStock = product.current_stock - item.quantity;
          db.prepare('UPDATE products SET current_stock = ? WHERE id = ?').run(newStock, item.itemId);
          
          // Register stock movement
          const movId = generateId('mov');
          db.prepare(`
            INSERT INTO stock_movements (id, product_id, type, quantity, reason)
            VALUES (?, ?, ?, ?, ?)
          `).run(movId, item.itemId, 'OUT', item.quantity, `Venda #${saleId}`);
        }
      }
    }

    // Insert payments
    for (const payment of payments) {
      const paymentId = generateId('pay');
      db.prepare(`
        INSERT INTO sale_payments (id, sale_id, method, amount)
        VALUES (?, ?, ?, ?)
      `).run(paymentId, saleId, payment.method, payment.amount);
    }

    // Create transaction for income
    const transactionId = generateId('txn');
    db.prepare(`
      INSERT INTO transactions (
        id, type, category, description, amount, status, payment_method,
        due_date, paid_date, client_id, professional_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      transactionId,
      'INCOME',
      'SALE',
      `Venda #${saleId}`,
      total,
      'PAID',
      payments[0]?.method,
      new Date().toISOString().split('T')[0],
      new Date().toISOString().split('T')[0],
      clientId || null,
      professionalId || null
    );

    // Update client stats if client selected
    if (clientId) {
      const client = db.prepare('SELECT total_visits, total_spent FROM clients WHERE id = ?').get(clientId) as any;
      if (client) {
        db.prepare(`
          UPDATE clients 
          SET total_visits = ?, total_spent = ?, last_visit = ?
          WHERE id = ?
        `).run(
          client.total_visits + 1,
          client.total_spent + total,
          new Date().toISOString().split('T')[0],
          clientId
        );
      }
    }

    // Return created sale
    const sale = db.prepare('SELECT * FROM sales WHERE id = ?').get(saleId) as any;
    const saleItems = db.prepare('SELECT * FROM sale_items WHERE sale_id = ?').all(saleId);
    const salePayments = db.prepare('SELECT * FROM sale_payments WHERE sale_id = ?').all(saleId);

    return NextResponse.json({
      id: sale.id,
      clientId: sale.client_id,
      professionalId: sale.professional_id,
      subtotal: sale.subtotal,
      discount: sale.discount,
      total: sale.total,
      status: sale.status,
      notes: sale.notes,
      items: saleItems.map((item: any) => ({
        id: item.id,
        type: item.type,
        itemId: item.item_id,
        name: item.item_name,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
        total: item.total,
      })),
      payments: salePayments.map((pay: any) => ({
        id: pay.id,
        method: pay.method,
        amount: pay.amount,
      })),
      createdAt: sale.created_at,
    }, { status: 201 });
  } catch (error) {
    console.error('POST sale error:', error);
    return NextResponse.json({ error: 'Erro ao registrar venda' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let query = 'SELECT * FROM sales WHERE 1=1';
    const params: any[] = [];

    if (startDate) {
      query += ` AND date(created_at) >= ?`;
      params.push(startDate);
    }

    if (endDate) {
      query += ` AND date(created_at) <= ?`;
      params.push(endDate);
    }

    query += ' ORDER BY created_at DESC';

    const sales = db.prepare(query).all(...params);

    const formatted = sales.map((sale: any) => ({
      id: sale.id,
      clientId: sale.client_id,
      professionalId: sale.professional_id,
      subtotal: sale.subtotal,
      discount: sale.discount,
      total: sale.total,
      status: sale.status,
      notes: sale.notes,
      createdAt: sale.created_at,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('GET sales error:', error);
    return NextResponse.json({ error: 'Erro ao buscar vendas' }, { status: 500 });
  }
}
