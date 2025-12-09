import React from 'react';
import ReactDOM from 'react-dom/client';
import ExtensionCard from './components/ExtensionCard';
import { ExtensionState } from './types';
import { scanGmailDom, trashEmails } from './services/gmailScraper';
import './index.css'; // Import styles so they are bundled

// 1. Create a container for our extension
const appContainer = document.createElement('div');
appContainer.id = 'inbox-cleanse-root';
// Z-index high to float above Gmail
appContainer.style.position = 'fixed';
appContainer.style.zIndex = '9999'; 
document.body.appendChild(appContainer);

// 2. The Wrapper Component to manage state inside the real extension
const ExtensionWrapper = () => {
  const [state, setState] = React.useState<ExtensionState>(ExtensionState.IDLE);
  const [visible, setVisible] = React.useState(true);
  const [count, setCount] = React.useState(0);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const handleScan = async () => {
    setState(ExtensionState.SCANNING);
    
    // In the real extension, we scan the ACTUAL DOM, not mock data
    const result = await scanGmailDom();
    
    setCount(result.subscriptionIds.length);
    setSelectedIds(result.subscriptionIds);
    setState(ExtensionState.REVIEW);
  };

  const handleAction = async (action: 'trash' | 'archive') => {
    setState(ExtensionState.CLEANING);
    await trashEmails(selectedIds); // Real DOM manipulation
    setState(ExtensionState.DONE);
  };

  const handleClose = () => setVisible(false);
  const handleReset = () => {
    setState(ExtensionState.IDLE);
    setCount(0);
  };

  if (!visible) return null; // Or render a small floating toggle button

  return (
    <ExtensionCard 
      state={state}
      count={count}
      onScan={handleScan}
      onTrash={() => handleAction('trash')}
      onArchive={() => handleAction('archive')}
      onClose={handleClose}
      onCancel={handleReset}
    />
  );
};

// 3. Mount React
const root = ReactDOM.createRoot(appContainer);
root.render(
  <React.StrictMode>
    <ExtensionWrapper />
  </React.StrictMode>
);