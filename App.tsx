
import React, { useState } from 'react';
import type { Lead, ChatMessage } from './types';
import { BOOKS, POTENTIAL_CUSTOMERS, INITIAL_ACTIVE_LEAD } from './constants';
import * as geminiService from './services/geminiService';

import Sidebar from './components/Sidebar';
import InsightsWidget from './components/InsightsWidget';
import CrmWidget from './components/CrmWidget';
import LeadDetail from './components/LeadDetail';
import DiscoveryBar from './components/DiscoveryBar';
import ChatbotModal from './components/ChatbotModal';

const App: React.FC = () => {
    // State for leads
    const [prioritizedLeads, setPrioritizedLeads] = useState<Lead[]>([]);
    const [activeLeads, setActiveLeads] = useState<Lead[]>([INITIAL_ACTIVE_LEAD]);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(INITIAL_ACTIVE_LEAD);

    // State for UI and loading
    const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
    const [isNarrativeLoading, setIsNarrativeLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // State for Chatbot
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        { role: 'assistant', content: 'Hello! How can I help you analyze your sales leads today?' }
    ]);

    const handleAnalyze = async () => {
        setIsLoadingAnalysis(true);
        setError(null);
        setSelectedLead(null);
        try {
            const generatedLeadData = await geminiService.analyzeCustomersAndGenerateLeads(POTENTIAL_CUSTOMERS, BOOKS);

            // Merge AI-generated data with original customer data
            const fullLeads = generatedLeadData.map(genLead => {
                const customer = POTENTIAL_CUSTOMERS.find(c => c.id === genLead.id);
                if (!customer) return null;
                return { ...customer, ...genLead } as Lead;
            }).filter((lead): lead is Lead => lead !== null)
              .sort((a, b) => b.priorityScore - a.priorityScore);

            setPrioritizedLeads(fullLeads);
            if (fullLeads.length > 0) {
                setSelectedLead(fullLeads[0]);
            } else if (activeLeads.length > 0) {
                setSelectedLead(activeLeads[0]);
            }

        } catch (e: any) {
            setError(e.message || 'An unknown error occurred during analysis.');
        } finally {
            setIsLoadingAnalysis(false);
        }
    };
    
    const handleSelectLead = (lead: Lead) => {
        setSelectedLead(lead);
    };

    const handleMoveLead = (leadToMove: Lead) => {
        setPrioritizedLeads(prev => prev.filter(lead => lead.id !== leadToMove.id));
        setActiveLeads(prev => [leadToMove, ...prev]);
        if (selectedLead?.id === leadToMove.id) {
            setSelectedLead(leadToMove); // Keep it selected in the new list
        }
    };
    
    const handleGenerateNarrative = async (lead: Lead) => {
        if (!lead) return;
        setIsNarrativeLoading(true);
        try {
            const narrative = await geminiService.generateNarrative(lead, BOOKS);
            const updateLead = (l: Lead) => l.id === lead.id ? { ...l, narrative } : l;
            
            setPrioritizedLeads(prev => prev.map(updateLead));
            setActiveLeads(prev => prev.map(updateLead));
            setSelectedLead(prev => prev && prev.id === lead.id ? { ...prev, narrative } : prev);

        } catch (e: any) {
            // Here you might want to show an error toast to the user
            console.error("Failed to generate narrative:", e.message);
        } finally {
            setIsNarrativeLoading(false);
        }
    };
    
    // Chatbot Functions
    const openChat = () => {
        // Initialize chat with current context every time it's opened
        geminiService.startChat([...prioritizedLeads, ...activeLeads], BOOKS);
        setIsChatOpen(true);
    };

    const handleSendMessage = async (message: string) => {
        const newUserMessage: ChatMessage = { role: 'user', content: message };
        setChatMessages(prev => [...prev, newUserMessage]);
        setIsChatLoading(true);

        try {
            const assistantResponse = await geminiService.continueChat(message);
            const newAssistantMessage: ChatMessage = { role: 'assistant', content: assistantResponse };
            setChatMessages(prev => [...prev, newAssistantMessage]);
        } catch (e: any) {
            const errorMessage: ChatMessage = { role: 'assistant', content: `Sorry, I encountered an error: ${e.message}` };
            setChatMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsChatLoading(false);
        }
    };


    return (
        <div className="flex h-screen bg-gray-dark font-sans">
            <Sidebar />
            <main className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="container mx-auto max-w-7xl">
                        <div className="space-y-6">
                            <InsightsWidget />
                            <DiscoveryBar onOpenChat={openChat} />
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                                <div className="lg:col-span-1">
                                    <CrmWidget
                                        prioritizedLeads={prioritizedLeads}
                                        activeLeads={activeLeads}
                                        selectedLeadId={selectedLead?.id || null}
                                        onSelectLead={handleSelectLead}
                                        onMoveLead={handleMoveLead}
                                        onAnalyze={handleAnalyze}
                                        isLoading={isLoadingAnalysis}
                                        error={error}
                                    />
                                </div>
                                <div className="lg:col-span-2">
                                    <LeadDetail
                                        lead={selectedLead}
                                        books={BOOKS}
                                        onGenerateNarrative={handleGenerateNarrative}
                                        isNarrativeLoading={isNarrativeLoading}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <ChatbotModal
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                isLoading={isChatLoading}
            />
        </div>
    );
};

export default App;
