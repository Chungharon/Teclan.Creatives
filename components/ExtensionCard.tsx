import React from 'react';
import { Mail, Trash2, Archive, X, Check, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { ExtensionState } from '../types';

interface ExtensionCardProps {
  state: ExtensionState;
  count: number;
  onScan: () => void;
  onTrash: () => void;
  onArchive: () => void;
  onClose: () => void;
  onCancel: () => void;
}

const ExtensionCard: React.FC<ExtensionCardProps> = ({
  state,
  count,
  onScan,
  onTrash,
  onArchive,
  onClose,
  onCancel
}) => {
  const isIdle = state === ExtensionState.IDLE;
  const isScanning = state === ExtensionState.SCANNING;
  const isReview = state === ExtensionState.REVIEW;
  const isCleaning = state === ExtensionState.CLEANING;
  const isDone = state === ExtensionState.DONE;

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden font-sans z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <span className="font-semibold tracking-wide">InboxCleanse AI</span>
        </div>
        {!isScanning && !isCleaning && (
            <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition">
              <X className="w-4 h-4" />
            </button>
        )}
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col items-center text-center">
        
        {isIdle && (
          <>
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Scan for Clutter?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Use Gemini AI to detect newsletters and promotional emails in your current view.
            </p>
            <button
              onClick={onScan}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Scan Inbox
            </button>
          </>
        )}

        {isScanning && (
          <>
            <div className="w-16 h-16 flex items-center justify-center mb-4">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Scanning...</h3>
            <p className="text-sm text-gray-500">
              Analyzing email subjects and snippets with Gemini...
            </p>
          </>
        )}

        {isReview && (
          <>
            <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-4 relative">
              <AlertCircle className="w-8 h-8" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                {count}
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Found {count} Items</h3>
            <p className="text-sm text-gray-500 mb-6">
              Review the highlighted emails. Select an action below.
            </p>
            <div className="grid grid-cols-2 gap-3 w-full">
               <button
                onClick={onArchive}
                className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-3 rounded-lg transition"
              >
                <Archive className="w-4 h-4" />
                Archive
              </button>
              <button
                onClick={onTrash}
                className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 px-3 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
                Trash
              </button>
            </div>
            <button onClick={onCancel} className="mt-3 text-xs text-gray-400 hover:text-gray-600 underline">
              Cancel Selection
            </button>
          </>
        )}

        {isCleaning && (
           <>
            <div className="w-16 h-16 flex items-center justify-center mb-4">
              <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Cleaning up...</h3>
          </>
        )}

        {isDone && (
          <>
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">All Clear!</h3>
            <p className="text-sm text-gray-500 mb-6">
              Moved {count} emails. Your inbox is looking lighter.
            </p>
            <button
              onClick={onCancel}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition"
            >
              Done
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default ExtensionCard;