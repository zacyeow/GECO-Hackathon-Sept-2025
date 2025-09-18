import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { Book, PotentialCustomer, Lead } from '../types';

// FIX: Initialize the GoogleGenAI client.
// It's assumed that process.env.API_KEY is configured in the deployment environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// This defines the expected JSON output structure for lead generation.
const leadGenerationSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            id: {
                type: Type.STRING,
                description: 'The ID of the potential customer from the input list.'
            },
            priorityScore: {
                type: Type.NUMBER,
                description: 'A score from 0 to 100 indicating the lead priority. Higher is better.'
            },
            justification: {
                type: Type.STRING,
                description: 'A brief explanation for why this customer is a high-priority lead, specifically mentioning the content gaps identified.'
            },
            recommendedBookIds: {
                type: Type.ARRAY,
                items: {
                    type: Type.STRING
                },
                description: 'An array of book IDs from the catalog that are most relevant to this customer and are NOT in their purchased list.'
            },
            potentialRevenue: {
                type: Type.NUMBER,
                description: 'An estimated potential revenue figure in USD for the initial sale based on the recommended books.'
            }
        },
        required: ['id', 'priorityScore', 'justification', 'recommendedBookIds', 'potentialRevenue']
    }
};


export const analyzeCustomersAndGenerateLeads = async (
    customers: PotentialCustomer[],
    books: Book[]
): Promise<Partial<Lead>[]> => {
    const model = 'gemini-2.5-flash';

    const prompt = `
    You are a sales analyst for a publisher. Your task is to analyze a list of potential institutional customers and a catalog of books.
    Identify high-priority sales leads by performing a gap analysis. A gap exists if a book in our catalog aligns with a customer's interests but is NOT in their 'purchasedBookIds' list.

    For each customer, you must provide:
    1.  A 'priorityScore' (0-100) based on the number and relevance of the identified gaps.
    2.  A concise 'justification' explaining the primary content gaps you found.
    3.  A list of 'recommendedBookIds' from our catalog to fill these gaps.
    4.  An estimated 'potentialRevenue' for an initial bulk sale of the recommended books.

    Here is the full book catalog:
    ${JSON.stringify(books.map(b => ({id: b.id, title: b.title, subject: b.subject})), null, 2)}

    Here is the list of potential customers to analyze. The 'purchasedBookIds' field lists the book IDs they already own. Your goal is to recommend books they DON'T own.
    ${JSON.stringify(customers, null, 2)}

    Respond with a JSON array that matches the provided schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: leadGenerationSchema,
            },
        });

        // FIX: Directly access the 'text' property for the response.
        const jsonText = response.text.trim();
        const generatedLeads = JSON.parse(jsonText);
        
        return generatedLeads as Partial<Lead>[];

    } catch (error) {
        console.error("Error generating leads:", error);
        throw new Error("Failed to analyze customers and generate leads. The AI model might be overloaded or the request was invalid.");
    }
};

export const generateNarrative = async (lead: Lead, books: Book[]): Promise<string> => {
    const model = 'gemini-2.5-flash';
    const recommendedBooks = books.filter(b => lead.recommendedBookIds.includes(b.id));

    const prompt = `
    You are a senior sales executive at a publishing house. Write a personalized, tailored sales outreach narrative for a potential customer.
    The narrative should be a concise, compelling paragraph that a sales representative can use in an email or a call.

    **Customer Details:**
    - Name: ${lead.name}
    - Type: ${lead.type}
    - Key Interests: ${lead.interests.join(', ')}

    **Your AI Analysis Justification:**
    ${lead.justification}

    **Recommended Titles for Them:**
    ${recommendedBooks.map(b => `- ${b.title} by ${b.author} (${b.subject})`).join('\n')}

    Based on all this information, write a compelling outreach narrative. Start by acknowledging their focus areas, then connect their needs to the specific, high-value titles you've identified. Highlight why these books are a crucial addition to their collection. Keep it professional, insightful, and under 150 words.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });

        // FIX: Directly access the 'text' property for the response.
        return response.text.trim();
    } catch (error) {
        console.error("Error generating narrative:", error);
        throw new Error("Failed to generate sales narrative.");
    }
};

let chat: Chat | null = null;

export const startChat = (leads: Lead[], books: Book[]) => {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are a helpful AI assistant for a book publisher's sales team.
    You have access to the current list of prioritized leads and the book catalog.
    Your job is to answer questions about the leads and books to help the sales team.
    Be concise and professional.

    Current Leads Data:
    ${JSON.stringify(leads, null, 2)}

    Book Catalog:
    ${JSON.stringify(books, null, 2)}
    `;

    // FIX: Use ai.chats.create to start a new chat session.
    chat = ai.chats.create({
        model: model,
        config: {
            systemInstruction: systemInstruction,
        },
    });
};

export const continueChat = async (message: string): Promise<string> => {
    if (!chat) {
        throw new Error("Chat not initialized. Call startChat first.");
    }
    try {
        // FIX: Use chat.sendMessage to continue the conversation.
        const response = await chat.sendMessage({ message });
        // FIX: Directly access the 'text' property for the response.
        return response.text.trim();
    } catch (error) {
        console.error("Error in chat conversation:", error);
        throw new Error("Failed to get a response from the AI assistant.");
    }
};
