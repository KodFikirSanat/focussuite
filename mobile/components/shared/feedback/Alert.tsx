import React from 'react';
import { View, Modal, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { SecondaryButton } from '../buttons/SecondaryButton';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface AlertAction {
  text: string;
  onPress: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface AlertProps {
  visible: boolean;
  title: string;
  message?: string;
  actions: AlertAction[];
  onDismiss?: () => void;
  dismissable?: boolean;
}

export const Alert: React.FC<AlertProps> = ({
  visible,
  title,
  message,
  actions,
  onDismiss,
  dismissable = true,
}) => {
  const backgroundColor = useThemeColor({}, 'background');
  const overlayColor = 'rgba(0,0,0,0.5)';

  React.useEffect(() => {
    if (visible) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [visible]);

  const handleBackdropPress = () => {
    if (dismissable && onDismiss) {
      onDismiss();
    }
  };

  const handleActionPress = (action: AlertAction) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    action.onPress();
  };

  const renderAction = (action: AlertAction, index: number) => {
    const isDestructive = action.style === 'destructive';
    const isCancel = action.style === 'cancel';
    const isPrimary = action.style === 'default' || (!isDestructive && !isCancel);

    if (isPrimary) {
      return (
        <PrimaryButton
          key={index}
          title={action.text}
          onPress={() => handleActionPress(action)}
          fullWidth
          style={[styles.actionButton, index > 0 && styles.actionSpacing]}
        />
      );
    }

    return (
      <SecondaryButton
        key={index}
        title={action.text}
        onPress={() => handleActionPress(action)}
        fullWidth
        variant={isDestructive ? 'danger' : 'secondary'}
        style={[styles.actionButton, index > 0 && styles.actionSpacing]}
      />
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleBackdropPress}
    >
      <Pressable style={styles.overlay} onPress={handleBackdropPress}>
        <View style={styles.container}>
          <Pressable onPress={() => {}}>
            <ThemedView style={[styles.alert, { backgroundColor }]}>
              <View style={styles.content}>
                <ThemedText style={styles.title}>{title}</ThemedText>
                {message && (
                  <ThemedText style={styles.message}>{message}</ThemedText>
                )}
              </View>

              <View style={styles.actionsContainer}>
                {actions.map(renderAction)}
              </View>
            </ThemedView>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

// Static methods for common alert types
export const AlertUtils = {
  show: (title: string, message?: string, actions?: AlertAction[]) => {
    // TODO: Implement global alert state management
    console.warn('AlertUtils.show not implemented yet. Use Alert component directly.');
  },

  confirm: (
    title: string,
    message?: string,
    onConfirm?: () => void,
    onCancel?: () => void
  ) => {
    const actions: AlertAction[] = [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: onCancel || (() => {}),
      },
      {
        text: 'Confirm',
        style: 'default',
        onPress: onConfirm || (() => {}),
      },
    ];

    // TODO: Implement global alert state management
    console.warn('AlertUtils.confirm not implemented yet. Use Alert component directly.');
  },

  error: (title: string, message?: string, onDismiss?: () => void) => {
    const actions: AlertAction[] = [
      {
        text: 'OK',
        style: 'default',
        onPress: onDismiss || (() => {}),
      },
    ];

    // TODO: Implement global alert state management
    console.warn('AlertUtils.error not implemented yet. Use Alert component directly.');
  },
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    maxWidth: 400,
  },
  alert: {
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  content: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    opacity: 0.8,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    marginHorizontal: 0,
  },
  actionSpacing: {
    marginTop: 8,
  },
});