import React from 'react';
import { Star } from 'lucide-react';
import { Email } from '../types';

interface EmailRowProps {
  email: Email;
  toggleSelect: (id: string) => void;
  highlight: boolean; // Is it identified as a subscription?
}

const EmailRow: React.FC<EmailRowProps> = ({ email, toggleSelect, highlight }) => {
  return (
    <div 
      className={`
        flex items-center px-4 py-2 border-b border-gray-100 group cursor-pointer hover:shadow-sm relative transition-colors duration-200
        ${email.isRead ? 'bg-white' : 'bg-white font-semibold'}
        ${email.selected ? 'bg-blue-50' : 'hover:bg-gray-50'}
        ${highlight && !email.selected ? 'bg-orange-50/60' : ''}
      `}
      onClick={() => toggleSelect(email.id)}
    >
      {/* Selection Highlight Bar */}
      {highlight && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-400" title="Detected as Subscription"></div>
      )}

      {/* Drag Handle / Checkbox */}
      <div className="mr-3 flex items-center justify-center">
        <input 
          type="checkbox" 
          checked={email.selected} 
          onChange={() => toggleSelect(email.id)}
          className={`
            w-4 h-4 border-gray-300 rounded focus:ring-blue-500
            ${highlight ? 'accent-orange-500' : 'accent-blue-600'}
          `}
        />
      </div>

      {/* Star */}
      <div className="mr-4 text-gray-300 hover:text-yellow-400 cursor-pointer">
        <Star className={`w-5 h-5 ${email.isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
      </div>

      {/* Sender */}
      <div className={`w-48 truncate mr-4 ${!email.isRead ? 'text-gray-900 font-bold' : 'text-gray-700'}`}>
        {email.sender}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center min-w-0">
        <span className={`truncate ${!email.isRead ? 'text-gray-900 font-bold' : 'text-gray-700'}`}>
          {email.subject}
        </span>
        <span className="mx-2 text-gray-400">-</span>
        <span className="text-gray-500 truncate text-sm">
          {email.snippet}
        </span>
      </div>

      {/* Date */}
      <div className={`ml-4 w-20 text-right text-xs ${!email.isRead ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>
        {email.date}
      </div>
      
      {highlight && (
        <div className="ml-4 text-xs font-medium text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full whitespace-nowrap">
          Subscription
        </div>
      )}
    </div>
  );
};

export default EmailRow;