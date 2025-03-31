import React, { useState } from 'react';
import { SafeAreaView, View, Text, Switch, StyleSheet } from 'react-native';
import { AIChatProvider } from '../components/AIChatProvider';
import { ColorScheme } from '../utils/theme';

/**
 * Example component showing basic usage of the AI Chat package
 */
const BasicUsage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const colorScheme: ColorScheme = darkMode ? 'dark' : 'light';
  
  // Define a custom prompt generator for this example
  const generatePrompt = (message: string, language: string): string => {
    return `Answer the following question in a friendly tone. 
      Be concise but helpful: ${message}`;
  };
  
  return (
    <SafeAreaView style={[
      styles.container, 
      { backgroundColor: darkMode ? '#121212' : '#f5f5f5' }
    ]}>
      {/* Simple toggle for dark mode */}
      <View style={styles.header}>
        <Text style={[
          styles.headerText, 
          { color: darkMode ? '#fff' : '#000' }
        ]}>
          AI Chat Example
        </Text>
        <View style={styles.toggleContainer}>
          <Text style={[
            styles.toggleLabel, 
            { color: darkMode ? '#fff' : '#000' }
          ]}>
            Dark Mode
          </Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={darkMode ? '#4e9aea' : '#f4f3f4'}
          />
        </View>
      </View>
      
      {/* The AIChatProvider component */}
      <View style={styles.chatContainer}>
        <AIChatProvider
          apiKey="YOUR_API_KEY_HERE" // Replace with your actual API key
          welcomeMessage="Hello! I'm an AI assistant. How can I help you today?"
          colorScheme={colorScheme}
          generatePrompt={generatePrompt}
          placeholder="Ask me anything..."
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    marginRight: 8,
  },
  chatContainer: {
    flex: 1,
  },
});

export default BasicUsage; 