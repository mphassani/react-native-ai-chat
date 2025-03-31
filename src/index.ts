// Components
export { default as ChatMessages } from './components/ChatMessages';
export { default as ClipboardNotificationBanner } from './components/ClipboardNotificationBanner';
export { default as AIChatProvider } from './components/AIChatProvider';

// Context
export { 
  MessageProvider, 
  useMessages
} from './context/MessageContext';

// Hooks
export { useClipboard } from './hooks/useClipboard';

// Theme 
export { 
  getTheme,
  LightTheme,
  DarkTheme
} from './utils/theme';

// Types
export type { 
  Message
} from './context/MessageContext';

export type { 
  UseClipboardResult 
} from './hooks/useClipboard';

export type { 
  ColorScheme, 
  ThemeColors 
} from './utils/theme';

export type {
  AIChatProviderProps
} from './components/AIChatProvider';

export type {
  ChatMessagesProps
} from './components/ChatMessages'; 