'use client';

import { useState, useEffect } from 'react';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Wallet,
    Plus,
    Search,
    Filter,
    Download,
    Calendar,
    Receipt,
    CreditCard,
    Banknote,
    X,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type TransactionType = 'INCOME' | 'EXPENSE';
type TransactionStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
type PaymentMethod = 'MONEY' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'TRANSFER';
type TransactionCategory =
  | 'SERVICE'
  | 'PRODUCT'
  | 'SALARY'
  | 'RENT'
  | 'SUPPLIES'
  | 'UTILITIES'
  | 'MARKETING'
  | 'OTHER';

interface Transaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  amount: number;
  status: TransactionStatus;
  paymentMethod?: PaymentMethod;
  dueDate: string;
  paidDate?: string;
  clientName?: string;
  professionalName?: string;
  notes?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'INCOME',
    category: 'SERVICE',
    description: 'Corte de Cabelo',
    amount: 80,
    status: 'PAID',
    paymentMethod: 'PIX',
    dueDate: '2025-10-15',
    paidDate: '2025-10-15',
    clientName: 'Maria Silva',
    professionalName: 'Ana Santos',
  },
  {
    id: '2',
    type: 'INCOME',
    category: 'PRODUCT',
    description: 'Venda de Shampoo Premium',
    amount: 120,
    status: 'PAID',
    paymentMethod: 'CREDIT_CARD',
    dueDate: '2025-10-15',
    paidDate: '2025-10-15',
    clientName: 'João Oliveira',
  },
  {
    id: '3',
    type: 'EXPENSE',
    category: 'SALARY',
    description: 'Salário - Ana Santos',
    amount: 3500,
    status: 'PENDING',
    dueDate: '2025-10-20',
    professionalName: 'Ana Santos',
  },
  {
    id: '4',
    type: 'EXPENSE',
    category: 'RENT',
    description: 'Aluguel do Salão',
    amount: 5000,
    status: 'PENDING',
    dueDate: '2025-10-25',
  },
  {
    id: '5',
    type: 'INCOME',
    category: 'SERVICE',
    description: 'Manicure + Pedicure',
    amount: 100,
    status: 'PAID',
    paymentMethod: 'MONEY',
    dueDate: '2025-10-14',
    paidDate: '2025-10-14',
    clientName: 'Paula Costa',
    professionalName: 'Carla Lima',
  },
  {
    id: '6',
    type: 'EXPENSE',
    category: 'SUPPLIES',
    description: 'Compra de Produtos Profissionais',
    amount: 800,
    status: 'PAID',
    paymentMethod: 'TRANSFER',
    dueDate: '2025-10-10',
    paidDate: '2025-10-10',
  },
  {
    id: '7',
    type: 'EXPENSE',
    category: 'UTILITIES',
    description: 'Conta de Luz',
    amount: 450,
    status: 'OVERDUE',
    dueDate: '2025-10-05',
  },
  {
    id: '8',
    type: 'INCOME',
    category: 'SERVICE',
    description: 'Escova + Hidratação',
    amount: 150,
    status: 'PENDING',
    dueDate: '2025-10-18',
    clientName: 'Fernanda Martins',
    professionalName: 'Ana Santos',
  },
];

const categoryLabels: Record<TransactionCategory, string> = {
  SERVICE: 'Serviço',
  PRODUCT: 'Produto',
  SALARY: 'Salário',
  RENT: 'Aluguel',
  SUPPLIES: 'Suprimentos',
  UTILITIES: 'Utilidades',
  MARKETING: 'Marketing',
  OTHER: 'Outro',
};

const statusLabels: Record<TransactionStatus, string> = {
  PENDING: 'Pendente',
  PAID: 'Pago',
  OVERDUE: 'Atrasado',
  CANCELLED: 'Cancelado',
};

const paymentMethodLabels: Record<PaymentMethod, string> = {
  MONEY: 'Dinheiro',
  CREDIT_CARD: 'Cartão de Crédito',
  DEBIT_CARD: 'Cartão de Débito',
  PIX: 'PIX',
  TRANSFER: 'Transferência',
};

export default function FinanceiroPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | TransactionType>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | TransactionStatus>('ALL');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/transactions');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    type: 'INCOME' as TransactionType,
    category: 'SERVICE' as TransactionCategory,
    description: '',
    amount: '',
    status: 'PENDING' as TransactionStatus,
    paymentMethod: 'MONEY' as PaymentMethod,
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    paidDate: '',
    clientName: '',
    professionalName: '',
    notes: '',
  });

  // Calcular estatísticas
  const stats = transactions.reduce(
    (acc, transaction) => {
      if (transaction.status === 'PAID') {
        if (transaction.type === 'INCOME') {
          acc.totalIncome += transaction.amount;
        } else {
          acc.totalExpense += transaction.amount;
        }
      }
      if (transaction.status === 'PENDING') {
        if (transaction.type === 'INCOME') {
          acc.pendingIncome += transaction.amount;
        } else {
          acc.pendingExpense += transaction.amount;
        }
      }
      return acc;
    },
    { totalIncome: 0, totalExpense: 0, pendingIncome: 0, pendingExpense: 0 }
  );

  const balance = stats.totalIncome - stats.totalExpense;

  // Filtrar transações
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.professionalName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'ALL' || transaction.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleOpenDialog = (transaction?: Transaction) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setFormData({
        type: transaction.type,
        category: transaction.category,
        description: transaction.description,
        amount: transaction.amount.toString(),
        status: transaction.status,
        paymentMethod: transaction.paymentMethod || 'MONEY',
        dueDate: transaction.dueDate,
        paidDate: transaction.paidDate || '',
        clientName: transaction.clientName || '',
        professionalName: transaction.professionalName || '',
        notes: transaction.notes || '',
      });
    } else {
      setEditingTransaction(null);
      setFormData({
        type: 'INCOME',
        category: 'SERVICE',
        description: '',
        amount: '',
        status: 'PENDING',
        paymentMethod: 'MONEY',
        dueDate: format(new Date(), 'yyyy-MM-dd'),
        paidDate: '',
        clientName: '',
        professionalName: '',
        notes: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTransaction(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const transactionData = {
      type: formData.type,
      category: formData.category,
      description: formData.description,
      amount: parseFloat(formData.amount),
      status: formData.status,
      paymentMethod: formData.status === 'PAID' ? formData.paymentMethod : undefined,
      dueDate: formData.dueDate,
      paidDate: formData.status === 'PAID' ? formData.paidDate || formData.dueDate : undefined,
      clientName: formData.clientName || undefined,
      professionalName: formData.professionalName || undefined,
      notes: formData.notes || undefined,
    };

    try {
      if (editingTransaction) {
        const response = await fetch(`/api/transactions/${editingTransaction.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transactionData),
        });

        if (response.ok) {
          await fetchTransactions();
        }
      } else {
        const response = await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transactionData),
        });

        if (response.ok) {
          await fetchTransactions();
        }
      }

      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      try {
        const response = await fetch(`/api/transactions/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchTransactions();
        }
      } catch (error) {
        console.error('Erro ao excluir transação:', error);
      }
    }
  };

  const handleMarkAsPaid = async (transaction: Transaction) => {
    try {
      const response = await fetch(`/api/transactions/${transaction.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...transaction,
          status: 'PAID',
          paidDate: format(new Date(), 'yyyy-MM-dd'),
          paymentMethod: transaction.paymentMethod || 'MONEY',
        }),
      });

      if (response.ok) {
        await fetchTransactions();
      }
    } catch (error) {
      console.error('Erro ao marcar como pago:', error);
    }
  };

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case 'PAID':
        return 'text-green-500 bg-green-500/10';
      case 'PENDING':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'OVERDUE':
        return 'text-red-500 bg-red-500/10';
      case 'CANCELLED':
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
          <p className="text-muted-foreground text-lg mt-1">
            Controle completo do fluxo de caixa
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Transação
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Saldo Atual</p>
              <p className={`text-2xl font-bold mt-2 ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                R$ {balance.toFixed(2)}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Receitas</p>
              <p className="text-2xl font-bold text-green-500 mt-2">
                R$ {stats.totalIncome.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Pendente: R$ {stats.pendingIncome.toFixed(2)}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Despesas</p>
              <p className="text-2xl font-bold text-red-500 mt-2">
                R$ {stats.totalExpense.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Pendente: R$ {stats.pendingExpense.toFixed(2)}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-red-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Contas Pendentes</p>
              <p className="text-2xl font-bold text-yellow-500 mt-2">
                {transactions.filter((t) => t.status === 'PENDING').length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                R$ {(stats.pendingIncome + stats.pendingExpense).toFixed(2)}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Receipt className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por descrição, cliente ou profissional..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
            <SelectTrigger className="w-full lg:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos os Tipos</SelectItem>
              <SelectItem value="INCOME">Receitas</SelectItem>
              <SelectItem value="EXPENSE">Despesas</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos os Status</SelectItem>
              <SelectItem value="PAID">Pagos</SelectItem>
              <SelectItem value="PENDING">Pendentes</SelectItem>
              <SelectItem value="OVERDUE">Atrasados</SelectItem>
              <SelectItem value="CANCELLED">Cancelados</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Data</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Tipo</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">
                  Descrição
                </th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">
                  Categoria
                </th>
                <th className="text-right p-4 font-medium text-sm text-muted-foreground">Valor</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">
                  Pagamento
                </th>
                <th className="text-center p-4 font-medium text-sm text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          {format(new Date(transaction.dueDate), 'dd/MM/yyyy', { locale: ptBR })}
                        </p>
                        {transaction.paidDate && (
                          <p className="text-xs text-muted-foreground">
                            Pago em{' '}
                            {format(new Date(transaction.paidDate), 'dd/MM/yyyy', { locale: ptBR })}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.type === 'INCOME'
                          ? 'text-green-500 bg-green-500/10'
                          : 'text-red-500 bg-red-500/10'
                      }`}
                    >
                      {transaction.type === 'INCOME' ? (
                        <>
                          <TrendingUp className="h-3 w-3" />
                          Receita
                        </>
                      ) : (
                        <>
                          <TrendingDown className="h-3 w-3" />
                          Despesa
                        </>
                      )}
                    </span>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-medium">{transaction.description}</p>
                      {transaction.clientName && (
                        <p className="text-xs text-muted-foreground">
                          Cliente: {transaction.clientName}
                        </p>
                      )}
                      {transaction.professionalName && (
                        <p className="text-xs text-muted-foreground">
                          Profissional: {transaction.professionalName}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground">
                      {categoryLabels[transaction.category]}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <p
                      className={`text-sm font-bold ${
                        transaction.type === 'INCOME' ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {transaction.type === 'INCOME' ? '+' : '-'} R${' '}
                      {transaction.amount.toFixed(2)}
                    </p>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        transaction.status
                      )}`}
                    >
                      {statusLabels[transaction.status]}
                    </span>
                  </td>
                  <td className="p-4">
                    {transaction.paymentMethod && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        {transaction.paymentMethod === 'MONEY' && <Banknote className="h-4 w-4" />}
                        {(transaction.paymentMethod === 'CREDIT_CARD' ||
                          transaction.paymentMethod === 'DEBIT_CARD') && (
                          <CreditCard className="h-4 w-4" />
                        )}
                        {transaction.paymentMethod === 'PIX' && <DollarSign className="h-4 w-4" />}
                        <span>{paymentMethodLabels[transaction.paymentMethod]}</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      {transaction.status === 'PENDING' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsPaid(transaction)}
                          className="h-8 text-green-500 hover:text-green-600 hover:bg-green-500/10"
                        >
                          Marcar como Pago
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(transaction)}
                        className="h-8"
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(transaction.id)}
                        className="h-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma transação encontrada</p>
            </div>
          )}
        </div>
      </Card>

      {/* Dialog for Add/Edit Transaction */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
            </DialogTitle>
            <DialogDescription>
              {editingTransaction
                ? 'Atualize os dados da transação.'
                : 'Preencha os dados da nova transação.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: TransactionType) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INCOME">Receita</SelectItem>
                    <SelectItem value="EXPENSE">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: TransactionCategory) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ex: Corte de cabelo, Aluguel, etc."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Valor (R$)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: TransactionStatus) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Data de Vencimento</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />
              </div>

              {formData.status === 'PAID' && (
                <div className="space-y-2">
                  <Label htmlFor="paidDate">Data de Pagamento</Label>
                  <Input
                    id="paidDate"
                    type="date"
                    value={formData.paidDate}
                    onChange={(e) => setFormData({ ...formData, paidDate: e.target.value })}
                  />
                </div>
              )}
            </div>

            {formData.status === 'PAID' && (
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value: PaymentMethod) =>
                    setFormData({ ...formData, paymentMethod: value })
                  }
                >
                  <SelectTrigger id="paymentMethod">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(paymentMethodLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Cliente (opcional)</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="Nome do cliente"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="professionalName">Profissional (opcional)</Label>
                <Input
                  id="professionalName"
                  value={formData.professionalName}
                  onChange={(e) => setFormData({ ...formData, professionalName: e.target.value })}
                  placeholder="Nome do profissional"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Informações adicionais..."
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingTransaction ? 'Salvar Alterações' : 'Criar Transação'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
