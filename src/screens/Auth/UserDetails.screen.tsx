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
import { StyledInput } from "../../components/StyledInput/StyledInput";
import { OTPModal } from "../../components/OTPModal/OTPModal";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useAuth, User } from "../../context/AuthContext";
import { authService } from "../../services/AuthService";

type RootStackParamList = {
    Login: undefined;
    UserDetails: {
        inputType: "email" | "phone" | "google" | "apple";
        value: string;
        authMethod?: "google" | "apple";
        prefilledData?: {
            firstName?: string;
            lastName?: string;
            email?: string;
        };
    };
};

type UserDetailsScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "UserDetails"
>;

type UserDetailsScreenRouteProp = RouteProp<RootStackParamList, "UserDetails">;

export const UserDetails: FC = () => {
    const navigation = useNavigation<UserDetailsScreenNavigationProp>();
    const route = useRoute<UserDetailsScreenRouteProp>();
    const { login } = useAuth();

    const { inputType, value, authMethod, prefilledData } = route.params;

    const [firstName, setFirstName] = useState(prefilledData?.firstName || "");
    const [lastName, setLastName] = useState(prefilledData?.lastName || "");
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailVerified, setEmailVerified] = useState(authMethod === "google" || authMethod === "apple");
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [verifyingEmail, setVerifyingEmail] = useState(false);
    const [verifyingPhone, setVerifyingPhone] = useState(false);
    const [showEmailOtpModal, setShowEmailOtpModal] = useState(false);
    const [showPhoneOtpModal, setShowPhoneOtpModal] = useState(false);

    // Animation values for loader
    const progressAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Input refs for auto-focus
    const firstNameRef = useRef<TextInput>(null);
    const lastNameRef = useRef<TextInput>(null);
    const emailOrPhoneRef = useRef<TextInput>(null);

    const verifyButtonRef = useRef<any>(null);

    // Determine what additional field we need
    // If user came from Google/Apple (they have email), ask for phone
    // If user came from phone input, ask for email
    // If user came from email input, ask for phone
    const needsPhone = inputType === "email" || authMethod === "google" || authMethod === "apple";
    const needsEmail = inputType === "phone";

    // Pre-fill email or phone field (but don't pre-fill the field we're asking for)
    useEffect(() => {
        // If coming from OTP screen (via Login -> OTP -> UserDetails), 
        // set verification status and pre-fill the verified field
        if (inputType === "email" || inputType === "phone") {
            if (inputType === "email") {
                setEmailVerified(true);
                // We don't pre-fill here as we need phone number
            } else if (inputType === "phone") {
                setPhoneVerified(true);
                // We don't pre-fill here as we need email
            }
        }

        // Auto-focus first empty field only on initial load
        const timer = setTimeout(() => {
            if (!firstName.trim() && firstNameRef.current) {
                firstNameRef.current.focus();
            } else if (!lastName.trim() && lastNameRef.current) {
                lastNameRef.current.focus();
            } else if ((needsEmail || needsPhone) && !emailOrPhone.trim() && emailOrPhoneRef.current) {
                emailOrPhoneRef.current.focus();
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [inputType, value, prefilledData]); // Removed firstName, lastName, emailOrPhone from dependencies

    // Smooth focus transition handlers
    const handleFirstNameSubmit = () => {
        setTimeout(() => {
            lastNameRef.current?.focus();
        }, 100);
    };

    const handleLastNameSubmit = () => {
        setTimeout(() => {
            emailOrPhoneRef.current?.focus();
        }, 100);
    };

    const validateName = (name: string) => {
        if (!name.trim()) return "This field is required";
        if (name.trim().length < 2) return "Must be at least 2 characters";
        return null;
    };

    const validateEmailOrPhone = (val: string) => {
        if (!val.trim()) return "This field is required";

        if (needsEmail) {
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(val.trim())) return "Please enter a valid email";
        } else if (needsPhone) {
            // Validate phone
            const phoneRegex = /^\+?\d{10,15}$/;
            if (!phoneRegex.test(val.trim())) return "Please enter a valid phone number";
        }

        return null;
    };

    const isFormValid =
        !validateName(firstName) &&
        !validateName(lastName) &&
        !validateEmailOrPhone(emailOrPhone) &&
        (needsEmail ? emailVerified : true) &&
        (needsPhone ? phoneVerified : true);

    const handleSubmit = async () => {
        if (!isFormValid) return;

        setLoading(true);
        startProgressAnimation();
        startPulseAnimation();

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Generate a unique user ID (in real app, this would come from backend)
            const userId = Date.now().toString();

            // Determine final auth method
            const finalAuthMethod = authMethod || inputType;

            // Create user object
            const userData: User = {
                id: userId,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: needsEmail ? emailOrPhone.trim() : (prefilledData?.email || (inputType === "email" ? value : "")),
                phone: needsPhone ? emailOrPhone.trim() : (inputType === "phone" ? value : undefined),
                authMethod: finalAuthMethod as "email" | "phone" | "google" | "apple",
            };

            // Store user data and mark as authenticated
            await login(userData);

            // Show success message
            Alert.alert(
                "Welcome!",
                `Hello ${firstName}, your account has been created successfully.`,
                [{ text: "OK" }]
            );

        } catch (error) {
            console.error("Error creating user:", error);
            Alert.alert(
                "Error",
                "Something went wrong. Please try again.",
                [{ text: "OK" }]
            );
        } finally {
            setLoading(false);
            progressAnim.setValue(0);
            pulseAnim.setValue(1);
        }
    };

    const getAdditionalFieldPlaceholder = () => {
        if (needsEmail) return "Enter your email address";
        if (needsPhone) return "Enter your phone number";
        return "";
    };

    const getAdditionalFieldLabel = () => {
        if (needsEmail) return "Email Address";
        if (needsPhone) return "Phone Number";
        return "";
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

    const startPulseAnimation = () => {
        const pulse = () => {
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                if (loading) pulse();
            });
        };
        pulse();
    };

    const handleVerifyEmail = async () => {
        if (!emailOrPhone || validateEmailOrPhone(emailOrPhone)) return;

        setVerifyingEmail(true);

        try {
            // Simulate sending OTP
            await new Promise(resolve => setTimeout(resolve, 500));
            setShowEmailOtpModal(true);
            Alert.alert("OTP Sent", `Verification code sent to ${emailOrPhone}`);
        } catch (error) {
            Alert.alert("Error", "Something went wrong. Please try again.");
        } finally {
            setVerifyingEmail(false);
        }
    };

    const handleVerifyPhone = async () => {
        if (!emailOrPhone || validateEmailOrPhone(emailOrPhone)) return;

        setVerifyingPhone(true);

        try {
            // Simulate sending OTP
            await new Promise(resolve => setTimeout(resolve, 500));
            setShowPhoneOtpModal(true);
            Alert.alert("OTP Sent", `Verification code sent to ${emailOrPhone}`);
        } catch (error) {
            Alert.alert("Error", "Something went wrong. Please try again.");
        } finally {
            setVerifyingPhone(false);
        }
    };

    const handleEmailVerificationSuccess = () => {
        setEmailVerified(true);
        setShowEmailOtpModal(false);
    };

    const handlePhoneVerificationSuccess = () => {
        setPhoneVerified(true);
        setShowPhoneOtpModal(false);
    };

    const handleBackPress = async () => {
        // If user came from OAuth (Google/Apple), revoke access to prevent auto-login
        if (authMethod === "google" || authMethod === "apple") {
            try {
                await authService.revokeAccess();
            } catch (error) {
                console.error("Error revoking access:", error);
            }
        }
        navigation.goBack();
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
                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity
                                onPress={handleBackPress}
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
                        <Text style={styles.title}>Complete Your Profile</Text>
                        <Text style={styles.subtitle}>
                            Please provide your details to complete the registration
                        </Text>

                        {/* Form Fields */}
                        <View style={styles.form}>
                            {/* First Name */}
                            <View style={styles.inputWrapper}>
                                <StyledInput
                                    ref={firstNameRef}
                                    placeholder="First Name"
                                    value={firstName}
                                    onChangeText={setFirstName}
                                    variant="white"
                                    fullWidth
                                    autoCapitalize="words"
                                    autoCorrect={false}
                                    loading={loading}
                                    disabled={loading}
                                    focusColor="#800080"
                                    errorColor="#FF3B30"
                                    shadowColor="#800080"
                                    validator={validateName}
                                    returnKeyType="next"
                                    blurOnSubmit={false}
                                    onSubmitEditing={handleFirstNameSubmit}
                                />
                            </View>

                            {/* Last Name */}
                            <View style={styles.inputWrapper}>
                                <StyledInput
                                    ref={lastNameRef}
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChangeText={setLastName}
                                    variant="white"
                                    fullWidth
                                    autoCapitalize="words"
                                    autoCorrect={false}
                                    loading={loading}
                                    disabled={loading}
                                    focusColor="#800080"
                                    errorColor="#FF3B30"
                                    shadowColor="#800080"
                                    validator={validateName}
                                    returnKeyType="next"
                                    blurOnSubmit={false}
                                    onSubmitEditing={handleLastNameSubmit}
                                />
                            </View>

                            {/* Additional Email or Phone Field */}
                            {(needsEmail || needsPhone) && (
                                <View style={styles.inputWrapper}>
                                    <Text style={styles.fieldLabel}>
                                        {getAdditionalFieldLabel()}
                                    </Text>
                                    <StyledInput
                                        ref={emailOrPhoneRef}
                                        placeholder={getAdditionalFieldPlaceholder()}
                                        value={emailOrPhone}
                                        onChangeText={setEmailOrPhone}
                                        variant="white"
                                        fullWidth
                                        keyboardType={needsEmail ? "email-address" : "phone-pad"}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        loading={loading || verifyingEmail || verifyingPhone}
                                        disabled={loading || verifyingEmail || verifyingPhone}
                                        focusColor="#800080"
                                        errorColor="#FF3B30"
                                        shadowColor="#800080"
                                        validator={validateEmailOrPhone}
                                        returnKeyType="done"
                                        onSubmitEditing={() => {
                                            if (needsEmail) {
                                                handleVerifyEmail();
                                            } else if (needsPhone) {
                                                handleVerifyPhone();
                                            }
                                        }}
                                    />

                                    {/* Verify Button */}
                                    {emailOrPhone && !validateEmailOrPhone(emailOrPhone) && (
                                        <View style={styles.verifyButtonContainer}>
                                            {(needsEmail ? emailVerified : phoneVerified) ? (
                                                <View style={styles.verifiedContainer}>
                                                    <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
                                                    <Text style={styles.verifiedText}>Verified</Text>
                                                </View>
                                            ) : (
                                                <TouchableOpacity
                                                    ref={verifyButtonRef}
                                                    style={[
                                                        styles.plainVerifyButton,
                                                        (verifyingEmail || verifyingPhone || loading) && styles.disabledButton
                                                    ]}
                                                    onPress={needsEmail ? handleVerifyEmail : handleVerifyPhone}
                                                    disabled={verifyingEmail || verifyingPhone || loading}
                                                >
                                                    <Text style={[
                                                        styles.plainVerifyButtonText,
                                                        (verifyingEmail || verifyingPhone || loading) && styles.disabledButtonText
                                                    ]}>
                                                        {needsEmail
                                                            ? (verifyingEmail ? "Sending..." : "Verify Email")
                                                            : (verifyingPhone ? "Sending..." : "Verify Phone")
                                                        }
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    )}

                                </View>
                            )}

                            {/* Info Text */}
                            {/* <Text style={styles.infoText}>
                                {inputType === "email" && `Phone: ${value}`}
                                {inputType === "phone" && `Phone: ${value}`}
                                {authMethod === "google" && "Signing up with Google"}
                                {authMethod === "apple" && "Signing up with Apple"}
                            </Text> */}
                        </View>

                        {/* Spacer */}
                        <View style={styles.spacer} />

                        {/* Progress Bar */}
                        {loading && (
                            <View style={styles.progressContainer}>
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
                                <Text style={styles.progressText}>Creating your account...</Text>
                            </View>
                        )}

                        {/* Submit Button */}
                        <View style={styles.bottomButton}>
                            <Animated.View style={loading ? { transform: [{ scale: pulseAnim }] } : {}}>
                                <StyledButton
                                    title={loading ? "Creating Account..." : "Complete Registration"}
                                    onPress={handleSubmit}
                                    disabled={!isFormValid || loading}
                                    buttonStyle={{
                                        backgroundColor: (isFormValid && !loading) ? "#800080" : "#ccc",
                                        paddingVertical: 14,
                                        borderRadius: 10,
                                    }}
                                    fullWidth
                                />
                            </Animated.View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

            {/* OTP Modals */}
            <OTPModal
                visible={showEmailOtpModal}
                onClose={() => setShowEmailOtpModal(false)}
                onVerificationSuccess={handleEmailVerificationSuccess}
                type="email"
                value={emailOrPhone}
            />

            <OTPModal
                visible={showPhoneOtpModal}
                onClose={() => setShowPhoneOtpModal(false)}
                onVerificationSuccess={handlePhoneVerificationSuccess}
                type="phone"
                value={emailOrPhone}
            />
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
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        paddingHorizontal: 25,
        marginTop: 8,
        lineHeight: 22,
    },
    form: {
        paddingHorizontal: 25,
        marginTop: 30,
    },
    inputWrapper: {
        marginBottom: 20,
    },
    fieldLabel: {
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: "#800080",
        fontWeight: "500",
        marginTop: 10,
    },
    spacer: {
        flex: 1,
    },
    bottomButton: {
        paddingHorizontal: 25,
        marginBottom: 40,
    },
    verifyButtonContainer: {
        marginTop: 12,
        alignItems: 'flex-end',
    },
    verifiedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0FDF4',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#22C55E',
    },
    verifiedText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '600',
        color: '#22C55E',
    },
    plainVerifyButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: '#800080',
        backgroundColor: 'transparent',
    },
    plainVerifyButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#800080',
        textAlign: 'center',
    },
    disabledButton: {
        opacity: 0.5,
        borderColor: '#ccc',
    },
    disabledButtonText: {
        color: '#ccc',
    },

    progressContainer: {
        alignItems: "center",
        paddingHorizontal: 25,
        marginBottom: 20,
    },
    progressBackground: {
        width: "100%",
        height: 4,
        backgroundColor: "#f0f0f0",
        borderRadius: 2,
        overflow: "hidden",
        marginBottom: 12,
    },
    progressBar: {
        height: "100%",
        backgroundColor: "#800080",
        borderRadius: 2,
    },
    progressText: {
        fontSize: 14,
        color: "#800080",
        fontWeight: "500",
    },
});