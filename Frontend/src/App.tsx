import { useState } from 'react';
import { TabNavigation } from './components/TabNavigation';
import { GenealogyTab } from './components/GenealogyTab';
import { AIComparisonTab } from './components/AIComparisonTab';

export type TabType = 'genealogy' | 'ai-comparison';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('genealogy');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/80">
      <div className="relative">
        {/* Header Section */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/40 sticky top-0 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 lg:w-18 lg:h-18 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 lg:mb-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 ring-1 ring-slate-900/10">
                <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-9 lg:h-9 border-2 border-white rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-sm"></div>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-slate-900 mb-3 sm:mb-4 lg:mb-5 tracking-tight px-2">
                LLM RESPONSE GENERATION & RATING
              </h1>
              <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-slate-400 to-slate-600 rounded-full mx-auto mb-3 sm:mb-4 lg:mb-5"></div>
              <p className="text-slate-600 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed font-medium px-4">
                Genealogy assessment and biography research & rating
              </p>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white/60 backdrop-blur-xl border-b border-slate-200/30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="transition-all duration-500 ease-in-out">
            {activeTab === 'genealogy' && <GenealogyTab />}
            {activeTab === 'ai-comparison' && <AIComparisonTab />}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white/40 backdrop-blur-lg border-t border-slate-200/30 mt-8 sm:mt-12 lg:mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="text-center text-slate-500 text-sm">
              <p></p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;