import { useState, useEffect } from 'react';
import { Truck, Plus, BarChart3, FileText, Menu, X } from 'lucide-react';
import type { LogisticsEntry } from './types';
import { loadEntries } from './utils/storage';
import { EntryForm } from './components/EntryForm';
import { EntriesTable } from './components/EntriesTable';
import { Dashboard } from './components/Dashboard';
import { BillGenerator } from './components/BillGenerator';

type ActiveTab = 'dashboard' | 'entries' | 'add-entry' | 'billing';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [entries, setEntries] = useState<LogisticsEntry[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadedEntries = loadEntries();
    setEntries(loadedEntries);
  }, []);

  const handleEntryAdded = (entry: LogisticsEntry) => {
    setEntries(prev => [...prev, entry]);
    setActiveTab('entries');
  };

  const handleEntriesChange = () => {
    const updatedEntries = loadEntries();
    setEntries(updatedEntries);
  };

  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: BarChart3, color: 'from-purple-500 to-pink-500' },
    { id: 'entries' as ActiveTab, label: 'View Entries', icon: Truck, color: 'from-blue-500 to-cyan-500' },
    { id: 'add-entry' as ActiveTab, label: 'Add Entry', icon: Plus, color: 'from-green-500 to-emerald-500' },
    { id: 'billing' as ActiveTab, label: 'Generate Bill', icon: FileText, color: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h1 className="ml-4 text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Aryan Enterprises
              </h1>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Desktop navigation */}
            <nav className="hidden md:flex space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`group relative flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                      activeTab === item.id
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-${item.color.split('-')[1]}-500/25`
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                    {activeTab === item.id && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-50"></div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700/50 bg-gray-800/80 backdrop-blur-xl">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-3 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                      activeTab === item.id
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fadeIn">
          {activeTab === 'dashboard' && <Dashboard entries={entries} />}
          {activeTab === 'entries' && (
            <EntriesTable entries={entries} onEntriesChange={handleEntriesChange} />
          )}
          {activeTab === 'add-entry' && <EntryForm onEntryAdded={handleEntryAdded} />}
          {activeTab === 'billing' && <BillGenerator entries={entries} />}
        </div>
      </main>
    </div>
  );
}

export default App;