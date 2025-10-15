import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const professional = db.prepare('SELECT * FROM professionals WHERE id = ?').get(id) as any;
    if (!professional) {
      return NextResponse.json({ error: 'Profissional não encontrado' }, { status: 404 });
    }
    
    const formatted = {
      id: professional.id,
      name: professional.name,
      email: professional.email,
      phone: professional.phone,
      specialties: professional.specialties ? JSON.parse(professional.specialties) : [],
      commission: professional.commission_rate || 30,
      workSchedule: professional.work_schedule ? JSON.parse(professional.work_schedule) : {},
      status: professional.active ? 'ACTIVE' : 'INACTIVE',
      createdAt: professional.created_at,
    };
    
    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching professional:', error);
    return NextResponse.json({ error: 'Erro ao buscar profissional' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    
    const professional = db.prepare('SELECT id FROM professionals WHERE id = ?').get(id);
    if (!professional) {
      return NextResponse.json({ error: 'Profissional não encontrado' }, { status: 404 });
    }

    // Prepare data for database
    const dbData: any = {};
    
    if (body.name !== undefined) dbData.name = body.name;
    if (body.email !== undefined) dbData.email = body.email;
    if (body.phone !== undefined) dbData.phone = body.phone;
    if (body.specialties !== undefined) dbData.specialties = JSON.stringify(body.specialties);
    if (body.commission !== undefined) dbData.commission_rate = body.commission;
    if (body.workSchedule !== undefined) dbData.work_schedule = JSON.stringify(body.workSchedule);
    if (body.status !== undefined) dbData.active = body.status === 'ACTIVE' ? 1 : 0;

    const updates = Object.keys(dbData).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(dbData), id];
    
    db.prepare(`UPDATE professionals SET ${updates} WHERE id = ?`).run(...values);
    
    const updated = db.prepare('SELECT * FROM professionals WHERE id = ?').get(id) as any;
    
    const formatted = {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      specialties: updated.specialties ? JSON.parse(updated.specialties) : [],
      commission: updated.commission_rate || 30,
      workSchedule: updated.work_schedule ? JSON.parse(updated.work_schedule) : {},
      status: updated.active ? 'ACTIVE' : 'INACTIVE',
      createdAt: updated.created_at,
    };
    
    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error updating professional:', error);
    return NextResponse.json({ error: 'Erro ao atualizar profissional' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const professional = db.prepare('SELECT id FROM professionals WHERE id = ?').get(id);
    if (!professional) {
      return NextResponse.json({ error: 'Profissional não encontrado' }, { status: 404 });
    }
    
    db.prepare('DELETE FROM professionals WHERE id = ?').run(id);
    return NextResponse.json({ success: true, message: 'Profissional excluído com sucesso' });
  } catch (error) {
    console.error('Error deleting professional:', error);
    return NextResponse.json({ error: 'Erro ao excluir profissional' }, { status: 500 });
  }
}
