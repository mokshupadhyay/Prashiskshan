# OAuth Setup Guide for VendorForge

This guide will walk you through setting up Google OAuth and Apple Sign-In for your VendorForge React Native app.

## 🔧 Environment Configuration

First, update your credentials in `src/config/environment.ts`:

```typescript
// Update the developmentConfig object with your actual credentials
const developmentConfig: EnvironmentConfig = {
  google: {
    webClientId: 'YOUR_ACTUAL_WEB_CLIENT_ID.apps.googleusercontent.com',
    iosClientId: 'YOUR_ACTUAL_IOS_CLIENT_ID.apps.googleusercontent.com',
    androidClientId: 'YOUR_ACTUAL_ANDROID_CLIENT_ID.apps.googleusercontent.com',
  },
  // ... rest of config
};
```

## 📱 Google OAuth Setup

### Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select an existing one
3. **Project name**: `VendorForge` (or your preferred name)
4. **Note down your Project ID**

### Step 2: Enable Google+ API

1. **Navigate to**: APIs & Services → Library
2. **Search for**: "Google+ API" or "Google Sign-In API"
3. **Click Enable**

### Step 3: Configure OAuth Consent Screen

1. **Navigate to**: APIs & Services → OAuth consent screen
2. **User Type**: External (for public apps) or Internal (for organization apps)
3. **Fill required fields**:
   - **App name**: VendorForge
   - **User support email**: your-email@domain.com
   - **Developer contact info**: your-email@domain.com
4. **Scopes**: Add `../auth/userinfo.email` and `../auth/userinfo.profile`
5. **Test users**: Add your email for testing

### Step 4: Create OAuth 2.0 Credentials

#### Web Client ID (Required for all platforms)

1. **Navigate to**: APIs & Services → Credentials
2. **Click**: Create Credentials → OAuth 2.0 Client IDs
3. **Application type**: Web application
4. **Name**: VendorForge Web Client
5. **Authorized redirect URIs**: (leave empty for now)
6. **Copy the Client ID** → This is your `GOOGLE_WEB_CLIENT_ID`

#### iOS Client ID

1. **Create Credentials** → OAuth 2.0 Client IDs
2. **Application type**: iOS
3. **Name**: VendorForge iOS
4. **Bundle ID**: `com.vendor.forge.app` (or your actual bundle ID)
5. **Copy the Client ID** → This is your `GOOGLE_IOS_CLIENT_ID`

#### Android Client ID

1. **Create Credentials** → OAuth 2.0 Client IDs
2. **Application type**: Android
3. **Name**: VendorForge Android
4. **Package name**: `com.vendor.forge.app` (or your actual package name)
5. **SHA-1 certificate fingerprint**: Get this by running:

   ```bash
   # For debug keystore
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

   # For release keystore (when you have one)
   keytool -list -v -keystore path/to/your/release.keystore -alias your-alias
   ```

6. **Copy the Client ID** → This is your `GOOGLE_ANDROID_CLIENT_ID`

### Step 5: Download Configuration Files

#### For iOS:

1. **Download**: GoogleService-Info.plist
2. **Add to**: `ios/VendorForge/GoogleService-Info.plist`
3. **In Xcode**: Drag the file into your project (make sure "Add to target" is checked)

#### For Android:

1. **Download**: google-services.json
2. **Add to**: `android/app/google-services.json`

### Step 6: Configure iOS (Xcode)

1. **Open**: `ios/VendorForge.xcworkspace` in Xcode
2. **Select your target** → Info tab
3. **Add URL Scheme**:

   - **Identifier**: `com.googleusercontent.apps.YOUR_IOS_CLIENT_ID`
   - **URL Schemes**: Your iOS Client ID (reversed)

   Example: If your iOS Client ID is `123456-abc.apps.googleusercontent.com`,
   add `com.googleusercontent.apps.123456-abc`

### Step 7: Configure Android

1. **Update** `android/build.gradle`:

   ```gradle
   dependencies {
       classpath 'com.google.gms:google-services:4.3.15'
   }
   ```

2. **Update** `android/app/build.gradle`:

   ```gradle
   apply plugin: 'com.google.gms.google-services'

   dependencies {
       implementation 'com.google.android.gms:play-services-auth:20.7.0'
   }
   ```

## 🍎 Apple Sign-In Setup

### Step 1: Apple Developer Account Requirements

1. **You need**: Active Apple Developer Program membership ($99/year)
2. **Account access**: https://developer.apple.com/account/

### Step 2: Enable Sign In with Apple

1. **Go to**: https://developer.apple.com/account/resources/identifiers/list
2. **Select your App ID** (or create one)
3. **Capabilities**: Check "Sign In with Apple"
4. **Configure**: Click "Edit" → Choose "Enable as primary App ID"
5. **Save**

### Step 3: Configure iOS App

1. **Open Xcode**: `ios/VendorForge.xcworkspace`
2. **Select your target** → Signing & Capabilities
3. **Add Capability**: "+ Capability" → "Sign In with Apple"
4. **Bundle Identifier**: Must match your Apple Developer App ID
   - Example: `com.vendorforge.app`

### Step 4: Get Apple Credentials

The following are automatically configured when you enable the capability:

- **Team ID**: Found in Apple Developer Account → Membership
- **Key ID**: Generated when you create an Apple Sign-In key (optional for basic setup)
- **Bundle ID**: Your app's bundle identifier

### Step 5: Update Environment Configuration

Update `src/config/environment.ts`:

```typescript
apple: {
  teamId: 'YOUR_APPLE_TEAM_ID', // Found in Apple Developer → Membership
  keyId: 'YOUR_APPLE_KEY_ID',   // Optional: for server-side verification
  bundleId: 'com.vendorforge.app', // Your actual bundle ID
},
```

## 🔐 Security Best Practices

### 1. Environment Variables

- Never commit actual credentials to version control
- Use different credentials for development/production
- Consider using CI/CD environment variables for production

### 2. Bundle ID / Package Name

- Keep consistent across all configurations
- iOS Bundle ID must match Apple Developer App ID
- Android Package Name must match Google OAuth configuration

### 3. SHA-1 Fingerprints

- Use debug keystore fingerprint for development
- Generate and use release keystore fingerprint for production
- Add both fingerprints to Google OAuth configuration

## 🧪 Testing Your Setup

### Test Google Sign-In:

1. **Run the app**: `npm run ios` or `npm run android`
2. **Tap**: "Continue with Google"
3. **Verify**: Google sign-in popup appears
4. **Check**: User profile data is received

### Test Apple Sign-In (iOS only):

1. **Run on iOS device** (doesn't work in simulator for Apple Sign-In)
2. **Tap**: "Continue with Apple"
3. **Verify**: Apple sign-in popup appears
4. **Check**: User data is received

## 🚨 Common Issues & Solutions

### Google Sign-In Issues:

1. **"DEVELOPER_ERROR"**:

   - Check SHA-1 fingerprint is correct
   - Verify package name matches
   - Ensure google-services.json is in correct location

2. **"SIGN_IN_CANCELLED"**:

   - Normal behavior when user cancels
   - Check if Google Play Services is available

3. **"PLAY_SERVICES_NOT_AVAILABLE"**:
   - Update Google Play Services on device
   - Test on different device

### Apple Sign-In Issues:

1. **"Not supported on this device"**:

   - Requires iOS 13+ and physical device
   - Simulators don't support Apple Sign-In

2. **"Sign In with Apple capability missing"**:

   - Add capability in Xcode
   - Ensure Apple Developer account is active

3. **Bundle ID mismatch**:
   - Verify Bundle ID matches Apple Developer App ID
   - Check Info.plist Bundle Identifier

## 📋 Final Checklist

Before going live, ensure:

- [ ] Google OAuth credentials configured for production
- [ ] Apple Sign-In capability added and configured
- [ ] Release keystore created and fingerprint added to Google
- [ ] Production environment variables set
- [ ] Apps tested on physical devices
- [ ] Privacy policy updated to mention OAuth providers
- [ ] App store listings mention sign-in methods

## 🔗 Useful Links

- [Google Cloud Console](https://console.cloud.google.com/)
- [Apple Developer Portal](https://developer.apple.com/account/)
- [Google Sign-In for React Native](https://github.com/react-native-google-signin/google-signin)
- [Apple Authentication for React Native](https://github.com/invertase/react-native-apple-authentication)
- [React Native Config Documentation](https://github.com/luggit/react-native-config)

## 📞 Need Help?

If you encounter issues:

1. Check the console logs for specific error messages
2. Verify all credentials are correctly configured
3. Test on different devices/simulators
4. Review the official documentation for each OAuth provider
