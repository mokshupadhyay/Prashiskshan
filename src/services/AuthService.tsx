import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { Platform } from 'react-native';
import { config, validateConfig } from '../config/environment';


export interface AuthResult {
    success: boolean;
    user?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        authMethod: 'google' | 'apple';
    };
    error?: string;
}

class AuthService {
    constructor() {
        this.configureGoogleSignIn();
    }

    private configureGoogleSignIn() {
        // Validate configuration before setting up Google Sign-In
        if (!validateConfig()) {
            console.warn('⚠️ Google Sign-In not configured properly. Please update environment configuration.');
            return;
        }

        GoogleSignin.configure({
            webClientId: config.google.webClientId,
            // iosClientId: Platform.OS === 'ios' ? config.google.iosClientId : undefined,
            // offlineAccess: true,
            // hostedDomain: '',
            forceCodeForRefreshToken: true,
        });
    }

    async signInWithGoogle(): Promise<AuthResult> {
        try {
            // Check if configuration is valid
            if (!validateConfig()) {
                return {
                    success: false,
                    error: 'Google Sign-In not configured. Please check environment settings.',
                };
            }

            // Check if device supports Google Play Services
            await GoogleSignin.hasPlayServices();

            // Sign in
            const userInfo = await GoogleSignin.signIn();

            if (userInfo.data?.user) {
                const user = userInfo.data.user;

                return {
                    success: true,
                    user: {
                        id: user.id,
                        firstName: user.givenName || '',
                        lastName: user.familyName || '',
                        email: user.email,
                        authMethod: 'google',
                    },
                };
            }

            return {
                success: false,
                error: 'No user information received from Google',
            };
        } catch (error: any) {
            console.error('Google Sign-In Error:', error);

            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                return {
                    success: false,
                    error: 'Sign-in was cancelled',
                };
            } else if (error.code === statusCodes.IN_PROGRESS) {
                return {
                    success: false,
                    error: 'Sign-in is already in progress',
                };
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                return {
                    success: false,
                    error: 'Google Play Services not available',
                };
            } else {
                return {
                    success: false,
                    error: error.message || 'Google Sign-In failed',
                };
            }
        }
    }

    async signInWithApple(): Promise<AuthResult> {
        try {
            if (Platform.OS !== 'ios') {
                return {
                    success: false,
                    error: 'Apple Sign-In is only available on iOS',
                };
            }

            // Check if Apple Authentication is available
            const isAvailable = appleAuth.isSupported;
            if (!isAvailable) {
                return {
                    success: false,
                    error: 'Apple Sign-In is not supported on this device',
                };
            }

            // Perform the authentication request
            const appleAuthRequestResponse = await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGIN,
                requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
            });

            // Get current authentication state
            const credentialState = await appleAuth.getCredentialStateForUser(
                appleAuthRequestResponse.user
            );

            if (credentialState === appleAuth.State.AUTHORIZED) {
                const { user, fullName, email } = appleAuthRequestResponse;

                return {
                    success: true,
                    user: {
                        id: user,
                        firstName: fullName?.givenName || '',
                        lastName: fullName?.familyName || '',
                        email: email || '',
                        authMethod: 'apple',
                    },
                };
            }

            return {
                success: false,
                error: 'Apple Sign-In was not authorized',
            };
        } catch (error: any) {
            console.error('Apple Sign-In Error:', error);

            if (error.code === appleAuth.Error.CANCELED) {
                return {
                    success: false,
                    error: 'Apple Sign-In was cancelled',
                };
            } else {
                return {
                    success: false,
                    error: error.message || 'Apple Sign-In failed',
                };
            }
        }
    }

    async signOut(): Promise<void> {
        try {
            // Sign out from Google
            const isSignedIn = await GoogleSignin.getCurrentUser();
            if (isSignedIn) {
                await GoogleSignin.signOut();
            }

            // Note: Apple doesn't have a programmatic sign-out
            // Users need to revoke access through Settings > Apple ID > Sign-In & Security
        } catch (error) {
            console.error('Sign out error:', error);
        }
    }

    async revokeAccess(): Promise<void> {
        try {
            // Revoke Google access (this is stronger than just sign out)
            const isSignedIn = await GoogleSignin.getCurrentUser();
            if (isSignedIn) {
                await GoogleSignin.revokeAccess();
            }

            // Note: Apple doesn't have a programmatic revoke
            // Users need to revoke access through Settings > Apple ID > Sign-In & Security
        } catch (error) {
            console.error('Revoke access error:', error);
        }
    }
}

export const authService = new AuthService();
