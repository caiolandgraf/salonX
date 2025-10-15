'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp, DollarSign,
  Users,
  Calendar,
  Download,
  Filter,
  Scissors,
  Package,
  Star
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Mock data for charts
const revenueData = [
  { month: 'Jan', receita: 12500, despesa: 8000 },
  { month: 'Fev', receita: 15200, despesa: 7500 },
  { month: 'Mar', receita: 18800, despesa: 9200 },
  { month: 'Abr', receita: 16500, despesa: 8800 },
  { month: 'Mai', receita: 21000, despesa: 10500 },
  { month: 'Jun', receita: 19500, despesa: 9000 },
  { month: 'Jul', receita: 22000, despesa: 11000 },
  { month: 'Ago', receita: 24500, despesa: 12000 },
  { month: 'Set', receita: 23000, despesa: 11500 },
  { month: 'Out', receita: 26000, despesa: 13000 },
];

const servicesData = [
  { name: 'Corte Feminino', value: 35, color: '#ffbd59' },
  { name: 'Corte Masculino', value: 25, color: '#f59e0b' },
  { name: 'Coloração', value: 20, color: '#ef4444' },
  { name: 'Manicure', value: 12, color: '#3b82f6' },
  { name: 'Outros', value: 8, color: '#8b5cf6' },
];

const professionalsData = [
  { name: 'Ana Santos', servicos: 145, receita: 18500, comissao: 5550 },
  { name: 'Carla Lima', servicos: 132, receita: 16200, comissao: 4860 },
  { name: 'Beatriz Souza', servicos: 98, receita: 12800, comissao: 3840 },
  { name: 'Daniela Costa', servicos: 87, receita: 10900, comissao: 3270 },
];

const appointmentsData = [
  { dia: 'Seg', agendamentos: 24, comparecimentos: 22, faltas: 2 },
  { dia: 'Ter', agendamentos: 28, comparecimentos: 26, faltas: 2 },
  { dia: 'Qua', agendamentos: 32, comparecimentos: 30, faltas: 2 },
  { dia: 'Qui', agendamentos: 30, comparecimentos: 28, faltas: 2 },
  { dia: 'Sex', agendamentos: 35, comparecimentos: 33, faltas: 2 },
  { dia: 'Sáb', agendamentos: 40, comparecimentos: 38, faltas: 2 },
];

const productsData = [
  { produto: 'Shampoo Premium', vendas: 45, receita: 5400 },
  { produto: 'Condicionador', vendas: 38, receita: 3800 },
  { produto: 'Máscara Capilar', vendas: 32, receita: 2720 },
  { produto: 'Esmalte', vendas: 28, receita: 980 },
  { produto: 'Base Facial', vendas: 15, receita: 3300 },
];

const clientsData = [
  { mes: 'Jan', novos: 15, recorrentes: 45, inativos: 5 },
  { mes: 'Fev', novos: 22, recorrentes: 52, inativos: 3 },
  { mes: 'Mar', novos: 28, recorrentes: 58, inativos: 4 },
  { mes: 'Abr', novos: 18, recorrentes: 62, inativos: 6 },
  { mes: 'Mai', novos: 25, recorrentes: 68, inativos: 2 },
  { mes: 'Jun', novos: 30, recorrentes: 75, inativos: 5 },
];

export default function RelatoriosPage() {
  const [period, setPeriod] = useState('month');
  const [reportType, setReportType] = useState('financial');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    profit: 0,
    profitMargin: 0,
    totalAppointments: 0,
    attendanceRate: 0,
    newClients: 0,
    activeClients: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, [period, reportType]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reports?period=${period}&type=${reportType}`);
      if (response.ok) {
        const data = await response.json();
        // Garantir que todos os campos necessários existam
        setStats({
          totalRevenue: data.summary?.totalIncome || 0,
          totalExpenses: data.summary?.totalExpenses || 0,
          profit: data.summary?.netProfit || 0,
          profitMargin: data.summary?.netProfit && data.summary?.totalIncome 
            ? ((data.summary.netProfit / data.summary.totalIncome) * 100) 
            : 0,
          totalAppointments: data.summary?.transactionsCount || 0,
          attendanceRate: 95, // Mock
          newClients: 0, // Mock
          activeClients: 0, // Mock
        });
      }
    } catch (error) {
      console.error('Erro ao buscar relatórios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (format: string) => {
    alert(`Exportando relatório em formato ${format}...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground text-lg mt-1">Analytics e relatórios gerenciais</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('PDF')} className="gap-2">
            <Download className="h-4 w-4" />
            Exportar PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport('Excel')} className="gap-2">
            <Download className="h-4 w-4" />
            Exportar Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <Label>Período</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="week">Esta Semana</SelectItem>
                <SelectItem value="month">Este Mês</SelectItem>
                <SelectItem value="quarter">Este Trimestre</SelectItem>
                <SelectItem value="year">Este Ano</SelectItem>
                <SelectItem value="custom">Período Customizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 space-y-2">
            <Label>Tipo de Relatório</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="financial">Financeiro</SelectItem>
                <SelectItem value="services">Serviços</SelectItem>
                <SelectItem value="professionals">Profissionais</SelectItem>
                <SelectItem value="clients">Clientes</SelectItem>
                <SelectItem value="products">Produtos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground">Carregando relatórios...</p>
          </div>
        </div>
      ) : (
        <>
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Receita Total</p>
              <p className="text-2xl font-bold text-green-500 mt-2">
                R$ {(stats?.totalRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500">Período selecionado</span>
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Lucro</p>
              <p className="text-2xl font-bold text-primary mt-2">
                R$ {(stats?.profit || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-xs text-muted-foreground">
                  Margem: {(stats?.profitMargin || 0).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Agendamentos</p>
              <p className="text-2xl font-bold mt-2">{stats?.totalAppointments || 0}</p>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-xs text-muted-foreground">
                  Taxa: {(stats?.attendanceRate || 0).toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Clientes Ativos</p>
              <p className="text-2xl font-bold mt-2">{stats?.activeClients || 0}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500">+{stats?.newClients || 0} novos</span>
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold">Receitas vs Despesas</h3>
              <p className="text-sm text-muted-foreground">Últimos 10 meses</p>
            </div>
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="receita" fill="#22c55e" name="Receita" radius={[8, 8, 0, 0]} />
              <Bar dataKey="despesa" fill="#ef4444" name="Despesa" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Services Pie Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold">Serviços Mais Realizados</h3>
              <p className="text-sm text-muted-foreground">Distribuição por tipo</p>
            </div>
            <Scissors className="h-5 w-5 text-primary" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={servicesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {servicesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Appointments Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold">Agendamentos Semanais</h3>
              <p className="text-sm text-muted-foreground">Comparecimentos vs Faltas</p>
            </div>
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={appointmentsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="dia" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="agendamentos"
                stroke="#ffbd59"
                strokeWidth={2}
                name="Agendamentos"
                dot={{ fill: '#ffbd59', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="comparecimentos"
                stroke="#22c55e"
                strokeWidth={2}
                name="Comparecimentos"
                dot={{ fill: '#22c55e', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="faltas"
                stroke="#ef4444"
                strokeWidth={2}
                name="Faltas"
                dot={{ fill: '#ef4444', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Clients Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold">Evolução de Clientes</h3>
              <p className="text-sm text-muted-foreground">Novos vs Recorrentes</p>
            </div>
            <Users className="h-5 w-5 text-primary" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={clientsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="mes" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar
                dataKey="novos"
                stackId="a"
                fill="#ffbd59"
                name="Novos"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="recorrentes"
                stackId="a"
                fill="#22c55e"
                name="Recorrentes"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Professionals Performance */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold">Performance dos Profissionais</h3>
              <p className="text-sm text-muted-foreground">Top 4 do mês</p>
            </div>
            <Star className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-4">
            {professionalsData.map((professional, index) => (
              <div key={index} className="flex items-center justify-between pb-4 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{professional.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {professional.servicos} serviços
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-500">
                    R$ {professional.receita.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Comissão: R$ {professional.comissao.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Products Sales */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold">Produtos Mais Vendidos</h3>
              <p className="text-sm text-muted-foreground">Top 5 do mês</p>
            </div>
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-4">
            {productsData.map((product, index) => (
              <div key={index} className="flex items-center justify-between pb-4 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center font-bold text-blue-500">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{product.produto}</p>
                    <p className="text-xs text-muted-foreground">{product.vendas} unidades</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-500">
                    R$ {product.receita.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Resumo Executivo</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Faturamento Mensal</p>
            <p className="text-2xl font-bold text-green-500">
              R$ {(stats?.totalRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                <div className="bg-green-500 h-full" style={{ width: '85%' }} />
              </div>
              <span className="text-xs text-muted-foreground">85% da meta</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Taxa de Ocupação</p>
            <p className="text-2xl font-bold text-primary">{(stats?.attendanceRate || 0).toFixed(0)}%</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-full"
                  style={{ width: `${Math.min(stats?.attendanceRate || 0, 100)}%` }}
                />
              </div>
              <span className="text-xs text-green-500">+2.3%</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Ticket Médio</p>
            <p className="text-2xl font-bold text-blue-500">R$ 137,57</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: '78%' }} />
              </div>
              <span className="text-xs text-green-500">+5.8%</span>
            </div>
          </div>
        </div>
      </Card>
      </>
      )}
    </div>
  );
}
