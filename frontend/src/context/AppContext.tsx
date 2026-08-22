import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  PageId,
  WarehouseLocation,
  ProductInventory,
  SupplierItem,
  OrderItem,
  DecisionQueueItem,
  AttentionItem,
  AlertItem,
  ToastMessage,
  SimulationParameters,
  SimulationResult,
  TimePeriod,
  TaskItem,
  CalendarEvent,
  NoteItem,
  FileDocument,
  AssistantPersona,
} from '../types';
import {
  APP_CONFIG,
  INITIAL_PRODUCTS,
  SUPPLIERS,
  ORDERS,
  DECISION_QUEUE,
  ATTENTION_ITEMS,
  ALERTS_DATA,
  INITIAL_TASKS,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_NOTES,
  INITIAL_FILES,
} from '../data/mockData';

interface AppContextType {
  appName: string;
  setAppName: (name: string) => void;
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  selectedWarehouse: WarehouseLocation;
  setSelectedWarehouse: (wh: WarehouseLocation) => void;
  selectedPeriod: TimePeriod;
  setSelectedPeriod: (period: TimePeriod) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  simulateProductRisk: (productName: string, demandSpikePct?: number) => void;
  
  // Data State
  products: ProductInventory[];
  suppliers: SupplierItem[];
  orders: OrderItem[];
  decisionQueue: DecisionQueueItem[];
  attentionItems: AttentionItem[];
  alerts: AlertItem[];
  unreadAlertsCount: number;

  // Productivity & Miley Features
  tasks: TaskItem[];
  addTask: (title: string, priority: TaskItem['priority'], category: TaskItem['category'], dueDate: string, description?: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  editTask: (id: string, updates: Partial<TaskItem>) => void;
  mileyOrganizeTasks: () => void;

  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;

  notes: NoteItem[];
  addNote: (title: string, content: string, category: string, tags: string[]) => void;
  editNote: (id: string, updates: Partial<NoteItem>) => void;
  deleteNote: (id: string) => void;

  files: FileDocument[];
  addFile: (file: FileDocument) => void;
  deleteFile: (id: string) => void;

  // Voice Interaction
  isVoiceModeOpen: boolean;
  setIsVoiceModeOpen: (open: boolean) => void;
  voiceState: 'idle' | 'listening' | 'processing' | 'speaking';
  setVoiceState: (state: 'idle' | 'listening' | 'processing' | 'speaking') => void;
  voiceTranscript: string;
  setVoiceTranscript: (text: string) => void;

  // Assistant Persona
  assistantPersona: AssistantPersona;
  setAssistantPersona: React.Dispatch<React.SetStateAction<AssistantPersona>>;

  // Search & Navigation
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Modals & Panels
  activeProductDetail: ProductInventory | null;
  setActiveProductDetail: (prod: ProductInventory | null) => void;
  activePOModalProduct: ProductInventory | null;
  setActivePOModalProduct: (prod: ProductInventory | null) => void;
  activeOrderDetail: OrderItem | null;
  setActiveOrderDetail: (order: OrderItem | null) => void;
  activeSupplierDetail: SupplierItem | null;
  setActiveSupplierDetail: (supplier: SupplierItem | null) => void;
  activeRecommendationModal: AttentionItem | null;
  setActiveRecommendationModal: (item: AttentionItem | null) => void;

  // Actions
  approveDecision: (id: string) => void;
  snoozeDecision: (id: string) => void;
  createPurchaseOrder: (productName: string, supplierCode: string, quantity: number, targetWarehouse: 'Pune' | 'Mumbai' | 'Delhi') => void;
  markAlertRead: (id: string) => void;
  markAllAlertsRead: () => void;
  expediteOrder: (orderId: string) => void;
  rerouteOrder: (orderId: string, newSupplierName: string) => void;

  // Toast
  toasts: ToastMessage[];
  addToast: (title: string, description: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  // Simulation
  simParams: SimulationParameters;
  setSimParams: React.Dispatch<React.SetStateAction<SimulationParameters>>;
  simResult: SimulationResult;
  applyPreset: (presetName: string) => void;
  executeMitigation: () => void;

  // Global Metrics
  executiveMetrics: {
    revenueAtRisk: string;
    revenueAtRiskSub: string;
    stockoutRisks: number;
    stockoutRisksSub: string;
    ordersAtRisk: number;
    ordersAtRiskSub: string;
    inventoryHealth: string;
    inventoryHealthSub: string;
    forecastAccuracy: string;
    forecastAccuracySub: string;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appName, setAppName] = useState<string>(APP_CONFIG.name);
  const [currentPage, setCurrentPage] = useState<PageId>('command-center');
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseLocation>('All');
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('30 days');
  const [selectedCategory, setSelectedCategory] = useState<string>('All categories');
  
  const [products, setProducts] = useState<ProductInventory[]>(INITIAL_PRODUCTS);
  const [suppliers] = useState<SupplierItem[]>(SUPPLIERS);
  const [orders, setOrders] = useState<OrderItem[]>(ORDERS);
  const [decisionQueue, setDecisionQueue] = useState<DecisionQueueItem[]>(DECISION_QUEUE);
  const [attentionItems, setAttentionItems] = useState<AttentionItem[]>(ATTENTION_ITEMS);
  const [alerts, setAlerts] = useState<AlertItem[]>(ALERTS_DATA);

  // New Miley Assistant collections
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [notes, setNotes] = useState<NoteItem[]>(INITIAL_NOTES);
  const [files, setFiles] = useState<FileDocument[]>(INITIAL_FILES);

  // Voice Interaction State
  const [isVoiceModeOpen, setIsVoiceModeOpen] = useState(false);
  const [voiceState, setVoiceState] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const [voiceTranscript, setVoiceTranscript] = useState('');

  // Persona State
  const [assistantPersona, setAssistantPersona] = useState<AssistantPersona>({
    tone: 'calm',
    voiceSpeed: 1.0,
    autoSpeech: false,
    proactiveSuggestions: true,
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [activeProductDetail, setActiveProductDetail] = useState<ProductInventory | null>(null);
  const [activePOModalProduct, setActivePOModalProduct] = useState<ProductInventory | null>(null);
  const [activeOrderDetail, setActiveOrderDetail] = useState<OrderItem | null>(null);
  const [activeSupplierDetail, setActiveSupplierDetail] = useState<SupplierItem | null>(null);
  const [activeRecommendationModal, setActiveRecommendationModal] = useState<AttentionItem | null>(null);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Simulation state
  const [simParams, setSimParams] = useState<SimulationParameters>({
    demandChangePct: 30,
    supplierLeadTimeDeltaDays: 5,
    warehouseCapacityPct: 80,
    logisticsDelayDays: 2,
    supplierAvailabilityPct: 85,
    presetName: 'Demand Spike',
  });

  const simulateProductRisk = (productName: string, demandSpikePct = 30) => {
    setSimParams({
      demandChangePct: demandSpikePct,
      supplierLeadTimeDeltaDays: 4,
      warehouseCapacityPct: 85,
      logisticsDelayDays: 2,
      supplierAvailabilityPct: 88,
      presetName: `${productName} Risk Assessment`,
    });
    setCurrentPage('simulator');
    addToast('Simulation Loaded', `What-If parameters calibrated for ${productName} (${demandSpikePct > 0 ? '+' : ''}${demandSpikePct}% demand).`, 'info');
  };

  const addToast = (title: string, description: string, type: ToastMessage['type'] = 'success') => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const unreadAlertsCount = useMemo(() => {
    return alerts.filter((a) => !a.isRead).length;
  }, [alerts]);

  // Task Actions
  const addTask = (title: string, priority: TaskItem['priority'], category: TaskItem['category'], dueDate: string, description = '') => {
    const newTask: TaskItem = {
      id: 'task-' + Date.now(),
      title,
      description,
      priority,
      category,
      dueDate,
      completed: false,
      assignee: 'Laxmi Patil',
    };
    setTasks((prev) => [newTask, ...prev]);
    addToast('Task Created', `"${title}" added to your priority list.`, 'success');
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const next = !t.completed;
          if (next) {
            addToast('Task Completed', `Completed "${t.title}".`, 'success');
          }
          return { ...t, completed: next };
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    addToast('Task Removed', 'Task deleted from your board.', 'info');
  };

  const editTask = (id: string, updates: Partial<TaskItem>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const mileyOrganizeTasks = () => {
    setTasks((prev) => {
      // Sort by urgency priority
      const priorityWeights: Record<TaskItem['priority'], number> = {
        Urgent: 4,
        High: 3,
        Medium: 2,
        Low: 1,
      };
      return [...prev].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return priorityWeights[b.priority] - priorityWeights[a.priority];
      });
    });
    addToast(
      'Miley Optimized Your Schedule',
      'Tasks prioritized by operational urgency, supplier lead times, and due dates.',
      'success'
    );
  };

  // Calendar Actions
  const addCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: 'cal-' + Date.now(),
    };
    setCalendarEvents((prev) => [...prev, newEvent]);
    addToast('Event Scheduled', `"${event.title}" scheduled for ${event.date}.`, 'success');
  };

  // Note Actions
  const addNote = (title: string, content: string, category: string, tags: string[]) => {
    const newNote: NoteItem = {
      id: 'note-' + Date.now(),
      title,
      excerpt: content.slice(0, 90) + '...',
      content,
      category,
      updatedAt: 'Just now',
      tags,
      isPinned: false,
    };
    setNotes((prev) => [newNote, ...prev]);
    addToast('Note Saved', `"${title}" created in knowledge base.`, 'success');
  };

  const editNote = (id: string, updates: Partial<NoteItem>) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updates, updatedAt: 'Just now' } : n)));
    addToast('Note Updated', 'Changes saved successfully.', 'success');
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    addToast('Note Deleted', 'Note removed from knowledge base.', 'info');
  };

  // File Actions
  const addFile = (file: FileDocument) => {
    setFiles((prev) => [file, ...prev]);
    addToast('Document Ingested', `Miley analyzed "${file.name}" with key insights extracted.`, 'success');
  };

  const deleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    addToast('Document Removed', 'File deleted from workspace.', 'info');
  };

  const approveDecision = (id: string) => {
    setDecisionQueue((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'Approved' } : item
      )
    );
    const item = decisionQueue.find((d) => d.id === id);
    addToast(
      'Decision Approved',
      `"${item?.decision || 'Action'}" approved and queued for dispatch.`,
      'success'
    );
  };

  const snoozeDecision = (id: string) => {
    setDecisionQueue((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'Snoozed' } : item
      )
    );
    addToast('Decision Snoozed', 'Action postponed for 24 hours.', 'info');
  };

  const createPurchaseOrder = (
    productName: string,
    supplierCode: string,
    quantity: number,
    targetWarehouse: 'Pune' | 'Mumbai' | 'Delhi'
  ) => {
    const newOrderId = `ord-${Math.floor(10500 + Math.random() * 900)}`;
    const orderNum = `#${newOrderId.replace('ord-', '')}`;
    const targetProduct = products.find((p) => p.name.toLowerCase() === productName.toLowerCase());
    const unitCost = targetProduct?.unitCost || 1200;

    const newOrder: OrderItem = {
      id: newOrderId,
      orderNumber: orderNum,
      productName,
      supplierName: supplierCode,
      warehouse: targetWarehouse,
      quantity,
      totalValue: quantity * unitCost,
      createdDate: 'Aug 22, 2026',
      expectedDelivery: 'Aug 28, 2026',
      status: 'Created',
      risk: 'Low',
      carrier: 'BlueDart Priority Logistics',
      trackingNumber: `BD-${Math.floor(100000 + Math.random() * 900000)}-IN`,
      lifecycle: {
        created: true,
        processing: false,
        shipped: false,
        inTransit: false,
        delivered: false,
      },
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Update product stock calculation simulation
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.name.toLowerCase() === productName.toLowerCase()) {
          return {
            ...prod,
            risk: prod.risk === 'Critical' ? 'Watch' : prod.risk,
            daysCover: Number((prod.daysCover + (quantity / (prod.forecastDemand / 30))).toFixed(1)),
          };
        }
        return prod;
      })
    );

    // Mark corresponding attention item or decision item as addressed
    setAttentionItems((prev) =>
      prev.filter((att) => !att.productName.toLowerCase().includes(productName.toLowerCase().slice(0, 8)))
    );

    addToast(
      'Purchase Order Created',
      `PO ${orderNum} for ${quantity.toLocaleString()} units of ${productName} dispatched to ${supplierCode}.`,
      'success'
    );
  };

  const markAlertRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isRead: true } : a))
    );
  };

  const markAllAlertsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
    addToast('Alerts Cleared', 'All operational alerts marked as acknowledged.', 'info');
  };

  const expediteOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: ord.status === 'Delayed' ? 'In Transit' : ord.status,
            risk: 'Low',
            delayReason: 'Expedited via Air Express. Arrival on schedule.',
          };
        }
        return ord;
      })
    );
    addToast('Shipment Expedited', `Order ${orderId} assigned priority air freight routing.`, 'success');
  };

  const rerouteOrder = (orderId: string, newSupplierName: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            supplierName: newSupplierName,
            status: 'Processing',
            risk: 'Low',
            delayReason: `Rerouted to ${newSupplierName} reserve allocation.`,
          };
        }
        return ord;
      })
    );
    addToast('Supplier Rerouted', `Order ${orderId} successfully transferred to ${newSupplierName}.`, 'success');
  };

  // Preset applications
  const applyPreset = (presetName: string) => {
    switch (presetName) {
      case 'Demand Spike':
        setSimParams({
          demandChangePct: 30,
          supplierLeadTimeDeltaDays: 2,
          warehouseCapacityPct: 88,
          logisticsDelayDays: 1,
          supplierAvailabilityPct: 90,
          presetName: 'Demand Spike',
        });
        break;
      case 'Supplier Delay':
        setSimParams({
          demandChangePct: 5,
          supplierLeadTimeDeltaDays: 6,
          warehouseCapacityPct: 80,
          logisticsDelayDays: 3,
          supplierAvailabilityPct: 75,
          presetName: 'Supplier Delay',
        });
        break;
      case 'Peak Season':
        setSimParams({
          demandChangePct: 50,
          supplierLeadTimeDeltaDays: 5,
          warehouseCapacityPct: 95,
          logisticsDelayDays: 4,
          supplierAvailabilityPct: 80,
          presetName: 'Peak Season',
        });
        break;
      case 'Warehouse Disruption':
        setSimParams({
          demandChangePct: 10,
          supplierLeadTimeDeltaDays: 4,
          warehouseCapacityPct: 55,
          logisticsDelayDays: 5,
          supplierAvailabilityPct: 82,
          presetName: 'Warehouse Disruption',
        });
        break;
      case 'Normal':
      default:
        setSimParams({
          demandChangePct: 0,
          supplierLeadTimeDeltaDays: 0,
          warehouseCapacityPct: 75,
          logisticsDelayDays: 0,
          supplierAvailabilityPct: 98,
          presetName: 'Normal',
        });
        break;
    }
  };

  // Dynamic simulation calculations
  const simResult: SimulationResult = useMemo(() => {
    const baseDemandFactor = 1 + simParams.demandChangePct / 100;
    const leadTimePenalty = simParams.supplierLeadTimeDeltaDays * 4.5;
    const delayPenalty = simParams.logisticsDelayDays * 3.5;
    const availabilityPenalty = (100 - simParams.supplierAvailabilityPct) * 0.8;

    const simulatedRiskPct = Math.min(
      96,
      Math.max(12, Math.round(12 * baseDemandFactor + leadTimePenalty + delayPenalty + availabilityPenalty))
    );

    const simulatedOrdersAtRisk = Math.min(
      140,
      Math.max(8, Math.round(8 * baseDemandFactor + simParams.supplierLeadTimeDeltaDays * 5 + simParams.logisticsDelayDays * 4))
    );

    const simulatedRevenueExposure = Math.round(
      18400 * baseDemandFactor + simulatedOrdersAtRisk * 2500 + (simParams.demandChangePct > 20 ? 65000 : 0)
    );

    const lossAvoided = Math.round(simulatedRevenueExposure * 0.88);

    return {
      current: {
        stockoutRiskPct: 12,
        ordersAtRisk: 8,
        revenueExposureInr: 18400,
      },
      simulated: {
        stockoutRiskPct: simulatedRiskPct,
        ordersAtRisk: simulatedOrdersAtRisk,
        revenueExposureInr: simulatedRevenueExposure,
      },
      recommendedResponse: {
        transfers: [
          'Transfer 400 units Mumbai → Pune',
          'Release 250 units reserve buffer in Delhi',
        ],
        supplierSwitches: [
          'Switch 120 units Smart Watch Series 4 allocation to Supplier C',
          'Split Wireless Earbuds secondary lot with Supplier B',
        ],
        priorityOrders: [
          'Prioritize 18 high-margin enterprise B2B shipments',
          'Upgrade 34 at-risk parcels to Dedicated Air Express',
        ],
        potentialLossAvoidedInr: lossAvoided || 186000,
      },
    };
  }, [simParams]);

  const executeMitigation = () => {
    addToast(
      'Mitigation Strategy Executed',
      `Inter-warehouse transfers queued and ₹${(simResult.recommendedResponse.potentialLossAvoidedInr / 100000).toFixed(2)}L potential loss mitigated.`,
      'success'
    );
  };

  const executiveMetrics = {
    revenueAtRisk: '₹2.37L',
    revenueAtRiskSub: '↑ 18% this week',
    stockoutRisks: 4,
    stockoutRisksSub: '2 critical',
    ordersAtRisk: 83,
    ordersAtRiskSub: '12 delayed',
    inventoryHealth: '87.8%',
    inventoryHealthSub: 'Across 3 warehouses',
    forecastAccuracy: '91.4%',
    forecastAccuracySub: 'Current model',
  };

  return (
    <AppContext.Provider
      value={{
        appName,
        setAppName,
        currentPage,
        setCurrentPage,
        selectedWarehouse,
        setSelectedWarehouse,
        selectedPeriod,
        setSelectedPeriod,
        selectedCategory,
        setSelectedCategory,
        simulateProductRisk,
        products,
        suppliers,
        orders,
        decisionQueue,
        attentionItems,
        alerts,
        unreadAlertsCount,
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        editTask,
        mileyOrganizeTasks,
        calendarEvents,
        addCalendarEvent,
        notes,
        addNote,
        editNote,
        deleteNote,
        files,
        addFile,
        deleteFile,
        isVoiceModeOpen,
        setIsVoiceModeOpen,
        voiceState,
        setVoiceState,
        voiceTranscript,
        setVoiceTranscript,
        assistantPersona,
        setAssistantPersona,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        activeProductDetail,
        setActiveProductDetail,
        activePOModalProduct,
        setActivePOModalProduct,
        activeOrderDetail,
        setActiveOrderDetail,
        activeSupplierDetail,
        setActiveSupplierDetail,
        activeRecommendationModal,
        setActiveRecommendationModal,
        approveDecision,
        snoozeDecision,
        createPurchaseOrder,
        markAlertRead,
        markAllAlertsRead,
        expediteOrder,
        rerouteOrder,
        toasts,
        addToast,
        removeToast,
        simParams,
        setSimParams,
        simResult,
        applyPreset,
        executeMitigation,
        executiveMetrics,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

