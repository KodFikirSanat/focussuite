import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { NavigationHeaderProps } from '@/types';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackButton } from './BackButton';

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  title,
  showBackButton = false,
  rightAction,
  onBackPress,
}) => {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <View style={styles.content}>
          {showBackButton && (
            <View style={styles.leftAction}>
              <BackButton onPress={onBackPress} />
            </View>
          )}

          <View style={styles.titleContainer}>
            <ThemedText type="title" style={styles.title} numberOfLines={1}>
              {title}
            </ThemedText>
          </View>

          <View style={styles.rightAction}>
            {rightAction || null}
          </View>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'transparent',
  },
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  leftAction: {
    width: 40,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  rightAction: {
    width: 40,
    alignItems: 'flex-end',
  },
});