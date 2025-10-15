import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { generateId } from '@/lib/db-helpers';

export async function GET() {
  try {
    const professionals = db.prepare('SELECT * FROM professionals ORDER BY created_at DESC').all();

    const formatted = professionals.map((prof: any) => ({
      id: prof.id,
      name: prof.name,
      email: prof.email,
      phone: prof.phone,
      specialties: prof.specialties ? JSON.parse(prof.specialties) : [],
      commission: prof.commission_rate || 30,
      workSchedule: prof.work_schedule ? JSON.parse(prof.work_schedule) : {},
      status: prof.active ? 'ACTIVE' : 'INACTIVE',
      createdAt: prof.created_at,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Erro ao buscar profissionais:', error);
    return NextResponse.json({ error: 'Erro ao buscar profissionais' }, { status: 500 });
  }
}

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

    const id = generateId('pro');
    const specialties = JSON.stringify(body.specialties || []);
    const workSchedule = JSON.stringify(body.workSchedule || {});

    db.prepare(`
      INSERT INTO professionals (
        id, name, email, phone, specialties, commission_rate, work_schedule, active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      name,
      email,
      phone,
      specialties,
      body.commission || 30,
      workSchedule,
      1
    );

    const newProfessional = db.prepare('SELECT * FROM professionals WHERE id = ?').get(id) as any;

    return NextResponse.json({
      id: newProfessional.id,
      name: newProfessional.name,
      email: newProfessional.email,
      phone: newProfessional.phone,
      specialties: JSON.parse(newProfessional.specialties),
      commission: newProfessional.commission_rate,
      workSchedule: newProfessional.work_schedule ? JSON.parse(newProfessional.work_schedule) : {},
      status: newProfessional.active ? 'ACTIVE' : 'INACTIVE',
      createdAt: newProfessional.created_at,
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar profissional:', error);
    return NextResponse.json({ error: 'Erro ao criar profissional' }, { status: 500 });
  }
}
