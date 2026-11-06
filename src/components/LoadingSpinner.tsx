/**
 * Loading Spinner Component
 * Reusable loading indicator
 */

import React from 'react';
import { ActivityIndicator, View, StyleSheet, ViewStyle } from 'react-native';

export const LoadingSpinner: React.FC<{
  containerStyle?: ViewStyle;
  indicatorStyle?: ViewStyle;
}> = ({
  containerStyle,
  indicatorStyle
}) => {
  return (
    <View style={containerStyle || styles.container}>
      <ActivityIndicator
        style={indicatorStyle}
        size="large"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
