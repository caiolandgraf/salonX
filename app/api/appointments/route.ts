import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { generateId } from '@/lib/db-helpers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const professionalId = searchParams.get('professionalId');
    const status = searchParams.get('status');

    let query = 'SELECT * FROM appointments WHERE 1=1';
    const params: any[] = [];

    if (date) {
      query += ' AND date = ?';
      params.push(date);
    }

    if (professionalId && professionalId !== 'all') {
      query += ' AND professional_id = ?';
      params.push(professionalId);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY date DESC, time DESC';

    const appointments = db.prepare(query).all(...params);
    
    // Convert snake_case to camelCase
    const formatted = appointments.map((apt: any) => ({
      id: apt.id,
      clientId: apt.client_id,
      clientName: apt.client_name,
      professionalId: apt.professional_id,
      professionalName: apt.professional_name,
      serviceId: apt.service_id,
      serviceName: apt.service_name,
      date: apt.date,
      time: apt.time,
      duration: apt.duration,
      price: apt.price,
      status: apt.status,
      notes: apt.notes,
      createdAt: apt.created_at,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    return NextResponse.json({ error: 'Erro ao buscar agendamentos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = generateId('apt');
    
    db.prepare(`
      INSERT INTO appointments (
        id, client_id, client_name, professional_id, professional_name,
        service_id, service_name, date, time, duration, price, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      body.clientId,
      body.clientName,
      body.professionalId,
      body.professionalName,
      body.serviceId,
      body.serviceName,
      body.date,
      body.time,
      body.duration,
      body.price,
      body.status || 'SCHEDULED',
      body.notes || null
    );

    const newAppointment = db.prepare('SELECT * FROM appointments WHERE id = ?').get(id) as any;
    
    return NextResponse.json({
      id: newAppointment.id,
      clientId: newAppointment.client_id,
      clientName: newAppointment.client_name,
      professionalId: newAppointment.professional_id,
      professionalName: newAppointment.professional_name,
      serviceId: newAppointment.service_id,
      serviceName: newAppointment.service_name,
      date: newAppointment.date,
      time: newAppointment.time,
      duration: newAppointment.duration,
      price: newAppointment.price,
      status: newAppointment.status,
      notes: newAppointment.notes,
      createdAt: newAppointment.created_at,
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return NextResponse.json({ error: 'Erro ao criar agendamento' }, { status: 500 });
  }
}
