import {
  ApiResponse,
  ApiErrorResponse,
  UserProfile,
  AuthSession,
  ConversationThread,
  BackendTask,
  BackendNote,
  BackendFile,
  BackendCalendarEvent,
  BackendNotification,
} from './api';

export * from './api';

export type PageId =
  | 'landing'
  | 'command-center'
  | 'ai-assistant'
  | 'tasks'
  | 'calendar'
  | 'notes'
  | 'files'
  | 'demand-forecast'
  | 'inventory'
  | 'procurement'
  | 'simulator'
  | 'orders'
  | 'fulfillment'
  | 'suppliers'
  | 'alerts'
  | 'model-insights'
  | 'settings';

export type WarehouseLocation = 'All' | 'Pune' | 'Mumbai' | 'Delhi';

export type RiskLevel = 'Critical' | 'High' | 'Watch' | 'Healthy' | 'Overstock';

export type OrderStatus = 'Created' | 'Processing' | 'Shipped' | 'In Transit' | 'Delivered' | 'Delayed';

export interface ProductInventory {
  id: string;
  name: string;
  category: string;
  sku: string;
  warehouse: 'Pune' | 'Mumbai' | 'Delhi';
  currentStock: number;
  forecastDemand: number;
  safetyStock: number;
  daysCover: number;
  reorderPoint: number;
  unitCost: number;
  sellingPrice: number;
  risk: RiskLevel;
  supplierLeadTimeDays: number;
  primarySupplier: string;
  recommendedPurchaseQty: number;
  recommendedPurchaseDate: string;
  trend: number; // percentage change
}

export interface SupplierItem {
  id: string;
  code: string;
  name: string;
  productFocus: string;
  unitPrice: number;
  leadTimeDays: number;
  reliabilityRate: number; // 94%
  orderAccuracyRate: number; // 96%
  onTimeDeliveryRate: number; // 93%
  status: 'Recommended' | 'Alternative' | 'High reliability' | 'Standard';
  explanation: string;
  activeOrdersCount: number;
  contactEmail: string;
  location: string;
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  productName: string;
  supplierName: string;
  warehouse: 'Pune' | 'Mumbai' | 'Delhi';
  quantity: number;
  totalValue: number;
  createdDate: string;
  expectedDelivery: string;
  status: OrderStatus;
  risk: 'Low' | 'Medium' | 'High';
  carrier: string;
  trackingNumber: string;
  lifecycle: {
    created: boolean;
    processing: boolean;
    shipped: boolean;
    inTransit: boolean;
    delivered: boolean;
  };
  delayReason?: string;
  mitigationSuggestion?: string;
}

export interface DecisionQueueItem {
  id: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  decision: string;
  productName: string;
  evidence: string;
  expectedImpact: string;
  confidence: number;
  status: 'Pending review' | 'Approved' | 'Snoozed' | 'In execution';
  recommendedAction: string;
}

export interface AttentionItem {
  id: string;
  number: string;
  productName: string;
  category: string;
  issue: string;
  currentInventory: number;
  forecastDemand: number;
  recommendedQty: number;
  recommendedAction: string;
  revenueProtected: number;
  urgencyDays?: number;
  delayDays?: number;
  affectedOrdersCount?: number;
  demandChangePct?: number;
  excessUnits?: number;
  isHero?: boolean;
}

export interface AlertItem {
  id: string;
  time: string;
  timestamp: string;
  category: 'Inventory' | 'Demand' | 'Supplier' | 'Fulfillment';
  severity: 'Critical' | 'Warning' | 'Info';
  title: string;
  productOrEntity: string;
  description: string;
  isRead: boolean;
  actionLabel?: string;
  targetPage?: PageId;
}

export interface SimulationParameters {
  demandChangePct: number; // e.g. +30
  supplierLeadTimeDeltaDays: number; // e.g. +5
  warehouseCapacityPct: number; // e.g. 80
  logisticsDelayDays: number; // e.g. +2
  supplierAvailabilityPct: number; // e.g. 85
  presetName: string;
}

export interface SimulationResult {
  current: {
    stockoutRiskPct: number;
    ordersAtRisk: number;
    revenueExposureInr: number;
  };
  simulated: {
    stockoutRiskPct: number;
    ordersAtRisk: number;
    revenueExposureInr: number;
  };
  recommendedResponse: {
    transfers: string[];
    supplierSwitches: string[];
    priorityOrders: string[];
    potentialLossAvoidedInr: number;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  content: string;
  dataSources?: string[];
  suggestedActions?: {
    label: string;
    actionType: 'NAVIGATE' | 'OPEN_PO' | 'SIMULATE' | 'APPROVE_DECISION';
    payload?: any;
  }[];
  structuredData?: {
    type: 'METRIC_CARD' | 'TABLE' | 'RECOMMENDATION';
    title?: string;
    details?: Record<string, any>;
  };
}

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export type TimePeriod = 'Today' | '7 days' | '30 days' | '90 days';

export interface PerformanceDataPoint {
  date: string;
  revenue: number;
  orders: number;
  aov: number;
}

export interface DemandVsForecastPoint {
  date: string;
  actualDemand: number | null;
  forecastDemand: number | null;
  lowerConfidence: number | null;
  upperConfidence: number | null;
}

export interface InventoryDistributionItem {
  status: string;
  percentage: number;
  units: number;
  skusCount: number;
  color: string;
}

export interface TopProductPerformance {
  id: string;
  name: string;
  sku: string;
  category: string;
  revenue: number;
  unitsSold: number;
  growthPct: number;
}

export interface SupplierPerformanceScorecard {
  id: string;
  name: string;
  code: string;
  onTimeRate: number;
  leadTimeReliability: number;
  qualityScore: number;
  riskLevel: 'Low' | 'Medium' | 'Elevated';
  activeOrders: number;
}

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  category: 'Operations' | 'Strategy' | 'Fulfillment' | 'Personal' | 'Procurement' | 'Logistics' | string;
  dueDate: string;
  completed: boolean;
  assignee?: string;
  suggestedByMiley?: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  date: string;
  duration: string;
  category: 'Meeting' | 'Review' | 'Deadline' | 'Milestone' | 'Logistics' | 'Strategy' | string;
  attendees: string[];
  location?: string;
  description?: string;
}

export interface NoteItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  updatedAt: string;
  tags: string[];
  isPinned?: boolean;
}

export interface FileDocument {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  status: 'Ready' | 'Processing' | 'Analyzed';
  summary: string;
  keyInsights: string[];
  extractedMetrics?: Record<string, string>;
}

export interface AssistantPersona {
  tone: 'warm' | 'calm' | 'concise' | 'analytical' | 'proactive';
  voiceSpeed?: number;
  voiceStyle?: 'warm-natural' | 'bright' | 'crisp' | string;
  autoSpeech?: boolean;
  proactiveSuggestions?: boolean;
}
