declare module 'react-native-markdown-display';
declare module '@react-native-async-storage/async-storage';

// Define Ionicons component
declare module 'react-native-elements/dist/icons/Ionicons' {
  import { Component } from 'react';
  
  interface IoniconsProps {
    name: string;
    size?: number;
    color?: string;
    style?: any;
    [key: string]: any;
  }
  
  export default class Ionicons extends Component<IoniconsProps> {}
}

// Other react-native-elements components
declare module 'react-native-elements' {
  import { ComponentType, ReactNode, FunctionComponent, Component, ReactElement } from 'react';
  
  export interface AvatarProps {
    rounded?: boolean;
    size?: number | string;
    source?: any;
    title?: string;
    icon?: object;
    containerStyle?: any;
    [key: string]: any;
  }
  
  export interface ButtonProps {
    title?: string;
    icon?: object;
    onPress?: () => void;
    disabled?: boolean;
    loading?: boolean;
    containerStyle?: any;
    buttonStyle?: any;
    titleStyle?: any;
    type?: 'solid' | 'clear' | 'outline';
    [key: string]: any;
  }
  
  export interface InputProps {
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    multiline?: boolean;
    inputContainerStyle?: any;
    containerStyle?: any;
    inputStyle?: any;
    rightIcon?: ReactNode;
    leftIcon?: ReactNode;
    [key: string]: any;
  }
  
  export interface ListItemProps {
    title?: ReactNode;
    subtitle?: ReactNode;
    leftAvatar?: object;
    rightIcon?: ReactNode;
    leftIcon?: ReactNode;
    containerStyle?: any;
    [key: string]: any;
  }
  
  export interface ListItemContentProps {
    [key: string]: any;
  }
  
  export interface ListItemTitleProps {
    style?: any;
    [key: string]: any;
  }
  
  export interface ListItemSubtitleProps {
    style?: any;
    [key: string]: any;
  }
  
  export const Avatar: FunctionComponent<AvatarProps>;
  export const Button: FunctionComponent<ButtonProps>;
  export const Input: FunctionComponent<InputProps>;
  
  // Define the component with its subcomponents
  type ListItemContentType = FunctionComponent<ListItemContentProps>;
  type ListItemTitleType = FunctionComponent<ListItemTitleProps>;
  type ListItemSubtitleType = FunctionComponent<ListItemSubtitleProps>;
  
  interface ListItemType extends FunctionComponent<ListItemProps> {
    Content: ListItemContentType;
    Title: ListItemTitleType;
    Subtitle: ListItemSubtitleType;
  }
  
  export const ListItem: ListItemType;
}

// Add expo-clipboard
declare module 'expo-clipboard' {
  export function setStringAsync(text: string): Promise<void>;
  export function getStringAsync(): Promise<string>;
  export default {
    setStringAsync,
    getStringAsync
  };
}

// Add any other modules that need declarations here 