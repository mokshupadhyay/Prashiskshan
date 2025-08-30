// Environment Configuration for VendorForge
import Config from 'react-native-config';

export interface EnvironmentConfig {
  google: {
    webClientId: string;
    iosClientId: string;
    androidClientId: string;
  };
  apple: {
    teamId: string;
    keyId: string;
    bundleId: string;
  };
  app: {
    env: 'development' | 'staging' | 'production';
    apiBaseUrl: string;
    webDashboardUrl: string;
  };
  firebase?: {
    projectId: string;
    apiKey: string;
    authDomain: string;
  };
}

const developmentConfig: EnvironmentConfig = {
  google: {
    webClientId:
      '1013176974410-q0b7cpnk3o3lpulttvdc9coasd5ubq57.apps.googleusercontent.com',
    iosClientId: Config.GOOGLE_IOS_CLIENT_ID || 'dummy-ios-client-id',
    androidClientId:
      Config.GOOGLE_ANDROID_CLIENT_ID || 'dummy-android-client-id',
  },
  apple: {
    teamId: Config.APPLE_TEAM_ID || 'dummy-team-id',
    keyId: Config.APPLE_KEY_ID || 'dummy-key-id',
    bundleId: Config.APPLE_BUNDLE_ID || 'com.vendor.forge.app',
  },
  app: {
    env:
      (Config.APP_ENV as 'development' | 'staging' | 'production') ||
      'development',
    apiBaseUrl: Config.API_BASE_URL || 'https://api.vendorforge.com',
    webDashboardUrl:
      Config.WEB_DASHBOARD_URL || 'https://vendorforge.vercel.app',
  },
  firebase: {
    projectId: Config.FIREBASE_PROJECT_ID || '',
    apiKey: Config.FIREBASE_API_KEY || '',
    authDomain: Config.FIREBASE_AUTH_DOMAIN || '',
  },
};

const productionConfig: EnvironmentConfig = {
  ...developmentConfig,
  app: {
    ...developmentConfig.app,
    env: 'production',
  },
};

const isDevelopment = __DEV__;
export const config: EnvironmentConfig = isDevelopment
  ? developmentConfig
  : productionConfig;

export const validateConfig = (): boolean => {
  const requiredFields = [
    config.google.webClientId,
    config.google.iosClientId,
    config.google.androidClientId,
    config.app.apiBaseUrl,
    config.app.webDashboardUrl,
  ];

  const isValid = requiredFields.every(
    field => field && field.trim() !== '' && !field.includes('YOUR_'),
  );

  if (!isValid && __DEV__) {
    console.warn(
      '⚠️ Environment configuration incomplete. Please update your .env file.',
    );
  }

  return isValid;
};
