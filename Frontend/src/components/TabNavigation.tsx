import React from 'react';
import { TabType } from '../App';
import { Users, Brain } from 'lucide-react';

interface TabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const tabs = [
    {
      id: 'genealogy' as TabType,
      label: 'Genealogy Assessment',
      description: 'Family research and supervision evaluation',
      icon: Users,
    },
    {
      id: 'ai-comparison' as TabType,
      label: 'Biography Assessment',
      description: 'AI model performance on research profiles',
      icon: Brain,
    },
  ];

  return (
    <div className="flex justify-center">
      <div className="inline-flex bg-white/70 backdrop-blur-xl border border-slate-200/50 rounded-3xl p-2 shadow-xl ring-1 ring-slate-900/5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center px-10 py-6 rounded-2xl font-medium transition-all duration-500 group min-w-[220px] ${
                isActive
                  ? 'bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-xl transform scale-[1.03] ring-1 ring-slate-900/20'
                  : 'text-slate-700 hover:bg-white/90 hover:shadow-lg hover:scale-[1.02] hover:ring-1 hover:ring-slate-900/10'
              }`}
            >
              <div className="flex items-center w-full">
                <div className={`mr-5 transition-all duration-500 ${
                  isActive 
                    ? 'text-white bg-white/20 p-3 rounded-xl shadow-sm' 
                    : 'text-slate-600 group-hover:text-slate-800 group-hover:bg-slate-100/90 p-3 rounded-xl transition-all duration-500'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-left flex-1">
                  <div className={`text-lg font-bold leading-tight transition-colors duration-500 ${
                    isActive ? 'text-white' : 'text-slate-800 group-hover:text-slate-900'
                  }`}>
                    {tab.label}
                  </div>
                  <div className={`text-sm mt-1.5 transition-colors duration-500 ${
                    isActive ? 'text-slate-300' : 'text-slate-500 group-hover:text-slate-600'
                  }`}>
                    {tab.description}
                  </div>
                </div>
              </div>
              
              {/* Enhanced glow for active tab */}
              {isActive && (
                <>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-slate-800/30 to-slate-900/30 blur-xl -z-20"></div>
                  <div className="absolute inset-0 rounded-2xl bg-slate-800/10 blur-sm -z-10"></div>
                </>
              )}
              
              {/* Subtle hover glow for inactive tabs */}
              {!isActive && (
                <div className="absolute inset-0 rounded-2xl bg-slate-500/0 group-hover:bg-slate-500/5 transition-all duration-500 -z-10"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};