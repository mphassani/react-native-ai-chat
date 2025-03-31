import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Message = {
    id: string;
    question: string;
    answer: string;
    timestamp: number;
};

// Define the subscription tiers for the package
export type SubscriptionTier = 'free' | 'premium';

// Define limits that can be customized
export interface MessageLimits {
    MAX_DAILY_MESSAGES: number;
    MAX_HISTORY_ITEMS: number;
}

export const DEFAULT_FREE_TIER_LIMITS: MessageLimits = {
    MAX_DAILY_MESSAGES: 5,
    MAX_HISTORY_ITEMS: 10
};

type MessageContextType = {
    messages: Message[];
    addMessage: (question: string, answer: string) => Promise<boolean>;
    clearMessages: () => Promise<void>;
    canSendMessage: () => Promise<boolean>;
    getDisplayMessages: () => Message[];
};

interface MessageProviderProps {
    children: React.ReactNode;
    storageKey?: string;
    tier?: SubscriptionTier;
    limits?: MessageLimits;
    customStorage?: {
        getItem: (key: string) => Promise<string | null>;
        setItem: (key: string, value: string) => Promise<void>;
        removeItem: (key: string) => Promise<void>;
    };
    onMessageLimitReached?: () => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<MessageProviderProps> = ({ 
    children, 
    storageKey = 'aiChatMessages',
    tier = 'free',
    limits = DEFAULT_FREE_TIER_LIMITS,
    customStorage,
    onMessageLimitReached
}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [dailyMessagesUsed, setDailyMessagesUsed] = useState(0);
    
    const storage = customStorage || AsyncStorage;

    // Load messages and daily usage from storage
    useEffect(() => {
        const loadData = async () => {
            try {
                const storedMessages = await storage.getItem(storageKey);
                if (storedMessages) {
                    setMessages(JSON.parse(storedMessages));
                }
                
                // Load daily message usage
                const today = new Date().toISOString().split('T')[0];
                const dailyKey = `${storageKey}_daily_${today}`;
                const storedDailyCount = await storage.getItem(dailyKey);
                
                if (storedDailyCount) {
                    setDailyMessagesUsed(parseInt(storedDailyCount, 10));
                } else {
                    // Reset daily count at the start of a new day
                    setDailyMessagesUsed(0);
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

    // Check if the user can send a message based on their tier
    const canSendMessage = async (): Promise<boolean> => {
        // Premium users can always send messages
        if (tier === 'premium') return true;
        
        try {
            // Check daily usage for free tier
            if (dailyMessagesUsed >= limits.MAX_DAILY_MESSAGES) {
                if (onMessageLimitReached) {
                    onMessageLimitReached();
                }
                return false;
            }
            
            // Increment daily usage
            const newCount = dailyMessagesUsed + 1;
            setDailyMessagesUsed(newCount);
            
            // Save to storage
            const today = new Date().toISOString().split('T')[0];
            const dailyKey = `${storageKey}_daily_${today}`;
            await storage.setItem(dailyKey, newCount.toString());
            
            return true;
        } catch (error) {
            console.error('Error checking message limit:', error);
            return false;
        }
    };

    // Get messages to display based on subscription tier
    const getDisplayMessages = (): Message[] => {
        // For premium users, return all messages
        if (tier === 'premium') {
            return messages;
        }
        
        // For free users, return limited history
        return [...messages]
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limits.MAX_HISTORY_ITEMS);
    };

    return (
        <MessageContext.Provider value={{ 
            messages, 
            addMessage, 
            clearMessages,
            canSendMessage,
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