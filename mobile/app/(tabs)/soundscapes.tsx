import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaWrapper } from '@/components/shared/layout';
import { ThemedText } from '@/components/themed-text';

export default function SoundscapesScreen() {
  return (
    <SafeAreaWrapper style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Soundscapes
      </ThemedText>
      <ThemedText style={styles.placeholder}>
        Frequency-based sounds with mixing capabilities coming soon...
      </ThemedText>
      {/* TODO: Implement soundscape components */}
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  placeholder: {
    textAlign: 'center',
    opacity: 0.7,
  },
});