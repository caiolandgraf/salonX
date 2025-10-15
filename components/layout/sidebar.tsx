'use client';

import {
    BarChart3,
    Briefcase,
    Calendar,
    DollarSign,
    LayoutDashboard,
    Package,
    Settings,
    ShoppingCart,
    Sparkles, 
    UserCircle,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    href: '/dashboard',
    description: 'Visão geral'
  },
  {
    icon: Calendar,
    label: 'Agenda',
    href: '/dashboard/agenda',
    description: 'Agendamentos'
  },
  {
    icon: UserCircle,
    label: 'Clientes',
    href: '/dashboard/clientes',
    description: 'Gestão de clientes'
  },
  {
    icon: Briefcase,
    label: 'Profissionais',
    href: '/dashboard/profissionais',
    description: 'Equipe'
  },
  {
    icon: DollarSign,
    label: 'Financeiro',
    href: '/dashboard/financeiro',
    description: 'Fluxo de caixa'
  },
  {
    icon: Package,
    label: 'Estoque',
    href: '/dashboard/estoque',
    description: 'Produtos'
  },
  {
    icon: ShoppingCart,
    label: 'PDV',
    href: '/dashboard/pdv',
    description: 'Ponto de venda'
  },
  {
    icon: BarChart3,
    label: 'Relatórios',
    href: '/dashboard/relatorios',
    description: 'Analytics'
  },
  {
    icon: Users,
    label: 'Usuários',
    href: '/dashboard/usuarios',
    description: 'Gestão de usuários'
  },
  {
    icon: Settings,
    label: 'Configurações',
    href: '/dashboard/configuracoes',
    description: 'Sistema'
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-72 border-r border-border bg-card">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary">SalonX</h1>
            <p className="text-xs text-muted-foreground">Gestão Inteligente</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'sidebar-link',
                  isActive && 'sidebar-link-active'
                )}
              >
                <Icon className="h-5 w-5" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-xs text-muted-foreground">{item.description}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <p className="text-xs text-center text-muted-foreground">
            © 2025 SalonX. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </aside>
  );
}
