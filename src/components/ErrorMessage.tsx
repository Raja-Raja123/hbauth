/**
 * Error Message Component
 * Reusable error display
 */

import React from 'react';
import { Text, View, StyleSheet, ViewStyle } from 'react-native';

interface ErrorMessageProps {
  message: string;
  containerStyle?: ViewStyle;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  containerStyle
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    marginVertical: 16,
  },
  text: {
    color: '#C62828',
    fontSize: 14,
    margin: 0,
  },
});
