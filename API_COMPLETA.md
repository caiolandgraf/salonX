# 📚 Documentação Completa das APIs - SalonX

## 🎯 Visão Geral

Sistema completo de gestão para salões de beleza com APIs RESTful.

**Base URL:** `http://localhost:3000/api`

---

## 🔐 Autenticação

### POST /api/auth/login
Realizar login no sistema

**Request:**
```json
{
  "email": "admin@bunx.io",
  "password": "admin123"
}
```

**Response:**
```json
{
  "user": {
    "id": "admin-1",
    "name": "Administrador",
    "email": "admin@bunx.io",
    "role": "ADMIN"
  },
  "token": "jwt-token-here"
}
```

---

## 👥 Usuários

### GET /api/users
Listar usuários com filtros

**Query Parameters:**
- `role` - Filtrar por função (ADMIN, MANAGER, PROFESSIONAL, etc.)
- `active` - true/false
- `search` - Buscar por nome ou email

### POST /api/users
Criar novo usuário

**Request:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "role": "PROFESSIONAL",
  "phone": "(11) 99999-9999",
  "active": true
}
```

### GET /api/users/[id]
Buscar usuário por ID

### PUT /api/users/[id]
Atualizar usuário

### DELETE /api/users/[id]
Excluir usuário

---

## 📅 Agendamentos

### GET /api/appointments
Listar agendamentos

**Query Parameters:**
- `date` - Filtrar por data (YYYY-MM-DD)
- `professionalId` - Filtrar por profissional
- `clientId` - Filtrar por cliente
- `status` - SCHEDULED, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED

### POST /api/appointments
Criar agendamento

**Request:**
```json
{
  "clientId": "client-123",
  "professionalId": "prof-456",
  "serviceId": "service-789",
  "date": "2025-10-20",
  "time": "14:00",
  "duration": 60,
  "price": 150.00,
  "notes": "Cliente prefere corte curto"
}
```

### GET /api/appointments/[id]
Buscar agendamento por ID

### PUT /api/appointments/[id]
Atualizar agendamento

### DELETE /api/appointments/[id]
Cancelar agendamento

---

## 👤 Clientes

### GET /api/clients
Listar clientes

**Query Parameters:**
- `search` - Buscar por nome, email ou telefone
- `active` - true/false

### POST /api/clients
Criar cliente

**Request:**
```json
{
  "name": "Maria Silva",
  "email": "maria@example.com",
  "phone": "(11) 98888-7777",
  "birthdate": "1990-05-15",
  "address": "Rua das Flores, 123",
  "notes": "Cliente VIP"
}
```

### GET /api/clients/[id]
Buscar cliente por ID

### PUT /api/clients/[id]
Atualizar cliente

### DELETE /api/clients/[id]
Excluir cliente

---

## 💇 Profissionais

### GET /api/professionals
Listar profissionais

**Query Parameters:**
- `status` - ACTIVE/INACTIVE
- `specialty` - Filtrar por especialidade

### POST /api/professionals
Criar profissional

**Request:**
```json
{
  "name": "Ana Costa",
  "email": "ana@bunx.io",
  "phone": "(11) 97777-6666",
  "specialties": ["Corte", "Coloração", "Manicure"],
  "commission": 30,
  "status": "ACTIVE"
}
```

### GET /api/professionals/[id]
Buscar profissional por ID

### PUT /api/professionals/[id]
Atualizar profissional

### DELETE /api/professionals/[id]
Excluir profissional

---

## ✂️ Serviços

### GET /api/services
Listar serviços

**Query Parameters:**
- `active` - true/false
- `category` - Filtrar por categoria

### POST /api/services
Criar serviço

**Request:**
```json
{
  "name": "Corte Feminino",
  "description": "Corte completo com finalização",
  "duration": 60,
  "price": 80.00,
  "category": "Cabelo",
  "active": true
}
```

### GET /api/services/[id]
Buscar serviço por ID

### PUT /api/services/[id]
Atualizar serviço

### DELETE /api/services/[id]
Excluir serviço

---

## 📦 Produtos

### GET /api/products
Listar produtos

**Query Parameters:**
- `type` - SERVICE/RESALE
- `category` - Categoria do produto
- `search` - Buscar por nome
- `lowStock` - true (produtos com estoque baixo)

### POST /api/products
Criar produto

**Request:**
```json
{
  "name": "Shampoo Premium 500ml",
  "type": "RESALE",
  "category": "HAIR",
  "brand": "L'Oreal",
  "sku": "SHA-001",
  "currentStock": 15,
  "minStock": 5,
  "maxStock": 50,
  "unit": "UN",
  "costPrice": 45.00,
  "salePrice": 120.00,
  "supplier": "Distribuidora Beauty"
}
```

### GET /api/products/[id]
Buscar produto por ID

### PUT /api/products/[id]
Atualizar produto

### DELETE /api/products/[id]
Excluir produto

---

## 📊 Movimentações de Estoque

### GET /api/stock-movements
Listar movimentações de estoque

**Query Parameters:**
- `productId` - Filtrar por produto
- `type` - IN/OUT/ADJUSTMENT
- `startDate` - Data inicial
- `endDate` - Data final

### POST /api/stock-movements
Registrar movimentação de estoque

**Request:**
```json
{
  "productId": "prod-123",
  "type": "IN",
  "quantity": 10,
  "reason": "Compra de fornecedor",
  "userId": "user-456"
}
```

---

## 💰 Transações Financeiras

### GET /api/transactions
Listar transações

**Query Parameters:**
- `type` - INCOME/EXPENSE
- `status` - PENDING/PAID/OVERDUE/CANCELLED
- `startDate` - Data inicial
- `endDate` - Data final
- `category` - Categoria

### POST /api/transactions
Criar transação

**Request:**
```json
{
  "type": "EXPENSE",
  "category": "RENT",
  "description": "Aluguel do salão - Outubro",
  "amount": 3500.00,
  "status": "PAID",
  "paymentMethod": "TRANSFER",
  "dueDate": "2025-10-05",
  "paidDate": "2025-10-05"
}
```

### GET /api/transactions/[id]
Buscar transação por ID

### PUT /api/transactions/[id]
Atualizar transação

### DELETE /api/transactions/[id]
Excluir transação

---

## 🛒 Vendas (PDV)

### POST /api/sales
Registrar venda no PDV

**Request:**
```json
{
  "clientId": "client-123",
  "items": [
    {
      "type": "SERVICE",
      "itemId": "service-456",
      "quantity": 1,
      "price": 80.00,
      "discount": 0
    },
    {
      "type": "PRODUCT",
      "itemId": "product-789",
      "quantity": 2,
      "price": 120.00,
      "discount": 10
    }
  ],
  "payments": [
    {
      "method": "PIX",
      "amount": 210.00
    }
  ],
  "professionalId": "prof-123",
  "notes": "Cliente pagou com PIX"
}
```

**Response:**
```json
{
  "saleId": "sale-123",
  "total": 300.00,
  "discount": 10.00,
  "finalTotal": 290.00,
  "timestamp": "2025-10-15T14:30:00Z"
}
```

---

## 📈 Dashboard & Métricas

### GET /api/dashboard/metrics
Obter métricas do dashboard

**Response:**
```json
{
  "todayRevenue": 1250.00,
  "todayAppointments": 15,
  "activeClients": 345,
  "monthRevenue": 28500.00,
  "revenueGrowth": 15.5,
  "appointmentsGrowth": 8.2,
  "clientsGrowth": 12.1
}
```

---

## 📊 Relatórios

### GET /api/reports
Gerar relatórios detalhados

**Query Parameters:**
- `type` - financial, services, professionals, clients, products, appointments
- `period` - today, week, month, year
- `startDate` - Data inicial (opcional)
- `endDate` - Data final (opcional)

**Exemplos:**

#### Relatório Financeiro
```
GET /api/reports?type=financial&period=month
```

**Response:**
```json
{
  "summary": {
    "totalIncome": 28500.00,
    "totalExpenses": 15200.00,
    "netProfit": 13300.00,
    "transactionsCount": 245
  },
  "incomeByCategory": [...],
  "expensesByCategory": [...],
  "incomeByPaymentMethod": [...]
}
```

#### Relatório de Profissionais
```
GET /api/reports?type=professionals&period=month
```

#### Relatório de Serviços Mais Vendidos
```
GET /api/reports?type=services&period=week
```

---

## 💵 Comissões

### GET /api/commissions
Calcular comissões de profissionais

**Query Parameters:**
- `professionalId` - ID do profissional (opcional)
- `period` - today, week, month, year
- `startDate` - Data inicial (opcional)
- `endDate` - Data final (opcional)
- `status` - Status dos agendamentos (COMPLETED recomendado)

**Exemplos:**

#### Comissões de Todos os Profissionais
```
GET /api/commissions?period=month&status=COMPLETED
```

**Response:**
```json
{
  "summary": {
    "total_professionals": 5,
    "total_appointments": 342,
    "total_revenue": 28500.00,
    "total_commission": 8550.00
  },
  "commissions": [
    {
      "id": "prof-1",
      "name": "Ana Costa",
      "commission_rate": 30,
      "total_appointments": 145,
      "total_revenue": 11600.00,
      "total_commission": 3480.00
    }
  ]
}
```

#### Comissões de um Profissional Específico
```
GET /api/commissions?professionalId=prof-1&period=month
```

### POST /api/commissions
Calcular comissão para um serviço

**Request:**
```json
{
  "professionalId": "prof-1",
  "servicePrice": 150.00
}
```

**Response:**
```json
{
  "professionalId": "prof-1",
  "professionalName": "Ana Costa",
  "commissionRate": 30,
  "servicePrice": 150.00,
  "commissionValue": 45.00
}
```

### PUT /api/commissions
Atualizar taxa de comissão

**Request:**
```json
{
  "professionalId": "prof-1",
  "commissionRate": 35
}
```

---

## ⚙️ Configurações

### GET /api/settings
Obter configurações do sistema

**Query Parameters:**
- `category` - general, booking, financial, notifications, stock
- `key` - Chave específica (opcional)

**Response:**
```json
{
  "general": {
    "business_name": "SalonX",
    "business_email": "contato@bunx.io",
    "business_phone": "(11) 99999-9999"
  },
  "booking": {
    "booking_interval": "30",
    "booking_start_hour": "08:00",
    "booking_end_hour": "20:00"
  },
  "financial": {
    "default_commission": "30",
    "accept_pix": "true"
  }
}
```

### PUT /api/settings
Atualizar configurações

**Request:**
```json
{
  "settings": {
    "business_name": "SalonX",
    "business_phone": "(11) 98888-7777",
    "default_commission": "35"
  }
}
```

### POST /api/settings
Criar nova configuração

**Request:**
```json
{
  "key": "custom_setting",
  "value": "custom_value",
  "category": "general"
}
```

---

## 📋 Status de Resposta HTTP

- **200** - Sucesso
- **201** - Criado com sucesso
- **400** - Requisição inválida
- **401** - Não autenticado
- **403** - Sem permissão
- **404** - Não encontrado
- **409** - Conflito (ex: email já existe)
- **500** - Erro interno do servidor

---

## 🔧 Observações Importantes

1. **Autenticação**: Todas as rotas (exceto /api/auth/login) devem incluir o token JWT no header:
   ```
   Authorization: Bearer {token}
   ```

2. **Datas**: Use formato ISO 8601 (YYYY-MM-DD) para datas

3. **Moeda**: Todos os valores monetários são em BRL (Real Brasileiro)

4. **Paginação**: As APIs suportam paginação através dos parâmetros:
   - `page` - Número da página (padrão: 1)
   - `limit` - Itens por página (padrão: 50)

5. **Banco de Dados**: SQLite com arquivo `grace.db` na raiz do projeto

6. **Seed Data**: O sistema é populado automaticamente com dados de exemplo em desenvolvimento

---

## 🚀 Como Usar

1. **Iniciar o servidor:**
   ```bash
   npm run dev
   ```

2. **Fazer login:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@bunx.io","password":"admin123"}'
   ```

3. **Usar o token nas próximas requisições:**
   ```bash
   curl http://localhost:3000/api/clients \
     -H "Authorization: Bearer {seu-token}"
   ```

---

## 🎨 Integração com Frontend

Todas as páginas do dashboard já estão prontas para consumir estas APIs:

- `/dashboard` - Métricas gerais
- `/dashboard/agenda` - Agendamentos
- `/dashboard/clientes` - Gestão de clientes
- `/dashboard/profissionais` - Gestão de profissionais
- `/dashboard/pdv` - Ponto de venda
- `/dashboard/estoque` - Controle de estoque
- `/dashboard/financeiro` - Gestão financeira
- `/dashboard/relatorios` - Relatórios e análises
- `/dashboard/usuarios` - Gestão de usuários
- `/dashboard/configuracoes` - Configurações do sistema

---

## 📞 Suporte

Para dúvidas ou problemas, consulte os logs do servidor ou verifique o arquivo `grace.db` para dados do banco.
