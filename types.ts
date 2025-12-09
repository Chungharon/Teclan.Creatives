export enum EmailCategory {
  PRIMARY = 'Primary',
  SOCIAL = 'Social',
  PROMOTIONS = 'Promotions',
  UPDATES = 'Updates'
}

export interface Email {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  snippet: string;
  date: string;
  isRead: boolean;
  isStarred: boolean;
  selected: boolean;
  isSubscription?: boolean; // Detected by AI
}

export interface ScanResult {
  subscriptionIds: string[];
  confidence: number;
}

export enum ExtensionState {
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  REVIEW = 'REVIEW',
  CLEANING = 'CLEANING',
  DONE = 'DONE'
}