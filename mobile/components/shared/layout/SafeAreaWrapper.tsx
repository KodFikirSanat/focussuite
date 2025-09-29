import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';
import { BaseComponentProps } from '@/types';

interface SafeAreaWrapperProps extends BaseComponentProps, Omit<SafeAreaViewProps, 'style'> {
  backgroundColor?: string;
  flex?: boolean;
}

export const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({
  children,
  backgroundColor,
  flex = true,
  style,
  ...rest
}) => {
  return (
    <SafeAreaView
      style={[
        flex && styles.flex,
        backgroundColor && { backgroundColor },
        style,
      ]}
      {...rest}
    >
      <ThemedView style={styles.content}>
        {children}
      </ThemedView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});