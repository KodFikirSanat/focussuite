import React, { useState } from 'react';
import { View, Modal, Pressable, StyleSheet, FlatList } from 'react-native';
import * as Haptics from 'expo-haptics';
import { BaseInputProps } from '@/types';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface PickerOption {
  label: string;
  value: string | number;
}

interface PickerProps extends BaseInputProps {
  value: string | number | undefined;
  onValueChange: (value: string | number) => void;
  options: PickerOption[];
  modalTitle?: string;
}

export const Picker: React.FC<PickerProps> = ({
  value,
  onValueChange,
  options,
  label,
  placeholder = 'Select an option',
  error,
  helperText,
  required = false,
  disabled = false,
  modalTitle,
  style,
  ...rest
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const placeholderColor = useThemeColor({}, 'tabIconDefault');

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (selectedValue: string | number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onValueChange(selectedValue);
    setIsVisible(false);
  };

  const openPicker = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsVisible(true);
  };

  const getBorderColor = () => {
    if (error) return '#FF6B6B';
    return 'rgba(0,0,0,0.1)';
  };

  const renderOption = ({ item }: { item: PickerOption }) => (
    <Pressable
      style={({ pressed }) => [
        styles.option,
        pressed && styles.optionPressed,
        item.value === value && styles.selectedOption,
      ]}
      onPress={() => handleSelect(item.value)}
    >
      <ThemedText
        style={[
          styles.optionText,
          item.value === value && { color: tintColor, fontWeight: '600' },
        ]}
      >
        {item.label}
      </ThemedText>
      {item.value === value && (
        <IconSymbol name="checkmark" size={20} color={tintColor} />
      )}
    </Pressable>
  );

  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.labelContainer}>
          <ThemedText style={styles.label}>
            {label}
            {required && <ThemedText style={styles.required}> *</ThemedText>}
          </ThemedText>
        </View>
      )}

      <Pressable
        style={[
          styles.pickerContainer,
          {
            backgroundColor,
            borderColor: getBorderColor(),
          },
          disabled && styles.disabledContainer,
          error && styles.errorContainer,
        ]}
        onPress={openPicker}
        disabled={disabled}
      >
        <ThemedText
          style={[
            styles.pickerText,
            !selectedOption && { color: placeholderColor },
          ]}
          numberOfLines={1}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </ThemedText>

        <IconSymbol
          name="chevron.down"
          size={20}
          color={disabled ? placeholderColor : textColor}
        />
      </Pressable>

      {(error || helperText) && (
        <View style={styles.messageContainer}>
          <ThemedText
            style={[
              styles.message,
              error ? styles.errorMessage : styles.helperMessage,
            ]}
          >
            {error || helperText}
          </ThemedText>
        </View>
      )}

      <Modal
        visible={isVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsVisible(false)}
      >
        <ThemedView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <ThemedText type="title" style={styles.modalTitle}>
              {modalTitle || label || 'Select Option'}
            </ThemedText>
            <Pressable
              style={styles.closeButton}
              onPress={() => setIsVisible(false)}
            >
              <ThemedText style={[styles.closeText, { color: tintColor }]}>
                Done
              </ThemedText>
            </Pressable>
          </View>

          <FlatList
            data={options}
            renderItem={renderOption}
            keyExtractor={(item) => String(item.value)}
            style={styles.optionsList}
            showsVerticalScrollIndicator={false}
          />
        </ThemedView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  labelContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  required: {
    color: '#FF6B6B',
  },
  pickerContainer: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disabledContainer: {
    opacity: 0.6,
  },
  errorContainer: {
    borderColor: '#FF6B6B',
  },
  pickerText: {
    fontSize: 16,
    flex: 1,
  },
  messageContainer: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  message: {
    fontSize: 14,
  },
  errorMessage: {
    color: '#FF6B6B',
  },
  helperMessage: {
    opacity: 0.7,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionsList: {
    flex: 1,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  optionPressed: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  selectedOption: {
    backgroundColor: 'rgba(0,122,255,0.1)',
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
});