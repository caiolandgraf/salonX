import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET - Obter comissões de profissionais
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const professionalId = searchParams.get('professionalId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const period = searchParams.get('period') || 'month';
    const status = searchParams.get('status') || 'all';

    let dateFilter = '';
    let params: any[] = [];

    // Filtro de data
    if (startDate && endDate) {
      dateFilter = 'AND date(a.date) BETWEEN ? AND ?';
      params = [startDate, endDate];
    } else if (period === 'today') {
      dateFilter = "AND date(a.date) = date('now')";
    } else if (period === 'week') {
      dateFilter = "AND date(a.date) >= date('now', '-7 days')";
    } else if (period === 'month') {
      dateFilter = "AND date(a.date) >= date('now', '-30 days')";
    } else if (period === 'year') {
      dateFilter = "AND date(a.date) >= date('now', '-365 days')";
    }

    if (professionalId) {
      // Comissões de um profissional específico
      const commissions = db.prepare(`
        SELECT 
          a.id as appointment_id,
          a.date,
          a.time,
          c.name as client_name,
          s.name as service_name,
          a.price as service_price,
          p.commission as commission_rate,
          (a.price * p.commission / 100) as commission_value,
          a.status
        FROM appointments a
        JOIN professionals p ON a.professional_id = p.id
        JOIN clients c ON a.client_id = c.id
        JOIN services s ON a.service_id = s.id
        WHERE a.professional_id = ?
        ${dateFilter}
        ${status !== 'all' ? 'AND a.status = ?' : ''}
        ORDER BY a.date DESC, a.time DESC
      `).all(professionalId, ...params, ...(status !== 'all' ? [status] : []));

      const summary = db.prepare(`
        SELECT 
          p.id,
          p.name,
          p.commission as commission_rate,
          COUNT(a.id) as total_appointments,
          SUM(a.price) as total_revenue,
          SUM(a.price * p.commission / 100) as total_commission
        FROM professionals p
        LEFT JOIN appointments a ON p.id = a.professional_id
        WHERE p.id = ?
        ${dateFilter.replace('a.date', 'a.date')}
        ${status !== 'all' ? 'AND a.status = ?' : ''}
        GROUP BY p.id, p.name, p.commission
      `).get(professionalId, ...params, ...(status !== 'all' ? [status] : []));

      return NextResponse.json({
        professional: summary,
        commissions,
      });
    } else {
      // Resumo de comissões de todos os profissionais
      const commissions = db.prepare(`
        SELECT 
          p.id,
          p.name,
          p.email,
          p.phone,
          p.commission as commission_rate,
          COUNT(a.id) as total_appointments,
          SUM(a.price) as total_revenue,
          SUM(a.price * p.commission / 100) as total_commission
        FROM professionals p
        LEFT JOIN appointments a ON p.id = a.professional_id
        ${dateFilter.replace('WHERE', 'WHERE 1=1')}
        ${status !== 'all' ? 'AND a.status = ?' : ''}
        WHERE p.status = 'ACTIVE'
        GROUP BY p.id, p.name, p.email, p.phone, p.commission
        ORDER BY total_commission DESC
      `).all(...params, ...(status !== 'all' ? [status] : []));

      const totalSummary = db.prepare(`
        SELECT 
          COUNT(DISTINCT p.id) as total_professionals,
          COUNT(a.id) as total_appointments,
          SUM(a.price) as total_revenue,
          SUM(a.price * p.commission / 100) as total_commission
        FROM professionals p
        LEFT JOIN appointments a ON p.id = a.professional_id
        WHERE p.status = 'ACTIVE'
        ${dateFilter}
        ${status !== 'all' ? 'AND a.status = ?' : ''}
      `).get(...params, ...(status !== 'all' ? [status] : []));

      return NextResponse.json({
        summary: totalSummary,
        commissions,
      });
    }
  } catch (error) {
    console.error('Error fetching commissions:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar comissões' },
      { status: 500 }
    );
  }
}

// POST - Calcular comissão para novo agendamento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { professionalId, servicePrice } = body;

    if (!professionalId || servicePrice === undefined) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: professionalId, servicePrice' },
        { status: 400 }
      );
    }

    // Buscar taxa de comissão do profissional
    const professional = db.prepare(`
      SELECT id, name, commission
      FROM professionals
      WHERE id = ? AND status = 'ACTIVE'
    `).get(professionalId) as any;

    if (!professional) {
      return NextResponse.json(
        { error: 'Profissional não encontrado' },
        { status: 404 }
      );
    }

    const commissionValue = (servicePrice * professional.commission) / 100;

    return NextResponse.json({
      professionalId: professional.id,
      professionalName: professional.name,
      commissionRate: professional.commission,
      servicePrice,
      commissionValue,
    });
  } catch (error) {
    console.error('Error calculating commission:', error);
    return NextResponse.json(
      { error: 'Erro ao calcular comissão' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar taxa de comissão de um profissional
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { professionalId, commissionRate } = body;

    if (!professionalId || commissionRate === undefined) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: professionalId, commissionRate' },
        { status: 400 }
      );
    }

    if (commissionRate < 0 || commissionRate > 100) {
      return NextResponse.json(
        { error: 'Taxa de comissão deve estar entre 0 e 100' },
        { status: 400 }
      );
    }

    // Verificar se profissional existe
    const professional = db.prepare('SELECT id FROM professionals WHERE id = ?').get(professionalId);
    
    if (!professional) {
      return NextResponse.json(
        { error: 'Profissional não encontrado' },
        { status: 404 }
      );
    }

    // Atualizar taxa de comissão
    db.prepare(`
      UPDATE professionals
      SET commission = ?
      WHERE id = ?
    `).run(commissionRate, professionalId);

    // Buscar dados atualizados
    const updated = db.prepare(`
      SELECT id, name, commission
      FROM professionals
      WHERE id = ?
    `).get(professionalId);

    return NextResponse.json({
      success: true,
      message: 'Taxa de comissão atualizada com sucesso',
      professional: updated,
    });
  } catch (error) {
    console.error('Error updating commission rate:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar taxa de comissão' },
      { status: 500 }
    );
  }
}
