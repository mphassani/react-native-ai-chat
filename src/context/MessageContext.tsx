import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Message = {
    id: string;
    question: string;
    answer: string;
    timestamp: number;
};

type MessageContextType = {
    messages: Message[];
    addMessage: (question: string, answer: string) => Promise<boolean>;
    clearMessages: () => Promise<void>;
    getDisplayMessages: () => Message[];
};

interface MessageProviderProps {
    children: React.ReactNode;
    storageKey?: string;
    customStorage?: {
        getItem: (key: string) => Promise<string | null>;
        setItem: (key: string, value: string) => Promise<void>;
        removeItem: (key: string) => Promise<void>;
    };
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<MessageProviderProps> = ({ 
    children, 
    storageKey = 'aiChatMessages',
    customStorage
}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    
    const storage = customStorage || AsyncStorage;

    // Load messages from storage
    useEffect(() => {
        const loadData = async () => {
            try {
                const storedMessages = await storage.getItem(storageKey);
                if (storedMessages) {
                    setMessages(JSON.parse(storedMessages));
                }
            } catch (error) {
                console.error('Error loading messages:', error);
            }
        };
        
        loadData();
    }, [storageKey]);

    // Add a new message
    const addMessage = async (question: string, answer: string): Promise<boolean> => {
        try {
            const newMessage = { 
                id: Math.random().toString(36).substring(7),
                question, 
                answer,
                timestamp: new Date().getTime()
            };
            
            const updatedMessages = [...messages, newMessage];
            setMessages(updatedMessages);
            await storage.setItem(storageKey, JSON.stringify(updatedMessages));
            return true;
        } catch (error) {
            console.error('Error adding message:', error);
            return false;
        }
    };

    // Clear all messages
    const clearMessages = async () => {
        try {
            await storage.removeItem(storageKey);
            setMessages([]);
        } catch (error) {
            console.error('Error clearing messages:', error);
        }
    };

    // Get all messages (without any limitations)
    const getDisplayMessages = (): Message[] => {
        return messages;
    };

    return (
        <MessageContext.Provider value={{ 
            messages, 
            addMessage, 
            clearMessages,
            getDisplayMessages
        }}>
            {children}
        </MessageContext.Provider>
    );
};

// Hook to use the message context
export const useMessages = () => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error('useMessages must be used within a MessageProvider');
    }
    return context;
}; 