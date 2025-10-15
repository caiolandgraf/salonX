import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { generateId } from '@/lib/db-helpers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    let query = `
      SELECT sm.*, p.name as product_name 
      FROM stock_movements sm
      LEFT JOIN products p ON sm.product_id = p.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (productId) {
      query += ' AND sm.product_id = ?';
      params.push(productId);
    }

    query += ' ORDER BY sm.created_at DESC';

    const movements = db.prepare(query).all(...params);

    const formatted = movements.map((mov: any) => ({
      id: mov.id,
      productId: mov.product_id,
      productName: mov.product_name,
      type: mov.type,
      quantity: mov.quantity,
      reason: mov.reason,
      userId: mov.user_id,
      createdAt: mov.created_at,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Erro ao buscar movimentações:', error);
    return NextResponse.json({ error: 'Erro ao buscar movimentações' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, type, quantity, reason, userId } = body;

    if (!productId || !type || !quantity) {
      return NextResponse.json(
        { error: 'Produto, tipo e quantidade são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se produto existe
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(productId) as any;
    if (!product) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }

    // Validar estoque para saída
    if (type === 'OUT' && product.current_stock < quantity) {
      return NextResponse.json({ error: 'Estoque insuficiente' }, { status: 400 });
    }

    // Criar movimentação
    const movementId = generateId('mov');
    db.prepare(`
      INSERT INTO stock_movements (id, product_id, type, quantity, reason, user_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      movementId,
      productId,
      type,
      quantity,
      reason || null,
      userId || null
    );

    // Atualizar estoque do produto
    let newStock = product.current_stock;
    if (type === 'IN') {
      newStock += quantity;
    } else if (type === 'OUT') {
      newStock -= quantity;
    } else if (type === 'ADJUSTMENT') {
      newStock = quantity;
    }

    db.prepare('UPDATE products SET current_stock = ? WHERE id = ?').run(newStock, productId);

    const movement = db.prepare(`
      SELECT sm.*, p.name as product_name 
      FROM stock_movements sm
      LEFT JOIN products p ON sm.product_id = p.id
      WHERE sm.id = ?
    `).get(movementId) as any;

    const updatedProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(productId) as any;

    return NextResponse.json({ 
      movement: {
        id: movement.id,
        productId: movement.product_id,
        productName: movement.product_name,
        type: movement.type,
        quantity: movement.quantity,
        reason: movement.reason,
        userId: movement.user_id,
        createdAt: movement.created_at,
      },
      product: {
        id: updatedProduct.id,
        name: updatedProduct.name,
        currentStock: updatedProduct.current_stock,
        minStock: updatedProduct.min_stock,
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar movimentação:', error);
    return NextResponse.json({ error: 'Erro ao criar movimentação' }, { status: 500 });
  }
}
