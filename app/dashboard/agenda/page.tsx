'use client';

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, Clock, User, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Appointment } from '@/types';

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8h às 20h
const DAYS_OF_WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function AgendaPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'day' | 'week' | 'month'>('day');
  const [selectedProfessional, setSelectedProfessional] = useState<string>('all');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [professionals, setProfessionals] = useState<Array<{ id: string; name: string }>>([]);
  const [services, setServices] = useState<Array<{ id: string; name: string; duration: number; price: number }>>([]);

  const [formData, setFormData] = useState({
    clientName: '',
    professionalId: '',
    serviceId: '',
    date: '',
    time: '',
    duration: 60,
  });

  useEffect(() => {
    fetchAppointments();
    fetchProfessionals();
    fetchServices();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/appointments');
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfessionals = async () => {
    try {
      const response = await fetch('/api/professionals');
      if (response.ok) {
        const data = await response.json();
        setProfessionals(data.map((p: any) => ({ id: p.id, name: p.name })));
      }
    } catch (error) {
      console.error('Erro ao buscar profissionais:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (response.ok) {
        const data = await response.json();
        setServices(data.map((s: any) => ({ id: s.id, name: s.name, duration: s.duration, price: s.price })));
      }
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const service = services.find(s => s.id === formData.serviceId);
    const professional = professionals.find(p => p.id === formData.professionalId);
    
    if (!service || !professional) return;

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: formData.clientName,
          professionalId: formData.professionalId,
          professionalName: professional.name,
          serviceId: formData.serviceId,
          serviceName: service.name,
          date: formData.date,
          time: formData.time,
          duration: formData.duration,
          status: 'SCHEDULED',
          price: service.price,
        }),
      });

      if (response.ok) {
        await fetchAppointments();
        setIsOpen(false);
        setFormData({
          clientName: '',
          professionalId: '',
          serviceId: '',
          date: '',
          time: '',
          duration: 60,
        });
      }
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
    }
  };

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate.toDateString() === date.toDateString() &&
        (selectedProfessional === 'all' || apt.professionalId === selectedProfessional);
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewType === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (viewType === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const formatDateHeader = () => {
    if (viewType === 'day') {
      return currentDate.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } else if (viewType === 'week') {
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - currentDate.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return `${weekStart.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} - ${weekEnd.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}`;
    } else {
      return currentDate.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
      });
    }
  };

  const getWeekDays = () => {
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Days from previous month
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(firstDay);
      day.setDate(day.getDate() - (i + 1));
      days.push(day);
    }
    
    // Days from current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    // Days from next month
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const day = new Date(year, month + 1, i);
      days.push(day);
    }
    
    return days;
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'CONFIRMED':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'IN_PROGRESS':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'CANCELLED':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getStatusLabel = (status: Appointment['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'Concluído';
      case 'CONFIRMED':
        return 'Confirmado';
      case 'IN_PROGRESS':
        return 'Em Andamento';
      case 'CANCELLED':
        return 'Cancelado';
      default:
        return 'Agendado';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
          <p className="text-muted-foreground text-lg mt-1">
            Gerencie os agendamentos do salão
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Novo Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle className="text-xl">Novo Agendamento</DialogTitle>
                <DialogDescription className="text-base">
                  Preencha os dados para criar um novo agendamento
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="clientName">Nome do Cliente</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="Nome completo"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="professionalId">Profissional</Label>
                  <Select
                    value={formData.professionalId}
                    onValueChange={(value) => setFormData({ ...formData, professionalId: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o profissional" />
                    </SelectTrigger>
                    <SelectContent>
                      {professionals.map((prof) => (
                        <SelectItem key={prof.id} value={prof.id}>
                          {prof.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="serviceId">Serviço</Label>
                  <Select
                    value={formData.serviceId}
                    onValueChange={(value) => setFormData({ ...formData, serviceId: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - {service.duration}min - R$ {service.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Data</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="time">Horário</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Agendar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and View Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateDate('prev')}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                <span className="text-lg font-semibold capitalize">
                  {formatDateHeader()}
                </span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateDate('next')}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentDate(new Date())}
              >
                Hoje
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Select value={selectedProfessional} onValueChange={setSelectedProfessional}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Todos os profissionais" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os profissionais</SelectItem>
                  {professionals.map((prof) => (
                    <SelectItem key={prof.id} value={prof.id}>
                      {prof.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex border rounded-lg">
                <Button
                  variant={viewType === 'day' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewType('day')}
                  className="rounded-r-none border-r-0"
                >
                  Dia
                </Button>
                <Button
                  variant={viewType === 'week' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewType('week')}
                  className="rounded-none border-r-0"
                >
                  Semana
                </Button>
                <Button
                  variant={viewType === 'month' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewType('month')}
                  className="rounded-l-none"
                >
                  Mês
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar View */}
      <Card>
        <CardContent className="p-6">
          {viewType === 'day' && (
            <div className="space-y-2">
              {HOURS.map((hour) => {
                const hourString = `${hour.toString().padStart(2, '0')}:00`;
                const dayAppointments = getAppointmentsForDay(currentDate);
                const hourAppointments = dayAppointments.filter(
                  (apt) => apt.time.startsWith(hour.toString().padStart(2, '0'))
                );

                return (
                  <div key={hour} className="flex gap-4 min-h-[80px]">
                    <div className="w-20 flex-shrink-0 pt-1">
                      <span className="text-sm font-medium text-muted-foreground">
                        {hourString}
                      </span>
                    </div>
                    <div className="flex-1 border-t border-border pt-2">
                      {hourAppointments.map((apt) => {
                      const [hours, minutes] = apt.time.split(':');
                      const endTime = new Date();
                      endTime.setHours(parseInt(hours), parseInt(minutes) + apt.duration);
                      const endTimeStr = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
                      
                      return (
                        <div
                          key={apt.id}
                          className={`mb-2 rounded-lg border p-3 ${getStatusColor(apt.status)}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Clock className="h-4 w-4" />
                                <span className="font-semibold">
                                  {apt.time} - {endTimeStr}
                                </span>
                              </div>
                            <div className="flex items-center gap-2 mb-1">
                              <User className="h-4 w-4" />
                              <span className="font-medium">{apt.clientName}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                              <Scissors className="h-4 w-4" />
                              <span className="text-sm">{apt.serviceName}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              com {apt.professionalName}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-lg">
                              R$ {apt.price.toFixed(2)}
                            </div>
                            <div className="text-xs mt-1">
                              {getStatusLabel(apt.status)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                    })}
                  </div>
                </div>
              );
            })}
            </div>
          )}

          {viewType === 'week' && (
            <div className="grid grid-cols-7 gap-2">
              {getWeekDays().map((day, idx) => {
                const dayAppointments = getAppointmentsForDay(day);
                const isToday = day.toDateString() === new Date().toDateString();
                
                return (
                  <div key={idx} className={`border rounded-lg p-2 ${isToday ? 'bg-primary/5 border-primary' : ''}`}>
                    <div className="text-center mb-2">
                      <div className="text-xs text-muted-foreground">{DAYS_OF_WEEK[day.getDay()]}</div>
                      <div className={`text-lg font-semibold ${isToday ? 'text-primary' : ''}`}>
                        {day.getDate()}
                      </div>
                    </div>
                    <div className="space-y-1">
                      {dayAppointments.map(apt => (
                        <div key={apt.id} className={`text-xs p-2 rounded ${getStatusColor(apt.status)}`}>
                          <div className="font-medium truncate">{apt.time}</div>
                          <div className="truncate">{apt.clientName}</div>
                        </div>
                      ))}
                      {dayAppointments.length === 0 && (
                        <div className="text-xs text-muted-foreground text-center py-4">
                          Sem agendamentos
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {viewType === 'month' && (
            <div>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {getMonthDays().map((day, idx) => {
                  const dayAppointments = getAppointmentsForDay(day);
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                  const isToday = day.toDateString() === new Date().toDateString();
                  
                  return (
                    <div
                      key={idx}
                      className={`min-h-[100px] border rounded-lg p-2 ${
                        isToday ? 'bg-primary/5 border-primary' : ''
                      } ${!isCurrentMonth ? 'opacity-50' : ''}`}
                    >
                      <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary' : ''}`}>
                        {day.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayAppointments.slice(0, 3).map(apt => (
                          <div key={apt.id} className={`text-xs p-1 rounded truncate ${getStatusColor(apt.status)}`}>
                            {apt.time} - {apt.clientName}
                          </div>
                        ))}
                        {dayAppointments.length > 3 && (
                          <div className="text-xs text-muted-foreground text-center">
                            +{dayAppointments.length - 3} mais
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
