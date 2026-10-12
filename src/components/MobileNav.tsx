import React from 'react';
import { ActiveNavTab } from '../types';
import {
  LayoutDashboard,
  Layers,
  Calculator,
  Search,
  FilePlus,
} from 'lucide-react';

interface MobileNavProps {
  currentTab: ActiveNavTab;
  onNavigate: (tab: ActiveNavTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onNavigate }) => {
  const navItems: { tab: ActiveNavTab; label: string; icon: React.ReactNode; isAction?: boolean }[] = [
    {
      tab: 'dashboard',
      label: 'پیشخوان',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      tab: 'loans',
      label: 'تسهیلات',
      icon: <Layers className="w-5 h-5" />,
    },
    {
      tab: 'new_application',
      label: 'درخواست',
      icon: <FilePlus className="w-5 h-5" />,
      isAction: true,
    },
    {
      tab: 'calculator',
      label: 'محاسبه قسط',
      icon: <Calculator className="w-5 h-5" />,
    },
    {
      tab: 'tracking',
      label: 'پیگیری',
      icon: <Search className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] shadow-lg px-2 py-1.5 flex items-center justify-around">
      {navItems.map((item) => {
        const isActive = currentTab === item.tab;

        if (item.isAction) {
          return (
            <button
              key={item.tab}
              onClick={() => onNavigate(item.tab)}
              className="flex flex-col items-center justify-center -mt-5"
            >
              <div className="w-12 h-12 rounded-full bg-[#0C1E30] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform border-2 border-white">
                {item.icon}
              </div>
              <span className="text-[10px] font-bold text-[#0C1E30] mt-0.5">{item.label}</span>
            </button>
          );
        }

        return (
          <button
            key={item.tab}
            onClick={() => onNavigate(item.tab)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors min-w-[56px] ${
              isActive ? 'text-[#0E7490] font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`${isActive ? 'scale-110' : ''} transition-transform`}>{item.icon}</div>
            <span className="text-[10px] mt-1">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
