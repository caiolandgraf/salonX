'use client'

import {
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  Users
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { MetricCard } from '@/components/dashboard/metric-card'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    todayRevenue: 0,
    todayAppointments: 0,
    activeClients: 0,
    monthRevenue: 0,
    revenueGrowth: 0,
    appointmentsGrowth: 0,
    clientsGrowth: 0,
    appointmentsList: [] as any[]
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dashboard/metrics')
      if (response.ok) {
        const data = await response.json()
        setMetrics(data)
      }
    } catch (error) {
      console.error('Erro ao buscar métricas:', error)
    } finally {
      setLoading(false)
    }
  }

  const todayAppointments = metrics.appointmentsList || []

  const getStatusInfo = (status: string) => {
    const statusMap: Record<
      string,
      { label: string; color: string; icon: any }
    > = {
      COMPLETED: {
        label: 'Concluído',
        color: 'text-green-500',
        icon: CheckCircle2
      },
      CONFIRMED: {
        label: 'Agendado',
        color: 'text-muted-foreground',
        icon: null
      },
      CANCELLED: { label: 'Cancelado', color: 'text-red-500', icon: null },
      NO_SHOW: { label: 'Faltou', color: 'text-orange-500', icon: null }
    }
    return statusMap[status] || statusMap.CONFIRMED
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-lg mt-1">
            Visão geral do seu negócio
          </p>
        </div>
        <div className="flex gap-3 flex-wrap mt-3 md:mt-0">
          <Button variant="outline" size="lg" className="flex-1 w-full">
            <Calendar className="mr-2 h-5 w-5" />
            Ver Agenda
          </Button>
          <Button size="lg" className="flex-1 w-full">
            <DollarSign className="mr-2 h-5 w-5" />
            Novo Atendimento
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Faturamento Hoje"
          value={`R$ ${metrics.todayRevenue.toFixed(2)}`}
          icon={DollarSign}
          trend={{ value: metrics.revenueGrowth, isPositive: true }}
        />
        <MetricCard
          title="Agendamentos Hoje"
          value={metrics.todayAppointments}
          description={`${todayAppointments.filter(a => a.status === 'completed').length} concluídos`}
          icon={Calendar}
          trend={{ value: metrics.appointmentsGrowth, isPositive: true }}
        />
        <MetricCard
          title="Clientes Ativos"
          value={metrics.activeClients}
          icon={Users}
          trend={{ value: metrics.clientsGrowth, isPositive: true }}
        />
        <MetricCard
          title="Faturamento Mensal"
          value={`R$ ${metrics.monthRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={TrendingUp}
          trend={{ value: metrics.revenueGrowth, isPositive: true }}
        />
      </div>

      {/* Today's Appointments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Agendamentos de Hoje</CardTitle>
              <CardDescription className="text-base mt-1">
                {todayAppointments.length} agendamentos para hoje
              </CardDescription>
            </div>
            <Button variant="outline">Ver Todos</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayAppointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Nenhum agendamento para hoje</p>
              </div>
            ) : (
              todayAppointments.map((appointment: any) => {
                const statusInfo = getStatusInfo(appointment.status)
                const StatusIcon = statusInfo.icon

                return (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-base">
                          {appointment.client_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.service_name} • R${' '}
                          {appointment.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-base">
                          {appointment.time}
                        </p>
                        <div className="flex items-center gap-1 text-sm">
                          {StatusIcon && (
                            <StatusIcon
                              className={`h-4 w-4 ${statusInfo.color}`}
                            />
                          )}
                          <span className={statusInfo.color}>
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Nova Marcação
            </CardTitle>
            <CardDescription className="text-base">
              Agendar novo serviço para cliente
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Novo Cliente
            </CardTitle>
            <CardDescription className="text-base">
              Cadastrar novo cliente no sistema
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Registrar Venda
            </CardTitle>
            <CardDescription className="text-base">
              Abrir PDV para registrar venda
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
