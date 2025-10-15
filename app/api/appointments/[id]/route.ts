import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const appointment = db.prepare('SELECT * FROM appointments WHERE id = ?').get(id) as any;
    
    if (!appointment) {
      return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      id: appointment.id,
      clientId: appointment.client_id,
      clientName: appointment.client_name,
      professionalId: appointment.professional_id,
      professionalName: appointment.professional_name,
      serviceId: appointment.service_id,
      serviceName: appointment.service_name,
      date: appointment.date,
      time: appointment.time,
      duration: appointment.duration,
      price: appointment.price,
      status: appointment.status,
      notes: appointment.notes,
      createdAt: appointment.created_at,
    });
  } catch (error) {
    console.error('Erro ao buscar agendamento:', error);
    return NextResponse.json({ error: 'Erro ao buscar agendamento' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    
    const exists = db.prepare('SELECT id FROM appointments WHERE id = ?').get(id);
    if (!exists) {
      return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 });
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (body.clientId !== undefined) {
      updates.push('client_id = ?');
      values.push(body.clientId);
    }
    if (body.clientName !== undefined) {
      updates.push('client_name = ?');
      values.push(body.clientName);
    }
    if (body.professionalId !== undefined) {
      updates.push('professional_id = ?');
      values.push(body.professionalId);
    }
    if (body.professionalName !== undefined) {
      updates.push('professional_name = ?');
      values.push(body.professionalName);
    }
    if (body.serviceId !== undefined) {
      updates.push('service_id = ?');
      values.push(body.serviceId);
    }
    if (body.serviceName !== undefined) {
      updates.push('service_name = ?');
      values.push(body.serviceName);
    }
    if (body.date !== undefined) {
      updates.push('date = ?');
      values.push(body.date);
    }
    if (body.time !== undefined) {
      updates.push('time = ?');
      values.push(body.time);
    }
    if (body.duration !== undefined) {
      updates.push('duration = ?');
      values.push(body.duration);
    }
    if (body.price !== undefined) {
      updates.push('price = ?');
      values.push(body.price);
    }
    if (body.status !== undefined) {
      updates.push('status = ?');
      values.push(body.status);
    }
    if (body.notes !== undefined) {
      updates.push('notes = ?');
      values.push(body.notes);
    }

    values.push(id);

    db.prepare(`UPDATE appointments SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    const updated = db.prepare('SELECT * FROM appointments WHERE id = ?').get(id) as any;

    return NextResponse.json({
      id: updated.id,
      clientId: updated.client_id,
      clientName: updated.client_name,
      professionalId: updated.professional_id,
      professionalName: updated.professional_name,
      serviceId: updated.service_id,
      serviceName: updated.service_name,
      date: updated.date,
      time: updated.time,
      duration: updated.duration,
      price: updated.price,
      status: updated.status,
      notes: updated.notes,
      createdAt: updated.created_at,
    });
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    return NextResponse.json({ error: 'Erro ao atualizar agendamento' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const exists = db.prepare('SELECT id FROM appointments WHERE id = ?').get(id);
    if (!exists) {
      return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 });
    }

    db.prepare('DELETE FROM appointments WHERE id = ?').run(id);

    return NextResponse.json({ message: 'Agendamento excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir agendamento:', error);
    return NextResponse.json({ error: 'Erro ao excluir agendamento' }, { status: 500 });
  }
}
