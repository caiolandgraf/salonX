import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET - Buscar cliente por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(id);

    if (!client) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar cliente' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar cliente
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    
    // Verificar se cliente existe
    const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(id);

    if (!client) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se email já está em uso por outro cliente
    if (body.email) {
      const emailExists = db.prepare('SELECT id FROM clients WHERE email = ? AND id != ?').get(body.email, id);
      if (emailExists) {
        return NextResponse.json(
          { error: 'Email já cadastrado' },
          { status: 400 }
        );
      }
    }

    // Preparar dados para atualização
    const tags = body.tags ? JSON.stringify(body.tags) : null;
    
    // Atualizar cliente com campos do CRM
    db.prepare(`
      UPDATE clients SET
        name = COALESCE(?, name),
        email = COALESCE(?, email),
        phone = COALESCE(?, phone),
        birthdate = COALESCE(?, birthdate),
        address = COALESCE(?, address),
        city = COALESCE(?, city),
        state = COALESCE(?, state),
        zip_code = COALESCE(?, zip_code),
        notes = COALESCE(?, notes),
        segment = COALESCE(?, segment),
        tags = COALESCE(?, tags),
        source = COALESCE(?, source),
        next_follow_up = COALESCE(?, next_follow_up),
        assigned_to = COALESCE(?, assigned_to),
        last_contact_date = COALESCE(?, last_contact_date)
      WHERE id = ?
    `).run(
      body.name || null,
      body.email || null,
      body.phone || null,
      body.birthdate || null,
      body.address || null,
      body.city || null,
      body.state || null,
      body.zipCode || null,
      body.notes || null,
      body.segment || null,
      tags,
      body.source || null,
      body.nextFollowUp || null,
      body.assignedTo || null,
      body.lastContactDate || null,
      id
    );
    
    const updated = db.prepare('SELECT * FROM clients WHERE id = ?').get(id) as any;

    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      birthdate: updated.birthdate,
      address: updated.address,
      city: updated.city,
      state: updated.state,
      zipCode: updated.zip_code,
      notes: updated.notes,
      segment: updated.segment,
      tags: updated.tags ? JSON.parse(updated.tags) : [],
      source: updated.source,
      lifetimeValue: updated.lifetime_value,
      averageTicket: updated.average_ticket,
      totalVisits: updated.total_visits,
      totalSpent: updated.total_spent,
      lastVisit: updated.last_visit,
      lastContactDate: updated.last_contact_date,
      nextFollowUp: updated.next_follow_up,
      assignedTo: updated.assigned_to,
      createdAt: updated.created_at,
    });
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar cliente' },
      { status: 500 }
    );
  }
}

// DELETE - Excluir cliente
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Verificar se cliente existe
    const client = db.prepare('SELECT id FROM clients WHERE id = ?').get(id);

    if (!client) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      );
    }

    db.prepare('DELETE FROM clients WHERE id = ?').run(id);

    return NextResponse.json({ success: true, message: 'Cliente excluído com sucesso' });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir cliente' },
      { status: 500 }
    );
  }
}
