import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Habit } from '@/types';
import { Card } from '@/components/shared/layout';
import { ThemedText } from '@/components/themed-text';
import { LongPressButton } from '@/components/shared/buttons';
import { StreakIndicator } from './StreakIndicator';

interface HabitCardProps {
  habit: Habit;
  onPress?: () => void;
  onComplete?: () => void;
  onLongPress?: () => void;
  completed?: boolean;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onPress,
  onComplete,
  onLongPress,
  completed = false,
}) => {
  const handleComplete = () => {
    // TODO: Implement habit completion logic
    onComplete?.();
  };

  return (
    <Card
      onPress={onPress}
      pressable={!!onPress}
      style={[styles.card, completed && styles.completedCard]}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <ThemedText type="defaultSemiBold" style={styles.title}>
            {habit.title}
          </ThemedText>
          {habit.description && (
            <ThemedText style={styles.description} numberOfLines={2}>
              {habit.description}
            </ThemedText>
          )}
        </View>

        {/* TODO: Add habit icon */}
        <View style={styles.iconContainer}>
          {/* <IconSymbol name={habit.icon || 'star'} size={24} color={habit.color} /> */}
        </View>
      </View>

      <View style={styles.footer}>
        <StreakIndicator
          streak={habit.streak}
          frequency={habit.frequency}
        />

        <LongPressButton
          title={completed ? 'Completed' : 'Complete'}
          onPress={handleComplete}
          onLongPress={onLongPress}
          style={[
            styles.completeButton,
            completed && styles.completedButton,
          ]}
          disabled={completed}
          longPressDuration={500}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
  },
  completedCard: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 18,
  },
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  completeButton: {
    minWidth: 100,
  },
  completedButton: {
    backgroundColor: '#4CAF50',
  },
});