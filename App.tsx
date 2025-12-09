import React, { useState, useCallback } from 'react';
import { Menu, Search, Settings, HelpCircle, Grip, ChevronLeft, ChevronRight, RefreshCw, MoreVertical, Plus, Sparkles } from 'lucide-react';
import { MOCK_EMAILS } from './constants';
import { Email, ExtensionState } from './types';
import EmailRow from './components/EmailRow';
import ExtensionCard from './components/ExtensionCard';
import { scanEmailsForSubscriptions } from './services/geminiService';

const App: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>(MOCK_EMAILS);
  const [extensionState, setExtensionState] = useState<ExtensionState>(ExtensionState.IDLE);
  const [isExtensionVisible, setIsExtensionVisible] = useState(true);
  const [processedCount, setProcessedCount] = useState(0);

  const toggleSelectEmail = (id: string) => {
    setEmails(prev => prev.map(e => 
      e.id === id ? { ...e, selected: !e.selected } : e
    ));
  };

  const handleScan = async () => {
    setExtensionState(ExtensionState.SCANNING);
    
    // Simulate API delay + Processing
    const result = await scanEmailsForSubscriptions(emails);
    
    setEmails(prev => prev.map(e => ({
      ...e,
      isSubscription: result.subscriptionIds.includes(e.id),
      selected: result.subscriptionIds.includes(e.id) // Auto-select found items
    })));

    setExtensionState(ExtensionState.REVIEW);
  };

  const getSelectedCount = () => emails.filter(e => e.selected).length;

  const handleCleanAction = async (action: 'trash' | 'archive') => {
    setExtensionState(ExtensionState.CLEANING);
    const count = getSelectedCount();
    setProcessedCount(count);

    // Simulate network operation delay
    setTimeout(() => {
      if (action === 'trash') {
        setEmails(prev => prev.filter(e => !e.selected));
      } else {
        // Archive just removes from view in this demo
        setEmails(prev => prev.filter(e => !e.selected));
      }
      setExtensionState(ExtensionState.DONE);
    }, 1200);
  };

  const handleReset = () => {
    setExtensionState(ExtensionState.IDLE);
    setEmails(prev => prev.map(e => ({...e, selected: false, isSubscription: false})));
    // In a real app we might reload data here, but we'll keep the remaining items
  };

  const handleReloadDemo = () => {
    setEmails(MOCK_EMAILS);
    setExtensionState(ExtensionState.IDLE);
  }

  return (
    <div className="h-screen flex flex-col bg-[#F6F8FC] overflow-hidden">
      {/* Gmail Header Simulation */}
      <header className="h-16 bg-white px-4 flex items-center justify-between border-b border-gray-200 shrink-0 z-40">
        <div className="flex items-center gap-4 w-60">
          <Menu className="w-6 h-6 text-gray-600 cursor-pointer" />
          <div className="flex items-center gap-1 cursor-pointer">
             <img src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r5.png" alt="Gmail" className="h-6 opacity-80" />
          </div>
        </div>

        <div className="flex-1 max-w-2xl px-4">
          <div className="bg-[#EAF1FB] flex items-center px-4 py-3 rounded-full transition-shadow focus-within:shadow-md focus-within:bg-white">
            <Search className="w-5 h-5 text-gray-600 mr-3" />
            <input 
              type="text" 
              placeholder="Search mail" 
              className="bg-transparent border-none outline-none w-full text-gray-700 placeholder-gray-600"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 w-60 justify-end">
          <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
             <HelpCircle className="w-6 h-6 text-gray-600" />
          </div>
          <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
             <Settings className="w-6 h-6 text-gray-600" />
          </div>
           <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
             <Grip className="w-6 h-6 text-gray-600" />
          </div>
          <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-medium cursor-pointer">
            J
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 py-4 pr-4 flex-col gap-1 hidden md:flex shrink-0">
          <div className="pl-4 mb-4">
            <button className="flex items-center gap-3 bg-[#C2E7FF] hover:shadow-md text-gray-800 font-medium px-6 py-4 rounded-2xl transition-all">
               <Plus className="w-5 h-5" />
               Compose
            </button>
          </div>
          
          {[
            { label: 'Inbox', icon: true, count: emails.length, active: true },
            { label: 'Starred', icon: false },
            { label: 'Snoozed', icon: false },
            { label: 'Sent', icon: false },
            { label: 'Drafts', icon: false },
          ].map((item, idx) => (
            <div key={idx} className={`flex items-center justify-between pl-8 pr-4 py-1.5 rounded-r-full cursor-pointer ${item.active ? 'bg-[#D3E3FD] font-bold text-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>
              <span className="text-sm">{item.label}</span>
              {item.count && <span className="text-xs font-medium">{item.count}</span>}
            </div>
          ))}
        </div>

        {/* Main List Area */}
        <main className="flex-1 bg-white m-2 rounded-2xl shadow-sm overflow-hidden flex flex-col relative">
          
          {/* Toolbar */}
          <div className="h-12 border-b border-gray-100 flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-4 text-gray-600">
              <div className="w-4 h-4 border-2 border-gray-500 rounded-sm cursor-pointer ml-1"></div>
              <div 
                className="cursor-pointer hover:text-black flex items-center justify-center" 
                onClick={handleReloadDemo} 
                title="Reset Demo"
              >
                <RefreshCw className="w-4 h-4" />
              </div>
              <MoreVertical className="w-4 h-4 cursor-pointer hover:text-black" />
            </div>
            <div className="flex items-center gap-4 text-gray-500 text-xs">
              <span>1-{emails.length} of {emails.length}</span>
              <div className="flex items-center gap-2">
                 <ChevronLeft className="w-4 h-4 cursor-pointer hover:text-black" />
                 <ChevronRight className="w-4 h-4 cursor-pointer hover:text-black" />
              </div>
            </div>
          </div>

          {/* Email List */}
          <div className="flex-1 overflow-y-auto">
            {emails.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-12 h-12 text-gray-300" />
                  </div>
                  <p className="text-lg">Your inbox is empty!</p>
                  <button onClick={handleReloadDemo} className="mt-4 text-blue-600 hover:underline">Reset Demo Data</button>
               </div>
            ) : (
              emails.map(email => (
                <EmailRow 
                  key={email.id} 
                  email={email} 
                  toggleSelect={toggleSelectEmail} 
                  highlight={!!email.isSubscription && extensionState === ExtensionState.REVIEW}
                />
              ))
            )}
          </div>
        </main>
      </div>

      {/* Extension Injection */}
      {isExtensionVisible && (
        <ExtensionCard 
          state={extensionState}
          count={getSelectedCount()}
          onScan={handleScan}
          onTrash={() => handleCleanAction('trash')}
          onArchive={() => handleCleanAction('archive')}
          onCancel={handleReset}
          onClose={() => setIsExtensionVisible(false)}
        />
      )}
      
      {/* Floating Toggle if closed */}
      {!isExtensionVisible && (
        <button 
          onClick={() => setIsExtensionVisible(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-blue-700 transition z-50"
        >
          <Sparkles className="w-6 h-6" />
        </button>
      )}

    </div>
  );
};

export default App;