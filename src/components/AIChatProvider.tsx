import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { Message, MessageProvider, useMessages } from '../context/MessageContext';
import ChatMessages from './ChatMessages';
import { ColorScheme, ThemeColors } from '../utils/theme';

export interface AIChatProviderProps {
  welcomeMessage?: string;
  storageKey?: string;
  placeholder?: string;
  clearLabel?: string;
  clearConfirmTitle?: string;
  clearConfirmMessage?: string;
  colorScheme?: ColorScheme;
  theme?: Partial<ThemeColors>;
  onError?: (error: Error) => void;
  customMessageHandler: (message: string) => Promise<string | null>;
  style?: any;
  children?: React.ReactNode;
}

// The internal component that uses the MessageContext
const AIChatInner: React.FC<AIChatProviderProps> = ({
  welcomeMessage = 'Hello! How can I help you today?',
  placeholder = 'Type a message...',
  clearLabel,
  clearConfirmTitle,
  clearConfirmMessage,
  colorScheme = 'light',
  theme = {},
  onError,
  customMessageHandler,
  style = {},
  children
}) => {
  const { messages: contextMessages, addMessage, clearMessages } = useMessages();
  const [displayMessages, setDisplayMessages] = useState<any[]>([
    {
      id: 'welcome',
      text: welcomeMessage,
      isUser: false
    }
  ]);

  // Handle sending a message
  const handleSendMessage = async (messageText: string): Promise<string | null> => {
    try {
      const response = await customMessageHandler(messageText);

      if (response) {
        // Save to context
        await addMessage(messageText, response);
      }

      return response;
    } catch (error) {
      if (onError) {
        onError(error instanceof Error ? error : new Error(String(error)));
      }
      console.error('Error sending message:', error);
      return 'Sorry, there was an error processing your request.';
    }
  };

  return (
    <View style={[styles.container, style]}>
      {children}
      <ChatMessages
        messages={displayMessages}
        setMessages={setDisplayMessages}
        onSendMessage={handleSendMessage}
        onClearConversation={clearMessages}
        placeholder={placeholder}
        clearLabel={clearLabel}
        clearConfirmTitle={clearConfirmTitle}
        clearConfirmMessage={clearConfirmMessage}
        colorScheme={colorScheme}
        theme={theme}
      />
    </View>
  );
};

// Main component that provides the MessageContext
export const AIChatProvider: React.FC<AIChatProviderProps> = (props) => {
  const { storageKey } = props;

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <MessageProvider
        storageKey={storageKey}
      >
        <AIChatInner {...props} />
      </MessageProvider>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AIChatProvider; 