export interface Book {
  id: string;
  title: string;
  author: string;
  subject: string;
  description: string;
}

export interface PotentialCustomer {
  id:string;
  name: string;
  type: 'University' | 'Research Institute' | 'Corporate R&D' | 'Public Library';
  interests: string[];
  // Replaced `currentCollectionStrength` with a list of purchased books for more accurate gap analysis.
  purchasedBookIds: string[];
}

export interface Lead extends PotentialCustomer {
  priorityScore: number;
  justification: string;
  recommendedBookIds: string[];
  narrative?: string;
  potentialRevenue: number;
}

// FIX: Added missing ChatMessage interface for the ChatbotModal component.
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
