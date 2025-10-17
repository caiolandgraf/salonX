'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  AlertTriangle,
  Box,
  Edit,
  Filter,
  History,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  TrendingDown,
  TrendingUp
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

type ProductType = 'SERVICE' | 'RESALE'
type ProductCategory =
  | 'HAIR'
  | 'NAILS'
  | 'SKINCARE'
  | 'MAKEUP'
  | 'TOOLS'
  | 'OTHER'
type MovementType = 'IN' | 'OUT' | 'ADJUSTMENT'

interface Product {
  id: string
  name: string
  type: ProductType
  category: ProductCategory
  brand: string
  sku: string
  currentStock: number
  minStock: number
  maxStock: number
  unit: string
  costPrice: number
  salePrice?: number
  supplier?: string
  location?: string
  notes?: string
}

interface StockMovement {
  id: string
  productId: string
  productName: string
  type: MovementType
  quantity: number
  date: string
  reason: string
  userId: string
  userName: string
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Shampoo Profissional 1L',
    type: 'SERVICE',
    category: 'HAIR',
    brand: "L'Oreal",
    sku: 'SHA-001',
    currentStock: 15,
    minStock: 10,
    maxStock: 50,
    unit: 'UN',
    costPrice: 45.0,
    supplier: 'Distribuidora Beauty',
    location: 'Prateleira A1'
  },
  {
    id: '2',
    name: 'Condicionador Hidratante 500ml',
    type: 'RESALE',
    category: 'HAIR',
    brand: 'Kerastase',
    sku: 'CON-002',
    currentStock: 8,
    minStock: 5,
    maxStock: 30,
    unit: 'UN',
    costPrice: 85.0,
    salePrice: 150.0,
    supplier: 'Distribuidora Beauty',
    location: 'Prateleira A2'
  },
  {
    id: '3',
    name: 'Esmalte Vermelho',
    type: 'RESALE',
    category: 'NAILS',
    brand: 'OPI',
    sku: 'ESM-003',
    currentStock: 3,
    minStock: 10,
    maxStock: 50,
    unit: 'UN',
    costPrice: 18.0,
    salePrice: 35.0,
    supplier: 'Nail Supply',
    location: 'Gaveta B3'
  },
  {
    id: '4',
    name: 'Máscara Facial Argila',
    type: 'SERVICE',
    category: 'SKINCARE',
    brand: 'Natura',
    sku: 'MAS-004',
    currentStock: 25,
    minStock: 15,
    maxStock: 60,
    unit: 'UN',
    costPrice: 32.0,
    supplier: 'Beauty Express',
    location: 'Prateleira C1'
  },
  {
    id: '5',
    name: 'Base Líquida FPS 30',
    type: 'RESALE',
    category: 'MAKEUP',
    brand: 'MAC',
    sku: 'BAS-005',
    currentStock: 12,
    minStock: 8,
    maxStock: 25,
    unit: 'UN',
    costPrice: 120.0,
    salePrice: 220.0,
    supplier: 'Makeup Pro',
    location: 'Vitrine 1'
  },
  {
    id: '6',
    name: 'Tesoura Profissional',
    type: 'SERVICE',
    category: 'TOOLS',
    brand: 'Jaguar',
    sku: 'TES-006',
    currentStock: 5,
    minStock: 3,
    maxStock: 10,
    unit: 'UN',
    costPrice: 250.0,
    supplier: 'Tools Import',
    location: 'Armário Ferramentas'
  }
]

const mockMovements: StockMovement[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Shampoo Profissional 1L',
    type: 'IN',
    quantity: 20,
    date: '2025-10-10',
    reason: 'Compra de estoque',
    userId: '1',
    userName: 'Admin'
  },
  {
    id: '2',
    productId: '2',
    productName: 'Condicionador Hidratante 500ml',
    type: 'OUT',
    quantity: 2,
    date: '2025-10-12',
    reason: 'Venda para cliente',
    userId: '2',
    userName: 'Ana Santos'
  },
  {
    id: '3',
    productId: '3',
    productName: 'Esmalte Vermelho',
    type: 'OUT',
    quantity: 7,
    date: '2025-10-14',
    reason: 'Uso em serviços',
    userId: '3',
    userName: 'Carla Lima'
  }
]

const categoryLabels: Record<ProductCategory, string> = {
  HAIR: 'Cabelo',
  NAILS: 'Unhas',
  SKINCARE: 'Skincare',
  MAKEUP: 'Maquiagem',
  TOOLS: 'Ferramentas',
  OTHER: 'Outros'
}

const movementTypeLabels: Record<MovementType, string> = {
  IN: 'Entrada',
  OUT: 'Saída',
  ADJUSTMENT: 'Ajuste'
}

export default function EstoquePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [loading, setLoading] = useState(true)
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [isMovementDialogOpen, setIsMovementDialogOpen] = useState(false)
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedProductHistory, setSelectedProductHistory] = useState<
    string | null
  >(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<'ALL' | ProductCategory>(
    'ALL'
  )
  const [filterType, setFilterType] = useState<'ALL' | ProductType>('ALL')
  const [showLowStock, setShowLowStock] = useState(false)

  useEffect(() => {
    fetchProducts()
    fetchMovements()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMovements = async () => {
    try {
      const response = await fetch('/api/stock-movements')
      if (response.ok) {
        const data = await response.json()
        setMovements(data)
      }
    } catch (error) {
      console.error('Erro ao buscar movimentações:', error)
    }
  }

  const [productForm, setProductForm] = useState({
    name: '',
    type: 'SERVICE' as ProductType,
    category: 'HAIR' as ProductCategory,
    brand: '',
    sku: '',
    currentStock: '',
    minStock: '',
    maxStock: '',
    unit: 'UN',
    costPrice: '',
    salePrice: '',
    supplier: '',
    location: '',
    notes: ''
  })

  const [movementForm, setMovementForm] = useState({
    productId: '',
    type: 'IN' as MovementType,
    quantity: '',
    reason: ''
  })

  // Calcular estatísticas
  const stats = {
    totalProducts: products.length,
    lowStockProducts: products.filter(p => p.currentStock <= p.minStock).length,
    totalValue: products.reduce(
      (sum, p) => sum + p.currentStock * p.costPrice,
      0
    ),
    revenueProducts: products.filter(p => p.type === 'RESALE').length
  }

  // Filtrar produtos
  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      filterCategory === 'ALL' || product.category === filterCategory
    const matchesType = filterType === 'ALL' || product.type === filterType
    const matchesLowStock =
      !showLowStock || product.currentStock <= product.minStock
    return matchesSearch && matchesCategory && matchesType && matchesLowStock
  })

  const handleOpenProductDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setProductForm({
        name: product.name,
        type: product.type,
        category: product.category,
        brand: product.brand,
        sku: product.sku,
        currentStock: product.currentStock.toString(),
        minStock: product.minStock.toString(),
        maxStock: product.maxStock.toString(),
        unit: product.unit,
        costPrice: product.costPrice.toString(),
        salePrice: product.salePrice?.toString() || '',
        supplier: product.supplier || '',
        location: product.location || '',
        notes: product.notes || ''
      })
    } else {
      setEditingProduct(null)
      setProductForm({
        name: '',
        type: 'SERVICE',
        category: 'HAIR',
        brand: '',
        sku: '',
        currentStock: '0',
        minStock: '10',
        maxStock: '50',
        unit: 'UN',
        costPrice: '',
        salePrice: '',
        supplier: '',
        location: '',
        notes: ''
      })
    }
    setIsProductDialogOpen(true)
  }

  const handleCloseProductDialog = () => {
    setIsProductDialogOpen(false)
    setEditingProduct(null)
  }

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault()

    const productData = {
      name: productForm.name,
      type: productForm.type,
      category: productForm.category,
      brand: productForm.brand,
      sku: productForm.sku,
      currentStock: parseFloat(productForm.currentStock),
      minStock: parseFloat(productForm.minStock),
      maxStock: parseFloat(productForm.maxStock),
      unit: productForm.unit,
      costPrice: parseFloat(productForm.costPrice),
      salePrice: productForm.salePrice
        ? parseFloat(productForm.salePrice)
        : undefined,
      supplier: productForm.supplier || undefined,
      location: productForm.location || undefined,
      notes: productForm.notes || undefined
    }

    try {
      if (editingProduct) {
        const response = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        })

        if (response.ok) {
          await fetchProducts()
        }
      } else {
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        })

        if (response.ok) {
          await fetchProducts()
        }
      }

      handleCloseProductDialog()
    } catch (error) {
      console.error('Erro ao salvar produto:', error)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          await fetchProducts()
          await fetchMovements()
        }
      } catch (error) {
        console.error('Erro ao excluir produto:', error)
      }
    }
  }

  const handleOpenMovementDialog = (productId?: string) => {
    setMovementForm({
      productId: productId || '',
      type: 'IN',
      quantity: '',
      reason: ''
    })
    setIsMovementDialogOpen(true)
  }

  const handleSubmitMovement = async (e: React.FormEvent) => {
    e.preventDefault()

    const product = products.find(p => p.id === movementForm.productId)
    if (!product) return

    const quantity = parseFloat(movementForm.quantity)

    try {
      const response = await fetch('/api/stock-movements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: movementForm.productId,
          productName: product.name,
          type: movementForm.type,
          quantity,
          reason: movementForm.reason,
          userId: '1',
          userName: 'Admin'
        })
      })

      if (response.ok) {
        await fetchProducts()
        await fetchMovements()
        setIsMovementDialogOpen(false)
      }
    } catch (error) {
      console.error('Erro ao criar movimentação:', error)
    }
  }

  const handleViewHistory = (productId: string) => {
    setSelectedProductHistory(productId)
    setIsHistoryDialogOpen(true)
  }

  const getStockStatus = (product: Product) => {
    if (product.currentStock === 0) {
      return { label: 'Esgotado', color: 'text-red-500 bg-red-500/10' }
    }
    if (product.currentStock <= product.minStock) {
      return {
        label: 'Estoque Baixo',
        color: 'text-yellow-500 bg-yellow-500/10'
      }
    }
    if (product.currentStock >= product.maxStock) {
      return { label: 'Estoque Alto', color: 'text-blue-500 bg-blue-500/10' }
    }
    return { label: 'Normal', color: 'text-green-500 bg-green-500/10' }
  }

  const productHistory = selectedProductHistory
    ? movements.filter(m => m.productId === selectedProductHistory)
    : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap md:flex-nowrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estoque</h1>
          <p className="text-muted-foreground text-lg mt-1">
            Controle de produtos e materiais
          </p>
        </div>
        <div className="flex gap-2 mt-3 md:mt-0 w-full md:w-auto flex-wrap md:flex-nowrap">
          <Button
            variant="outline"
            onClick={() => handleOpenMovementDialog()}
            className="gap-2 w-full md:w-auto"
          >
            <TrendingUp className="h-4 w-4" />
            Nova Movimentação
          </Button>
          <Button
            onClick={() => handleOpenProductDialog()}
            className="gap-2 w-full md:w-auto"
          >
            <Plus className="h-4 w-4" />
            Novo Produto
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total de Produtos
              </p>
              <p className="text-2xl font-bold mt-2">{stats.totalProducts}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Package className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Estoque Baixo
              </p>
              <p className="text-2xl font-bold text-yellow-500 mt-2">
                {stats.lowStockProducts}
              </p>
              <Button
                variant="link"
                size="sm"
                className="p-0 h-auto text-xs mt-1"
                onClick={() => setShowLowStock(!showLowStock)}
              >
                {showLowStock ? 'Mostrar Todos' : 'Ver Alertas'}
              </Button>
            </div>
            <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Valor em Estoque
              </p>
              <p className="text-2xl font-bold text-green-500 mt-2">
                R$ {stats.totalValue.toFixed(2)}
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
              <p className="text-sm font-medium text-muted-foreground">
                Produtos p/ Revenda
              </p>
              <p className="text-2xl font-bold mt-2">{stats.revenueProducts}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-blue-500" />
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
              placeholder="Buscar por nome, marca ou SKU..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={filterCategory}
            onValueChange={(value: any) => setFilterCategory(value)}
          >
            <SelectTrigger className="w-full lg:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todas Categorias</SelectItem>
              {Object.entries(categoryLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filterType}
            onValueChange={(value: any) => setFilterType(value)}
          >
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos os Tipos</SelectItem>
              <SelectItem value="SERVICE">Uso Interno</SelectItem>
              <SelectItem value="RESALE">Revenda</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Products Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">
                  Produto
                </th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">
                  SKU
                </th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">
                  Categoria
                </th>
                <th className="text-center p-4 font-medium text-sm text-muted-foreground">
                  Estoque
                </th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">
                  Status
                </th>
                <th className="text-right p-4 font-medium text-sm text-muted-foreground">
                  Valor Unitário
                </th>
                <th className="text-center p-4 font-medium text-sm text-muted-foreground">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => {
                const stockStatus = getStockStatus(product)
                const stockPercentage =
                  (product.currentStock / product.maxStock) * 100

                return (
                  <tr
                    key={product.id}
                    className="border-b last:border-0 hover:bg-muted/50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Box className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {product.brand} •{' '}
                            {product.type === 'SERVICE'
                              ? 'Uso Interno'
                              : 'Revenda'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-mono">{product.sku}</p>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">
                        {categoryLabels[product.category]}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col items-center gap-1">
                        <p className="text-sm font-bold">
                          {product.currentStock} {product.unit}
                        </p>
                        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              product.currentStock <= product.minStock
                                ? 'bg-red-500'
                                : product.currentStock >= product.maxStock
                                  ? 'bg-blue-500'
                                  : 'bg-green-500'
                            }`}
                            style={{
                              width: `${Math.min(stockPercentage, 100)}%`
                            }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Min: {product.minStock} / Max: {product.maxStock}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}
                      >
                        {stockStatus.label}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div>
                        <p className="text-sm font-medium">
                          R$ {product.costPrice.toFixed(2)}
                        </p>
                        {product.salePrice && (
                          <p className="text-xs text-green-500">
                            Venda: R$ {product.salePrice.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewHistory(product.id)}
                          className="h-8 w-8 p-0"
                          title="Histórico"
                        >
                          <History className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenMovementDialog(product.id)}
                          className="h-8 w-8 p-0"
                          title="Movimentação"
                        >
                          <TrendingUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenProductDialog(product)}
                          className="h-8 w-8 p-0"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum produto encontrado</p>
            </div>
          )}
        </div>
      </Card>

      {/* Product Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? 'Atualize as informações do produto.'
                : 'Cadastre um novo produto no estoque.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitProduct} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="name">Nome do Produto *</Label>
                <Input
                  id="name"
                  value={productForm.name}
                  onChange={e =>
                    setProductForm({ ...productForm, name: e.target.value })
                  }
                  placeholder="Ex: Shampoo Profissional"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo *</Label>
                <Select
                  value={productForm.type}
                  onValueChange={(value: ProductType) =>
                    setProductForm({ ...productForm, type: value })
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SERVICE">Uso Interno</SelectItem>
                    <SelectItem value="RESALE">Revenda</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <Select
                  value={productForm.category}
                  onValueChange={(value: ProductCategory) =>
                    setProductForm({ ...productForm, category: value })
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

              <div className="space-y-2">
                <Label htmlFor="brand">Marca *</Label>
                <Input
                  id="brand"
                  value={productForm.brand}
                  onChange={e =>
                    setProductForm({ ...productForm, brand: e.target.value })
                  }
                  placeholder="Ex: L'Oreal"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  value={productForm.sku}
                  onChange={e =>
                    setProductForm({ ...productForm, sku: e.target.value })
                  }
                  placeholder="Ex: SHA-001"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentStock">Estoque Atual *</Label>
                <Input
                  id="currentStock"
                  type="number"
                  step="0.01"
                  min="0"
                  value={productForm.currentStock}
                  onChange={e =>
                    setProductForm({
                      ...productForm,
                      currentStock: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minStock">Estoque Mínimo *</Label>
                <Input
                  id="minStock"
                  type="number"
                  step="0.01"
                  min="0"
                  value={productForm.minStock}
                  onChange={e =>
                    setProductForm({ ...productForm, minStock: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxStock">Estoque Máximo *</Label>
                <Input
                  id="maxStock"
                  type="number"
                  step="0.01"
                  min="0"
                  value={productForm.maxStock}
                  onChange={e =>
                    setProductForm({ ...productForm, maxStock: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unidade *</Label>
                <Select
                  value={productForm.unit}
                  onValueChange={value =>
                    setProductForm({ ...productForm, unit: value })
                  }
                >
                  <SelectTrigger id="unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UN">Unidade</SelectItem>
                    <SelectItem value="KG">Quilograma</SelectItem>
                    <SelectItem value="L">Litro</SelectItem>
                    <SelectItem value="ML">Mililitro</SelectItem>
                    <SelectItem value="CX">Caixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="costPrice">Preço de Custo (R$) *</Label>
                <Input
                  id="costPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={productForm.costPrice}
                  onChange={e =>
                    setProductForm({
                      ...productForm,
                      costPrice: e.target.value
                    })
                  }
                  required
                />
              </div>

              {productForm.type === 'RESALE' && (
                <div className="space-y-2">
                  <Label htmlFor="salePrice">Preço de Venda (R$)</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={productForm.salePrice}
                    onChange={e =>
                      setProductForm({
                        ...productForm,
                        salePrice: e.target.value
                      })
                    }
                    placeholder="Opcional"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="supplier">Fornecedor</Label>
                <Input
                  id="supplier"
                  value={productForm.supplier}
                  onChange={e =>
                    setProductForm({ ...productForm, supplier: e.target.value })
                  }
                  placeholder="Ex: Distribuidora Beauty"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={productForm.location}
                  onChange={e =>
                    setProductForm({ ...productForm, location: e.target.value })
                  }
                  placeholder="Ex: Prateleira A1"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="notes">Observações</Label>
                <Input
                  id="notes"
                  value={productForm.notes}
                  onChange={e =>
                    setProductForm({ ...productForm, notes: e.target.value })
                  }
                  placeholder="Informações adicionais..."
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseProductDialog}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editingProduct ? 'Salvar Alterações' : 'Cadastrar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Movement Dialog */}
      <Dialog
        open={isMovementDialogOpen}
        onOpenChange={setIsMovementDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Movimentação</DialogTitle>
            <DialogDescription>
              Registre entrada ou saída de produtos.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitMovement} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productId">Produto *</Label>
              <Select
                value={movementForm.productId}
                onValueChange={value =>
                  setMovementForm({ ...movementForm, productId: value })
                }
                required
              >
                <SelectTrigger id="productId">
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} (Estoque: {product.currentStock}{' '}
                      {product.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="movementType">Tipo de Movimentação *</Label>
              <Select
                value={movementForm.type}
                onValueChange={(value: MovementType) =>
                  setMovementForm({ ...movementForm, type: value })
                }
              >
                <SelectTrigger id="movementType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN">Entrada</SelectItem>
                  <SelectItem value="OUT">Saída</SelectItem>
                  <SelectItem value="ADJUSTMENT">Ajuste de Estoque</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade *</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                min="0.01"
                value={movementForm.quantity}
                onChange={e =>
                  setMovementForm({ ...movementForm, quantity: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Motivo *</Label>
              <Input
                id="reason"
                value={movementForm.reason}
                onChange={e =>
                  setMovementForm({ ...movementForm, reason: e.target.value })
                }
                placeholder="Ex: Compra de estoque, Uso em serviço, etc."
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsMovementDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Registrar Movimentação</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Histórico de Movimentações</DialogTitle>
            <DialogDescription>
              {selectedProductHistory &&
                `Produto: ${products.find(p => p.id === selectedProductHistory)?.name}`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {productHistory.length > 0 ? (
              productHistory.map(movement => (
                <Card key={movement.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          movement.type === 'IN'
                            ? 'bg-green-500/10'
                            : movement.type === 'OUT'
                              ? 'bg-red-500/10'
                              : 'bg-blue-500/10'
                        }`}
                      >
                        {movement.type === 'IN' ? (
                          <TrendingUp
                            className={`h-5 w-5 ${
                              movement.type === 'IN'
                                ? 'text-green-500'
                                : 'text-red-500'
                            }`}
                          />
                        ) : (
                          <TrendingDown
                            className={`h-5 w-5 ${
                              movement.type === 'OUT'
                                ? 'text-red-500'
                                : 'text-blue-500'
                            }`}
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {movementTypeLabels[movement.type]} -{' '}
                          {movement.quantity} unidades
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {movement.reason}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Por: {movement.userName} •{' '}
                          {format(
                            new Date(movement.date),
                            "dd/MM/yyyy 'às' HH:mm",
                            {
                              locale: ptBR
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nenhuma movimentação encontrada
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
