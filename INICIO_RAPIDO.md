# 🚀 Início Rápido - SalonX

## Servidor em Execução

✅ **O servidor está rodando em**: http://localhost:3001

## Como Acessar

### 1. Página de Login
Acesse: http://localhost:3001/login

**Credenciais de Teste:**
- Email: qualquer email (ex: admin@salonx.com.br)
- Senha: qualquer senha

> ⚠️ Modo desenvolvimento - autenticação simplificada

### 2. Dashboard
Após fazer login, você será redirecionado para: http://localhost:3001/dashboard

### 3. Gestão de Usuários
Acesse: http://localhost:3001/dashboard/usuarios

Aqui você pode:
- ✅ Ver lista completa de usuários
- ✅ Criar novos usuários
- ✅ Editar usuários existentes
- ✅ Excluir usuários
- ✅ Filtrar por função
- ✅ Buscar por nome ou email

### 4. Outros Módulos
Todos os outros módulos estão acessíveis via sidebar:
- Agenda
- Clientes
- Profissionais
- Financeiro
- Estoque
- PDV
- Relatórios
- Configurações

*Estes módulos exibem placeholders e serão implementados nas próximas fases.*

## Comandos Úteis

### Parar o Servidor
No terminal onde está rodando, pressione: `Ctrl + C`

### Reiniciar o Servidor
```bash
npm run dev
```

### Build de Produção
```bash
npm run build
npm start
```

### Verificar Erros
```bash
npm run lint
```

## Estrutura de Navegação

```
/                       → Redireciona para /login
/login                  → Tela de autenticação
/dashboard              → Dashboard principal
/dashboard/usuarios     → Gestão de usuários (COMPLETO)
/dashboard/agenda       → Agenda (em desenvolvimento)
/dashboard/clientes     → CRM (em desenvolvimento)
/dashboard/profissionais → Equipe (em desenvolvimento)
/dashboard/financeiro   → Financeiro (em desenvolvimento)
/dashboard/estoque      → Estoque (em desenvolvimento)
/dashboard/pdv          → Ponto de Venda (em desenvolvimento)
/dashboard/relatorios   → Relatórios (em desenvolvimento)
/dashboard/configuracoes → Configurações (em desenvolvimento)
```

## Funcionalidades Disponíveis

### ✅ Gestão de Usuários
1. **Criar Usuário**
   - Clique no botão "Novo Usuário"
   - Preencha: nome, email, função, senha
   - Marque se o usuário está ativo
   - Clique em "Criar Usuário"

2. **Editar Usuário**
   - Clique no ícone de lápis (editar)
   - Modifique os dados desejados
   - Senha é opcional na edição
   - Clique em "Atualizar Usuário"

3. **Excluir Usuário**
   - Clique no ícone de lixeira (excluir)
   - Confirme a ação
   - Usuários Admin não podem ser excluídos

4. **Filtrar Usuários**
   - Use o campo de busca para procurar por nome/email
   - Use o select para filtrar por função
   - Os filtros funcionam em conjunto

### ✅ Dashboard
- Visualize métricas do dia (faturamento, agendamentos, clientes)
- Veja agendamentos do dia com status em tempo real
- Use atalhos rápidos para funcionalidades

### ✅ Navegação
- Menu lateral fixo (sidebar) com todos os módulos
- Header com busca global e menu do usuário
- Indicador visual da página atual

## Testar Funcionalidades

### Teste 1: Login
1. Acesse http://localhost:3001/login
2. Digite qualquer email e senha
3. Clique em "Entrar no Sistema"
4. Você deve ser redirecionado para o dashboard

### Teste 2: Criar Usuário
1. Acesse http://localhost:3001/dashboard/usuarios
2. Clique em "Novo Usuário"
3. Preencha todos os campos
4. Clique em "Criar Usuário"
5. O novo usuário deve aparecer na tabela

### Teste 3: Filtros
1. Na página de usuários
2. Digite um nome na busca
3. Selecione uma função no filtro
4. A tabela deve atualizar automaticamente

### Teste 4: Edição
1. Clique no ícone de editar de um usuário
2. Modifique o nome ou função
3. Clique em "Atualizar Usuário"
4. As mudanças devem aparecer na tabela

## Características do Design

### Tema Dark
- Background preto (#000000)
- Cards em cinza escuro (#0a0a0a)
- Texto branco (#fafafa)
- Destaque dourado (#ffbd59)

### Acessibilidade
- Fontes grandes e legíveis
- Alto contraste
- Botões grandes
- Ícones com texto descritivo
- Estados visuais claros

### Responsividade
O sistema funciona em:
- Desktop (ideal)
- Tablet
- Mobile

## Próximos Módulos

Os próximos módulos a serem implementados são:

1. **Agenda** - Calendário completo com agendamentos
2. **Clientes** - CRM com histórico completo
3. **Profissionais** - Gestão de equipe e comissões
4. **Financeiro** - Fluxo de caixa e relatórios
5. **Estoque** - Controle de produtos
6. **PDV** - Ponto de venda integrado
7. **Relatórios** - Analytics avançado
8. **Configurações** - Personalização do sistema

## Suporte

### Documentação
- README.md - Documentação completa
- IMPLEMENTADO.md - Detalhes da implementação

### Links Úteis
- Next.js: https://nextjs.org/docs
- shadcn/ui: https://ui.shadcn.com
- Tailwind: https://tailwindcss.com/docs
- TypeScript: https://www.typescriptlang.org/docs

---

✨ **Desenvolvido com Next.js 15, React 19 e TypeScript**

🎨 **Design System com shadcn/ui e Tailwind CSS**

♿ **Interface acessível e pensada para todos**
