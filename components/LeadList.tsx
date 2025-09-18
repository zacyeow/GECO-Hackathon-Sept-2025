
import React from 'react';
import type { Lead } from '../types';
import { TargetIcon } from './IconComponents';

interface LeadListProps {
  leads: Lead[];
  selectedLeadId: string | null;
  onSelectLead: (lead: Lead) => void;
}

const LeadList: React.FC<LeadListProps> = ({ leads, selectedLeadId, onSelectLead }) => {
  const getPriorityColor = (score: number) => {
    if (score > 85) return 'bg-red-500';
    if (score > 65) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-gray-medium rounded-lg p-4 h-full overflow-y-auto">
      <div className="flex items-center gap-3 mb-4">
        <TargetIcon className="w-6 h-6 text-brand-accent"/>
        <h2 className="text-xl font-bold text-text-primary">Prioritized Leads</h2>
      </div>
      <div className="space-y-3">
        {leads.map((lead) => (
          <div
            key={lead.id}
            onClick={() => onSelectLead(lead)}
            className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
              selectedLeadId === lead.id
                ? 'bg-brand-secondary border-brand-accent shadow-lg'
                : 'bg-gray-light border-transparent hover:border-brand-accent'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-text-primary">{lead.name}</p>
                <p className="text-sm text-text-secondary">{lead.type}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-text-primary">{lead.priorityScore}</span>
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(lead.priorityScore)}`}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadList;
