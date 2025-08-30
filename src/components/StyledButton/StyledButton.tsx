// import React, { FC, ReactNode } from "react";
// import {
//     ActivityIndicator,
//     Platform,
//     StyleSheet,
//     Text,
//     TextStyle,
//     TouchableOpacity,
//     View,
//     ViewStyle,
//     GestureResponderEvent,
// } from "react-native";

// type Variant = "primary" | "secondary" | "danger";

// interface StyledButtonProps {
//     title: string;
//     onPress: (event: GestureResponderEvent) => void;
//     buttonStyle?: ViewStyle;
//     textStyle?: TextStyle;
//     disabled?: boolean;
//     activeOpacity?: number;
//     loading?: boolean;
//     loadingColor?: string;
//     loadingSize?: "small" | "large";
//     variant?: Variant;
//     fullWidth?: boolean;
//     iconLeft?: ReactNode;
//     iconRight?: ReactNode;
//     accessibilityLabel?: string;
//     accessibilityHint?: string;
//     hitSlop?: { top?: number; bottom?: number; left?: number; right?: number };
//     onPressIn?: (event: GestureResponderEvent) => void;
//     onPressOut?: (event: GestureResponderEvent) => void;
// }

// export const StyledButton: FC<StyledButtonProps> = ({
//     title,
//     onPress,
//     buttonStyle,
//     textStyle,
//     disabled = false,
//     activeOpacity = 0.7,
//     loading = false,
//     loadingColor = "#fff",
//     loadingSize = "small",
//     variant = "primary",
//     fullWidth = false,
//     iconLeft,
//     iconRight,
//     accessibilityLabel,
//     accessibilityHint,
//     hitSlop,
//     onPressIn,
//     onPressOut,
// }) => {
//     return (
//         <TouchableOpacity
//             accessible={true}
//             accessibilityRole="button"
//             accessibilityState={{ disabled: disabled || loading }}
//             accessibilityLabel={accessibilityLabel ?? title}
//             accessibilityHint={accessibilityHint}
//             disabled={disabled || loading}
//             onPress={onPress}
//             onPressIn={onPressIn}
//             onPressOut={onPressOut}
//             activeOpacity={activeOpacity}
//             hitSlop={hitSlop}
//             style={[
//                 styles.buttonStyleDefault,
//                 variantStyles[variant],
//                 fullWidth && styles.fullWidth,
//                 buttonStyle,
//                 (disabled || loading) && styles.disabledButton,
//             ]}
//         >
//             <View style={styles.contentContainer}>
//                 {iconLeft && <View style={styles.icon}>{iconLeft}</View>}
//                 {loading ? (
//                     <ActivityIndicator size={loadingSize} color={loadingColor} />
//                 ) : (
//                     <Text style={[styles.textStyleDefault, textStyle]}>{title}</Text>
//                 )}
//                 {iconRight && <View style={styles.icon}>{iconRight}</View>}
//             </View>
//         </TouchableOpacity>
//     );
// };

// const variantStyles = StyleSheet.create({
//     primary: { backgroundColor: "#007bff" },
//     secondary: { backgroundColor: "#6c757d" },
//     danger: { backgroundColor: "#dc3545" },
// });

// const styles = StyleSheet.create({
//     buttonStyleDefault: {
//         paddingVertical: 12,
//         paddingHorizontal: 20,
//         borderRadius: 6,
//         alignItems: "center",
//         justifyContent: "center",
//         ...Platform.select({
//             ios: {
//                 shadowColor: "#000",
//                 shadowOffset: { width: 0, height: 2 },
//                 shadowOpacity: 0.25,
//                 shadowRadius: 3.84,
//             },
//             android: {
//                 elevation: 5,
//             },
//         }),
//     },
//     textStyleDefault: {
//         color: "#fff",
//         fontSize: 16,
//         fontWeight: "600",
//     },
//     disabledButton: {
//         backgroundColor: "#999999",
//     },
//     fullWidth: {
//         alignSelf: "stretch",
//     },
//     contentContainer: {
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     icon: {
//         marginHorizontal: 5,
//     },
// });
import React, { FC, ReactNode } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

type Variant = "primary" | "secondary" | "danger" | "white" | "text";

interface StyledButtonProps {
    title: string;
    onPress: () => void;
    buttonStyle?: ViewStyle;
    textStyle?: TextStyle;
    disabled?: boolean;
    activeOpacity?: number;
    loading?: boolean;
    loadingColor?: string;
    variant?: Variant;
    fullWidth?: boolean;
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
}

export const StyledButton: FC<StyledButtonProps> = ({
    title,
    onPress,
    buttonStyle,
    textStyle,
    disabled = false,
    activeOpacity = 0.7,
    loading = false,
    loadingColor = "#000",
    variant = "primary",
    fullWidth = false,
    iconLeft,
    iconRight,
}) => {
    return (
        <TouchableOpacity
            accessible={true}
            accessibilityRole="button"
            accessibilityState={{ disabled: disabled || loading }}
            accessibilityLabel={title}
            disabled={disabled || loading}
            onPress={onPress}
            activeOpacity={activeOpacity}
            style={[
                styles.buttonStyleDefault,
                variantStyles[variant],
                fullWidth && styles.fullWidth,
                buttonStyle,
                (disabled || loading) && styles.disabledButton,
            ]}
        >
            <View style={styles.contentContainer}>
                {iconLeft && <View style={styles.icon}>{iconLeft}</View>}
                {loading ? (
                    <ActivityIndicator size="small" color={loadingColor} />
                ) : (
                    <Text
                        style={[
                            styles.textStyleDefault,
                            variant === "white" && styles.textStyleBlack,
                            variant === "text" && styles.textVariantText,
                            textStyle,
                        ]}
                    >
                        {title}
                    </Text>
                )}
                {iconRight && <View style={styles.icon}>{iconRight}</View>}
            </View>
        </TouchableOpacity>
    );
};

const variantStyles = StyleSheet.create({
    primary: { backgroundColor: "#007bff" },
    secondary: { backgroundColor: "#6c757d" },
    danger: { backgroundColor: "#dc3545" },
    white: {
        backgroundColor: "#fff",
    },
    text: {
        backgroundColor: "transparent",
        elevation: 0,
        shadowOpacity: 0,
    },
});

const styles = StyleSheet.create({
    buttonStyleDefault: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    textStyleDefault: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    textStyleBlack: {
        color: "#000",
    },
    textVariantText: {
        color: "#00357C",
        fontWeight: "500",
    },
    disabledButton: {
        backgroundColor: "#999999",
    },
    fullWidth: {
        alignSelf: "stretch",
    },
    contentContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        marginRight: 8,
    },
});
