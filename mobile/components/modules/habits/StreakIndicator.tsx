import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';

interface StreakIndicatorProps {
  streak: number;
  frequency: 'daily' | 'weekly' | 'custom';
  maxStreak?: number;
}

export const StreakIndicator: React.FC<StreakIndicatorProps> = ({
  streak,
  frequency,
  maxStreak,
}) => {
  const getStreakColor = () => {
    if (streak === 0) return '#999';
    if (streak < 7) return '#FF9500';
    if (streak < 30) return '#34C759';
    return '#AF52DE';
  };

  const getFrequencyText = () => {
    switch (frequency) {
      case 'daily': return 'day streak';
      case 'weekly': return 'week streak';
      default: return 'streak';
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.fireIcon, { backgroundColor: getStreakColor() }]}>
        <ThemedText style={styles.fireEmoji}>🔥</ThemedText>
      </View>

      <View style={styles.textContainer}>
        <ThemedText style={[styles.streakNumber, { color: getStreakColor() }]}>
          {streak}
        </ThemedText>
        <ThemedText style={styles.streakText}>
          {getFrequencyText()}
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fireIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  fireEmoji: {
    fontSize: 14,
  },
  textContainer: {
    alignItems: 'flex-start',
  },
  streakNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  streakText: {
    fontSize: 12,
    opacity: 0.7,
    lineHeight: 14,
  },
});