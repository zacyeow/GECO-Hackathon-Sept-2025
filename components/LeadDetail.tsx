
import React from 'react';
import type { Book, Lead } from '../types';
import { SparklesIcon, DocumentTextIcon, TargetIcon } from './IconComponents';
import Spinner from './Spinner';

interface LeadDetailProps {
  lead: Lead | null;
  books: Book[];
  onGenerateNarrative: (lead: Lead) => void;
  isNarrativeLoading: boolean;
}

const LeadDetail: React.FC<LeadDetailProps> = ({ lead, books, onGenerateNarrative, isNarrativeLoading }) => {
  if (!lead) {
    return (
      <div className="bg-gray-medium rounded-lg p-6 flex flex-col items-center justify-center h-full text-center" style={{ minHeight: '500px' }}>
        <TargetIcon className="w-16 h-16 text-gray-light mb-4" />
        <h3 className="text-xl font-semibold text-text-primary">Select a Lead</h3>
        <p className="text-text-secondary mt-2">Choose a lead from the list to view their details and generate a sales narrative.</p>
      </div>
    );
  }

  const recommendedBooks = lead.recommendedBookIds.map(id => books.find(b => b.id === id)).filter(Boolean) as Book[];

  return (
    <div className="bg-gray-medium rounded-lg p-6 h-full overflow-y-auto">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">{lead.name}</h2>
          <p className="text-md text-text-secondary">{lead.type}</p>
        </div>
        <div className="flex items-center gap-6">
            <div className="text-right">
                <p className="text-sm text-text-secondary">Priority Score</p>
                <p className="text-3xl font-bold text-brand-accent">{lead.priorityScore}</p>
            </div>
             <div className="text-right">
                <p className="text-sm text-text-secondary">Est. Revenue</p>
                <p className="text-3xl font-bold text-green-400">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(lead.potentialRevenue)}
                </p>
            </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-text-primary mb-2">Justification</h4>
          <p className="text-text-secondary bg-gray-light p-3 rounded-md">{lead.justification}</p>
        </div>

        <div>
          <h4 className="font-semibold text-text-primary mb-2">Interests</h4>
          <div className="flex flex-wrap gap-2">
            {lead.interests.map(interest => (
              <span key={interest} className="bg-brand-accent text-xs font-semibold px-2.5 py-1 rounded-full text-white">{interest}</span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-text-primary mb-2">Recommended Titles</h4>
          <ul className="space-y-2">
            {recommendedBooks.map(book => (
              <li key={book.id} className="bg-gray-light p-3 rounded-md">
                <p className="font-semibold text-text-primary">{book.title}</p>
                <p className="text-sm text-text-secondary">by {book.author} - ({book.subject})</p>
              </li>
            ))}
          </ul>
        </div>

        <div>
            <div className="flex justify-between items-center mb-2">
                 <h4 className="font-semibold text-text-primary flex items-center gap-2"><DocumentTextIcon className="w-5 h-5"/> Tailored Outreach Narrative</h4>
                 {!lead.narrative && (
                     <button
                        onClick={() => onGenerateNarrative(lead)}
                        disabled={isNarrativeLoading}
                        className="flex items-center gap-2 bg-brand-accent hover:bg-brand-primary text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 disabled:bg-gray-light disabled:cursor-not-allowed"
                     >
                        <SparklesIcon className="w-5 h-5" />
                        {isNarrativeLoading ? 'Generating...' : 'Generate with AI'}
                    </button>
                 )}
            </div>
            {isNarrativeLoading ? (
                <div className="flex justify-center items-center h-48 bg-gray-light rounded-md">
                    <Spinner />
                </div>
            ) : (
                lead.narrative && (
                    <div className="bg-gray-light p-4 rounded-md whitespace-pre-wrap text-text-secondary font-mono text-sm">
                        {lead.narrative}
                    </div>
                )
            )}
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;
