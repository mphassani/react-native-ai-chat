# React Native AI Chat

A React Native package for implementing AI-powered chat interfaces with minimal setup. This package provides reusable components for building AI chat experiences with a clean, customizable UI.

<table style="width:100%;">
  <tr>
    <td style="text-align:center;">
      <img width="200" alt="Translit App" src="https://github.com/user-attachments/assets/4b090ad0-f3a4-45fa-acdf-a0e93ece7fa5" />
      <br>
      <a href="https://apps.apple.com/us/app/translit-translator-more/id6447789720">Translit</a>
    </td>
    <td style="text-align:center;">
      <img width="200" alt="Book Club App" src="https://github.com/user-attachments/assets/f7913d62-38ab-439c-bb3f-5003e01f8446" />
      <br>
      <a href="https://apps.apple.com/us/app/book-club-reading-tracker/id6742517590">Book Club</a>
    </td>
  </tr>
</table>

## Features

- 🤖 Pre-built chat UI components
- 📋 Clipboard integration
- 🌙 Dark mode support
- 💬 Message history management
- 🎨 Customizable theming
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
  // Custom message handler to process messages with your AI service
  const handleMessages = async (message) => {
    // Implement your AI logic here
    // For example, call OpenAI API, Azure, or any other service
    const response = await callYourAIService(message);
    return response;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AIChatProvider
        customMessageHandler={handleMessages}
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
  customMessageHandler={async (message) => {
    // Your AI implementation here
    // This is REQUIRED - you must implement your own AI logic
    const response = await yourAIService.generateResponse(message);
    return response;
  }}
  welcomeMessage="Hello! How can I help you today?"
/>

// Advanced usage
<AIChatProvider
  customMessageHandler={async (message) => {
    // Your AI implementation here
    // For example, connecting to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${YOUR_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: message }]
      })
    });
    
    const data = await response.json();
    return data.choices[0].message.content;
  }}
  welcomeMessage="Hello! I'm here to help with translations."
  placeholder="Type your message here..."
  colorScheme="dark"
/>
```

### ChatMessages

Lower-level component for displaying chat messages with more customization options.

```jsx
import { ChatMessages, useMessages } from 'react-native-ai-chat';

function ChatScreen() {
  const { addMessage, clearMessages } = useMessages();
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
  customMessageHandler={async (message) => {
    // Your AI implementation here
    // This is REQUIRED - you must implement your own AI logic
    const response = await yourAIService.generateResponse(message);
    return response;
  }}
  theme={customTheme}
/>
```

## License

MIT 
