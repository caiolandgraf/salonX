export type UserRole = 
  | 'ADMIN' 
  | 'MANAGER' 
  | 'EMPLOYEE'
  | 'PROFESSIONAL' 
  | 'RECEPTIONIST' 
  | 'CASHIER';

export type Permission = 
  | 'ALL'
  | 'READ'
  | 'WRITE'
  | 'UPDATE'
  | 'DELETE'
  | 'VIEW_DASHBOARD'
  | 'MANAGE_USERS'
  | 'MANAGE_APPOINTMENTS'
  | 'MANAGE_CLIENTS'
  | 'MANAGE_PROFESSIONALS'
  | 'MANAGE_FINANCES'
  | 'MANAGE_STOCK'
  | 'MANAGE_POS'
  | 'VIEW_REPORTS'
  | 'MANAGE_SETTINGS'
  | 'MANAGE_MARKETING';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Only used in API, never sent to frontend
  role: UserRole;
  avatar?: string;
  status: 'ACTIVE' | 'INACTIVE';
  permissions: Permission[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface DashboardMetrics {
  todayRevenue: number;
  todayAppointments: number;
  activeClients: number;
  monthRevenue: number;
  revenueGrowth: number;
  appointmentsGrowth: number;
  clientsGrowth: number;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  professionalId: string;
  professionalName: string;
  serviceId: string;
  serviceName: string;
  date: string | Date;
  time: string;
  duration: number;
  price: number;
  status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt: Date;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthdate?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  notes?: string;
  active?: boolean;
  createdAt: Date;
  lastVisit?: string | Date;
  totalVisits: number;
  totalSpent: number;
  // CRM fields
  segment?: 'VIP' | 'REGULAR' | 'NEW' | 'INACTIVE';
  tags?: string[];
  source?: string; // Como conheceu o salão
  lifetimeValue?: number;
  averageTicket?: number;
  lastContactDate?: string;
  nextFollowUp?: string;
  assignedTo?: string; // User ID
}

export interface ClientNote {
  id: string;
  clientId: string;
  userId: string;
  userName: string;
  content: string;
  type: 'NOTE' | 'CALL' | 'EMAIL' | 'MEETING' | 'FOLLOW_UP';
  createdAt: Date;
}

export interface ClientTag {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
}

export interface ClientInteraction {
  id: string;
  clientId: string;
  type: 'APPOINTMENT' | 'PURCHASE' | 'CALL' | 'EMAIL' | 'VISIT';
  description: string;
  amount?: number;
  date: string;
  createdAt: Date;
}

export interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  commission: number;
  workSchedule: Record<string, { start: string; end: string }>;
  status: 'ACTIVE' | 'INACTIVE';
  avatar?: string;
  totalServices: number;
  totalRevenue: number;
  createdAt: Date;
}

export interface WorkSchedule {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number; // in minutes
  price: number;
  category: string;
  active: boolean;
}

export interface Product {
  id: string;
  name: string;
  type: 'SERVICE' | 'RESALE';
  category: string;
  brand: string;
  sku: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  costPrice: number;
  salePrice?: number;
  supplier?: string;
  location?: string;
  notes?: string;
  createdAt: Date;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  date: string;
  reason: string;
  userId: string;
  userName: string;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  description: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  paymentMethod?: string;
  dueDate?: string;
  paidDate?: string;
  clientName?: string;
  professionalName?: string;
  notes?: string;
  createdAt: Date;
}
