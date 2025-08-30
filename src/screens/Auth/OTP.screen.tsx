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
    Animated,
    Easing,
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";

import { StyledButton } from "../../components/StyledButton/StyledButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

type RootStackParamList = {
    Login: undefined;
    OTP: {
        inputType: "email" | "phone" | "unknown";
        value: string;
        context?: "login" | "verification"; // login flow or verification in UserDetails
    };
    UserDetails: {
        inputType: "email" | "phone" | "unknown";
        value: string;
        verified?: boolean;
    };
};

type OTPScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "OTP"
>;

type OTPScreenRouteProp = RouteProp<RootStackParamList, "OTP">;

export const OTP: FC = () => {
    const navigation = useNavigation<OTPScreenNavigationProp>();
    const route = useRoute<OTPScreenRouteProp>();

    const { inputType, value, context = "login" } = route.params;

    const [otp, setOtp] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Animation values for loader
    const progressAnim = useRef(new Animated.Value(0)).current;

    // Input refs
    const inputRefs = useRef<(TextInput | null)[]>([]);

    useEffect(() => {
        // Auto-focus first input
        const timer = setTimeout(() => {
            if (inputRefs.current[0]) {
                inputRefs.current[0].focus();
            }
        }, 300);

        return () => clearTimeout(timer);
    }, []);



    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            // Move to previous input on backspace if current is empty
            inputRefs.current[index - 1]?.focus();
            setCurrentIndex(index - 1);
        }
    };

    const handleSubmitEditing = (index: number) => {
        if (index < 3 && otp[index]) {
            // Move to next input on "Next" key press
            inputRefs.current[index + 1]?.focus();
            setCurrentIndex(index + 1);
        } else if (index === 3 && otp.every(digit => digit !== '')) {
            // All digits entered, verify OTP
            handleVerifyOtp();
        }
    };

    const startProgressAnimation = () => {
        progressAnim.setValue(0);
        Animated.timing(progressAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            useNativeDriver: false,
        }).start();
    };
    const handleOtpChange = (text: string, index: number) => {
        // Only allow single digit
        const sanitizedText = text.replace(/[^0-9]/g, '').slice(-1);

        const newOtp = [...otp];
        newOtp[index] = sanitizedText;
        setOtp(newOtp);

        // Move focus only when user clicks "Next" on keyboard
        if (sanitizedText && index < 3) {
            setCurrentIndex(index + 1);
            setTimeout(() => {
                inputRefs.current[index + 1]?.focus();
            }, 50);
        } else {
            setCurrentIndex(index);
        }

        // ✅ Auto verify when all 4 digits are filled
        if (newOtp.every(digit => digit !== '')) {
            handleVerifyOtp(newOtp.join(''));
        }
    };

    const handleVerifyOtp = async (enteredOtp?: string) => {
        const otpValue = enteredOtp ?? otp.join('');

        if (otpValue.length !== 4) {
            return;
        }

        if (otpValue !== '0000') {
            Alert.alert("Invalid OTP", "Please enter the correct OTP (0000)");
            setOtp(['', '', '', '']);
            setCurrentIndex(0);
            setTimeout(() => {
                inputRefs.current[0]?.focus();
            }, 100);
            return;
        }

        setLoading(true);
        startProgressAnimation();

        try {
            // Simulate verification delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (context === "login") {
                navigation.navigate("UserDetails", {
                    inputType,
                    value,
                    verified: true,
                });
            } else {
                navigation.goBack();
            }
        } catch (error) {
            console.error("OTP verification error:", error);
            Alert.alert("Error", "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
            progressAnim.setValue(0);
        }
    };

    const handleResendOtp = () => {
        Alert.alert(
            "OTP Sent",
            `New verification code sent to ${value}`,
            [{ text: "OK" }]
        );
        // Clear current OTP and refocus
        setOtp(['', '', '', '']);
        setCurrentIndex(0);
        setTimeout(() => {
            inputRefs.current[0]?.focus();
        }, 100);
    };

    const getTitle = () => {
        if (inputType === "email") {
            return "Verify Email";
        } else if (inputType === "phone") {
            return "Verify Phone";
        }
        return "Enter Verification Code";
    };

    const getSubtitle = () => {
        const method = inputType === "email" ? "email" : "phone number";
        return `We sent a 4-digit code to your ${method}`;
    };

    const isFormValid = otp.every(digit => digit !== '') && !loading;

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoiding}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.screen}>
                        {/* Header */}
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

                        {/* Title */}
                        <Text style={styles.title}>{getTitle()}</Text>
                        <Text style={styles.subtitle}>
                            {getSubtitle()}
                        </Text>
                        <Text style={styles.valueText}>{value}</Text>

                        {/* OTP Input Section */}
                        <View style={styles.otpContainer}>
                            <View style={styles.otpInputWrapper}>
                                {otp.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        ref={ref => {
                                            inputRefs.current[index] = ref;
                                        }}
                                        style={[
                                            styles.otpInput,
                                            currentIndex === index && styles.otpInputFocused,
                                            digit && styles.otpInputFilled,
                                            loading && styles.otpInputDisabled,
                                        ]}
                                        value={digit}
                                        onChangeText={(text) => handleOtpChange(text, index)}
                                        onKeyPress={(e) => handleKeyPress(e, index)}
                                        onSubmitEditing={() => handleSubmitEditing(index)}
                                        keyboardType="numeric"
                                        maxLength={1}
                                        selectTextOnFocus
                                        editable={!loading}
                                        textAlign="center"
                                        returnKeyType={index === 3 ? "done" : "next"}
                                        blurOnSubmit={index === 3}
                                    />
                                ))}
                            </View>

                            {/* Resend Section */}
                            <View style={styles.resendContainer}>
                                <Text style={styles.resendText}>Didn't receive the code? </Text>
                                <TouchableOpacity
                                    onPress={handleResendOtp}
                                    disabled={loading}
                                >
                                    <Text style={[
                                        styles.resendButton,
                                        loading && styles.resendButtonDisabled
                                    ]}>
                                        Resend
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Spacer */}
                        <View style={styles.spacer} />

                        {/* Progress Bar */}
                        {loading && (
                            <View style={styles.progressContainer}>
                                <Text style={styles.progressText}>Verifying...</Text>
                                <View style={styles.progressBackground}>
                                    <Animated.View
                                        style={[
                                            styles.progressBar,
                                            {
                                                width: progressAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: ['0%', '100%'],
                                                })
                                            }
                                        ]}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Verify Button */}
                        <View style={styles.bottomButton}>
                            <StyledButton
                                title={loading ? "Verifying..." : "Verify Code"}
                                onPress={handleVerifyOtp}
                                disabled={!isFormValid}
                                buttonStyle={{
                                    backgroundColor: isFormValid ? "#800080" : "#ccc",
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
    title: {
        fontSize: 24,
        fontWeight: "600",
        color: "#333",
        paddingHorizontal: 25,
        marginTop: 20,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        paddingHorizontal: 25,
        marginTop: 8,
        textAlign: "center",
        lineHeight: 22,
    },
    valueText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#800080",
        paddingHorizontal: 25,
        marginTop: 4,
        textAlign: "center",
    },
    otpContainer: {
        paddingHorizontal: 25,
        marginTop: 40,
        alignItems: "center",
    },
    otpInputWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        maxWidth: 280,
    },
    otpInput: {
        width: 56,
        height: 56,
        borderWidth: 1.5,
        borderColor: "#e1e1e1",
        borderRadius: 12,
        fontSize: 24,
        fontWeight: "600",
        textAlign: "center",
        backgroundColor: "#fafafa",
        color: "#1a1a1a",
    },
    otpInputFocused: {
        borderColor: "#800080",
        backgroundColor: "#fff",
        shadowColor: "#800080",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    otpInputFilled: {
        borderColor: "#800080",
        backgroundColor: "#fff",
    },
    otpInputDisabled: {
        opacity: 0.6,
    },
    resendContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 32,
    },
    resendText: {
        fontSize: 14,
        color: "#666",
    },
    resendButton: {
        fontSize: 14,
        fontWeight: "600",
        color: "#800080",
    },
    resendButtonDisabled: {
        color: "#ccc",
    },
    spacer: {
        flex: 1,
    },
    progressContainer: {
        alignItems: "center",
        paddingHorizontal: 25,
        marginBottom: 20,
    },
    progressText: {
        fontSize: 14,
        color: "#800080",
        fontWeight: "500",
        marginBottom: 12,
    },
    progressBackground: {
        width: "100%",
        height: 4,
        backgroundColor: "#f0f0f0",
        borderRadius: 2,
        overflow: "hidden",
    },
    progressBar: {
        height: "100%",
        backgroundColor: "#800080",
        borderRadius: 2,
    },
    bottomButton: {
        paddingHorizontal: 25,
        marginBottom: 40,
    },
});
