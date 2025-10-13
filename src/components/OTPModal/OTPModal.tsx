import React, { useState, useRef, useEffect } from "react";
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    Modal,
    TouchableOpacity,
    Animated,
    Easing,
    Alert,
    Keyboard,
    TouchableWithoutFeedback,
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
import { StyledButton } from "../StyledButton/StyledButton";

interface OTPModalProps {
    visible: boolean;
    onClose: () => void;
    onVerificationSuccess: () => void;
    type: "email" | "phone";
    value: string;
}

export const OTPModal: React.FC<OTPModalProps> = ({
    visible,
    onClose,
    onVerificationSuccess,
    type,
    value,
}) => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Animation values
    const slideAnim = useRef(new Animated.Value(300)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    // Input refs
    const inputRefs = useRef<(TextInput | null)[]>([]);

    useEffect(() => {
        if (visible) {
            // Reset state when modal opens
            setOtp(['', '', '', '']);
            setCurrentIndex(0);
            setLoading(false);
            progressAnim.setValue(0);

            // Slide in animation
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }).start();

            // Auto-focus first input after animation
            const timer = setTimeout(() => {
                if (inputRefs.current[0]) {
                    inputRefs.current[0].focus();
                }
            }, 400);

            return () => clearTimeout(timer);
        } else {
            // Slide out animation
            Animated.timing(slideAnim, {
                toValue: 300,
                duration: 200,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const handleOtpChange = (text: string, index: number) => {
        // Only allow single digit
        const sanitizedText = text.replace(/[^0-9]/g, '').slice(-1);

        const newOtp = [...otp];
        newOtp[index] = sanitizedText;
        setOtp(newOtp);

        // Auto-move to next input when digit is entered
        if (sanitizedText && index < 3) {
            setCurrentIndex(index + 1);
            setTimeout(() => {
                inputRefs.current[index + 1]?.focus();
            }, 50);
        } else if (!sanitizedText) {
            setCurrentIndex(index);
        } else {
            setCurrentIndex(index);
        }
    };

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

    const handleVerifyOtp = async () => {
        const enteredOtp = otp.join('');

        if (enteredOtp.length !== 4) {
            Alert.alert("Incomplete OTP", "Please enter all 4 digits");
            return;
        }

        if (enteredOtp !== '0000') {
            Alert.alert("Invalid OTP", "Please enter the correct OTP (0000)");
            // Clear OTP and refocus first input
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

            onVerificationSuccess();
            // Alert.alert("Success", `${type === 'email' ? 'Email' : 'Phone'} verified successfully!`);

        } catch (error) {
            console.error("OTP verification error:", error);
            Alert.alert(
                "Error",
                "Something went wrong. Please try again.",
                [{ text: "OK" }]
            );
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
        return type === "email" ? "Verify Email" : "Verify Phone";
    };

    const getSubtitle = () => {
        const method = type === "email" ? "email" : "phone number";
        return `Enter the 4-digit code sent to your ${method}`;
    };

    const isFormValid = otp.every(digit => digit !== '') && !loading;

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={[
                                styles.modalContainer,
                                {
                                    transform: [{ translateY: slideAnim }]
                                }
                            ]}
                        >
                            {/* Header */}
                            <View style={styles.header}>
                                <TouchableOpacity
                                    onPress={onClose}
                                    style={styles.closeButton}
                                    disabled={loading}
                                >
                                    <Ionicons
                                        name="close"
                                        size={24}
                                        color={loading ? "#ccc" : "#666"}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Content */}
                            <View style={styles.content}>
                                {/* Title */}
                                <Text style={styles.title}>{getTitle()}</Text>
                                <Text style={styles.subtitle}>{getSubtitle()}</Text>
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

                                    <View >
                                        <Text style={{ textAlign: 'center', marginTop: 8, color: '#666', fontSize: 12 }}>Enter 0000 to verify</Text>
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
                                <View style={styles.buttonContainer}>
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
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    modalContainer: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: "85%",
        minHeight: 450,
    },
    header: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    closeButton: {
        padding: 4,
    },
    content: {
        paddingHorizontal: 25,
        paddingVertical: 20,
        flex: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: "600",
        color: "#333",
        textAlign: "center",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: "#666",
        textAlign: "center",
        lineHeight: 20,
        marginBottom: 4,
    },
    valueText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#800080",
        textAlign: "center",
        marginBottom: 30,
    },
    otpContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    otpInputWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        maxWidth: 250,
        marginBottom: 24,
    },
    otpInput: {
        width: 50,
        height: 50,
        borderWidth: 1.5,
        borderColor: "#e1e1e1",
        borderRadius: 10,
        fontSize: 20,
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
    },
    resendText: {
        fontSize: 13,
        color: "#666",
    },
    resendButton: {
        fontSize: 13,
        fontWeight: "600",
        color: "#800080",
    },
    resendButtonDisabled: {
        color: "#ccc",
    },
    progressContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    progressText: {
        fontSize: 13,
        color: "#800080",
        fontWeight: "500",
        marginBottom: 10,
    },
    progressBackground: {
        width: "100%",
        height: 3,
        backgroundColor: "#f0f0f0",
        borderRadius: 2,
        overflow: "hidden",
    },
    progressBar: {
        height: "100%",
        backgroundColor: "#800080",
        borderRadius: 2,
    },
    buttonContainer: {
        marginTop: "auto",
        paddingTop: 10,
    },
});
