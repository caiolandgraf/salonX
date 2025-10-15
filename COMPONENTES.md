# 📦 Componentes Disponíveis - SalonX

## Componentes UI (shadcn/ui)

### 1. Button
**Localização**: `components/ui/button.tsx`

**Uso**:
```tsx
import { Button } from '@/components/ui/button';

<Button>Clique aqui</Button>
<Button variant="outline" size="lg">Botão Grande</Button>
<Button variant="destructive" size="sm">Excluir</Button>
```

**Variantes**:
- `default` - Botão primário (dourado)
- `destructive` - Destrutivo (vermelho)
- `outline` - Com borda
- `secondary` - Secundário
- `ghost` - Sem fundo
- `link` - Estilo de link

**Tamanhos**:
- `sm` - Pequeno
- `default` - Padrão
- `lg` - Grande
- `xl` - Extra grande
- `icon` - Ícone (quadrado)

---

### 2. Card
**Localização**: `components/ui/card.tsx`

**Uso**:
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
    <CardDescription>Descrição opcional</CardDescription>
  </CardHeader>
  <CardContent>
    Conteúdo principal
  </CardContent>
  <CardFooter>
    Rodapé opcional
  </CardFooter>
</Card>
```

---

### 3. Input
**Localização**: `components/ui/input.tsx`

**Uso**:
```tsx
import { Input } from '@/components/ui/input';

<Input type="text" placeholder="Digite algo..." />
<Input type="email" placeholder="seu@email.com" />
<Input type="password" placeholder="Senha" />
```

---

### 4. Label
**Localização**: `components/ui/label.tsx`

**Uso**:
```tsx
import { Label } from '@/components/ui/label';

<Label htmlFor="name">Nome</Label>
<Input id="name" />
```

---

### 5. Avatar
**Localização**: `components/ui/avatar.tsx`

**Uso**:
```tsx
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

<Avatar>
  <AvatarImage src="/avatar.jpg" alt="Nome" />
  <AvatarFallback>NM</AvatarFallback>
</Avatar>
```

---

### 6. Dropdown Menu
**Localização**: `components/ui/dropdown-menu.tsx`

**Uso**:
```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Abrir Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Perfil</DropdownMenuItem>
    <DropdownMenuItem>Configurações</DropdownMenuItem>
    <DropdownMenuItem>Sair</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

### 7. Dialog (Modal)
**Localização**: `components/ui/dialog.tsx`

**Uso**:
```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Abrir Modal</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Título do Modal</DialogTitle>
      <DialogDescription>Descrição do conteúdo</DialogDescription>
    </DialogHeader>
    <div>Conteúdo do modal</div>
    <DialogFooter>
      <Button>Salvar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### 8. Select
**Localização**: `components/ui/select.tsx`

**Uso**:
```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Selecione..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Opção 1</SelectItem>
    <SelectItem value="option2">Opção 2</SelectItem>
  </SelectContent>
</Select>
```

---

### 9. Checkbox
**Localização**: `components/ui/checkbox.tsx`

**Uso**:
```tsx
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Aceito os termos</Label>
</div>
```

---

### 10. Table
**Localização**: `components/ui/table.tsx`

**Uso**:
```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Nome</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Ações</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>João Silva</TableCell>
      <TableCell>joao@email.com</TableCell>
      <TableCell>
        <Button size="sm">Editar</Button>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

## Componentes de Layout

### 11. Sidebar
**Localização**: `components/layout/sidebar.tsx`

**Descrição**: Menu lateral fixo com navegação principal

**Características**:
- Logo do sistema
- Menu de navegação com ícones
- Indicador visual de página ativa
- Descrições acessíveis
- Rodapé com copyright

**Uso**: Incluído automaticamente no layout do dashboard

---

### 12. Header
**Localização**: `components/layout/header.tsx`

**Descrição**: Cabeçalho fixo com busca e menu do usuário

**Características**:
- Campo de busca global
- Notificações com badge
- Menu dropdown do usuário
- Avatar customizável

**Uso**: Incluído automaticamente no layout do dashboard

---

## Componentes Dashboard

### 13. MetricCard
**Localização**: `components/dashboard/metric-card.tsx`

**Uso**:
```tsx
import { MetricCard } from '@/components/dashboard/metric-card';
import { DollarSign } from 'lucide-react';

<MetricCard
  title="Faturamento Hoje"
  value="R$ 2.850,00"
  description="Total de vendas"
  icon={DollarSign}
  trend={{ value: 12.5, isPositive: true }}
/>
```

**Props**:
- `title` - Título do card
- `value` - Valor principal
- `description` (opcional) - Descrição adicional
- `icon` - Ícone do lucide-react
- `trend` (opcional) - { value: number, isPositive: boolean }
- `className` (opcional) - Classes adicionais

---

## Ícones (Lucide React)

Todos os ícones estão disponíveis via `lucide-react`:

```tsx
import {
  // Navegação
  LayoutDashboard,
  Calendar,
  Users,
  UserCircle,
  Briefcase,
  DollarSign,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  
  // Ações
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  EyeOff,
  X,
  Check,
  ChevronDown,
  ChevronRight,
  
  // Status
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Loader2,
  
  // Outros
  Bell,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
```

### Uso de Ícones:
```tsx
<DollarSign className="h-5 w-5 text-primary" />
<Loader2 className="h-4 w-4 animate-spin" />
<CheckCircle2 className="h-4 w-4 text-green-500" />
```

---

## Utilitários

### formatCurrency
**Localização**: `lib/utils.ts`

```tsx
import { formatCurrency } from '@/lib/utils';

formatCurrency(1500.50); // "R$ 1.500,50"
```

### formatDate
**Localização**: `lib/utils.ts`

```tsx
import { formatDate } from '@/lib/utils';

formatDate(new Date()); // "15/10/2024"
```

### formatDateTime
**Localização**: `lib/utils.ts`

```tsx
import { formatDateTime } from '@/lib/utils';

formatDateTime(new Date()); // "15/10/24, 14:30"
```

### cn (Class Name Merger)
**Localização**: `lib/utils.ts`

```tsx
import { cn } from '@/lib/utils';

cn("text-primary", isActive && "font-bold", className);
```

---

## Tipos TypeScript

**Localização**: `types/index.ts`

### Tipos Disponíveis:
- `User` - Usuário do sistema
- `UserRole` - Função do usuário
- `Permission` - Permissão
- `DashboardMetrics` - Métricas do dashboard
- `Appointment` - Agendamento
- `Client` - Cliente
- `Professional` - Profissional
- `WorkSchedule` - Horário de trabalho
- `Service` - Serviço
- `Product` - Produto
- `Transaction` - Transação financeira

### Uso:
```tsx
import type { User, UserRole } from '@/types';

const user: User = {
  id: '1',
  name: 'João Silva',
  email: 'joao@email.com',
  role: 'ADMIN',
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

---

## Padrões de Uso

### Formulários
```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function FormExample() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <Button type="submit">Enviar</Button>
    </form>
  );
}
```

### Loading States
```tsx
const [isLoading, setIsLoading] = useState(false);

<Button disabled={isLoading}>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Carregando...
    </>
  ) : (
    'Enviar'
  )}
</Button>
```

### Estados Condicionais
```tsx
{user.active ? (
  <span className="text-green-500">Ativo</span>
) : (
  <span className="text-muted-foreground">Inativo</span>
)}
```

---

## Resumo

### Componentes UI (10)
✅ Button, Card, Input, Label, Avatar, Dropdown Menu, Dialog, Select, Checkbox, Table

### Componentes Layout (2)
✅ Sidebar, Header

### Componentes Dashboard (1)
✅ MetricCard

### Utilitários (4)
✅ formatCurrency, formatDate, formatDateTime, cn

### Ícones
✅ 30+ ícones do Lucide React

### Tipos
✅ 10+ tipos TypeScript

---

**Total: 17 componentes prontos para uso + utilitários + ícones + tipos**
