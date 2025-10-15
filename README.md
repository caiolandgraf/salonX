# 💇‍♀️ SalonX - Sistema de Gestão para Salões de Beleza

Sistema completo de gestão para salões de beleza desenvolvido com **Next.js 15**, **React 19**, **TypeScript** e **shadcn/ui**.

![SalonX](https://img.shields.io/badge/version-0.1.0-ffbd59)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Características Principais

- 🎨 **Design Moderno**: Interface dark com cor de destaque dourada (#ffbd59)
- ♿ **Acessibilidade**: Interface pensada para todas as idades, incluindo idosos
- 📱 **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- 🚀 **Performance**: Otimizado com Next.js 15 e React Server Components
- 🔐 **Seguro**: Sistema de autenticação e permissões robusto

## 🛠️ Stack Tecnológica

- **Framework**: Next.js 15 com App Router
- **UI Library**: React 19
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Componentes**: shadcn/ui (customizados)
- **Ícones**: Lucide React
- **Formatação de Datas**: date-fns
- **Gráficos**: Recharts

## 📋 Módulos do Sistema

### ✅ Implementados (Fase 1)

- **Autenticação**: Sistema de login com recuperação de senha
- **Dashboard**: Visão geral com métricas e agendamentos do dia
- **Gestão de Usuários**: CRUD completo com controle de permissões

### 🚧 Em Desenvolvimento (Próximas Fases)

1. **Agenda Inteligente**: Calendário interativo, gestão de horários, conflitos
2. **Gestão Financeira**: Fluxo de caixa, contas a pagar/receber, relatórios
3. **Controle de Estoque**: Produtos internos e revenda, alertas de reposição
4. **Gestão de Profissionais**: Horários, comissões, performance
5. **CRM**: Gestão completa de clientes, histórico, preferências
6. **PDV**: Ponto de venda rápido e integrado
7. **Marketing**: Campanhas, lembretes, mensagens personalizadas
8. **Pacotes e Promoções**: Gestão de ofertas e vale-presentes
9. **Relatórios**: Analytics avançado com dashboards customizáveis
10. **Configurações**: Personalização completa do sistema

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

### Instalação

```bash
# Clone o repositório (ou navegue até a pasta do projeto)
cd salonX

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

### Build para Produção

```bash
# Criar build otimizado
npm run build

# Executar build de produção
npm start
```

## 📁 Estrutura do Projeto

```
salonX/
├── app/
│   ├── (auth)/
│   │   └── login/              # Página de login
│   ├── dashboard/              # Área autenticada
│   │   ├── page.tsx           # Dashboard principal
│   │   ├── usuarios/          # Gestão de usuários
│   │   ├── agenda/            # Agendamentos
│   │   ├── clientes/          # CRM
│   │   ├── profissionais/     # Gestão de equipe
│   │   ├── financeiro/        # Gestão financeira
│   │   ├── estoque/           # Controle de estoque
│   │   ├── pdv/               # Ponto de venda
│   │   ├── relatorios/        # Relatórios
│   │   └── configuracoes/     # Configurações
│   ├── layout.tsx             # Layout raiz
│   ├── page.tsx               # Página inicial (redireciona)
│   └── globals.css            # Estilos globais
├── components/
│   ├── ui/                    # Componentes shadcn/ui
│   ├── layout/                # Layout components (Sidebar, Header)
│   └── dashboard/             # Componentes do dashboard
├── lib/
│   └── utils.ts               # Funções utilitárias
├── types/
│   └── index.ts               # Tipos TypeScript
├── public/                    # Arquivos estáticos
├── tailwind.config.ts         # Configuração do Tailwind
├── tsconfig.json              # Configuração do TypeScript
└── package.json               # Dependências
```

## 🎨 Design System

### Cores Principais

```css
--primary: #ffbd59          /* Dourado/Amarelo */
--background: #000000       /* Preto */
--foreground: #fafafa       /* Branco */
--card: #0a0a0a            /* Cinza muito escuro */
--border: #262626          /* Cinza escuro */
```

### Acessibilidade

- ✅ Contraste WCAG 2.1 AA
- ✅ Fontes legíveis (tamanho base aumentado)
- ✅ Botões e áreas clicáveis grandes
- ✅ Ícones com texto descritivo
- ✅ Navegação por teclado
- ✅ Suporte a leitores de tela

## 👥 Níveis de Acesso

- **Administrador**: Acesso total ao sistema
- **Gerente**: Gestão operacional completa
- **Profissional**: Agenda própria, clientes, comissões
- **Atendente**: Agendamentos, clientes, recepção
- **Caixa**: PDV, financeiro, fechamento de caixa

## 🔐 Autenticação

### Credenciais de Teste

```
Email: admin@salonx.com.br
Senha: (qualquer senha - desenvolvimento)
```

> ⚠️ **Nota**: O sistema de autenticação atual é apenas para demonstração. 
> Em produção, será implementado com backend real e segurança adequada.

## 📊 Funcionalidades do Dashboard

- **Métricas em Tempo Real**: Faturamento, agendamentos, clientes ativos
- **Agendamentos do Dia**: Lista visual com status em tempo real
- **Atalhos Rápidos**: Acesso rápido às funcionalidades principais
- **Gráficos de Performance**: Visualização de crescimento e tendências

## 👨‍💻 Desenvolvimento

### Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start

# Lint
npm run lint
```

### Padrões de Código

- **Componentes**: Use 'use client' apenas quando necessário (interatividade)
- **Tipos**: Sempre use TypeScript com tipos explícitos
- **Estilização**: Use Tailwind CSS e classes utilitárias
- **Componentes UI**: Utilize componentes do shadcn/ui customizados

### Criando Novos Módulos

1. Crie a pasta em `app/dashboard/[modulo]`
2. Adicione `page.tsx` com o componente principal
3. Defina tipos necessários em `types/index.ts`
4. Crie componentes reutilizáveis em `components/`
5. Adicione rota no sidebar (`components/layout/sidebar.tsx`)

## 🔄 Roadmap

### Fase 1 - Base ✅ (Concluída)
- [x] Estrutura do projeto
- [x] Design system e tema
- [x] Autenticação
- [x] Dashboard principal
- [x] Gestão de usuários

### Fase 2 - Operacional 🚧
- [ ] Agenda inteligente
- [ ] Gestão de clientes (CRM)
- [ ] Gestão de profissionais
- [ ] Serviços e categorias

### Fase 3 - Financeiro 📅
- [ ] Fluxo de caixa
- [ ] Contas a pagar/receber
- [ ] PDV completo
- [ ] Fechamento de caixa

### Fase 4 - Estoque e Marketing 📅
- [ ] Controle de estoque
- [ ] Alertas de reposição
- [ ] Sistema de campanhas
- [ ] Lembretes automáticos

### Fase 5 - Analytics e Expansão 📅
- [ ] Relatórios avançados
- [ ] Dashboards customizáveis
- [ ] Suporte a múltiplas unidades
- [ ] App mobile (PWA)

## 📝 Boas Práticas

### Performance
- Uso de React Server Components quando possível
- Lazy loading de componentes pesados
- Otimização de imagens com Next/Image
- Cache adequado de requisições

### Segurança
- Validação de dados no client e server
- Sanitização de inputs
- Proteção contra XSS e SQL Injection
- Conformidade com LGPD

### UX/UI
- Loading states em todas as ações
- Feedback visual claro
- Mensagens de erro compreensíveis
- Confirmação em ações destrutivas

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📧 Contato

**SalonX Team**
- Email: contato@salonx.com.br
- Website: https://salonx.com.br

---

Desenvolvido com 💛 pela equipe SalonX
