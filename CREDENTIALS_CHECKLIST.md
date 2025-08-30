# 🔑 OAuth Credentials Checklist

## Where to Get Your Credentials

### 📊 Google OAuth Credentials

**Location**: [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials

| Credential            | Where to Find                              | What it looks like                            |
| --------------------- | ------------------------------------------ | --------------------------------------------- |
| **Web Client ID**     | OAuth 2.0 Client IDs → Web application     | `123456789-abcdef.apps.googleusercontent.com` |
| **iOS Client ID**     | OAuth 2.0 Client IDs → iOS application     | `123456789-ghijkl.apps.googleusercontent.com` |
| **Android Client ID** | OAuth 2.0 Client IDs → Android application | `123456789-mnopqr.apps.googleusercontent.com` |

**Quick Setup Steps**:

1. Create Google Cloud Project
2. Enable Google+ API
3. Configure OAuth consent screen
4. Create 3 OAuth client IDs (Web, iOS, Android)
5. Download config files

### 🍎 Apple Sign-In Credentials

**Location**: [Apple Developer Portal](https://developer.apple.com/account/) → Certificates, Identifiers & Profiles

| Credential    | Where to Find           | What it looks like           |
| ------------- | ----------------------- | ---------------------------- |
| **Team ID**   | Membership tab          | `ABCD123456` (10 characters) |
| **Bundle ID** | Identifiers → App IDs   | `com.vendor.forge.app`       |
| **Key ID**    | Keys section (optional) | `WXYZ789012` (10 characters) |

**Quick Setup Steps**:

1. Enable "Sign In with Apple" for your App ID
2. Add capability in Xcode
3. Get Team ID from Membership page
4. Use your app's Bundle ID

## 🛠 Update Your Configuration

Edit `src/config/environment.ts` and replace these placeholders:

```typescript
const developmentConfig: EnvironmentConfig = {
  google: {
    webClientId: 'YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com', // ← Replace this
    iosClientId: 'YOUR_GOOGLE_IOS_CLIENT_ID.apps.googleusercontent.com', // ← Replace this
    androidClientId: 'YOUR_GOOGLE_ANDROID_CLIENT_ID.apps.googleusercontent.com', // ← Replace this
  },
  apple: {
    teamId: 'YOUR_APPLE_TEAM_ID', // ← Replace this
    keyId: 'YOUR_APPLE_KEY_ID', // ← Replace this (optional)
    bundleId: 'com.vendorforge.app', // ← Update to your actual bundle ID
  },
  // ... rest of config
};
```

## 🎯 Priority Order

**Start with these (required for basic functionality)**:

1. ✅ Google Web Client ID (most important)
2. ✅ Apple Team ID + Bundle ID (for iOS)
3. ✅ Google iOS Client ID (for iOS Google Sign-In)
4. ✅ Google Android Client ID (for Android Google Sign-In)

**Optional (for advanced features)**:

- Apple Key ID (for server-side token verification)
- Firebase configuration (if using Firebase services)

## 🚀 Quick Start (Minimum Viable Setup)

If you want to test quickly, you only need:

### For Google Sign-In:

1. **Google Cloud Console** → Create project → Enable Google+ API
2. **Create Web Client ID** → Copy to `webClientId`
3. **Create iOS/Android Client IDs** → Copy to respective fields

### For Apple Sign-In:

1. **Apple Developer** → Enable "Sign In with Apple" for your App ID
2. **Copy Team ID** from Membership → Add to `teamId`
3. **Use your Bundle ID** → Add to `bundleId`

## 📱 Testing Without Full Setup

The app will work with partial configuration:

- **Email/Phone auth**: Works without any OAuth setup
- **Google Sign-In**: Needs at least Web Client ID
- **Apple Sign-In**: Needs Team ID and proper Xcode configuration

## 🔧 Development vs Production

You'll need **separate credentials** for:

- **Development**: Test with debug keystores and development Bundle IDs
- **Production**: Real keystores and production Bundle IDs

Update the `productionConfig` object in `environment.ts` with production credentials when ready.

## ❗ Important Notes

- **Never commit real credentials** to version control
- **Keep development and production separate**
- **Google SHA-1 fingerprint** must match your keystore
- **Apple Sign-In** only works on iOS 13+ physical devices
- **Bundle IDs** must be consistent across all platforms
