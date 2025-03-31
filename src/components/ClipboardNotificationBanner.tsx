import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface ClipboardNotificationBannerProps {
  message: string;
  duration?: number;
  visibleSnack: boolean;
  onDismiss?: () => void;
  color?: string;
  textColor?: string;
}

const ClipboardNotificationBanner: React.FC<ClipboardNotificationBannerProps> = ({
  message,
  duration = 2000,
  visibleSnack,
  onDismiss,
  color = '#333',
  textColor = '#fff'
}) => {
  const opacity = new Animated.Value(0);

  useEffect(() => {
    if (visibleSnack) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(duration - 600),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (onDismiss) {
          onDismiss();
        }
      });
    }
  }, [visibleSnack, duration, opacity, onDismiss]);

  if (!visibleSnack) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity, backgroundColor: color },
      ]}
    >
      <Text style={[styles.text, { color: textColor }]}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 70,
    left: '10%',
    right: '10%',
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    color: '#fff',
    fontSize: 14,
  },
});

export default ClipboardNotificationBanner; 