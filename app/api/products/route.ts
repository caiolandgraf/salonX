import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { generateId } from '@/lib/db-helpers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const lowStock = searchParams.get('lowStock');

    let query = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];

    if (category && category !== 'ALL') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (type && type !== 'ALL') {
      query += ' AND type = ?';
      params.push(type);
    }

    if (lowStock === 'true') {
      query += ' AND current_stock <= min_stock';
    }

    query += ' ORDER BY name';

    const products = db.prepare(query).all(...params);

    const formatted = products.map((product: any) => ({
      id: product.id,
      name: product.name,
      type: product.type,
      category: product.category,
      brand: product.brand,
      sku: product.sku,
      currentStock: product.current_stock,
      minStock: product.min_stock,
      maxStock: product.max_stock,
      unit: product.unit,
      costPrice: product.cost_price,
      salePrice: product.sale_price,
      supplier: product.supplier,
      location: product.location,
      notes: product.notes,
      createdAt: product.created_at,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json({ error: 'Erro ao buscar produtos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, category, sku, costPrice, unit } = body;

    if (!name || !type || !category || !sku || !costPrice) {
      return NextResponse.json(
        { error: 'Nome, tipo, categoria, SKU e preço de custo são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se SKU já existe
    const existing = db.prepare('SELECT id FROM products WHERE sku = ?').get(sku);
    if (existing) {
      return NextResponse.json(
        { error: 'SKU já cadastrado' },
        { status: 400 }
      );
    }

    const id = generateId('prd');

    db.prepare(`
      INSERT INTO products (
        id, name, type, category, brand, sku, current_stock, min_stock, max_stock,
        unit, cost_price, sale_price, supplier, location, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      name,
      type,
      category,
      body.brand || null,
      sku,
      body.currentStock || 0,
      body.minStock || 10,
      body.maxStock || 50,
      unit || 'UN',
      costPrice,
      body.salePrice || null,
      body.supplier || null,
      body.location || null,
      body.notes || null
    );

    const newProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as any;

    return NextResponse.json({
      id: newProduct.id,
      name: newProduct.name,
      type: newProduct.type,
      category: newProduct.category,
      brand: newProduct.brand,
      sku: newProduct.sku,
      currentStock: newProduct.current_stock,
      minStock: newProduct.min_stock,
      maxStock: newProduct.max_stock,
      unit: newProduct.unit,
      costPrice: newProduct.cost_price,
      salePrice: newProduct.sale_price,
      supplier: newProduct.supplier,
      location: newProduct.location,
      notes: newProduct.notes,
      createdAt: newProduct.created_at,
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return NextResponse.json({ error: 'Erro ao criar produto' }, { status: 500 });
  }
}
