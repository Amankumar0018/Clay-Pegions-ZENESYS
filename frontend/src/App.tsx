/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { ToastContainer } from './components/common/ToastContainer';
import { SearchModal } from './components/common/SearchModal';
import { ReviewRecommendationModal } from './components/common/ReviewRecommendationModal';
import { CreatePOModal } from './components/common/CreatePOModal';
import { OrderDetailDrawer } from './components/common/OrderDetailDrawer';
import { SupplierDetailDrawer } from './components/common/SupplierDetailDrawer';
import { ProductDetailDrawer } from './components/common/ProductDetailDrawer';

// Screens
import { CommandCenterScreen } from './screens/CommandCenterScreen';
import { DemandForecastScreen } from './screens/DemandForecastScreen';
import { InventoryScreen } from './screens/InventoryScreen';
import { ProcurementScreen } from './screens/ProcurementScreen';
import { OrdersScreen } from './screens/OrdersScreen';
import { FulfillmentScreen } from './screens/FulfillmentScreen';
import { SuppliersScreen } from './screens/SuppliersScreen';
import { AIAssistantScreen } from './screens/AIAssistantScreen';
import { AlertsScreen } from './screens/AlertsScreen';
import { SimulatorScreen } from './screens/SimulatorScreen';
import { ModelInsightsScreen } from './screens/ModelInsightsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { TasksScreen } from './screens/TasksScreen';
import { CalendarScreen } from './screens/CalendarScreen';
import { NotesScreen } from './screens/NotesScreen';
import { FilesScreen } from './screens/FilesScreen';
import { LandingPageScreen } from './screens/LandingPageScreen';
import { VoiceModal } from './components/common/VoiceModal';

const MainLayout: React.FC = () => {
  const {
    currentPage,
    isSearchOpen,
    setIsSearchOpen,
    activeRecommendationModal,
    setActiveRecommendationModal,
    activePOModalProduct,
    setActivePOModalProduct,
    activeOrderDetail,
    setActiveOrderDetail,
    activeSupplierDetail,
    setActiveSupplierDetail,
  } = useApp();

  // If on the immersive overview/landing page, render full width
  if (currentPage === 'landing') {
    return (
      <div id="miley-app-root" className="min-h-screen bg-[#FBF9F5] text-[#232220] flex flex-col antialiased">
        <LandingPageScreen />
        <VoiceModal />
        <ToastContainer />
      </div>
    );
  }

  const renderCurrentScreen = () => {
    switch (currentPage) {
      case 'command-center':
        return <CommandCenterScreen />;
      case 'tasks':
        return <TasksScreen />;
      case 'calendar':
        return <CalendarScreen />;
      case 'notes':
        return <NotesScreen />;
      case 'files':
        return <FilesScreen />;
      case 'demand-forecast':
        return <DemandForecastScreen />;
      case 'inventory':
        return <InventoryScreen />;
      case 'procurement':
        return <ProcurementScreen />;
      case 'orders':
        return <OrdersScreen />;
      case 'fulfillment':
        return <FulfillmentScreen />;
      case 'suppliers':
        return <SuppliersScreen />;
      case 'ai-assistant':
        return <AIAssistantScreen />;
      case 'alerts':
        return <AlertsScreen />;
      case 'simulator':
        return <SimulatorScreen />;
      case 'model-insights':
        return <ModelInsightsScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <CommandCenterScreen />;
    }
  };

  return (
    <div id="miley-app-root" className="min-h-screen bg-[#FBF9F5] text-[#232220] flex flex-col antialiased">
      {/* Top Bar Header */}
      <TopBar />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Primary Page Canvas */}
        <main
          id="main-content-canvas"
          className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full"
        >
          {renderCurrentScreen()}
        </main>
      </div>

      {/* Global Interactive Modals & Drawers */}
      <VoiceModal />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <ReviewRecommendationModal
        item={activeRecommendationModal}
        onClose={() => setActiveRecommendationModal(null)}
      />

      <CreatePOModal
        product={activePOModalProduct}
        onClose={() => setActivePOModalProduct(null)}
      />

      <OrderDetailDrawer
        order={activeOrderDetail}
        onClose={() => setActiveOrderDetail(null)}
      />

      <SupplierDetailDrawer
        supplier={activeSupplierDetail}
        onClose={() => setActiveSupplierDetail(null)}
      />

      <ProductDetailDrawer />

      {/* System Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
