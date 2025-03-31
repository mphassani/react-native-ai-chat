import React, { useRef, useEffect, useState } from 'react';
import { View, TouchableOpacity, FlatList, Alert, Platform, KeyboardAvoidingView, Keyboard, KeyboardEvent } from 'react-native';
import { Avatar, ListItem, Button, Input } from "react-native-elements";
import Markdown from 'react-native-markdown-display';
import * as Clipboard from 'expo-clipboard';
import { useClipboard } from '../hooks/useClipboard';
import ClipboardNotificationBanner from './ClipboardNotificationBanner';
import { getTheme, ThemeColors, ColorScheme } from '../utils/theme';
import Icon from 'react-native-vector-icons/Ionicons';

// Define Message type
export type Message = {
  id: string;
  text: string;
  isUser: boolean;
  copied?: boolean;
  timestamp?: number;
};

// Define props interface
export interface ChatMessagesProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onSendMessage?: (text: string) => Promise<string | null>;
  onClearConversation?: () => Promise<void>;
  placeholder?: string;
  clearLabel?: string;
  clearConfirmTitle?: string;
  clearConfirmMessage?: string;
  colorScheme?: ColorScheme;
  theme?: Partial<ThemeColors>;
  inputMultiline?: boolean;
  showClearButton?: boolean;
  avatarIcons?: {
    user?: string;
    bot?: string;
  };
  disableCopy?: boolean;
  markdownStyles?: Record<string, any>;
  showTimestamp?: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  setMessages,
  onSendMessage,
  onClearConversation,
  placeholder = "Type a message...",
  clearLabel = "Clear Conversation",
  clearConfirmTitle = "Clear Conversation",
  clearConfirmMessage = "Are you sure you want to clear the entire conversation?",
  colorScheme = 'light',
  theme = {},
  inputMultiline = false,
  showClearButton = true,
  avatarIcons = { user: 'person', bot: 'sparkles' },
  disableCopy = false,
  markdownStyles = {},
  showTimestamp = false
}) => {
  const flatListRef = useRef<FlatList>(null);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  
  // Get theme colors
  const colors = getTheme(colorScheme as ColorScheme, theme);
  
  // Use clipboard hook
  const { visibleSnack, showSnack, hideSnack, copyToClipboard } = useClipboard();

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Handle keyboard events
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event: KeyboardEvent) => {
        setKeyboardHeight(event.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Function to handle sending a message
  const sendMessage = async () => {
    const messageText = inputText.trim();
    if (!messageText || isLoading) return;

    setIsLoading(true);
    
    // Add user message to chat
    const userMessageId = Math.random().toString(36).substring(7);
    setMessages(prevMessages => [
      ...prevMessages, 
      {
        id: userMessageId,
        text: messageText,
        isUser: true,
        timestamp: Date.now()
      }
    ]);
    
    setInputText('');
    
    try {
      if (onSendMessage) {
        // Call the provided onSendMessage function
        const answer = await onSendMessage(messageText);
        
        if (answer) {
          // Add bot response to chat
          const botMessageId = Math.random().toString(36).substring(7);
          setMessages(prevMessages => [
            ...prevMessages,
            {
              id: botMessageId,
              text: answer,
              isUser: false,
              copied: false,
              timestamp: Date.now()
            }
          ]);
          
          // Automatically copy the answer to clipboard if not disabled
          if (!disableCopy) {
            await copyToClipboard(answer);
            
            // Mark this message as copied
            setTimeout(() => {
              setMessages(prevMessages =>
                prevMessages.map(msg =>
                  msg.id === botMessageId ? {...msg, copied: true} : msg
                )
              );
              
              // Reset the copied state after a delay
              setTimeout(() => {
                setMessages(prevMessages =>
                  prevMessages.map(msg =>
                    msg.id === botMessageId ? {...msg, copied: false} : msg
                  )
                );
              }, 2000);
            }, 100);
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message to chat
      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: Math.random().toString(36).substring(7),
          text: "Sorry, there was an error processing your request. Please try again.",
          isUser: false,
          copied: false,
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to clear the conversation
  const clearConversation = () => {
    // Show confirmation alert
    Alert.alert(
      clearConfirmTitle,
      clearConfirmMessage,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              // Clear messages from state
              setMessages([]);
              // Call custom clear function if provided
              if (onClearConversation) {
                await onClearConversation();
              }
            } catch (error) {
              console.error('Error clearing conversation:', error);
            }
          }
        }
      ]
    );
  };

  // Function to format timestamp
  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Default markdown styles that can be overridden
  const defaultMarkdownStyles = {
    body: { color: colors.botText },
    heading1: { color: colors.botText, fontSize: 20, fontWeight: 'bold' },
    heading2: { color: colors.botText, fontSize: 18, fontWeight: 'bold' },
    paragraph: { color: colors.botText },
    strong: { color: colors.botText, fontWeight: 'bold' },
    em: { color: colors.botText, fontStyle: 'italic' },
    ...markdownStyles
  };

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      {/* Clear conversation button */}
      {showClearButton && messages.length > 0 && (
        <TouchableOpacity
          onPress={clearConversation}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 10,
            padding: 8,
            borderRadius: 8,
            backgroundColor: colors.background,
          }}
        >
          <Icon name="trash-outline" size={20} color="#888" />
        </TouchableOpacity>
      )}
      
      {/* Messages list */}
      <View style={{ flex: 1, paddingBottom: 60 }}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => (
            <View>
              <ListItem
                containerStyle={{
                  backgroundColor: item.isUser ? colors.userBubble : colors.botBubble,
                  borderRadius: 12,
                  marginBottom: 8,
                  width: '80%',
                  alignSelf: item.isUser ? 'flex-end' : 'flex-start',
                }}
              >
                <Avatar
                  rounded
                  icon={{ name: item.isUser ? avatarIcons.user : avatarIcons.bot, type: 'ionicon' }}
                  containerStyle={{
                    backgroundColor: item.isUser ? colors.icon : '#EDB458',
                  }}
                />
                <ListItem.Content>
                  {item.isUser ? (
                    <ListItem.Title style={{ color: colors.userText }}>
                      {item.text}
                    </ListItem.Title>
                  ) : (
                    <View style={{ flexDirection: "row" }}>
                      <Markdown style={defaultMarkdownStyles}>
                        {item.text}
                      </Markdown>
                    </View>
                  )}
                  
                  {/* Timestamp */}
                  {showTimestamp && item.timestamp && (
                    <ListItem.Subtitle 
                      style={{ 
                        color: item.isUser ? colors.userText : colors.botText,
                        opacity: 0.7,
                        fontSize: 10,
                        marginTop: 4,
                        textAlign: 'right'
                      }}
                    >
                      {formatTimestamp(item.timestamp)}
                    </ListItem.Subtitle>
                  )}
                </ListItem.Content>
                
                {/* Copy button for bot messages */}
                {!item.isUser && !disableCopy && (
                  <TouchableOpacity
                    style={{ alignSelf: 'center', marginTop: 5, marginLeft: "10%" }}
                    onPress={async () => {
                      await copyToClipboard(item.text);

                      // Mark this message as copied
                      setMessages(prevMessages =>
                        prevMessages.map(msg =>
                          msg.id === item.id ? { ...msg, copied: true } : msg
                        )
                      );

                      // Reset the copied state after a delay
                      setTimeout(() => {
                        setMessages(prevMessages =>
                          prevMessages.map(msg =>
                            msg.id === item.id ? { ...msg, copied: false } : msg
                          )
                        );
                      }, 2000);
                    }}
                  >
                    <Icon
                      name={item.copied ? "checkmark-circle" : "copy-outline"}
                      size={18}
                      color={item.copied ? "#4caf50" : "#666"}
                    />
                  </TouchableOpacity>
                )}
              </ListItem>
            </View>
          )}
          style={{ flex: 1 }}
        />
      </View>
      
      {/* Input area with KeyboardAvoidingView */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'position' : 'height'}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.inputBackground,
        }}
      >
        <Input
          placeholder={placeholder}
          value={inputText}
          onChangeText={setInputText}
          multiline={inputMultiline}
          numberOfLines={inputMultiline ? 3 : 1}
          onSubmitEditing={sendMessage}
          inputContainerStyle={{
            borderBottomWidth: 0,
            paddingVertical: 0,
          }}
          inputStyle={{
            maxHeight: 50,
            color: colors.inputText,
            paddingTop: "3%",
          }}
          rightIcon={
            <Button
              title={inputMultiline ? "Send" : ""}
              disabled={inputText.trim() === '' || isLoading}
              onPress={sendMessage}
              containerStyle={{ marginLeft: 8 }}
              loading={isLoading}
              icon={<Icon name="send" size={24} color={colors.tint} />}
            />
          }
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          containerStyle={{
            marginTop: 0,
            paddingVertical: 0,
            backgroundColor: colors.inputBackground,
          }}
        />
      </KeyboardAvoidingView>

      {/* Clipboard notification */}
      <ClipboardNotificationBanner
        message={"Copied to clipboard"}
        duration={2000}
        visibleSnack={visibleSnack}
        onDismiss={hideSnack}
      />
    </View>
  );
};

export default ChatMessages; 