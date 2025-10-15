# 📚 Documentação da API - SalonX

## 🚀 Começando

### Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

### Credenciais padrão

- **Email**: admin@bunx.io
- **Senha**: admin123

---

## 📋 Endpoints da API

### 🔐 Autenticação

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@bunx.io",
  "password": "admin123"
}
```

**Resposta:**
```json
{
  "success": true,
  "user": {
    "id": "admin-1",
    "name": "Administrador",
    "email": "admin@bunx.io",
    "role": "ADMIN"
  },
  "token": "mock-jwt-token-..."
}
```

---

### 📅 Agendamentos

#### Listar agendamentos
```http
GET /api/appointments?date=2024-10-15&professionalId=pro-123&status=CONFIRMED
```

**Parâmetros:**
- `date` (opcional): Filtrar por data (YYYY-MM-DD)
- `professionalId` (opcional): Filtrar por profissional
- `status` (opcional): Filtrar por status

#### Criar agendamento
```http
POST /api/appointments
Content-Type: application/json

{
  "clientId": "cli-123",
  "clientName": "Maria Silva",
  "professionalId": "pro-456",
  "professionalName": "Carla Mendes",
  "serviceId": "s1",
  "serviceName": "Corte Feminino",
  "date": "2024-10-15",
  "time": "14:00",
  "duration": 60,
  "price": 80.00,
  "status": "SCHEDULED",
  "notes": "Cliente prefere corte curto"
}
```

#### Atualizar agendamento
```http
PUT /api/appointments/[id]
Content-Type: application/json

{
  "status": "CONFIRMED",
  "notes": "Confirmado por telefone"
}
```

#### Deletar agendamento
```http
DELETE /api/appointments/[id]
```

---

### 👥 Clientes

#### Listar clientes
```http
GET /api/clients?search=maria
```

**Parâmetros:**
- `search` (opcional): Buscar por nome, email ou telefone

#### Criar cliente
```http
POST /api/clients
Content-Type: application/json

{
  "name": "Maria Silva",
  "email": "maria@email.com",
  "phone": "(11) 98765-4321",
  "birthdate": "1990-05-15",
  "address": "Rua das Flores, 123",
  "notes": "Cliente VIP"
}
```

---

### 👨‍💼 Profissionais

#### Listar profissionais
```http
GET /api/professionals
```

#### Criar profissional
```http
POST /api/professionals
Content-Type: application/json

{
  "name": "Carla Mendes",
  "email": "carla@salon.com",
  "phone": "(11) 91234-5678",
  "specialties": ["Corte", "Coloração"],
  "commission": 30
}
```

---

### 💇 Serviços

#### Listar serviços
```http
GET /api/services?category=Cabelo
```

**Parâmetros:**
- `category` (opcional): Filtrar por categoria

#### Criar serviço
```http
POST /api/services
Content-Type: application/json

{
  "name": "Corte Feminino",
  "description": "Corte completo com lavagem e finalização",
  "price": 80.00,
  "duration": 60,
  "category": "Cabelo"
}
```

---

### 📦 Produtos

#### Listar produtos
```http
GET /api/products?category=Cabelo&type=PRODUCT&lowStock=true
```

**Parâmetros:**
- `category` (opcional): Filtrar por categoria
- `type` (opcional): PRODUCT ou CONSUMABLE
- `lowStock` (opcional): true para produtos com estoque baixo

#### Criar produto
```http
POST /api/products
Content-Type: application/json

{
  "name": "Shampoo Profissional 1L",
  "type": "PRODUCT",
  "category": "Cabelo",
  "brand": "L'Oréal",
  "sku": "SHP001",
  "currentStock": 25,
  "minStock": 10,
  "maxStock": 50,
  "unit": "UN",
  "costPrice": 45.00,
  "salePrice": 89.90,
  "supplier": "Distribuidora XYZ",
  "location": "Prateleira A2"
}
```

---

### 📊 Movimentações de Estoque

#### Listar movimentações
```http
GET /api/stock-movements?productId=prd-123
```

#### Criar movimentação
```http
POST /api/stock-movements
Content-Type: application/json

{
  "productId": "prd-123",
  "type": "IN",
  "quantity": 10,
  "reason": "Compra de fornecedor",
  "userId": "admin-1"
}
```

**Tipos:**
- `IN`: Entrada
- `OUT`: Saída
- `ADJUSTMENT`: Ajuste de estoque

---

### 💰 Transações Financeiras

#### Listar transações
```http
GET /api/transactions?type=INCOME&status=PAID&startDate=2024-10-01&endDate=2024-10-31
```

**Parâmetros:**
- `type` (opcional): INCOME ou EXPENSE
- `status` (opcional): PENDING, PAID, CANCELLED
- `startDate` (opcional): Data inicial
- `endDate` (opcional): Data final

#### Criar transação
```http
POST /api/transactions
Content-Type: application/json

{
  "type": "INCOME",
  "category": "SERVICE",
  "description": "Serviço de corte",
  "amount": 80.00,
  "status": "PAID",
  "paymentMethod": "CREDIT_CARD",
  "dueDate": "2024-10-15",
  "paidDate": "2024-10-15",
  "clientId": "cli-123",
  "notes": "Pagamento via cartão"
}
```

---

### 🛒 Vendas (PDV)

#### Listar vendas
```http
GET /api/sales?startDate=2024-10-01&endDate=2024-10-31
```

#### Criar venda
```http
POST /api/sales
Content-Type: application/json

{
  "clientId": "cli-123",
  "professionalId": "pro-456",
  "items": [
    {
      "type": "SERVICE",
      "itemId": "s1",
      "name": "Corte Feminino",
      "quantity": 1,
      "price": 80.00,
      "discount": 0,
      "total": 80.00
    },
    {
      "type": "PRODUCT",
      "itemId": "prd-123",
      "name": "Shampoo 1L",
      "quantity": 2,
      "price": 89.90,
      "discount": 10.00,
      "total": 169.80
    }
  ],
  "payments": [
    {
      "method": "CREDIT_CARD",
      "amount": 249.80
    }
  ],
  "subtotal": 249.80,
  "discount": 0,
  "total": 249.80,
  "notes": "Cliente levou 2 shampoos"
}
```

**Observações:**
- Ao criar uma venda, o estoque dos produtos é automaticamente atualizado
- Uma transação financeira de receita é criada automaticamente
- As estatísticas do cliente (visitas, gastos) são atualizadas

---

### 📊 Dashboard - Métricas

#### Obter métricas
```http
GET /api/dashboard/metrics
```

**Resposta:**
```json
{
  "todayRevenue": 450.00,
  "todayAppointments": 8,
  "activeClients": 45,
  "monthRevenue": 12500.00,
  "revenueGrowth": 12.5,
  "appointmentsGrowth": 8.3,
  "clientsGrowth": 0,
  "totalClients": 156
}
```

---

## 🗄️ Banco de Dados

O sistema utiliza **SQLite** com o arquivo `grace.db` na raiz do projeto.

### Tabelas:
- `users` - Usuários do sistema
- `clients` - Clientes do salão
- `professionals` - Profissionais
- `services` - Serviços oferecidos
- `appointments` - Agendamentos
- `products` - Produtos do estoque
- `stock_movements` - Movimentações de estoque
- `transactions` - Transações financeiras
- `sales` - Vendas
- `sale_items` - Itens das vendas
- `sale_payments` - Pagamentos das vendas

### Dados de exemplo

O banco é automaticamente populado com dados de exemplo no primeiro start em modo desenvolvimento.

---

## 🛠️ Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **SQLite** - Banco de dados
- **better-sqlite3** - Driver SQLite
- **Tailwind CSS** - Estilização

---

## 📝 Notas

1. **Autenticação**: Por enquanto usa autenticação simplificada. Em produção, implementar JWT adequado.
2. **Senhas**: Atualmente aceita senha fixa 'admin123'. Implementar bcrypt para produção.
3. **CORS**: Configure adequadamente para produção.
4. **Validações**: Adicionar validações mais robustas com Zod ou similar.
5. **Transações**: Usar transações do SQLite para operações críticas.

---

## 🐛 Troubleshooting

### Banco não inicializa
```bash
# Deletar o banco e reiniciar
rm grace.db
npm run dev
```

### Erros de permissão
```bash
# Dar permissões ao arquivo do banco
chmod 666 grace.db
```

---

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação completa ou entre em contato com o time de desenvolvimento.
