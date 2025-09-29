import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { BaseComponentProps } from '@/types';

interface ContainerProps extends BaseComponentProps {
  padding?: number;
  margin?: number;
  flex?: number;
  centered?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  padding = 16,
  margin = 0,
  flex,
  centered = false,
  style,
  ...rest
}) => {
  const containerStyle = [
    styles.container,
    {
      padding,
      margin,
      flex,
    },
    centered && styles.centered,
    style,
  ];

  return (
    <ThemedView style={containerStyle} {...rest}>
      {children}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});