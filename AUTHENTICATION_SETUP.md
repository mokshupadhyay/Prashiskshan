# VendorForge Authentication Setup

## Overview
VendorForge now includes a comprehensive authentication system with the following features:

- **Email/Phone Authentication**: Users can sign up with email or phone number
- **Google Sign-In**: OAuth integration with Google
- **Apple Sign-In**: Native Apple authentication (iOS only)
- **Secure Storage**: User data encrypted using `react-native-encrypted-storage`
- **WebView Dashboard**: Integrated web dashboard at https://vendorforge.vercel.app/

## Authentication Flow

### 1. Landing Screen
- Users can choose between Google, Apple, or Email/Phone authentication
- Clean UI with animated carousel showing app features

### 2. Login Screen (Email/Phone)
- Smart input detection (automatically identifies email vs phone)
- Real-time validation with visual feedback
- Navigation to UserDetails screen

### 3. UserDetails Screen
- Collects user's first name, last name
- Requests additional email/phone based on initial input
- Supports pre-filled data from social login
- Securely stores user data and marks as authenticated

### 4. WebView Dashboard
- Loads the VendorForge web app
- Navigation controls (back, forward, refresh)
- Logout functionality
- User context injection for web app integration

## Setup Instructions

### Google Sign-In Setup

1. **Google Cloud Console Setup**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google Sign-In API
   - Create OAuth 2.0 credentials (Web client ID)

2. **Update Configuration**:
   ```typescript
   // In src/services/AuthService.tsx, replace:
   webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com'
   // With your actual Web Client ID
   ```

3. **iOS Configuration**:
   - Add the GoogleService-Info.plist to ios/VendorForge/
   - Update URL schemes in Info.plist

4. **Android Configuration**:
   - Add google-services.json to android/app/
   - Update build.gradle files

### Apple Sign-In Setup (iOS Only)

1. **Apple Developer Account**:
   - Enable Sign In with Apple capability
   - Add to your app's entitlements

2. **Xcode Configuration**:
   - Open ios/VendorForge.xcworkspace in Xcode
   - Select your target → Signing & Capabilities
   - Add "Sign In with Apple" capability

### React Native Setup

1. **Install Dependencies** (Already done):
   ```bash
   npm install react-native-encrypted-storage react-native-webview @react-native-google-signin/google-signin @invertase/react-native-apple-authentication
   ```

2. **iOS Pod Installation** (Already done):
   ```bash
   cd ios && pod install
   ```

3. **Android Configuration**:
   ```bash
   # Clean and rebuild for Android
   cd android && ./gradlew clean && cd ..
   ```

## File Structure

```
src/
├── context/
│   └── AuthContext.tsx          # Authentication state management
├── screens/
│   ├── Auth/
│   │   ├── Landing.screen.tsx   # Main landing with auth options
│   │   ├── Login.screen.tsx     # Email/phone login
│   │   └── UserDetails.screen.tsx # User registration form
│   └── Main/
│       └── WebViewDashboard.screen.tsx # Main dashboard
├── services/
│   └── AuthService.tsx          # Google/Apple auth integration
└── components/
    ├── StyledButton/            # Reusable button component
    └── StyledInput/             # Reusable input component
```

## Key Features

### Secure Storage
- All user data encrypted using device keychain/keystore
- Automatic persistence across app launches
- Secure logout with data cleanup

### Smart Authentication
- Auto-detection of email vs phone input
- Context-aware form fields in UserDetails
- Seamless social login integration

### Professional UI
- Consistent design system
- Loading states and error handling
- Responsive keyboard handling
- Clean navigation flow

### WebView Integration
- Full-featured web browser controls
- User context injection
- Offline error handling
- Native logout integration

## Testing

### Frontend Testing (No Backend Required)
- All authentication flows work without backend
- Simulated API responses for development
- Secure local storage for user sessions
- Mock social login flows

### Production Considerations
1. Replace mock API calls with real backend endpoints
2. Implement proper server-side user management
3. Add refresh token handling for social logins
4. Implement proper error tracking and analytics

## Troubleshooting

### Common Issues

1. **Google Sign-In Not Working**:
   - Verify Web Client ID is correct
   - Check GoogleService-Info.plist/google-services.json
   - Ensure Firebase project is properly configured

2. **Apple Sign-In Not Available**:
   - Only works on iOS 13+ devices
   - Requires proper Apple Developer account setup
   - Check device capabilities

3. **Encrypted Storage Issues**:
   - Clear app data if testing locally
   - Verify device keychain access
   - Check iOS/Android permissions

4. **WebView Loading Issues**:
   - Verify internet connection
   - Check if domain is accessible
   - Review Content Security Policy settings

## Next Steps

1. **Backend Integration**: Connect to real authentication API
2. **Push Notifications**: Add notification support
3. **Biometric Auth**: Add fingerprint/face recognition
4. **Deep Linking**: Handle authentication redirects
5. **Analytics**: Track user authentication flows
