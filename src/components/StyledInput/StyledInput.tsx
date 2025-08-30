import React, { useRef, useState, useEffect } from "react";
import {
    TextInput,
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    TextInputProps,
    Text,
    ActivityIndicator,
} from "react-native";

interface StyledInputProps extends TextInputProps {
    fullWidth?: boolean;
    variant?: "white" | "default";
    label?: string;
    loading?: boolean;
    disabled?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    focusColor?: string;
    errorColor?: string;
    disabledColor?: string;
    shadowColor?: string;
    containerStyle?: any;
    labelStyle?: any;
    errorStyle?: any;
    validator?: (value: string) => string | null; // returns error message or null
}

export const StyledInput = React.forwardRef<TextInput, StyledInputProps>(({
    fullWidth,
    variant = "default",
    label,
    loading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    focusColor = "#800080",
    errorColor = "#FF3B30",
    disabledColor = "#E5E5E7",
    shadowColor = "#800080",
    style,
    containerStyle,
    labelStyle,
    errorStyle,
    validator,
    value: propValue,
    onChangeText,
    ...props
}, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [internalError, setInternalError] = useState<string | null>(null);
    const [value, setValue] = useState(propValue || "");
    const inputRef = useRef<TextInput>(null);

    // Sync internal state if parent changes value
    useEffect(() => {
        setValue(propValue || "");
    }, [propValue]);

    const getBorderColor = () => {
        if (disabled) return disabledColor;
        if (internalError) return errorColor;
        if (isFocused) return focusColor;
        return "#ccc";
    };

    const getBackgroundColor = () => {
        if (disabled) return "#F2F2F7";
        if (variant === "white") return "#fff";
        return "#fff";
    };

    const getOuterContainerStyle = () => {
        return {
            backgroundColor:
                isFocused && !disabled && !internalError
                    ? shadowColor
                    : "transparent",
            padding: 2,
        };
    };

    const handleFocus = (e: any) => {
        if (!disabled) {
            setIsFocused(true);
            props.onFocus?.(e);
        }
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        if (validator) {
            const err = validator(value);
            setInternalError(err);
        }
        props.onBlur?.(e);
    };

    const handleChangeText = (text: string) => {
        setValue(text);
        if (internalError) setInternalError(null); // Clear error when typing
        onChangeText?.(text);
    };

    const handleContainerPress = () => {
        if (!disabled) {
            (ref as any)?.current?.focus() || inputRef.current?.focus();
        }
    };

    return (
        <View style={[fullWidth && { width: "100%" }, containerStyle]}>
            {/* Label */}
            {label && (
                <Text
                    style={[
                        styles.label,
                        labelStyle,
                        disabled && { color: disabledColor },
                    ]}
                >
                    {label}
                </Text>
            )}

            {/* Input Container */}
            <TouchableWithoutFeedback onPress={handleContainerPress}>
                <View
                    style={[
                        styles.outerContainer,
                        getOuterContainerStyle(),
                    ]}
                >
                    <View
                        style={[
                            styles.container,
                            {
                                borderColor: getBorderColor(),
                                backgroundColor: getBackgroundColor(),
                            },
                            disabled && styles.disabled,
                        ]}
                    >
                        {/* Left Icon */}
                        {leftIcon && (
                            <View style={styles.leftIconContainer}>
                                {leftIcon}
                            </View>
                        )}

                        {/* Text Input */}
                        <TextInput
                            ref={ref || inputRef}
                            style={[
                                styles.input,
                                leftIcon && { marginLeft: 8 },
                                (rightIcon || loading) && { marginRight: 8 },
                                disabled && { color: disabledColor },
                                style,
                            ]}
                            value={value}
                            onChangeText={handleChangeText}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            placeholderTextColor={
                                disabled ? disabledColor : "#888"
                            }
                            editable={!disabled && !loading}
                            {...props}
                        />

                        {/* Right Icon or Loader */}
                        {loading ? (
                            <View style={styles.rightIconContainer}>
                                <ActivityIndicator
                                    size="small"
                                    color={focusColor}
                                />
                            </View>
                        ) : rightIcon ? (
                            <View style={styles.rightIconContainer}>
                                {rightIcon}
                            </View>
                        ) : null}
                    </View>
                </View>
            </TouchableWithoutFeedback>

            {/* Error Message */}
            {internalError && (
                <Text style={[styles.errorText, errorStyle]}>
                    {internalError}
                </Text>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    outerContainer: {
        borderRadius: 10,
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1.5,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        minHeight: 48,
    },
    input: {
        flex: 1,
        fontSize: 16,
        padding: 0,
        color: "#000",
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 6,
        color: "#333",
    },
    leftIconContainer: {
        marginRight: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    rightIconContainer: {
        marginLeft: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    disabled: {
        opacity: 0.6,
    },
    errorText: {
        fontSize: 12,
        color: "#FF3B30",
        marginTop: 4,
        marginLeft: 4,
    },
});
