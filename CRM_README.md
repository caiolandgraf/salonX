# 🎯 CRM Funcional - SalonX

## 📋 Visão Geral

Sistema completo de **Customer Relationship Management (CRM)** integrado ao SalonX, com funcionalidades profissionais para gestão de relacionamento com clientes.

## ✨ Funcionalidades Principais

### 1. **Dashboard CRM**
- ✅ Total de clientes ativos
- ✅ Segmentação (VIP, Regular, Novo, Inativo)
- ✅ Receita total gerada
- ✅ Ticket médio por cliente
- ✅ Estatísticas em tempo real

### 2. **Perfil Completo do Cliente**
- ✅ Informações de contato (nome, email, telefone, endereço completo)
- ✅ Data de nascimento
- ✅ Segmentação automática e manual
- ✅ Tags personalizadas
- ✅ Origem do cliente (como conheceu o salão)
- ✅ Histórico de visitas
- ✅ Total gasto (Lifetime Value)
- ✅ Ticket médio
- ✅ Última visita
- ✅ Próximo follow-up agendado
- ✅ Responsável pelo atendimento

### 3. **Visualização Detalhada do Cliente**
- ✅ Modal completo com 3 abas:
  - **Visão Geral**: dados de contato e estatísticas
  - **Histórico**: todas as interações e compras
  - **Notas & Follow-ups**: registro de comunicações

### 4. **Sistema de Notas**
- ✅ Registro de interações
- ✅ Tipos de nota:
  - 📝 Nota simples
  - 📞 Ligação
  - ✉️ Email
  - 👥 Reunião
  - 🔔 Follow-up
- ✅ Histórico completo com data e usuário responsável

### 5. **Histórico de Interações**
- ✅ Registro automático de:
  - Agendamentos
  - Compras
  - Ligações
  - Emails
  - Visitas
- ✅ Timeline completa do relacionamento

### 6. **Segmentação Inteligente**
- ✅ **Novo**: Clientes cadastrados recentemente
- ✅ **Regular**: Clientes com 5+ visitas
- ✅ **VIP**: Clientes com gasto total ≥ R$ 1.000
- ✅ **Inativo**: Clientes sem visitas recentes
- ✅ Atualização automática baseada em comportamento

### 7. **Filtros e Buscas**
- ✅ Busca por nome, email ou telefone
- ✅ Filtro por segmento
- ✅ Ordenação personalizável
- ✅ Exportação de dados (em desenvolvimento)

## 🚀 Como Usar

### Passo 1: Executar a Migração do Banco de Dados

Execute a migração para criar as novas tabelas do CRM:

```bash
# Opção 1: Via API (recomendado)
curl -X POST http://localhost:3000/api/crm/migrate

# Opção 2: Via terminal
npm run migrate:crm

# Opção 3: Manualmente no navegador
# Acesse: http://localhost:3000/api/crm/migrate (método POST via Postman/Insomnia)
```

### Passo 2: Acessar o CRM

1. Faça login no sistema
2. Acesse o menu **Clientes** no dashboard
3. Explore as funcionalidades do CRM!

### Passo 3: Cadastrar Clientes

1. Clique em **"Novo Cliente"**
2. Preencha os dados:
   - **Obrigatórios**: Nome, Email, Telefone
   - **Opcionais**: Data de nascimento, endereço completo, segmento, origem, observações
3. Clique em **"Cadastrar"**

### Passo 4: Gerenciar Clientes

#### Visualizar Detalhes
- Clique no ícone 👁️ (olho) para abrir a visualização completa
- Navegue pelas abas: Visão Geral, Histórico, Notas

#### Adicionar Notas
1. Abra os detalhes do cliente
2. Vá para a aba **"Notas & Follow-ups"**
3. Clique em **"Nova Nota"**
4. Selecione o tipo e escreva o conteúdo
5. Clique em **"Salvar"**

#### Atualizar Segmento
1. Abra os detalhes do cliente
2. Clique no ícone ✏️ ao lado do segmento atual
3. Selecione o novo segmento
4. Clique em **"Salvar"**

#### Editar Informações
- Clique no ícone ✏️ (lápis) na lista de clientes
- Atualize os dados desejados
- Clique em **"Atualizar"**

#### Excluir Cliente
- Clique no ícone 🗑️ (lixeira)
- Confirme a exclusão

## 📊 Estrutura do Banco de Dados

### Tabela: `clients` (atualizada)
```sql
- id: TEXT PRIMARY KEY
- name: TEXT NOT NULL
- email: TEXT
- phone: TEXT
- birthdate: TEXT
- address: TEXT
- city: TEXT
- state: TEXT
- zip_code: TEXT
- notes: TEXT
- total_visits: INTEGER DEFAULT 0
- total_spent: REAL DEFAULT 0
- last_visit: TEXT
- segment: TEXT DEFAULT 'NEW'
- tags: TEXT (JSON array)
- source: TEXT
- lifetime_value: REAL DEFAULT 0
- average_ticket: REAL DEFAULT 0
- last_contact_date: TEXT
- next_follow_up: TEXT
- assigned_to: TEXT (FK -> users.id)
- active: INTEGER DEFAULT 1
- created_at: TEXT DEFAULT CURRENT_TIMESTAMP
```

### Tabela: `client_notes`
```sql
- id: TEXT PRIMARY KEY
- client_id: TEXT NOT NULL (FK -> clients.id)
- user_id: TEXT NOT NULL (FK -> users.id)
- content: TEXT NOT NULL
- type: TEXT DEFAULT 'NOTE'
- created_at: TEXT DEFAULT CURRENT_TIMESTAMP
```

### Tabela: `client_tags`
```sql
- id: TEXT PRIMARY KEY
- name: TEXT UNIQUE NOT NULL
- color: TEXT NOT NULL
- created_at: TEXT DEFAULT CURRENT_TIMESTAMP
```

### Tabela: `client_interactions`
```sql
- id: TEXT PRIMARY KEY
- client_id: TEXT NOT NULL (FK -> clients.id)
- type: TEXT NOT NULL
- description: TEXT NOT NULL
- amount: REAL
- date: TEXT NOT NULL
- created_at: TEXT DEFAULT CURRENT_TIMESTAMP
```

## 🎨 Componentes Criados

### 1. `ClientDetailView` 
**Localização**: `/components/crm/client-detail-view.tsx`

Modal completo com visualização detalhada do cliente, incluindo:
- Informações de contato
- Estatísticas (total gasto, visitas, ticket médio)
- Sistema de tabs
- Gerenciamento de segmentos
- Sistema de notas

### 2. Página CRM Atualizada
**Localização**: `/app/dashboard/clientes/page.tsx`

Página principal do CRM com:
- Dashboard com cards de estatísticas
- Tabela de clientes com avatares
- Filtros e busca avançada
- Formulário completo de cadastro
- Integração com o componente de detalhes

## 🔌 APIs Criadas

### 1. Notas do Cliente
```
GET  /api/clients/[id]/notes
POST /api/clients/[id]/notes
```

### 2. Interações do Cliente
```
GET /api/clients/[id]/interactions
```

### 3. Migração do CRM
```
GET  /api/crm/migrate
POST /api/crm/migrate
```

### 4. Clientes (atualizado)
```
GET    /api/clients          # Suporta filtro por segmento
POST   /api/clients          # Campos CRM incluídos
GET    /api/clients/[id]
PUT    /api/clients/[id]     # Campos CRM incluídos
DELETE /api/clients/[id]
```

## 📈 Métricas Calculadas Automaticamente

### Lifetime Value (LTV)
- Soma total de todos os gastos do cliente
- Atualizado após cada venda/serviço

### Ticket Médio
- `Total Gasto ÷ Número de Visitas`
- Recalculado automaticamente

### Segmentação Automática
- **VIP**: LTV ≥ R$ 1.000
- **Regular**: 5+ visitas
- **Novo**: 0 visitas ou recém-cadastrado
- **Inativo**: Sem visitas nos últimos 90 dias (futuro)

## 🎯 Próximas Funcionalidades (Roadmap)

- [ ] **Campanhas de Marketing**
  - Email marketing integrado
  - WhatsApp Business API
  - SMS automático

- [ ] **Automações**
  - Mensagens de aniversário automáticas
  - Follow-up automático após X dias
  - Reengajamento de clientes inativos

- [ ] **Relatórios Avançados**
  - Taxa de retenção
  - Churn rate
  - Análise de cohort
  - Previsão de receita

- [ ] **Integração com Agendamentos**
  - Histórico automático de serviços
  - Preferências de profissionais
  - Horários preferidos

- [ ] **Sistema de Pontos/Fidelidade**
  - Programa de pontos
  - Cupons de desconto
  - Recompensas automáticas

## 🛠️ Tecnologias Utilizadas

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Better-sqlite3** - Banco de dados SQLite
- **Tailwind CSS** - Estilização
- **Shadcn/ui** - Componentes UI
- **Lucide React** - Ícones

## 📝 Notas Importantes

1. **Backup**: Sempre faça backup do banco de dados antes de executar migrações
2. **Segurança**: Em produção, adicione autenticação nas rotas de migração
3. **Performance**: Para grandes volumes de dados, considere paginação
4. **Validação**: Adicione validação de dados no frontend e backend

## 🤝 Contribuindo

Para adicionar novas funcionalidades ao CRM:

1. Atualize os types em `/types/index.ts`
2. Crie/atualize as tabelas do banco de dados
3. Implemente as APIs necessárias
4. Atualize os componentes do frontend
5. Documente as mudanças

## 📞 Suporte

Para dúvidas ou problemas:
- Verifique o console do navegador para erros
- Consulte os logs do servidor
- Revise este README

---

**Desenvolvido com ❤️ para o SalonX**
