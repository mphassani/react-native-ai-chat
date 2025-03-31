# React Native AI Chat

A React Native package for implementing AI-powered chat interfaces with minimal setup. Extracted from a transliteration app, this package provides reusable components for building AI chat experiences.

## Features

- 🤖 Pre-built chat UI components
- 📋 Clipboard integration
- 🌙 Dark mode support
- 💬 Message history management
- 🔑 API key management for AI providers
- 🔒 Free/premium tier limits support
- 📱 Optimized for mobile

## Installation

```bash
npm install react-native-ai-chat
# or
yarn add react-native-ai-chat
```

### Peer Dependencies

This package requires the following peer dependencies:

```bash
npm install react-native-elements expo-clipboard react-native-markdown-display @react-native-async-storage/async-storage
# or
yarn add react-native-elements expo-clipboard react-native-markdown-display @react-native-async-storage/async-storage
```

## Quick Start

```jsx
import React from 'react';
import { SafeAreaView } from 'react-native';
import { AIChatProvider } from 'react-native-ai-chat';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AIChatProvider
        apiKey="your-openai-api-key"
        welcomeMessage="Hello! How can I help you today?"
        colorScheme="light"
      />
    </SafeAreaView>
  );
}
```

## Components

### AIChatProvider

Main component that provides the chat interface and message management.

```jsx
import { AIChatProvider } from 'react-native-ai-chat';

// Basic usage
<AIChatProvider
  apiKey="your-openai-api-key"
  welcomeMessage="Hello! How can I help you today?"
/>

// Advanced usage
<AIChatProvider
  apiKey="your-openai-api-key"
  apiEndpoint="https://api.openai.com/v1/chat/completions"
  welcomeMessage="Hello! I'm here to help with translations."
  placeholder="Type your message here..."
  colorScheme="dark"
  tier="premium"
  limits={{
    MAX_DAILY_MESSAGES: 10,
    MAX_HISTORY_ITEMS: 50
  }}
  onLimitReached={() => {
    // Show upgrade prompt
    Alert.alert('Limit Reached', 'Upgrade to premium for unlimited messages');
  }}
  generatePrompt={(message, language) => {
    return `Translate this to ${language}: ${message}`;
  }}
  customMessageHandler={async (message) => {
    // Custom implementation for handling messages
    // Return the AI response
    return "Custom response";
  }}
/>
```

### ChatMessages

Lower-level component for displaying chat messages with more customization options.

```jsx
import { ChatMessages, useMessages } from 'react-native-ai-chat';

function ChatScreen() {
  const { addMessage, clearMessages, canSendMessage } = useMessages();
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello!', isUser: false }
  ]);
  
  const handleSendMessage = async (text) => {
    // Custom handling logic
    const response = await callSomeAIApi(text);
    return response;
  };
  
  return (
    <ChatMessages
      messages={messages}
      setMessages={setMessages}
      onSendMessage={handleSendMessage}
      onClearConversation={clearMessages}
      colorScheme="light"
      showTimestamp={true}
      disableCopy={false}
    />
  );
}
```

## Usage with Custom Themes

```jsx
import { AIChatProvider, LightTheme } from 'react-native-ai-chat';

// Custom theme extending the default light theme
const customTheme = {
  ...LightTheme,
  tint: '#FF6B6B',
  userBubble: '#FF6B6B',
  botBubble: '#F7F7F7',
};

<AIChatProvider
  apiKey="your-openai-api-key"
  theme={customTheme}
/>
```

## License

MIT 