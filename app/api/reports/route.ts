import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET - Obter dados de relatórios
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'financial';
    const period = searchParams.get('period') || 'month';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let transactionDateFilter = '';
    let appointmentDateFilter = '';
    let stockDateFilter = '';
    let params: any[] = [];

    if (startDate && endDate) {
      transactionDateFilter = 'AND COALESCE(paid_date, created_at) BETWEEN ? AND ?';
      appointmentDateFilter = 'AND date BETWEEN ? AND ?';
      stockDateFilter = 'AND date(created_at) BETWEEN ? AND ?';
      params = [startDate, endDate];
    } else if (period === 'today') {
      transactionDateFilter = "AND date(COALESCE(paid_date, created_at)) = date('now')";
      appointmentDateFilter = "AND date(date) = date('now')";
      stockDateFilter = "AND date(created_at) = date('now')";
    } else if (period === 'week') {
      transactionDateFilter = "AND date(COALESCE(paid_date, created_at)) >= date('now', '-7 days')";
      appointmentDateFilter = "AND date(date) >= date('now', '-7 days')";
      stockDateFilter = "AND date(created_at) >= date('now', '-7 days')";
    } else if (period === 'month') {
      transactionDateFilter = "AND date(COALESCE(paid_date, created_at)) >= date('now', '-30 days')";
      appointmentDateFilter = "AND date(date) >= date('now', '-30 days')";
      stockDateFilter = "AND date(created_at) >= date('now', '-30 days')";
    } else if (period === 'year') {
      transactionDateFilter = "AND date(COALESCE(paid_date, created_at)) >= date('now', '-365 days')";
      appointmentDateFilter = "AND date(date) >= date('now', '-365 days')";
      stockDateFilter = "AND date(created_at) >= date('now', '-365 days')";
    }

    let result: any = {};

    switch (type) {
      case 'financial':
        result = await getFinancialReport(transactionDateFilter, params);
        break;
      case 'services':
        result = await getServicesReport(appointmentDateFilter, params);
        break;
      case 'professionals':
        result = await getProfessionalsReport(appointmentDateFilter, params);
        break;
      case 'clients':
        result = await getClientsReport(appointmentDateFilter, params);
        break;
      case 'products':
        result = await getProductsReport(stockDateFilter, params);
        break;
      case 'appointments':
        result = await getAppointmentsReport(appointmentDateFilter, params);
        break;
      default:
        return NextResponse.json(
          { error: 'Tipo de relatório inválido' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar relatório' },
      { status: 500 }
    );
  }
}

// Relatório Financeiro
async function getFinancialReport(dateFilter: string, params: any[]) {
  // Receitas
  const income = db.prepare(`
    SELECT 
      SUM(amount) as total,
      COUNT(*) as count
    FROM transactions
    WHERE type = 'INCOME' AND status = 'PAID' ${dateFilter}
  `).get(...params) as { total: number; count: number };

  // Despesas
  const expenses = db.prepare(`
    SELECT 
      SUM(amount) as total,
      COUNT(*) as count
    FROM transactions
    WHERE type = 'EXPENSE' AND status = 'PAID' ${dateFilter}
  `).get(...params) as { total: number; count: number };

  // Receitas por categoria
  const incomeByCategory = db.prepare(`
    SELECT category, SUM(amount) as total
    FROM transactions
    WHERE type = 'INCOME' AND status = 'PAID' ${dateFilter}
    GROUP BY category
  `).all(...params);

  // Despesas por categoria
  const expensesByCategory = db.prepare(`
    SELECT category, SUM(amount) as total
    FROM transactions
    WHERE type = 'EXPENSE' AND status = 'PAID' ${dateFilter}
    GROUP BY category
  `).all(...params);

  // Receitas por método de pagamento
  const incomeByPaymentMethod = db.prepare(`
    SELECT payment_method, SUM(amount) as total
    FROM transactions
    WHERE type = 'INCOME' AND status = 'PAID' ${dateFilter}
    GROUP BY payment_method
  `).all(...params);

  return {
    summary: {
      totalIncome: income.total || 0,
      totalExpenses: expenses.total || 0,
      netProfit: (income.total || 0) - (expenses.total || 0),
      transactionsCount: (income.count || 0) + (expenses.count || 0),
    },
    incomeByCategory,
    expensesByCategory,
    incomeByPaymentMethod,
  };
}

// Relatório de Serviços
async function getServicesReport(dateFilter: string, params: any[]) {
  const serviceStats = db.prepare(`
    SELECT 
      s.id,
      s.name,
      s.category,
      s.price,
      COUNT(a.id) as total_appointments,
      SUM(a.price) as total_revenue
    FROM services s
    LEFT JOIN appointments a ON s.id = a.service_id ${dateFilter ? 'AND a.' + dateFilter.substring(4) : ''}
    GROUP BY s.id, s.name, s.category, s.price
    ORDER BY total_revenue DESC
  `).all(...params);

  const topServices = db.prepare(`
    SELECT 
      s.name,
      COUNT(a.id) as count,
      SUM(a.price) as revenue
    FROM appointments a
    JOIN services s ON a.service_id = s.id
    WHERE 1=1 ${dateFilter ? 'AND a.' + dateFilter.substring(4) : ''}
    GROUP BY s.id, s.name
    ORDER BY count DESC
    LIMIT 10
  `).all(...params);

  return {
    serviceStats,
    topServices,
  };
}

// Relatório de Profissionais
async function getProfessionalsReport(dateFilter: string, params: any[]) {
  const professionalStats = db.prepare(`
    SELECT 
      p.id,
      p.name,
      p.commission,
      COUNT(a.id) as total_appointments,
      SUM(a.price) as total_revenue,
      SUM(a.price * p.commission / 100) as total_commission
    FROM professionals p
    LEFT JOIN appointments a ON p.id = a.professional_id ${dateFilter ? 'AND a.' + dateFilter.substring(4) : ''}
    WHERE p.status = 'ACTIVE'
    GROUP BY p.id, p.name, p.commission
    ORDER BY total_revenue DESC
  `).all(...params);

  return {
    professionalStats,
  };
}

// Relatório de Clientes
async function getClientsReport(dateFilter: string, params: any[]) {
  const clientStats = db.prepare(`
    SELECT 
      COUNT(*) as total_clients,
      SUM(CASE WHEN last_visit IS NOT NULL THEN 1 ELSE 0 END) as active_clients,
      AVG(total_spent) as avg_spent,
      AVG(total_visits) as avg_visits
    FROM clients
  `).get();

  const topClients = db.prepare(`
    SELECT 
      id,
      name,
      email,
      phone,
      total_visits,
      total_spent
    FROM clients
    ORDER BY total_spent DESC
    LIMIT 20
  `).all();

  const newClients = db.prepare(`
    SELECT 
      COUNT(*) as count
    FROM clients
    WHERE date(created_at) >= date('now', '-30 days')
  `).get();

  return {
    summary: clientStats,
    topClients,
    newClients,
  };
}

// Relatório de Produtos
async function getProductsReport(dateFilter: string, params: any[]) {
  const productStats = db.prepare(`
    SELECT 
      p.id,
      p.name,
      p.category,
      p.current_stock,
      p.min_stock,
      p.sale_price,
      CASE 
        WHEN p.current_stock <= p.min_stock THEN 1 
        ELSE 0 
      END as needs_restock
    FROM products p
    WHERE p.type = 'RESALE'
    ORDER BY needs_restock DESC, p.current_stock ASC
  `).all();

  const lowStockProducts = db.prepare(`
    SELECT 
      name,
      current_stock,
      min_stock
    FROM products
    WHERE current_stock <= min_stock
    ORDER BY current_stock ASC
  `).all();

  const stockMovements = db.prepare(`
    SELECT 
      type,
      COUNT(*) as count,
      SUM(quantity) as total_quantity
    FROM stock_movements
    WHERE 1=1 ${dateFilter}
    GROUP BY type
  `).all(...params);

  return {
    productStats,
    lowStockProducts,
    stockMovements,
  };
}

// Relatório de Agendamentos
async function getAppointmentsReport(dateFilter: string, params: any[]) {
  const appointmentStats = db.prepare(`
    SELECT 
      status,
      COUNT(*) as count,
      SUM(price) as total_revenue
    FROM appointments
    WHERE 1=1 ${dateFilter}
    GROUP BY status
  `).all(...params);

  const appointmentsByDay = db.prepare(`
    SELECT 
      date(date) as day,
      COUNT(*) as count
    FROM appointments
    WHERE 1=1 ${dateFilter}
    GROUP BY date(date)
    ORDER BY day
  `).all(...params);

  const appointmentsByHour = db.prepare(`
    SELECT 
      substr(time, 1, 2) as hour,
      COUNT(*) as count
    FROM appointments
    WHERE 1=1 ${dateFilter}
    GROUP BY hour
    ORDER BY count DESC
  `).all(...params);

  return {
    appointmentStats,
    appointmentsByDay,
    appointmentsByHour,
  };
}
