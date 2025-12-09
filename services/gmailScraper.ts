import { ScanResult } from '../types';
import { scanEmailsForSubscriptions } from './geminiService';

/**
 * Real-world DOM scraping for Gmail.
 * Note: Gmail uses obfuscated class names (like .zA, .xY). 
 * This scraper looks for the table rows that represent emails.
 */
export const scanGmailDom = async (): Promise<ScanResult> => {
  // 1. Find all email rows in the current view
  // 'tr.zA' is a common stable-ish selector for email rows in standard view
  const emailRows = Array.from(document.querySelectorAll('tr.zA'));
  
  const emailsToAnalyze = emailRows.map((row) => {
    // Attempt to find subject and snippet. 
    // .bog = subject wrapper often
    // .y2 = snippet wrapper often
    const subjectElement = row.querySelector('.bog');
    const snippetElement = row.querySelector('.y2'); // The gray text preview
    const senderElement = row.querySelector('.yX'); // The sender name

    return {
      id: row.id, // Gmail rows usually have an ID
      sender: senderElement?.textContent || 'Unknown',
      senderEmail: '', // Harder to get from list view without hovering
      subject: subjectElement?.textContent || '',
      snippet: snippetElement?.textContent || '',
      date: '',
      isRead: !row.classList.contains('zE'), // zE often means unread
      isStarred: false,
      selected: false
    };
  });

  console.log("Found emails in DOM:", emailsToAnalyze.length);

  // 2. Send to Gemini
  return scanEmailsForSubscriptions(emailsToAnalyze);
};

export const trashEmails = async (ids: string[]) => {
  // 1. Find the rows again
  const rows = ids.map(id => document.getElementById(id)).filter(r => r !== null);
  
  // 2. Select them (Gmail usually requires selecting the checkbox then clicking trash)
  rows.forEach(row => {
    const checkbox = row?.querySelector('div[role="checkbox"]');
    if (checkbox) {
      (checkbox as HTMLElement).click();
    }
  });

  // 3. Wait a moment for UI to update, then find the "Delete" button
  // This is tricky in Gmail's dynamic DOM. 
  // Often it's safer to just highlight them for the user in a V1 extension.
  await new Promise(r => setTimeout(r, 500));
  
  // Attempt to find the trash button in the toolbar (aria-label is usually reliable)
  const trashButton = document.querySelector('div[act="10"]') || document.querySelector('[aria-label="Delete"]');
  if (trashButton) {
    (trashButton as HTMLElement).click();
  } else {
    alert("Could not auto-click Trash. Please click the trash icon in the toolbar.");
  }
};