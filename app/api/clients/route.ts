import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { generateId } from '@/lib/db-helpers';

// GET - Listar todos os clientes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const segment = searchParams.get('segment');

    let query = 'SELECT * FROM clients WHERE active = 1';
    const params: any[] = [];

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    if (segment) {
      query += ' AND segment = ?';
      params.push(segment);
    }

    query += ' ORDER BY created_at DESC';

    const clients = db.prepare(query).all(...params);

    const formatted = clients.map((client: any) => ({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      birthdate: client.birthdate,
      address: client.address,
      city: client.city,
      state: client.state,
      zipCode: client.zip_code,
      notes: client.notes,
      totalVisits: client.total_visits || 0,
      totalSpent: client.total_spent || 0,
      lastVisit: client.last_visit,
      segment: client.segment || 'NEW',
      tags: client.tags ? JSON.parse(client.tags) : [],
      source: client.source,
      lifetimeValue: client.lifetime_value || 0,
      averageTicket: client.average_ticket || 0,
      lastContactDate: client.last_contact_date,
      nextFollowUp: client.next_follow_up,
      assignedTo: client.assigned_to,
      active: client.active === 1,
      createdAt: client.created_at,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar clientes' },
      { status: 500 }
    );
  }
}

// POST - Criar novo cliente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Nome, email e telefone são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se email já existe
    const existing = db.prepare('SELECT id FROM clients WHERE email = ?').get(email);
    if (existing) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 400 }
      );
    }

    const id = generateId('cli');
    const tags = body.tags ? JSON.stringify(body.tags) : null;

    db.prepare(`
      INSERT INTO clients (
        id, name, email, phone, birthdate, address, city, state, zip_code,
        notes, segment, tags, source, assigned_to,
        total_visits, total_spent, lifetime_value, average_ticket
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      name,
      email,
      phone,
      body.birthdate || null,
      body.address || null,
      body.city || null,
      body.state || null,
      body.zipCode || null,
      body.notes || null,
      body.segment || 'NEW',
      tags,
      body.source || null,
      body.assignedTo || null,
      0,
      0,
      0,
      0
    );

    const newClient = db.prepare('SELECT * FROM clients WHERE id = ?').get(id) as any;

    return NextResponse.json({
      id: newClient.id,
      name: newClient.name,
      email: newClient.email,
      phone: newClient.phone,
      birthdate: newClient.birthdate,
      address: newClient.address,
      city: newClient.city,
      state: newClient.state,
      zipCode: newClient.zip_code,
      notes: newClient.notes,
      segment: newClient.segment,
      tags: newClient.tags ? JSON.parse(newClient.tags) : [],
      source: newClient.source,
      lifetimeValue: newClient.lifetime_value,
      averageTicket: newClient.average_ticket,
      totalVisits: newClient.total_visits,
      totalSpent: newClient.total_spent,
      lastVisit: newClient.last_visit,
      assignedTo: newClient.assigned_to,
      createdAt: newClient.created_at,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: 'Erro ao criar cliente' },
      { status: 500 }
    );
  }
}
