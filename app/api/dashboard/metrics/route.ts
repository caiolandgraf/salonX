import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    // Agendamentos de hoje
    const todayAppointmentsResult = db.prepare(
      'SELECT COUNT(*) as count FROM appointments WHERE date = ?'
    ).get(today) as { count: number };

    // Receita de hoje (agendamentos completados + transações pagas hoje)
    const todayAppointmentsRevenue = db.prepare(
      'SELECT COALESCE(SUM(price), 0) as total FROM appointments WHERE date = ? AND status = ?'
    ).get(today, 'COMPLETED') as { total: number };
    
    const todayTransactionsRevenue = db.prepare(
      `SELECT COALESCE(SUM(amount), 0) as total 
       FROM transactions 
       WHERE date(COALESCE(paid_date, created_at)) = ? 
       AND type = 'INCOME' 
       AND status = 'PAID'`
    ).get(today) as { total: number };
    
    const todayRevenueResult = { 
      total: todayAppointmentsRevenue.total + todayTransactionsRevenue.total 
    };

    // Receita do mês atual (transações pagas)
    const monthRevenueResult = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total 
      FROM transactions 
      WHERE strftime('%Y-%m', created_at) = ? 
      AND type = 'INCOME' 
      AND status = 'PAID'
    `).get(currentMonth) as { total: number };

    // Clientes ativos (com visitas nos últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

    const activeClientsResult = db.prepare(
      'SELECT COUNT(DISTINCT client_id) as count FROM appointments WHERE date >= ? AND client_id IS NOT NULL'
    ).get(thirtyDaysAgoStr) as { count: number };

    // Calcular crescimento em relação ao mês anterior
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthStr = lastMonth.toISOString().slice(0, 7);

    const lastMonthRevenueResult = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total 
      FROM transactions 
      WHERE strftime('%Y-%m', created_at) = ? 
      AND type = 'INCOME' 
      AND status = 'PAID'
    `).get(lastMonthStr) as { total: number };

    const lastMonthAppointmentsResult = db.prepare(`
      SELECT COUNT(*) as count 
      FROM appointments 
      WHERE strftime('%Y-%m', date) = ?
    `).get(lastMonthStr) as { count: number };

    const currentMonthAppointmentsResult = db.prepare(`
      SELECT COUNT(*) as count 
      FROM appointments 
      WHERE strftime('%Y-%m', date) = ?
    `).get(currentMonth) as { count: number };

    // Calcular percentuais de crescimento
    const revenueGrowth = lastMonthRevenueResult.total > 0
      ? ((monthRevenueResult.total - lastMonthRevenueResult.total) / lastMonthRevenueResult.total) * 100
      : 0;

    const appointmentsGrowth = lastMonthAppointmentsResult.count > 0
      ? ((currentMonthAppointmentsResult.count - lastMonthAppointmentsResult.count) / lastMonthAppointmentsResult.count) * 100
      : 0;

    // Total de clientes cadastrados
    const totalClientsResult = db.prepare('SELECT COUNT(*) as count FROM clients').get() as { count: number };

    // Buscar lista de agendamentos de hoje
    const todayAppointments = db.prepare(`
      SELECT id, client_name, service_name, time, status, price
      FROM appointments 
      WHERE date = ?
      ORDER BY time ASC
    `).all(today);

    return NextResponse.json({
      todayRevenue: todayRevenueResult.total,
      todayAppointments: todayAppointmentsResult.count,
      activeClients: activeClientsResult.count,
      monthRevenue: monthRevenueResult.total,
      revenueGrowth: Number(revenueGrowth.toFixed(1)),
      appointmentsGrowth: Number(appointmentsGrowth.toFixed(1)),
      clientsGrowth: 0, // Pode ser implementado com base em novos cadastros
      totalClients: totalClientsResult.count,
      appointmentsList: todayAppointments,
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json({ error: 'Erro ao buscar métricas' }, { status: 500 });
  }
}
