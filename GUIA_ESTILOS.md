# 🎨 Guia de Estilos - SalonX

## Paleta de Cores

### Cores Principais

```css
/* Primária (Dourado) */
--primary: #ffbd59
--primary-foreground: #000000

/* Background */
--background: #000000
--foreground: #fafafa

/* Cards */
--card: #0a0a0a
--card-foreground: #fafafa

/* Popover */
--popover: #0a0a0a
--popover-foreground: #fafafa

/* Secundária */
--secondary: #262626
--secondary-foreground: #fafafa

/* Muted */
--muted: #262626
--muted-foreground: #a3a3a3

/* Accent */
--accent: #ffbd59
--accent-foreground: #000000

/* Destructive */
--destructive: #ef4444
--destructive-foreground: #fafafa

/* Border & Input */
--border: #333333
--input: #333333
--ring: #ffbd59
```

### Cores de Função (Role Colors)

```css
/* Administrador */
.role-admin { background: rgb(255 189 89 / 0.1); color: #ffbd59; }

/* Gerente */
.role-manager { background: rgb(59 130 246 / 0.1); color: #3b82f6; }

/* Profissional */
.role-professional { background: rgb(34 197 94 / 0.1); color: #22c55e; }

/* Atendente */
.role-receptionist { background: rgb(168 85 247 / 0.1); color: #a855f7; }

/* Caixa */
.role-cashier { background: rgb(249 115 22 / 0.1); color: #f97316; }
```

### Cores de Status

```css
/* Sucesso */
.status-success { color: #22c55e; }

/* Erro */
.status-error { color: #ef4444; }

/* Aviso */
.status-warning { color: #f59e0b; }

/* Info */
.status-info { color: #3b82f6; }

/* Em andamento */
.status-progress { color: #ffbd59; }
```

## Tipografia

### Família de Fontes

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Tamanhos

```css
/* Base (16px) */
text-base: 1rem

/* Títulos */
text-3xl: 1.875rem (30px)  /* Página */
text-2xl: 1.5rem (24px)    /* Seção */
text-xl: 1.25rem (20px)    /* Card Title */
text-lg: 1.125rem (18px)   /* Subtítulo */

/* Corpo */
text-base: 1rem (16px)     /* Texto normal */
text-sm: 0.875rem (14px)   /* Texto pequeno */
text-xs: 0.75rem (12px)    /* Muito pequeno */
```

### Pesos

```css
font-normal: 400
font-medium: 500
font-semibold: 600
font-bold: 700
```

## Espaçamentos

### Padding

```css
p-2: 0.5rem (8px)
p-3: 0.75rem (12px)
p-4: 1rem (16px)
p-6: 1.5rem (24px)
p-8: 2rem (32px)
```

### Margin

```css
m-2: 0.5rem (8px)
m-4: 1rem (16px)
m-6: 1.5rem (24px)
m-8: 2rem (32px)
```

### Gap

```css
gap-2: 0.5rem (8px)
gap-3: 0.75rem (12px)
gap-4: 1rem (16px)
gap-6: 1.5rem (24px)
```

## Componentes

### Botões

#### Tamanhos
```tsx
size="sm"      // h-8 px-3 text-xs
size="default" // h-9 px-4 py-2 text-sm
size="lg"      // h-11 px-8 text-base
size="xl"      // h-14 px-10 text-lg
size="icon"    // h-9 w-9
```

#### Variantes
```tsx
variant="default"     // Primário (dourado)
variant="destructive" // Destrutivo (vermelho)
variant="outline"     // Contorno
variant="secondary"   // Secundário
variant="ghost"       // Sem fundo
variant="link"        // Link
```

### Cards

```tsx
<Card>                // Container principal
  <CardHeader>        // Cabeçalho (p-6)
    <CardTitle>       // Título (text-lg font-semibold)
    <CardDescription> // Descrição (text-sm muted)
  </CardHeader>
  <CardContent>       // Conteúdo (p-6 pt-0)
  <CardFooter>        // Rodapé (p-6 pt-0)
</Card>
```

### Inputs

```tsx
<Input
  className="h-11"    // Altura padrão
  placeholder="..."   // Placeholder sempre presente
/>
```

### Tabelas

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>   // Cabeçalho (text-muted-foreground)
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>      // Hover com bg-muted/50
      <TableCell>   // Célula (p-4)
    </TableRow>
  </TableBody>
</Table>
```

## Layout

### Sidebar

```css
width: 18rem (288px)
background: var(--card)
border-right: 1px solid var(--border)
```

### Header

```css
height: 4rem (64px)
background: var(--card)
border-bottom: 1px solid var(--border)
```

### Main Content

```css
padding: 1.5rem (24px)
overflow-y: auto
```

## Borders

### Radius

```css
rounded-sm: 0.125rem (2px)
rounded: 0.25rem (4px)
rounded-md: 0.375rem (6px)
rounded-lg: 0.5rem (8px)
rounded-xl: 0.75rem (12px)
rounded-2xl: 1rem (16px)
rounded-full: 9999px
```

### Width

```css
border: 1px
border-2: 2px
```

## Sombras

```css
shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1)
shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
```

## Transições

```css
transition-colors: color, background-color, border-color
duration-200: 200ms
```

## Estados

### Hover

```css
hover:bg-secondary      /* Background secundário */
hover:text-primary      /* Texto primário */
hover:border-primary    /* Borda primária */
```

### Focus

```css
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-ring
focus-visible:ring-offset-2
```

### Active

```css
active:scale-95         /* Leve redução no clique */
```

### Disabled

```css
disabled:opacity-50
disabled:pointer-events-none
```

## Classes Customizadas

### Sidebar Link

```css
.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  color: var(--muted-foreground);
  transition: all 200ms;
}

.sidebar-link:hover {
  color: var(--primary);
  background: var(--secondary);
}

.sidebar-link-active {
  background: var(--secondary);
  color: var(--primary);
}
```

### Metric Card

```css
.metric-card {
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  background: var(--card);
  padding: 1.5rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
```

## Ícones

### Tamanhos

```tsx
className="h-4 w-4"   // Pequeno (dentro de inputs, badges)
className="h-5 w-5"   // Médio (sidebar, botões)
className="h-6 w-6"   // Grande (destaque)
className="h-8 w-8"   // Extra grande
className="h-16 w-16" // Ícones de placeholder
```

### Cores

```tsx
className="text-muted-foreground"  // Neutro
className="text-primary"           // Destaque
className="text-destructive"       // Erro
className="text-green-500"         // Sucesso
```

## Animações

### Spin (Loading)

```tsx
<Loader2 className="animate-spin" />
```

### Pulse (Status ativo)

```tsx
<div className="animate-pulse" />
```

### Fade In

```tsx
className="data-[state=open]:animate-in data-[state=closed]:animate-out"
```

## Responsividade

### Breakpoints

```css
sm: 640px   /* Tablet pequeno */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Desktop grande */
2xl: 1536px /* Desktop extra grande */
```

### Mobile First

```tsx
className="flex-col md:flex-row"      /* Coluna no mobile, linha no tablet+ */
className="w-full md:w-1/2"           /* Full width mobile, metade tablet+ */
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4" /* Grid responsivo */
```

## Acessibilidade

### Contraste

- Texto em background: 7:1 (AAA)
- Texto em cards: 4.5:1 (AA)
- Ícones: 3:1 (AA)

### Áreas Clicáveis

```css
min-height: 44px  /* h-11 */
min-width: 44px   /* w-11 */
```

### Focus Visible

Sempre visível e destacado:
```css
focus-visible:ring-2
focus-visible:ring-primary
```

## Exemplos de Uso

### Card com Métrica

```tsx
<Card className="metric-card">
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        Título
      </CardTitle>
      <Icon className="h-5 w-5 text-muted-foreground" />
    </div>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold">R$ 2.850,00</div>
    <p className="text-xs text-muted-foreground mt-1">
      vs. mês anterior
    </p>
  </CardContent>
</Card>
```

### Botão com Loading

```tsx
<Button disabled={isLoading}>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Salvando...
    </>
  ) : (
    'Salvar'
  )}
</Button>
```

### Badge de Status

```tsx
<span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-green-500/10 text-green-500">
  <CheckCircle2 className="mr-1 h-3 w-3" />
  Ativo
</span>
```

---

**Desenvolvido seguindo as melhores práticas de UI/UX e acessibilidade**
