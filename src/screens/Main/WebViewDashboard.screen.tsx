import React, { FC, useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
} from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../context/AuthContext';

const VENDORFORGE_URL = 'https://vendorforge.vercel.app/';

export const WebViewDashboard: FC = () => {
    const { logout, user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);
    const webViewRef = useRef<WebView>(null);

    const handleLoadStart = () => {
        setLoading(true);
    };

    const handleLoadEnd = () => {
        setLoading(false);
    };

    const handleNavigationStateChange = (navState: WebViewNavigation) => {
        setCanGoBack(navState.canGoBack);
        setCanGoForward(navState.canGoForward);
    };

    const handleError = () => {
        setLoading(false);
        Alert.alert(
            'Connection Error',
            'Unable to load VendorForge. Please check your internet connection and try again.',
            [{ text: 'OK' }]
        );
    };

    const handleGoBack = () => {
        if (canGoBack && webViewRef.current) {
            webViewRef.current.goBack();
        }
    };

    const handleGoForward = () => {
        if (canGoForward && webViewRef.current) {
            webViewRef.current.goForward();
        }
    };

    const handleRefresh = () => {
        if (webViewRef.current) {
            webViewRef.current.reload();
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            `Are you sure you want to logout, ${user?.firstName}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await logout();
                        } catch (error) {
                            console.error('Logout error:', error);
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" />
            <View style={styles.content}>
                {/* Navigation Header */}
                <View style={styles.header}>
                    <View style={styles.navigationButtons}>
                        <TouchableOpacity
                            style={[styles.navButton, !canGoBack && styles.disabledButton]}
                            onPress={handleGoBack}
                            disabled={!canGoBack}
                        >
                            <Ionicons
                                name="chevron-back"
                                size={24}
                                color={canGoBack ? "#333" : "#ccc"}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.navButton, !canGoForward && styles.disabledButton]}
                            onPress={handleGoForward}
                            disabled={!canGoForward}
                        >
                            <Ionicons
                                name="chevron-forward"
                                size={24}
                                color={canGoForward ? "#333" : "#ccc"}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.navButton} onPress={handleRefresh}>
                            <Ionicons name="refresh" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={24} color="#800080" />
                    </TouchableOpacity>
                </View>

                {/* Loading Indicator */}
                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#800080" />
                    </View>
                )}

                {/* WebView */}
                <WebView
                    ref={webViewRef}
                    source={{ uri: VENDORFORGE_URL }}
                    style={styles.webview}
                    onLoadStart={handleLoadStart}
                    onLoadEnd={handleLoadEnd}
                    onError={handleError}
                    onNavigationStateChange={handleNavigationStateChange}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    scalesPageToFit={true}
                    allowsBackForwardNavigationGestures={true}
                    // Inject user data if needed (optional)
                    injectedJavaScript={`
                    // You can inject user data here if the web app supports it
                    window.ReactNativeWebView && window.ReactNativeWebView.postMessage('user_data:${JSON.stringify(user)}');
                    true;
                `}
                    onMessage={(event) => {
                        // Handle messages from web view if needed
                        console.log('WebView message:', event.nativeEvent.data);
                    }}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    content: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    navigationButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    navButton: {
        padding: 8,
        marginRight: 8,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
    },
    disabledButton: {
        backgroundColor: '#f9f9f9',
    },
    logoutButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -20,
        marginTop: -20,
        zIndex: 1000,
    },
    webview: {
        flex: 1,
    },
});
