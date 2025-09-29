import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaWrapper } from '@/components/shared/layout';
import { ThemedText } from '@/components/themed-text';
import { HabitCard } from '@/components/modules/habits';
import { PrimaryButton } from '@/components/shared/buttons';
import type { Habit } from '@/types';

// Mock data
const mockHabits: Habit[] = [
  {
    id: '1',
    title: 'Drink Water',
    description: 'Drink 8 glasses of water throughout the day',
    frequency: 'daily',
    streak: 5,
    completedDates: [],
    color: '#3498db',
  },
  {
    id: '2',
    title: 'Morning Exercise',
    description: '30 minutes of cardio or strength training',
    frequency: 'daily',
    streak: 12,
    completedDates: [],
    color: '#e74c3c',
  },
];

export default function HabitsScreen() {
  const [habits, setHabits] = React.useState<Habit[]>(mockHabits);

  const handleHabitComplete = (habitId: string) => {
    // TODO: Implement habit completion logic
    console.log('Complete habit:', habitId);
  };

  const handleAddHabit = () => {
    // TODO: Navigate to add habit screen
    console.log('Add new habit');
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Daily Habits
        </ThemedText>
        <PrimaryButton
          title="Add Habit"
          onPress={handleAddHabit}
          size="small"
        />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.habitsList}>
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onComplete={() => handleHabitComplete(habit.id)}
              onPress={() => console.log('View habit details:', habit.id)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  habitsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});