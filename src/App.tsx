import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { DiscoverTab } from './components/discover/DiscoverTab';
import { MessagesTab } from './components/messages/MessagesTab';
import { WalletTab } from './components/wallet/WalletTab';
import { SupportTab } from './components/support/SupportTab';
import { AccountTab } from './components/account/AccountTab';
import { CreatorStudio } from './components/creator/CreatorStudio';
import { AdminPanel } from './components/admin/AdminPanel';
import { AgeGateModal } from './components/common/AgeGateModal';
import { LegalModal } from './components/common/LegalModal';
import { CheckoutModal } from './components/common/CheckoutModal';
import { CallSimulatorModal } from './components/common/CallSimulatorModal';
import { ToastContainer } from './components/common/ToastContainer';

const MainContent: React.FC = () => {
  const { activeTab, viewMode, addToast } = useApp();

  // DRM & Anti-Screen Capture Protection listeners
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      // Prevent context menu (right click save image)
      e.preventDefault();
      addToast('info', 'DRM Protected', 'Right-click saving is disabled to protect creator copyright.');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Discourage PrintScreen or screenshot shortcuts
      if (e.key === 'PrintScreen' || (e.ctrlKey && e.key === 'p') || (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4'))) {
        addToast('warning', 'Content Protection', 'Digital DRM watermark is embedded with your user ID.');
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [addToast]);

  return (
    <div className="min-h-screen bg-[#080b11] text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Header */}
      <Header />

      {/* Main View Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 pt-4 pb-12">
        {viewMode === 'creator_studio' ? (
          <CreatorStudio />
        ) : viewMode === 'admin_panel' ? (
          <AdminPanel />
        ) : (
          <>
            {activeTab === 'discover' && <DiscoverTab />}
            {activeTab === 'messages' && <MessagesTab />}
            {activeTab === 'wallet' && <WalletTab />}
            {activeTab === 'support' && <SupportTab />}
            {activeTab === 'account' && <AccountTab />}
          </>
        )}
      </main>

      {/* Bottom 5-Tab Navigation (Visible in standard user/creator browsing mode) */}
      <BottomNav />

      {/* Global Modals & Overlays */}
      <AgeGateModal />
      <LegalModal />
      <CheckoutModal />
      <CallSimulatorModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
