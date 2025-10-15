import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!product) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Erro ao buscar produto' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    
    const product = db.prepare('SELECT id FROM products WHERE id = ?').get(id);
    if (!product) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }

    // Map frontend fields (camelCase) to database fields (snake_case)
    const fieldMap: Record<string, string> = {
      name: 'name',
      type: 'type',
      category: 'category',
      brand: 'brand',
      sku: 'sku',
      currentStock: 'current_stock',
      minStock: 'min_stock',
      costPrice: 'cost_price',
      salePrice: 'sale_price',
      unit: 'unit',
      supplier: 'supplier',
      description: 'description',
      active: 'active',
    };

    const dbData: any = {};
    for (const [key, value] of Object.entries(body)) {
      const dbKey = fieldMap[key] || key;
      dbData[dbKey] = value;
    }

    const updates = Object.keys(dbData).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(dbData), id];
    
    db.prepare(`UPDATE products SET ${updates} WHERE id = ?`).run(...values);
    
    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Erro ao atualizar produto' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const product = db.prepare('SELECT id FROM products WHERE id = ?').get(id);
    if (!product) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }
    
    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    return NextResponse.json({ success: true, message: 'Produto excluído com sucesso' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Erro ao excluir produto' }, { status: 500 });
  }
}
