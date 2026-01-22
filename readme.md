# Fiction Expo Social Auth

[![npm version](https://badge.fury.io/js/fiction-expo-social-auth.svg)](https://www.npmjs.com/package/fiction-expo-social-auth)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-green.svg)](https://opensource.org/licenses/ISC)

**Zero-config social authentication for React Native (Expo), React Web, and Next.js.**

Get Google, Facebook, and Apple Sign-In working in **under 5 minutes** — no OAuth credential management required!

---

## ✨ Features

- 🔐 **Google Sign-In** — Full support across all platforms
- 📘 **Facebook Sign-In** — OAuth flow for all platforms  
- 🍎 **Apple Sign-In** — Native on iOS, web fallback on Android/Web
- 📱 **Cross-Platform** — React Native (Expo), React Web, Next.js
- 🎯 **Unified API** — Same code works everywhere
- ⚡ **React Hook** — Modern `useSocialLogin` hook
- 🔷 **TypeScript** — Full type definitions included
- 🔒 **Privacy First** — We don't store any user data

---

## 📊 Platform Support

| Platform | Google | Facebook | Apple |
|----------|:------:|:--------:|:-----:|
| iOS (Expo) | ✅ | ✅ | ✅ Native |
| Android (Expo) | ✅ | ✅ | ✅ Web Fallback |
| React Web | ✅ | ✅ | ✅ |
| Next.js | ✅ | ✅ | ✅ |

---

## 📦 Installation

```bash
npm install fiction-expo-social-auth
```

### For Expo / React Native

Install the required peer dependencies:

```bash
npx expo install expo-web-browser expo-linking expo-apple-authentication
```

### For React Web / Next.js

No additional dependencies required!

---

## 🚀 Quick Start

### Using the Hook (Recommended)

```tsx
import React from 'react';
import { View, Button, Text, ActivityIndicator } from 'react-native';
import { useSocialLogin } from 'fiction-expo-social-auth';

export default function LoginScreen() {
  const google = useSocialLogin('google');
  const facebook = useSocialLogin('facebook');
  const apple = useSocialLogin('apple');

  const handleGoogleLogin = async () => {
    const result = await google.login();
    
    if (result.action === 'success') {
      console.log('Welcome!', result.user.email);
      console.log('User ID:', result.user.id);
      console.log('Name:', result.user.name);
      console.log('Photo:', result.user.photo);
      // Navigate to your app's home screen
    } else {
      console.log('Login failed:', result.error);
    }
  };

  const handleFacebookLogin = async () => {
    const result = await facebook.login();
    if (result.action === 'success') {
      console.log('Welcome!', result.user.email);
    }
  };

  const handleAppleLogin = async () => {
    const result = await apple.login();
    if (result.action === 'success') {
      console.log('Welcome!', result.user.email);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Button
        title={google.loading ? 'Signing in...' : 'Continue with Google'}
        onPress={handleGoogleLogin}
        disabled={google.loading}
      />
      
      <Button
        title={facebook.loading ? 'Signing in...' : 'Continue with Facebook'}
        onPress={handleFacebookLogin}
        disabled={facebook.loading}
      />
      
      <Button
        title={apple.loading ? 'Signing in...' : 'Continue with Apple'}
        onPress={handleAppleLogin}
        disabled={apple.loading}
      />

      {google.error && <Text style={{ color: 'red' }}>{google.error}</Text>}
      {facebook.error && <Text style={{ color: 'red' }}>{facebook.error}</Text>}
      {apple.error && <Text style={{ color: 'red' }}>{apple.error}</Text>}
    </View>
  );
}
```

### Using Direct Functions

```tsx
import { googleLogin, facebookLogin, appleLogin } from 'fiction-expo-social-auth';

// Google Sign-In
const googleResult = await googleLogin();

// Facebook Sign-In
const facebookResult = await facebookLogin();

// Apple Sign-In (Native on iOS, Web fallback on Android/Web)
const appleResult = await appleLogin();

// Handle result
if (googleResult.action === 'success') {
  const { email, name, id, photo } = googleResult.user;
  // Store user data, navigate, etc.
}
```

### Legacy API (Backward Compatible)

```tsx
import { fictionLogin } from 'fiction-expo-social-auth';

// Works with all providers
const result = await fictionLogin('google');   // or 'facebook', 'apple'

console.log(result);
// Success: { action: 'success', email: '...', name: '...', photo: '...', id: '...' }
// Failure: { action: 'failed', error: '...', errorCode: '...' }
```

---

## 📖 API Reference

### `useSocialLogin(provider)`

React hook for social authentication.

```typescript
const { login, loading, error, result, reset } = useSocialLogin('google');
```

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `provider` | `'google' \| 'facebook' \| 'apple'` | The authentication provider to use |

**Returns:**
| Property | Type | Description |
|----------|------|-------------|
| `login` | `(options?) => Promise<AuthResult>` | Function to trigger the login flow |
| `loading` | `boolean` | `true` while authentication is in progress |
| `error` | `string \| null` | Error message if login failed |
| `result` | `AuthResult \| null` | Full result object after login attempt |
| `reset` | `() => void` | Reset the hook state |

### `AuthResult`

The result object returned after authentication:

```typescript
// ✅ Success Response
{
  action: 'success';
  user: {
    id: string;      // Unique user ID from provider
    email: string;   // User's email address
    name: string;    // User's display name
    photo: string;   // URL to user's profile photo
  };
  // Also available at root level for convenience:
  id: string;
  email: string;
  name: string;
  photo: string;
}

// ❌ Failure Response
{
  action: 'failed';
  error: string;           // Human-readable error message
  errorCode?: string;      // Machine-readable error code
}
```

### Error Codes

| Error Code | Description |
|------------|-------------|
| `ERR_REQUEST_CANCELED` | User cancelled the sign-in flow |
| `ERR_NETWORK` | Network connectivity issue |
| `ERR_INVALID_TOKEN` | Invalid or expired token |
| `ERR_AUTH_FAILED` | General authentication failure |
| `ERR_MISSING_DEPS` | Required dependency not installed |

---

## 🔧 Configuration Options

### Custom Backend URL

By default, the package uses our hosted authentication backend. You can specify a custom backend:

```typescript
const result = await googleLogin({
  backendUrl: 'https://your-custom-backend.com'
});
```

### Custom Callback URL

For web applications, you can customize the callback URL:

```typescript
const result = await googleLogin({
  callbackUrl: 'https://yourapp.com/auth/callback'
});
```

---

## 🍎 Apple Sign-In Setup (iOS)

For native Apple Sign-In on iOS devices:

### 1. Install the dependency

```bash
npx expo install expo-apple-authentication
```

### 2. Enable Apple Sign-In capability

In your Apple Developer account, enable "Sign In with Apple" for your App ID.

### 3. Configure app.json

```json
{
  "expo": {
    "ios": {
      "usesAppleSignIn": true,
      "bundleIdentifier": "com.yourcompany.yourapp"
    },
    "plugins": ["expo-apple-authentication"]
  }
}
```

> ⚠️ **Important:** Apple only provides the user's name and email on their **first sign-in**. Store this data immediately in your database!

### Web/Android Fallback

On non-iOS platforms, Apple Sign-In automatically uses an OAuth web flow. No additional configuration needed.

---

## ⚠️ Error Handling Best Practices

```typescript
import { useSocialLogin } from 'fiction-expo-social-auth';

function LoginScreen() {
  const { login, loading, error } = useSocialLogin('google');
  
  const handleLogin = async () => {
    const result = await login();
    
    if (result.action === 'failed') {
      switch (result.errorCode) {
        case 'ERR_REQUEST_CANCELED':
          // User cancelled - don't show error, just return
          return;
          
        case 'ERR_NETWORK':
          Alert.alert('Network Error', 'Please check your internet connection');
          break;
          
        case 'ERR_AUTH_FAILED':
          Alert.alert('Authentication Failed', 'Please try again');
          break;
          
        default:
          Alert.alert('Error', result.error || 'Something went wrong');
      }
      return;
    }
    
    // Success! Navigate to home
    navigation.navigate('Home', { user: result.user });
  };
  
  return (
    <TouchableOpacity onPress={handleLogin} disabled={loading}>
      <Text>{loading ? 'Signing in...' : 'Continue with Google'}</Text>
    </TouchableOpacity>
  );
}
```

---

## 🔒 Privacy & Security

**We take your privacy seriously:**

- ✅ **No data storage** — All authentication data is sent directly to your app
- ✅ **Session-only** — Data is cleared from our servers immediately after authentication
- ✅ **No tracking** — We don't track users or collect analytics
- ✅ **Open source** — You can review our code on GitHub

---

## 🛠️ Troubleshooting

### "Popup was blocked"
Enable popups for your domain in browser settings, or handle the error gracefully:

```typescript
if (result.error?.includes('Popup was blocked')) {
  Alert.alert('Please enable popups for this site');
}
```

### Apple Sign-In not working on iOS Simulator
Apple Sign-In requires a real device or an Apple Developer account configured correctly.

### Module not found errors
Make sure you've installed all peer dependencies:

```bash
npx expo install expo-web-browser expo-linking expo-apple-authentication
```

---

## 📝 Complete Example

```tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useSocialLogin } from 'fiction-expo-social-auth';

export default function AuthScreen() {
  const [user, setUser] = useState(null);
  
  const google = useSocialLogin('google');
  const facebook = useSocialLogin('facebook');
  const apple = useSocialLogin('apple');

  const handleLogin = async (provider) => {
    let result;
    
    switch (provider) {
      case 'google':
        result = await google.login();
        break;
      case 'facebook':
        result = await facebook.login();
        break;
      case 'apple':
        result = await apple.login();
        break;
    }
    
    if (result.action === 'success') {
      setUser(result.user);
    }
  };

  if (user) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: user.photo }} style={styles.avatar} />
        <Text style={styles.name}>Welcome, {user.name}!</Text>
        <Text style={styles.email}>{user.email}</Text>
        <TouchableOpacity onPress={() => setUser(null)} style={styles.button}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      
      <TouchableOpacity 
        style={[styles.button, styles.googleButton]} 
        onPress={() => handleLogin('google')}
        disabled={google.loading}
      >
        <Text style={styles.buttonText}>
          {google.loading ? 'Signing in...' : '🔵 Continue with Google'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, styles.facebookButton]} 
        onPress={() => handleLogin('facebook')}
        disabled={facebook.loading}
      >
        <Text style={styles.buttonText}>
          {facebook.loading ? 'Signing in...' : '📘 Continue with Facebook'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, styles.appleButton]} 
        onPress={() => handleLogin('apple')}
        disabled={apple.loading}
      >
        <Text style={[styles.buttonText, { color: '#fff' }]}>
          {apple.loading ? 'Signing in...' : '🍎 Continue with Apple'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40 },
  button: { padding: 16, borderRadius: 12, marginVertical: 8, alignItems: 'center' },
  googleButton: { backgroundColor: '#4285F4' },
  facebookButton: { backgroundColor: '#1877F2' },
  appleButton: { backgroundColor: '#000' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  avatar: { width: 100, height: 100, borderRadius: 50, alignSelf: 'center' },
  name: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 16 },
  email: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 8 },
});
```

---

## 📞 Support

Need help? Reach out:

- 📧 **Email:** csgenius786@gmail.com
- 💬 **WhatsApp:** +923009550284
- 🐛 **Issues:** [GitHub Issues](https://github.com/fictiondevelopers/fiction-expo-social-auth/issues)
- ☕ **Support us:** [Buy me a coffee](https://www.buymeacoffee.com/mahevstark)

---

## 📜 License

ISC License © [Fiction Developers](https://fictiondevelopers.com)

---

Made with ❤️ by [Fiction Developers](https://fictiondevelopers.com)