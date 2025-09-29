import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Platform } from 'react-native';
import { BaseInputProps } from '@/types';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

interface TextFieldProps extends BaseInputProps {
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  returnKeyType?: 'done' | 'next' | 'search' | 'send' | 'go';
  onSubmitEditing?: () => void;
  maxLength?: number;
  editable?: boolean;
}

export const TextField: React.FC<TextFieldProps> = ({
  value,
  onChangeText,
  label,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  returnKeyType = 'done',
  onSubmitEditing,
  maxLength,
  editable = true,
  style,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const placeholderColor = useThemeColor({}, 'tabIconDefault');

  const getBorderColor = () => {
    if (error) return '#FF6B6B';
    if (isFocused) return tintColor;
    return 'rgba(0,0,0,0.1)';
  };

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

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor,
            borderColor: getBorderColor(),
          },
          multiline && styles.multilineContainer,
          disabled && styles.disabledContainer,
          error && styles.errorContainer,
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          maxLength={maxLength}
          editable={editable && !disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.input,
            {
              color: textColor,
              minHeight: multiline ? numberOfLines * 20 : undefined,
            },
          ]}
          {...rest}
        />
      </View>

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
  inputContainer: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 16 : 12,
  },
  multilineContainer: {
    paddingVertical: 16,
  },
  disabledContainer: {
    opacity: 0.6,
  },
  errorContainer: {
    borderColor: '#FF6B6B',
  },
  input: {
    fontSize: 16,
    lineHeight: 20,
    textAlignVertical: 'top',
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
});