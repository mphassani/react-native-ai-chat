export type ColorScheme = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  text: string;
  tint: string;
  icon: string;
  userBubble: string;
  botBubble: string;
  userText: string;
  botText: string;
  inputBackground: string;
  inputText: string;
  border: string;
}

// Default light theme
export const LightTheme: ThemeColors = {
  background: '#FFFFFF',
  text: '#000000',
  tint: '#2f95dc',
  icon: '#FFFFFF',
  userBubble: '#2f95dc',
  botBubble: '#f0f0f0',
  userText: '#FFFFFF',
  botText: '#000000',
  inputBackground: '#FFFFFF',
  inputText: '#000000',
  border: '#e0e0e0'
};

// Default dark theme
export const DarkTheme: ThemeColors = {
  background: '#121212',
  text: '#FFFFFF',
  tint: '#4e9aea',
  icon: '#FFFFFF',
  userBubble: '#4e9aea',
  botBubble: '#2a2a2a',
  userText: '#FFFFFF',
  botText: '#FFFFFF',
  inputBackground: '#1e1e1e',
  inputText: '#FFFFFF',
  border: '#333333'
};

export const getTheme = (colorScheme: ColorScheme = 'light', customTheme?: Partial<ThemeColors>): ThemeColors => {
  const baseTheme = colorScheme === 'dark' ? DarkTheme : LightTheme;
  
  if (customTheme) {
    return { ...baseTheme, ...customTheme };
  }
  
  return baseTheme;
}; 