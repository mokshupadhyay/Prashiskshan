import React, { FC, useState, useRef, useEffect } from "react";
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Keyboard,
    TouchableWithoutFeedback,
    SafeAreaView,
    Text,
    Alert,
    TextInput,
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";

import { StyledButton } from "../../components/StyledButton/StyledButton";
import { StyledInput } from "../../components/StyledInput/StyledInput";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

type RootStackParamList = {
    Login: undefined;
    OTP: { inputType: "email" | "phone" | "unknown"; value: string; context?: "login" | "verification" };
    UserDetails: { inputType: "email" | "phone" | "unknown"; value: string };
};

type LoginScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Login"
>;

export const Login: FC = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        // Auto-focus input field
        const timer = setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    const isEmail = (value: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    const isPhone = (value: string) =>
        /^\+?\d{10,15}$/.test(value.trim());

    const validateEmailOrPhone = (value: string) => {
        if (!value.trim()) return "Please enter your email or phone number";
        if (!isEmail(value) && !isPhone(value))
            return "Please enter a valid email or phone number";
        return null;
    };

    const isValidInput = !validateEmailOrPhone(inputValue);

    const handleNext = async () => {
        if (!isValidInput) return;

        setLoading(true);

        try {
            // Simulate API call delay (optional)
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Determine input type
            let type: "email" | "phone" | "unknown" = "unknown";
            if (isEmail(inputValue)) {
                type = "email";
            } else if (isPhone(inputValue)) {
                type = "phone";
            }

            // Navigate to OTP screen
            navigation.navigate("OTP", {
                inputType: type,
                value: inputValue,
                context: "login",
            });
        } catch (err: any) {
            console.error("Login navigation error:", err);
            Alert.alert(
                "Error",
                "Something went wrong. Please try again.",
                [{ text: "OK" }]
            );
        } finally {
            setLoading(false);
        }
    };

    const getInputIcon = () => {
        if (!inputValue) return null;
        if (isEmail(inputValue)) {
            return <Ionicons name="mail-outline" size={20} color="#800080" />;
        } else if (isPhone(inputValue)) {
            return <Ionicons name="call-outline" size={20} color="#800080" />;
        }
        return null;
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoiding}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.screen}>
                        {/* Back Chevron */}
                        <View style={styles.header}>
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                style={styles.backButton}
                                disabled={loading}
                            >
                                <Ionicons
                                    name="chevron-back"
                                    size={26}
                                    color={loading ? "#ccc" : "#000"}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Top Instruction Text */}
                        <Text style={styles.topInstruction}>
                            Enter your email or phone number
                        </Text>

                        {/* Input Section */}
                        <View style={styles.inputWrapper}>
                            <StyledInput
                                ref={inputRef}
                                placeholder="Enter your email or phone"
                                value={inputValue}
                                onChangeText={setInputValue}
                                variant="white"
                                fullWidth
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                loading={loading}
                                disabled={loading}
                                rightIcon={getInputIcon()}
                                focusColor="#800080"
                                errorColor="#FF3B30"
                                shadowColor="#800080"
                                validator={validateEmailOrPhone}
                            />
                        </View>

                        {/* Spacer to push button to bottom */}
                        <View style={styles.spacer} />

                        {/* Continue Button */}
                        <View style={styles.bottomButton}>
                            <StyledButton
                                title={loading ? "Please wait..." : "Continue"}
                                onPress={handleNext}
                                disabled={!isValidInput || loading}
                                buttonStyle={{
                                    backgroundColor: (isValidInput && !loading) ? "#800080" : "#ccc",
                                    paddingVertical: 14,
                                    borderRadius: 10,
                                }}
                                fullWidth
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "transparent",
    },
    keyboardAvoiding: {
        flex: 1,
    },
    screen: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: "#fff",
        borderBottomColor: "#ccc",
        borderBottomWidth: 0.8,
    },
    backButton: {},
    topInstruction: {
        fontSize: 20,
        fontWeight: "500",
        color: "#333",
        paddingHorizontal: 25,
        marginTop: 20,
    },
    inputWrapper: {
        paddingHorizontal: 25,
        marginTop: 10,
    },
    spacer: {
        flex: 1,
    },
    bottomButton: {
        paddingHorizontal: 25,
        marginBottom: 40,
    },
});
