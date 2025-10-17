'use client'

import {
  CheckCircle2,
  DollarSign,
  Edit,
  Mail,
  Phone,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  XCircle
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import type { Professional } from '@/types'

const DAYS_OF_WEEK = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Segunda' },
  { value: 2, label: 'Terça' },
  { value: 3, label: 'Quarta' },
  { value: 4, label: 'Quinta' },
  { value: 5, label: 'Sexta' },
  { value: 6, label: 'Sábado' }
]

export default function ProfissionaisPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingProfessional, setEditingProfessional] =
    useState<Professional | null>(null)
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfessionals()
  }, [])

  const fetchProfessionals = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/professionals')
      if (response.ok) {
        const data = await response.json()
        setProfessionals(data)
      }
    } catch (error) {
      console.error('Erro ao buscar profissionais:', error)
    } finally {
      setLoading(false)
    }
  }

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialties: '',
    commission: '40',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
  })

  const filteredProfessionals = professionals.filter(
    prof =>
      prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const specialtiesArray = formData.specialties
      .split(',')
      .map(s => s.trim())
      .filter(s => s)

    try {
      const body = {
        ...formData,
        specialties: JSON.stringify(specialtiesArray),
        commission: parseFloat(formData.commission)
      }

      if (editingProfessional) {
        const response = await fetch(
          `/api/professionals/${editingProfessional.id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          }
        )

        if (response.ok) {
          await fetchProfessionals()
        }
      } else {
        const response = await fetch('/api/professionals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })

        if (response.ok) {
          await fetchProfessionals()
        }
      }

      setIsOpen(false)
      resetForm()
    } catch (error) {
      console.error('Erro ao salvar profissional:', error)
      alert('Erro ao salvar profissional')
    }
  }

  const handleEdit = (professional: Professional) => {
    setEditingProfessional(professional)
    setFormData({
      name: professional.name,
      email: professional.email,
      phone: professional.phone,
      specialties: professional.specialties.join(', '),
      commission: professional.commission.toString(),
      status: professional.status
    })
    setIsOpen(true)
  }

  const handleDelete = async (professionalId: string) => {
    if (confirm('Tem certeza que deseja excluir este profissional?')) {
      try {
        const response = await fetch(`/api/professionals/${professionalId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          await fetchProfessionals()
        }
      } catch (error) {
        console.error('Erro ao excluir profissional:', error)
        alert('Erro ao excluir profissional')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialties: '',
      commission: '40',
      status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
    })
    setEditingProfessional(null)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }

  const getWorkDays = (schedule: Professional['workSchedule']) => {
    if (!schedule || typeof schedule !== 'object') {
      return 'Não definido'
    }

    const dayMap: Record<string, string> = {
      monday: 'Seg',
      tuesday: 'Ter',
      wednesday: 'Qua',
      thursday: 'Qui',
      friday: 'Sex',
      saturday: 'Sáb',
      sunday: 'Dom'
    }

    const days = Object.keys(schedule)
      .map(day => dayMap[day])
      .filter(Boolean)
    return days.length > 0 ? days.join(', ') : 'Não definido'
  }

  // Mock performance data
  const getPerformanceData = () => {
    return {
      totalServices: 145,
      totalRevenue: 15800.0,
      averageRating: 4.8,
      commission: 6320.0
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap md:flex-nowrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profissionais</h1>
          <p className="text-muted-foreground text-lg mt-1">
            Gerencie sua equipe de profissionais
          </p>
        </div>
        <Dialog
          open={isOpen}
          onOpenChange={open => {
            setIsOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button size="lg" className="mt-3 md:mt-0 w-full md:w-auto">
              <Plus className="mr-2 h-5 w-5" />
              Novo Profissional
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {editingProfessional
                    ? 'Editar Profissional'
                    : 'Novo Profissional'}
                </DialogTitle>
                <DialogDescription className="text-base">
                  {editingProfessional
                    ? 'Atualize as informações do profissional'
                    : 'Preencha as informações para cadastrar um novo profissional'}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={e =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Nome completo"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={e =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="email@exemplo.com"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={e =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="(11) 98765-4321"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="specialties">Especialidades *</Label>
                  <Input
                    id="specialties"
                    value={formData.specialties}
                    onChange={e =>
                      setFormData({ ...formData, specialties: e.target.value })
                    }
                    placeholder="Cortes, Coloração, Escova (separado por vírgula)"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Separe as especialidades por vírgula
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="commission">Taxa de Comissão (%)</Label>
                  <Input
                    id="commission"
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={formData.commission}
                    onChange={e =>
                      setFormData({ ...formData, commission: e.target.value })
                    }
                    placeholder="40"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="active"
                    checked={formData.status === 'ACTIVE'}
                    onCheckedChange={checked =>
                      setFormData({
                        ...formData,
                        status: checked ? 'ACTIVE' : 'INACTIVE'
                      })
                    }
                  />
                  <Label
                    htmlFor="active"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Profissional ativo
                  </Label>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingProfessional ? 'Atualizar' : 'Cadastrar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Profissionais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {professionals.filter(p => p.status === 'ACTIVE').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Atendimentos (Mês)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">145</div>
            <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +12% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Faturamento Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">R$ 15.800</div>
            <p className="text-xs text-muted-foreground mt-1">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Comissões Totais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">R$ 6.320</div>
            <p className="text-xs text-muted-foreground mt-1">A pagar</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Profissionais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Professionals Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Lista de Profissionais</CardTitle>
              <CardDescription className="text-base mt-1">
                {filteredProfessionals.length} profissional
                {filteredProfessionals.length !== 1 ? 'is' : ''} encontrado
                {filteredProfessionals.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Profissional</TableHead>
                <TableHead>Especialidades</TableHead>
                <TableHead>Dias de Trabalho</TableHead>
                <TableHead>Comissão</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfessionals.map(professional => (
                <TableRow key={professional.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {getInitials(professional.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{professional.name}</p>
                        <div className="flex flex-col gap-1 mt-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {professional.email}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {professional.phone}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {professional.specialties.map((specialty, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-primary/10 text-primary"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {getWorkDays(professional.workSchedule)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span className="font-semibold">
                        {professional.commission}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {professional.status === 'ACTIVE' ? (
                      <div className="flex items-center gap-1 text-green-500">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm font-medium">Ativo</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <XCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Inativo</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(professional)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(professional.id)}
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
