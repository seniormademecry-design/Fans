import React from 'react';
import { useApp } from '../../context/AppContext';
import { Compass, MessageSquare, Wallet, HelpCircle, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, viewMode, setViewMode, conversations } = useApp();

  const unreadMessagesCount = conversations.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0);

  interface TabItem {
    id: 'discover' | 'messages' | 'wallet' | 'support' | 'account';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }

  const tabs: TabItem[] = [
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: unreadMessagesCount },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'support', label: 'Support', icon: HelpCircle },
    { id: 'account', label: 'Account', icon: User },
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#090d14]/95 backdrop-blur-lg border-t border-white/10 pb-safe"
    >
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id && viewMode === 'main';

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => {
                setViewMode('main');
                setActiveTab(tab.id);
              }}
              className={`flex flex-col items-center justify-center py-1 px-3 relative transition-all rounded-lg group ${
                isActive ? 'text-amber-400' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1 -right-2 bg-rose-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-[#090d14]">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-1 font-medium tracking-tight ${isActive ? 'text-amber-400 font-semibold' : 'text-zinc-400'}`}>
                {tab.label}
              </span>

              {isActive && (
                <span className="absolute bottom-0 w-6 h-0.5 bg-gradient-to-r from-amber-400 to-rose-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
