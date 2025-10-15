import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { generateId } from '@/lib/db-helpers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = 'SELECT * FROM services WHERE active = 1';
    const params: any[] = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY category, name';

    const services = db.prepare(query).all(...params);

    const formatted = services.map((service: any) => ({
      id: service.id,
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category: service.category,
      active: service.active === 1,
      createdAt: service.created_at,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    return NextResponse.json({ error: 'Erro ao buscar serviços' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price, duration, category } = body;

    if (!name || !price || !duration || !category) {
      return NextResponse.json(
        { error: 'Nome, preço, duração e categoria são obrigatórios' },
        { status: 400 }
      );
    }

    const id = generateId('srv');

    db.prepare(`
      INSERT INTO services (
        id, name, description, price, duration, category, active
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      name,
      body.description || null,
      price,
      duration,
      category,
      1
    );

    const newService = db.prepare('SELECT * FROM services WHERE id = ?').get(id) as any;

    return NextResponse.json({
      id: newService.id,
      name: newService.name,
      description: newService.description,
      price: newService.price,
      duration: newService.duration,
      category: newService.category,
      active: newService.active === 1,
      createdAt: newService.created_at,
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    return NextResponse.json({ error: 'Erro ao criar serviço' }, { status: 500 });
  }
}
