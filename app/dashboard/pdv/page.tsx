'use client';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Banknote,
  Check,
  CreditCard,
  DollarSign,
  Minus,
  Package,
  Plus,
  Printer,
  Scissors,
  Search,
  ShoppingCart,
  User, 
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type ItemType = 'SERVICE' | 'PRODUCT';
type PaymentMethod = 'MONEY' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'TRANSFER';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  category: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

interface CartItem {
  id: string;
  type: ItemType;
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  discount: number;
  total: number;
}

interface Payment {
  method: PaymentMethod;
  amount: number;
}

const mockServices: Service[] = [
  { id: 's1', name: 'Corte Feminino', price: 80, duration: 60, category: 'Cabelo' },
  { id: 's2', name: 'Corte Masculino', price: 50, duration: 30, category: 'Cabelo' },
  { id: 's3', name: 'Coloração', price: 200, duration: 120, category: 'Cabelo' },
  { id: 's4', name: 'Escova', price: 60, duration: 45, category: 'Cabelo' },
  { id: 's5', name: 'Manicure', price: 40, duration: 45, category: 'Unhas' },
  { id: 's6', name: 'Pedicure', price: 50, duration: 60, category: 'Unhas' },
  { id: 's7', name: 'Design de Sobrancelha', price: 35, duration: 30, category: 'Sobrancelha' },
  { id: 's8', name: 'Maquiagem', price: 150, duration: 60, category: 'Maquiagem' },
];

const mockProducts: Product[] = [
  { id: 'p1', name: 'Shampoo Premium 500ml', price: 120, stock: 15, category: 'Cabelo' },
  { id: 'p2', name: 'Condicionador 500ml', price: 100, stock: 12, category: 'Cabelo' },
  { id: 'p3', name: 'Máscara Capilar', price: 85, stock: 8, category: 'Cabelo' },
  { id: 'p4', name: 'Esmalte', price: 35, stock: 25, category: 'Unhas' },
  { id: 'p5', name: 'Base Facial', price: 220, stock: 5, category: 'Maquiagem' },
  { id: 'p6', name: 'Batom', price: 65, stock: 18, category: 'Maquiagem' },
];

const paymentMethodLabels: Record<PaymentMethod, string> = {
  MONEY: 'Dinheiro',
  CREDIT_CARD: 'Cartão de Crédito',
  DEBIT_CARD: 'Cartão de Débito',
  PIX: 'PIX',
  TRANSFER: 'Transferência',
};

export default function PDVPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'SERVICE' | 'PRODUCT'>('SERVICE');
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [selectedProfessional, setSelectedProfessional] = useState<string>('');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [currentPayment, setCurrentPayment] = useState<Payment>({
    method: 'MONEY',
    amount: 0,
  });
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Array<{ id: string; name: string }>>([]);
  const [professionals, setProfessionals] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
    fetchProducts();
    fetchClients();
    fetchProfessionals();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        // Filtra produtos que podem ser vendidos (tem preço de venda e estoque)
        // Mapeia os campos da API (salePrice, currentStock) para os campos do componente (price, stock)
        setProducts(
          data
            .filter((p: any) => p.salePrice > 0 && p.currentStock > 0)
            .map((p: any) => ({
              id: p.id,
              name: p.name,
              price: p.salePrice,
              stock: p.currentStock,
              category: p.category,
            }))
        );
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients');
      if (response.ok) {
        const data = await response.json();
        setClients(data.map((c: any) => ({ id: c.id, name: c.name })));
      }
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  const fetchProfessionals = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/professionals');
      if (response.ok) {
        const data = await response.json();
        setProfessionals(data.map((p: any) => ({ id: p.id, name: p.name })));
      }
    } catch (error) {
      console.error('Erro ao buscar profissionais:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar serviços e produtos
  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular totais
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalDiscount = cart.reduce((sum, item) => sum + item.discount, 0);
  const total = subtotal - totalDiscount;
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const remaining = total - totalPaid;

  const addToCart = (type: ItemType, item: Service | Product) => {
    const existingItem = cart.find((cartItem) => cartItem.itemId === item.id);

    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === existingItem.id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
                total: (cartItem.quantity + 1) * cartItem.price - cartItem.discount,
              }
            : cartItem
        )
      );
    } else {
      const newItem: CartItem = {
        id: Date.now().toString(),
        type,
        itemId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        discount: 0,
        total: item.price,
      };
      setCart([...cart, newItem]);
    }
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === itemId) {
            const newQuantity = Math.max(0, item.quantity + delta);
            return {
              ...item,
              quantity: newQuantity,
              total: newQuantity * item.price - item.discount,
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const updateDiscount = (itemId: string, discount: number) => {
    setCart(
      cart.map((item) =>
        item.id === itemId
          ? {
              ...item,
              discount: Math.max(0, Math.min(discount, item.price * item.quantity)),
              total: item.price * item.quantity - discount,
            }
          : item
      )
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
    setPayments([]);
    setSelectedClient('');
    setSelectedProfessional('');
  };

  const handleOpenPaymentDialog = () => {
    if (cart.length === 0) {
      alert('Adicione itens ao carrinho antes de finalizar a venda.');
      return;
    }
    setCurrentPayment({ method: 'MONEY', amount: remaining });
    setIsPaymentDialogOpen(true);
  };

  const handleAddPayment = () => {
    if (currentPayment.amount <= 0) {
      alert('Valor do pagamento deve ser maior que zero.');
      return;
    }
    if (currentPayment.amount > remaining) {
      alert('Valor do pagamento é maior que o valor restante.');
      return;
    }
    setPayments([...payments, currentPayment]);
    setIsPaymentDialogOpen(false);
  };

  const handleRemovePayment = (index: number) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  const handleFinalizeSale = async () => {
    if (remaining > 0) {
      alert('Ainda há valor pendente. Adicione mais pagamentos.');
      return;
    }

    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: selectedClient || undefined,
          professionalId: selectedProfessional || undefined,
          items: cart,
          payments,
          subtotal,
          totalDiscount,
          total,
        }),
      });

      if (response.ok) {
        setIsPaymentDialogOpen(false);
        setIsReceiptDialogOpen(true);
      }
    } catch (error) {
      console.error('Erro ao finalizar venda:', error);
      alert('Erro ao finalizar venda. Tente novamente.');
    }
  };

  const handlePrintReceipt = () => {
    // Aqui seria implementada a integração com impressora
    alert('Comprovante enviado para impressão!');
    setIsReceiptDialogOpen(false);
    clearCart();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">PDV - Ponto de Venda</h1>
          <p className="text-muted-foreground text-lg mt-1">
            Sistema de registro de vendas e serviços
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={clearCart} disabled={cart.length === 0}>
            Limpar Venda
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Products/Services */}
        <div className="lg:col-span-2 space-y-4">
          {/* Client and Professional Selection */}
          <Card className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cliente</Label>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger>
                    <User className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Profissional</Label>
                <Select value={selectedProfessional} onValueChange={setSelectedProfessional}>
                  <SelectTrigger>
                    <User className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Selecione o profissional" />
                  </SelectTrigger>
                  <SelectContent>
                    {professionals.map((professional) => (
                      <SelectItem key={professional.id} value={professional.id}>
                        {professional.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar serviços ou produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'SERVICE' ? 'default' : 'outline'}
              onClick={() => setActiveTab('SERVICE')}
              className="flex-1 gap-2"
            >
              <Scissors className="h-4 w-4" />
              Serviços
            </Button>
            <Button
              variant={activeTab === 'PRODUCT' ? 'default' : 'outline'}
              onClick={() => setActiveTab('PRODUCT')}
              className="flex-1 gap-2"
            >
              <Package className="h-4 w-4" />
              Produtos
            </Button>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {activeTab === 'SERVICE' &&
              filteredServices.map((service) => (
                <Card
                  key={service.id}
                  className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => addToCart('SERVICE', service)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <Scissors className="h-5 w-5 text-primary" />
                    <span className="text-xs text-muted-foreground">{service.duration} min</span>
                  </div>
                  <h3 className="font-medium text-sm mb-1">{service.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{service.category}</p>
                  <p className="text-lg font-bold text-primary">R$ {service.price.toFixed(2)}</p>
                </Card>
              ))}

            {activeTab === 'PRODUCT' &&
              filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => addToCart('PRODUCT', product)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <Package className="h-5 w-5 text-primary" />
                    <span className="text-xs text-muted-foreground">Est: {product.stock}</span>
                  </div>
                  <h3 className="font-medium text-sm mb-1">{product.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{product.category}</p>
                  <p className="text-lg font-bold text-primary">R$ {product.price.toFixed(2)}</p>
                </Card>
              ))}
          </div>
        </div>

        {/* Right Side - Cart */}
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">Carrinho</h2>
              <span className="ml-auto text-sm text-muted-foreground">
                {cart.length} {cart.length === 1 ? 'item' : 'itens'}
              </span>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Carrinho vazio</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {cart.map((item) => (
                  <Card key={item.id} className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {item.type === 'SERVICE' ? (
                            <Scissors className="h-4 w-4 text-primary" />
                          ) : (
                            <Package className="h-4 w-4 text-primary" />
                          )}
                          <p className="text-sm font-medium">{item.name}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          R$ {item.price.toFixed(2)} un.
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="h-7 w-7 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="h-7 w-7 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <Label className="text-xs">Desconto:</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max={item.price * item.quantity}
                        value={item.discount}
                        onChange={(e) => updateDiscount(item.id, parseFloat(e.target.value) || 0)}
                        className="h-7 text-xs"
                        placeholder="R$ 0,00"
                      />
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-xs text-muted-foreground">Subtotal:</span>
                      <span className="text-sm font-bold text-primary">
                        R$ {item.total.toFixed(2)}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>

          {/* Totals */}
          {cart.length > 0 && (
            <Card className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Desconto:</span>
                  <span className="font-medium text-red-500">- R$ {totalDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-3 border-t">
                <span>Total:</span>
                <span className="text-primary">R$ {total.toFixed(2)}</span>
              </div>

              {payments.length > 0 && (
                <>
                  <div className="space-y-2 pt-3 border-t">
                    {payments.map((payment, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          {payment.method === 'MONEY' && <Banknote className="h-4 w-4" />}
                          {(payment.method === 'CREDIT_CARD' ||
                            payment.method === 'DEBIT_CARD') && <CreditCard className="h-4 w-4" />}
                          {payment.method === 'PIX' && <DollarSign className="h-4 w-4" />}
                          <span className="text-muted-foreground">
                            {paymentMethodLabels[payment.method]}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-500 font-medium">
                            R$ {payment.amount.toFixed(2)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemovePayment(index)}
                            className="h-6 w-6 p-0 text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t">
                    <span className="text-muted-foreground">Restante:</span>
                    <span className="font-bold text-yellow-500">R$ {remaining.toFixed(2)}</span>
                  </div>
                </>
              )}

              <Button
                onClick={remaining > 0 ? handleOpenPaymentDialog : handleFinalizeSale}
                className="w-full gap-2"
                size="lg"
              >
                {remaining > 0 ? (
                  <>
                    <CreditCard className="h-5 w-5" />
                    {payments.length > 0 ? 'Adicionar Pagamento' : 'Ir para Pagamento'}
                  </>
                ) : (
                  <>
                    <Check className="h-5 w-5" />
                    Finalizar Venda
                  </>
                )}
              </Button>
            </Card>
          )}
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Pagamento</DialogTitle>
            <DialogDescription>
              Valor restante: <span className="font-bold">R$ {remaining.toFixed(2)}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Forma de Pagamento</Label>
              <Select
                value={currentPayment.method}
                onValueChange={(value: PaymentMethod) =>
                  setCurrentPayment({ ...currentPayment, method: value })
                }
              >
                <SelectTrigger>
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

            <div className="space-y-2">
              <Label>Valor (R$)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max={remaining}
                value={currentPayment.amount}
                onChange={(e) =>
                  setCurrentPayment({ ...currentPayment, amount: parseFloat(e.target.value) || 0 })
                }
                placeholder="0,00"
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentPayment({ ...currentPayment, amount: remaining / 2 })}
                className="flex-1"
              >
                50%
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentPayment({ ...currentPayment, amount: remaining })}
                className="flex-1"
              >
                100%
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddPayment}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={isReceiptDialogOpen} onOpenChange={setIsReceiptDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Venda Finalizada!</DialogTitle>
            <DialogDescription className="text-center">
              <Check className="h-16 w-16 text-green-500 mx-auto mb-4 mt-4" />
            </DialogDescription>
          </DialogHeader>

          <Card className="p-6 space-y-4">
            <div className="text-center border-b pb-4">
              <h3 className="font-bold text-2xl mb-2">SalonX</h3>
              <p className="text-sm text-muted-foreground">
                {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>

            {selectedClient && (
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                <span className="text-muted-foreground">Cliente:</span>
                <span className="font-medium">
                  {clients.find((c) => c.id === selectedClient)?.name}
                </span>
              </div>
            )}

            <div className="space-y-2 border-b pb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-medium">R$ {item.total.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Desconto:</span>
                  <span className="text-red-500">- R$ {totalDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total:</span>
                <span className="text-primary">R$ {total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-1 border-t pt-4">
              <p className="text-xs text-muted-foreground font-medium mb-2">Pagamentos:</p>
              {payments.map((payment, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {paymentMethodLabels[payment.method]}
                  </span>
                  <span>R$ {payment.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </Card>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsReceiptDialogOpen(false)} className="flex-1">
              Não Imprimir
            </Button>
            <Button onClick={handlePrintReceipt} className="flex-1 gap-2">
              <Printer className="h-4 w-4" />
              Imprimir Comprovante
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
