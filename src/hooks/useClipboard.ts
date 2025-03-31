import { useState } from 'react';
import * as Clipboard from 'expo-clipboard';

export interface UseClipboardResult {
  visibleSnack: boolean;
  showSnack: () => void;
  hideSnack: () => void;
  copyToClipboard: (text: string) => Promise<boolean>;
}

export const useClipboard = (
  duration = 2000
): UseClipboardResult => {
  const [visibleSnack, setVisibleSnack] = useState(false);

  const showSnack = () => setVisibleSnack(true);
  const hideSnack = () => setVisibleSnack(false);

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      await Clipboard.setStringAsync(text);
      showSnack();

      // Automatically hide snack after duration
      setTimeout(() => {
        hideSnack();
      }, duration);

      return true;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
  };

  return {
    visibleSnack,
    showSnack,
    hideSnack,
    copyToClipboard
  };
}; 