
import React from 'react';
import type { Lead } from '../types';
import Spinner from './Spinner';
import { SparklesIcon, ArrowRightIcon, UsersIcon } from './IconComponents';

interface CrmWidgetProps {
  prioritizedLeads: Lead[];
  activeLeads: Lead[];
  selectedLeadId: string | null;
  onSelectLead: (lead: Lead) => void;
  onMoveLead: (lead: Lead) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  error: string | null;
}

const CrmWidget: React.FC<CrmWidgetProps> = ({ prioritizedLeads, activeLeads, selectedLeadId, onSelectLead, onMoveLead, onAnalyze, isLoading, error }) => {
  
  const LeadItem: React.FC<{lead: Lead, showMoveButton: boolean}> = ({ lead, showMoveButton }) => {
    const revenue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(lead.potentialRevenue);
    
    return (
        <div
            onClick={() => onSelectLead(lead)}
            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                selectedLeadId === lead.id
                ? 'bg-brand-secondary border-brand-accent shadow-md'
                : 'bg-gray-light border-transparent hover:border-brand-accent'
            }`}
        >
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-bold text-text-primary">{lead.name}</p>
                    <p className="text-sm text-text-secondary">{lead.type} - <span className="text-green-400 font-medium">{revenue}</span></p>
                </div>
                 {showMoveButton && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onMoveLead(lead); }}
                        className="p-2 rounded-full bg-brand-accent text-white hover:bg-brand-primary transition-colors"
                        aria-label="Reach out and move to active"
                        title="Reach Out"
                    >
                        <ArrowRightIcon className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
  };
  
  const renderContent = () => {
    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><Spinner /></div>;
    }
    if (error) {
        return <div className="text-center text-red-400 p-4">
            <p><strong>Analysis Failed</strong></p>
            <p className="text-sm">{error}</p>
             <button onClick={onAnalyze} className="mt-4 bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded">
                Try Again
             </button>
        </div>;
    }
    if (prioritizedLeads.length === 0 && activeLeads.length === 0) {
        return (
            <div className="text-center p-4">
                <p className="text-text-secondary">Click below to analyze your customer data and discover high-potential leads.</p>
                <button
                    onClick={onAnalyze}
                    className="mt-4 flex items-center justify-center gap-2 w-full bg-brand-accent hover:bg-brand-primary text-white font-bold py-2 px-4 rounded-lg text-md transition-transform transform hover:scale-105"
                >
                    <SparklesIcon className="w-5 h-5" />
                    Start AI Gap Analysis
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">Prioritized Leads (AI-Generated)</h3>
                <div className="space-y-2">
                    {prioritizedLeads.length > 0 ? (
                        prioritizedLeads.map((lead) => <LeadItem key={lead.id} lead={lead} showMoveButton={true} />)
                    ) : (
                        <p className="text-sm text-gray-400 px-2">No prioritized leads.</p>
                    )}
                </div>
            </div>
            <div>
                 <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">My Active Leads (Rep-Managed)</h3>
                <div className="space-y-2">
                     {activeLeads.length > 0 ? (
                        activeLeads.map((lead) => <LeadItem key={lead.id} lead={lead} showMoveButton={false} />)
                    ) : (
                        <p className="text-sm text-gray-400 px-2">No active leads. Move a lead from prioritized to get started.</p>
                    )}
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="bg-gray-medium rounded-lg p-4 h-full overflow-y-auto">
        <div className="flex items-center gap-3 mb-4">
            <UsersIcon className="w-6 h-6 text-brand-accent"/>
            <h2 className="text-xl font-bold text-text-primary">Leads CRM</h2>
        </div>
        {renderContent()}
    </div>
  );
};

export default CrmWidget;
