import React, { FC, useCallback, useState } from 'react';
import { StyleSheet, Text, View, Alert, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LandingCarousel } from '../../components/LandingCarousel/LandingCarousel';
import { StyledButton } from '../../components/StyledButton/StyledButton';
import { VendorForgeLogo } from '../../assets/logo/VendorForge';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { authService } from '../../services/AuthService';

type RootStackParamList = {
    Landing: undefined;
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

type LandingScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Landing'
>;

export const Landing: FC = () => {
    const navigation = useNavigation<LandingScreenNavigationProp>();
    const [loading, setLoading] = useState({
        google: false,
        apple: false,
    });

    const handleGoogleSignIn = useCallback(async () => {
        setLoading(prev => ({ ...prev, google: true }));

        try {
            const result = await authService.signInWithGoogle();

            if (result.success && result.user) {
                navigation.navigate('UserDetails', {
                    inputType: 'google',
                    value: result.user.email,
                    authMethod: 'google',
                    prefilledData: {
                        firstName: result.user.firstName,
                        lastName: result.user.lastName,
                        email: result.user.email,
                    },
                });
            } else {
                Alert.alert('Sign-In Failed', result.error || 'Google Sign-In failed');
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setLoading(prev => ({ ...prev, google: false }));
        }
    }, [navigation]);

    const handleAppleSignIn = useCallback(async () => {
        setLoading(prev => ({ ...prev, apple: true }));

        try {
            const result = await authService.signInWithApple();

            if (result.success && result.user) {
                navigation.navigate('UserDetails', {
                    inputType: 'apple',
                    value: result.user.email,
                    authMethod: 'apple',
                    prefilledData: {
                        firstName: result.user.firstName,
                        lastName: result.user.lastName,
                        email: result.user.email,
                    },
                });
            } else {
                Alert.alert('Sign-In Failed', result.error || 'Apple Sign-In failed');
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setLoading(prev => ({ ...prev, apple: false }));
        }
    }, [navigation]);

    const handleEmailPhonePress = useCallback(() => {
        navigation.navigate('Login');
    }, [navigation]);

    // Dynamic spacing based on platform
    const buttonSpacing = Platform.OS === 'ios' ? 16 : 24;

    return (
        <View style={styles.screen}>
            <LandingCarousel />

            {/* Logo and Text Section */}
            <View style={styles.header}>
                <VendorForgeLogo variant="default" size={64} />
                <View style={styles.textWrapper}>
                    <Text style={styles.title}>VendorForge</Text>
                    <Text style={styles.subtitle}>
                        Join our vendor community to unlock exclusive benefits and
                        opportunities.
                    </Text>
                </View>
            </View>

            {/* Authentication Buttons */}
            <View style={styles.buttonsWrapper}>
                <StyledButton
                    title={loading.google ? "Signing in..." : "Continue with Google"}
                    onPress={handleGoogleSignIn}
                    variant="white"
                    buttonStyle={{
                        ...styles.button,
                        marginBottom: buttonSpacing,
                        ...(loading.google && styles.disabledButton)
                    }}
                    iconLeft={<Icon name="google" size={20} color="#DB4437" />}
                    textStyle={styles.buttonText}
                    disabled={loading.google || loading.apple}
                />
                {Platform.OS === 'ios' && (
                    <StyledButton
                        title={loading.apple ? "Signing in..." : "Continue with Apple"}
                        onPress={handleAppleSignIn}
                        variant="white"
                        buttonStyle={{
                            ...styles.button,
                            marginBottom: buttonSpacing,
                            ...(loading.apple && styles.disabledButton)
                        }}
                        iconLeft={<Icon name="apple" size={20} color="#333" />}
                        textStyle={styles.buttonText}
                        disabled={loading.google || loading.apple}
                    />
                )}
                <StyledButton
                    title="Continue with Email/Phone"
                    onPress={handleEmailPhonePress}
                    variant="text"
                    textStyle={styles.textButtonText}
                    disabled={loading.google || loading.apple}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginVertical: 32,
    },
    textWrapper: {
        flexShrink: 1,
        marginLeft: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1e40af',
        letterSpacing: 0.5,
    },
    subtitle: {
        marginTop: 6,
        fontSize: 15,
        color: '#555',
        lineHeight: 20,
    },
    buttonsWrapper: {
        marginHorizontal: 24,
        marginTop: 12,
    },
    button: {
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#000',
    },
    buttonText: {
        color: '#000',
        fontWeight: '600',
    },
    textButtonText: {
        color: '#00357C',
        fontWeight: '600',
        fontSize: 16,
    },
    disabledButton: {
        opacity: 0.6,
    },
});