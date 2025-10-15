// Script para popular o banco de dados com dados de exemplo
import db from './db.js';
import { generateId } from './db-helpers.js';

export function seedDatabase() {
  try {
    console.log('🌱 Iniciando seed do banco de dados...');

    // Verificar se já tem dados
    const clientsCount = db.prepare('SELECT COUNT(*) as count FROM clients').get() as { count: number };
    if (clientsCount.count > 0) {
      console.log('✅ Banco já possui dados. Seed ignorado.');
      return;
    }

    // Inserir clientes de exemplo
    const clients = [
      { name: 'Maria Silva', email: 'maria@email.com', phone: '(11) 98765-4321', birthdate: '1990-05-15' },
      { name: 'João Santos', email: 'joao@email.com', phone: '(11) 98765-4322', birthdate: '1985-08-20' },
      { name: 'Ana Costa', email: 'ana@email.com', phone: '(11) 98765-4323', birthdate: '1992-03-10' },
      { name: 'Pedro Oliveira', email: 'pedro@email.com', phone: '(11) 98765-4324', birthdate: '1988-11-25' },
      { name: 'Juliana Souza', email: 'juliana@email.com', phone: '(11) 98765-4325', birthdate: '1995-07-30' },
    ];

    console.log('📝 Inserindo clientes...');
    for (const client of clients) {
      db.prepare(`
        INSERT INTO clients (id, name, email, phone, birthdate, total_visits, total_spent)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(generateId('cli'), client.name, client.email, client.phone, client.birthdate, 0, 0);
    }

    // Inserir profissionais de exemplo
    const professionals = [
      { name: 'Carla Mendes', email: 'carla@salon.com', phone: '(11) 91234-5678', specialties: ['Corte', 'Coloração'] },
      { name: 'Roberto Lima', email: 'roberto@salon.com', phone: '(11) 91234-5679', specialties: ['Corte', 'Barba'] },
      { name: 'Fernanda Alves', email: 'fernanda@salon.com', phone: '(11) 91234-5680', specialties: ['Manicure', 'Pedicure'] },
      { name: 'Ricardo Pereira', email: 'ricardo@salon.com', phone: '(11) 91234-5681', specialties: ['Corte', 'Escova'] },
    ];

    console.log('👨‍💼 Inserindo profissionais...');

    // Horário padrão de trabalho (Seg a Sex: 9h-18h, Sáb: 9h-17h)
    const defaultWorkSchedule = {
      monday: { start: '09:00', end: '18:00' },
      tuesday: { start: '09:00', end: '18:00' },
      wednesday: { start: '09:00', end: '18:00' },
      thursday: { start: '09:00', end: '18:00' },
      friday: { start: '09:00', end: '18:00' },
      saturday: { start: '09:00', end: '17:00' },
    };

    for (const prof of professionals) {
      db.prepare(`
        INSERT INTO professionals (id, name, email, phone, specialties, commission_rate, work_schedule, active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        generateId('pro'),
        prof.name,
        prof.email,
        prof.phone,
        JSON.stringify(prof.specialties),
        30,
        JSON.stringify(defaultWorkSchedule),
        1
      );
    }

    // Inserir produtos de exemplo
    const products = [
      { name: 'Shampoo Profissional 1L', type: 'PRODUCT', category: 'Cabelo', brand: 'L\'Oréal', sku: 'SHP001', stock: 25, minStock: 10, costPrice: 45.00, salePrice: 89.90 },
      { name: 'Condicionador Profissional 1L', type: 'PRODUCT', category: 'Cabelo', brand: 'L\'Oréal', sku: 'CND001', stock: 20, minStock: 10, costPrice: 42.00, salePrice: 85.90 },
      { name: 'Esmalte Vermelho', type: 'PRODUCT', category: 'Unhas', brand: 'Risqué', sku: 'ESM001', stock: 50, minStock: 20, costPrice: 5.00, salePrice: 12.90 },
      { name: 'Máscara Capilar 500g', type: 'PRODUCT', category: 'Cabelo', brand: 'Kerastase', sku: 'MSC001', stock: 15, minStock: 5, costPrice: 85.00, salePrice: 159.90 },
      { name: 'Tintura Chocolate', type: 'PRODUCT', category: 'Cabelo', brand: 'Wella', sku: 'TIN001', stock: 30, minStock: 15, costPrice: 25.00, salePrice: 54.90 },
      { name: 'Acetona 1L', type: 'CONSUMABLE', category: 'Unhas', brand: 'Genérica', sku: 'ACT001', stock: 10, minStock: 5, costPrice: 8.00, salePrice: 0 },
    ];

    console.log('📦 Inserindo produtos...');
    for (const prod of products) {
      db.prepare(`
        INSERT INTO products (
          id, name, type, category, brand, sku, current_stock, min_stock,
          cost_price, sale_price, unit
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        generateId('prd'), prod.name, prod.type, prod.category, prod.brand,
        prod.sku, prod.stock, prod.minStock, prod.costPrice, prod.salePrice, 'UN'
      );
    }

    // Inserir agendamentos de exemplo
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const allClients = db.prepare('SELECT * FROM clients').all() as any[];
    const allProfessionals = db.prepare('SELECT * FROM professionals').all() as any[];
    const allServices = db.prepare('SELECT * FROM services').all() as any[];

    console.log('📅 Inserindo agendamentos...');
    if (allClients.length > 0 && allProfessionals.length > 0 && allServices.length > 0) {
      const appointments = [
        {
          clientId: allClients[0].id,
          clientName: allClients[0].name,
          professionalId: allProfessionals[0].id,
          professionalName: allProfessionals[0].name,
          serviceId: allServices[0].id,
          serviceName: allServices[0].name,
          date: today.toISOString().split('T')[0],
          time: '09:00',
          duration: allServices[0].duration,
          price: allServices[0].price,
          status: 'CONFIRMED',
        },
        {
          clientId: allClients[1].id,
          clientName: allClients[1].name,
          professionalId: allProfessionals[1].id,
          professionalName: allProfessionals[1].name,
          serviceId: allServices[1].id,
          serviceName: allServices[1].name,
          date: today.toISOString().split('T')[0],
          time: '10:00',
          duration: allServices[1].duration,
          price: allServices[1].price,
          status: 'CONFIRMED',
        },
        {
          clientId: allClients[2].id,
          clientName: allClients[2].name,
          professionalId: allProfessionals[0].id,
          professionalName: allProfessionals[0].name,
          serviceId: allServices[2].id,
          serviceName: allServices[2].name,
          date: tomorrow.toISOString().split('T')[0],
          time: '14:00',
          duration: allServices[2].duration,
          price: allServices[2].price,
          status: 'SCHEDULED',
        },
      ];

      for (const apt of appointments) {
        db.prepare(`
          INSERT INTO appointments (
            id, client_id, client_name, professional_id, professional_name,
            service_id, service_name, date, time, duration, price, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          generateId('apt'), apt.clientId, apt.clientName, apt.professionalId,
          apt.professionalName, apt.serviceId, apt.serviceName, apt.date,
          apt.time, apt.duration, apt.price, apt.status
        );
      }
    }

    // Inserir algumas transações de exemplo
    console.log('💰 Inserindo transações...');
    const transactions = [
      {
        type: 'INCOME',
        category: 'SERVICE',
        description: 'Serviço de corte e coloração',
        amount: 280.00,
        status: 'PAID',
        paymentMethod: 'CREDIT_CARD',
        dueDate: today.toISOString().split('T')[0],
        paidDate: today.toISOString().split('T')[0],
      },
      {
        type: 'EXPENSE',
        category: 'PRODUCTS',
        description: 'Compra de produtos profissionais',
        amount: 850.00,
        status: 'PAID',
        paymentMethod: 'DEBIT_CARD',
        dueDate: today.toISOString().split('T')[0],
        paidDate: today.toISOString().split('T')[0],
      },
      {
        type: 'EXPENSE',
        category: 'UTILITIES',
        description: 'Conta de energia elétrica',
        amount: 320.00,
        status: 'PENDING',
        paymentMethod: null,
        dueDate: tomorrow.toISOString().split('T')[0],
        paidDate: null,
      },
    ];

    for (const txn of transactions) {
      db.prepare(`
        INSERT INTO transactions (
          id, type, category, description, amount, status, payment_method,
          due_date, paid_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        generateId('txn'), txn.type, txn.category, txn.description,
        txn.amount, txn.status, txn.paymentMethod, txn.dueDate, txn.paidDate
      );
    }

    console.log('✅ Seed concluído com sucesso!');
    console.log('👤 Login: admin@bunx.io');
    console.log('🔑 Senha: admin123');

  } catch (error) {
    console.error('❌ Erro ao fazer seed:', error);
    throw error;
  }
}

// Executar seed se for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}
