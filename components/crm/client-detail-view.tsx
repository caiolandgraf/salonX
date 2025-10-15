'use client';

import {
  Calendar,
  Clock,
  DollarSign,
  Edit,
  History,
  Mail,
  MapPin,
  MessageSquare,
  Phone,Plus,
  TrendingUp,
  User,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Client, ClientInteraction, ClientNote } from '@/types';

interface ClientDetailViewProps {
  client: Client;
  onClose: () => void;
  onUpdate: () => void;
}

export default function ClientDetailView({ client, onClose, onUpdate }: ClientDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'notes'>('overview');
  const [notes, setNotes] = useState<ClientNote[]>([]);
  const [interactions, setInteractions] = useState<ClientInteraction[]>([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [noteType, setNoteType] = useState<'NOTE' | 'CALL' | 'EMAIL' | 'MEETING' | 'FOLLOW_UP'>('NOTE');
  const [isEditingSegment, setIsEditingSegment] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState(client.segment || 'NEW');

  useEffect(() => {
    fetchNotes();
    fetchInteractions();
  }, [client.id]);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`/api/clients/${client.id}/notes`);
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      }
    } catch (error) {
      console.error('Erro ao buscar notas:', error);
    }
  };

  const fetchInteractions = async () => {
    try {
      const response = await fetch(`/api/clients/${client.id}/interactions`);
      if (response.ok) {
        const data = await response.json();
        setInteractions(data);
      }
    } catch (error) {
      console.error('Erro ao buscar interações:', error);
    }
  };

  const handleAddNote = async () => {
    if (!noteContent.trim()) return;

    try {
      const response = await fetch(`/api/clients/${client.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: noteContent,
          type: noteType,
        }),
      });

      if (response.ok) {
        setNoteContent('');
        setIsAddingNote(false);
        fetchNotes();
      }
    } catch (error) {
      console.error('Erro ao adicionar nota:', error);
    }
  };

  const handleUpdateSegment = async () => {
    try {
      const response = await fetch(`/api/clients/${client.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...client,
          segment: selectedSegment,
        }),
      });

      if (response.ok) {
        setIsEditingSegment(false);
        onUpdate();
      }
    } catch (error) {
      console.error('Erro ao atualizar segmento:', error);
    }
  };

  const getSegmentColor = (segment?: string) => {
    switch (segment) {
      case 'VIP': return 'bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700';
      case 'REGULAR': return 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-700';
      case 'NEW': return 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700';
      case 'INACTIVE': return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600';
    }
  };

  const getNoteTypeIcon = (type: string) => {
    switch (type) {
      case 'CALL': return <Phone className="h-4 w-4" />;
      case 'EMAIL': return <Mail className="h-4 w-4" />;
      case 'MEETING': return <User className="h-4 w-4" />;
      case 'FOLLOW_UP': return <Clock className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 !mt-[0vh]">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col border dark:border-neutral-700">
        {/* Header */}
        <div className="p-6 border-b flex items-start justify-between dark:border-neutral-700">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-xl bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-semibold">
                {client.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{client.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSegmentColor(client.segment)}`}>
                  {client.segment || 'NEW'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingSegment(true)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b bg-background dark:border-neutral-700">
          <div className="flex gap-4 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-4 border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-amber-500 text-amber-600 dark:border-amber-400 dark:text-amber-400 font-medium'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-3 px-4 border-b-2 transition-colors ${
                activeTab === 'history'
                  ? 'border-amber-500 text-amber-600 dark:border-amber-400 dark:text-amber-400 font-medium'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400'
              }`}
            >
              Histórico
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`py-3 px-4 border-b-2 transition-colors ${
                activeTab === 'notes'
                  ? 'border-amber-500 text-amber-600 dark:border-amber-400 dark:text-amber-400 font-medium'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400'
              }`}
            >
              Notas & Follow-ups
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-background">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
              {/* Contact Info */}
              <Card className="md:col-span-2 bg-background dark:border-neutral-700">
                <CardHeader>
                  <CardTitle>Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Phone className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <span>{client.phone || 'Não informado'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <span>{client.email || 'Não informado'}</span>
                  </div>
                  {client.birthdate && (
                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <span>Aniversário: {formatDate(client.birthdate)}</span>
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <span>{client.address}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Stats */}
              <div className="space-y-4">
                <Card className="bg-background dark:border-neutral-700">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                        <DollarSign className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Gasto</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(client.totalSpent)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-background dark:border-neutral-700">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                        <History className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total de Visitas</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{client.totalVisits}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-background dark:border-neutral-700">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Ticket Médio</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {formatCurrency(client.averageTicket || 0)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Info */}
              <Card className="md:col-span-3 bg-background dark:border-neutral-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Informações Adicionais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Cliente desde</p>
                      <p className="font-medium text-gray-900 dark:text-gray-200">{formatDate(client.createdAt)}</p>
                    </div>
                    {client.lastVisit && (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Última visita</p>
                        <p className="font-medium text-gray-900 dark:text-gray-200">{formatDate(client.lastVisit)}</p>
                      </div>
                    )}
                    {client.source && (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Como conheceu</p>
                        <p className="font-medium text-gray-900 dark:text-gray-200">{client.source}</p>
                      </div>
                    )}
                    {client.nextFollowUp && (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Próximo follow-up</p>
                        <p className="font-medium text-gray-900 dark:text-gray-200">{formatDate(client.nextFollowUp)}</p>
                      </div>
                    )}
                  </div>
                  {client.notes && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Observações</p>
                      <p className="text-sm bg-background dark:border-neutral-700 text-gray-700 dark:text-gray-300 p-3 rounded-lg">{client.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <Card className="bg-background dark:border-neutral-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Histórico de Interações</CardTitle>
                </CardHeader>
                <CardContent>
                  {interactions.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">Nenhuma interação registrada</p>
                  ) : (
                    <div className="space-y-4">
                      {interactions.map((interaction) => (
                        <div key={interaction.id} className="flex items-start gap-4 pb-4 border-b dark:border-gray-700 last:border-0">
                          <div className="p-2 bg-background rounded-lg">
                            {getNoteTypeIcon(interaction.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-gray-900 dark:text-white">{interaction.description}</p>
                              {interaction.amount && (
                                <span className="text-green-600 dark:text-green-400 font-medium">
                                  {formatCurrency(interaction.amount)}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{formatDate(interaction.date)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notas e Follow-ups</h3>
                <Button onClick={() => setIsAddingNote(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Nota
                </Button>
              </div>

              <div className="space-y-4">
                {notes.length === 0 ? (
                  <Card className="bg-background dark:border-neutral-700">
                    <CardContent className="py-8 text-center text-gray-500 dark:text-gray-400">
                      Nenhuma nota registrada
                    </CardContent>
                  </Card>
                ) : (
                  notes.map((note) => (
                    <Card key={note.id} className="bg-background dark:border-neutral-700">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-background dark:border-neutral-700 rounded-lg">
                            {getNoteTypeIcon(note.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-900 dark:text-white">{note.userName}</span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(note.createdAt)}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">{note.content}</p>
                            <span className="inline-block mt-2 px-2 py-1 bg-background dark:border-neutral-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                              {note.type}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Note Dialog */}
      <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nota</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tipo</Label>
              <select
                value={noteType}
                onChange={(e) => setNoteType(e.target.value as any)}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="NOTE">Nota</option>
                <option value="CALL">Ligação</option>
                <option value="EMAIL">Email</option>
                <option value="MEETING">Reunião</option>
                <option value="FOLLOW_UP">Follow-up</option>
              </select>
            </div>
            <div>
              <Label>Conteúdo</Label>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md min-h-[120px]"
                placeholder="Escreva sua nota aqui..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingNote(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddNote}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Segment Dialog */}
      <Dialog open={isEditingSegment} onOpenChange={setIsEditingSegment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Segmento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Segmento</Label>
              <select
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value as any)}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="NEW">Novo</option>
                <option value="REGULAR">Regular</option>
                <option value="VIP">VIP</option>
                <option value="INACTIVE">Inativo</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingSegment(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateSegment}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
