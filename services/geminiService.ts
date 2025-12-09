import { GoogleGenAI, Type } from "@google/genai";
import { Email, ScanResult } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  // In a real extension, we would check chrome.storage
  if (!apiKey) {
    console.warn("API Key not found in env. Returning null client.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const scanEmailsForSubscriptions = async (emails: Email[]): Promise<ScanResult> => {
  const ai = getClient();
  
  // Minimal payload to save tokens
  const emailData = emails.map(e => ({
    id: e.id,
    sender: e.sender,
    subject: e.subject,
    snippet: e.snippet
  }));

  // Fallback if no API key is present (for demo purposes)
  if (!ai) {
    console.log("Using Mock/Regex scanner due to missing API Key");
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network
    const keywords = ['unsubscribe', 'sale', 'off', 'newsletter', 'offer', 'digest'];
    const ids = emails
      .filter(e => {
        const text = (e.subject + ' ' + e.snippet).toLowerCase();
        return keywords.some(k => text.includes(k));
      })
      .map(e => e.id);
    return { subscriptionIds: ids, confidence: 0.8 };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        Analyze the following list of emails. 
        Identify which ones are likely newsletters, promotional marketing, or automated subscription updates that a user might want to clean up.
        Important emails (personal, work, billing, invoices) should NOT be selected.
        
        Emails: ${JSON.stringify(emailData)}
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            newsletterIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "The IDs of the emails identified as subscriptions or promotions."
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      subscriptionIds: result.newsletterIds || [],
      confidence: 0.95
    };

  } catch (error) {
    console.error("Gemini Scan Error:", error);
    return { subscriptionIds: [], confidence: 0 };
  }
};