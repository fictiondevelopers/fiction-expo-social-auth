# Fiction Expo Social Auth

Effortless social authentication for **React Native (Expo)**, **React Web**, and **Next.js**. Supports Google, Facebook, and Apple Sign-In with a unified API.

> **No credential management headaches!** Skip the hassle of managing OAuth credentials across projects. Use this package to get social login working in under 5 minutes.

## Features

- ✅ **Google Sign-In** - Full support across all platforms
- ✅ **Facebook Sign-In** - OAuth flow for all platforms
- ✅ **Apple Sign-In** - Native on iOS, web fallback on other platforms
- ✅ **TypeScript** - Full type definitions included
- ✅ **Cross-platform** - React Native (Expo), React Web, Next.js
- ✅ **Unified API** - Same code works everywhere
- ✅ **React Hook** - Modern `useSocialLogin` hook

## Supported Platforms

| Platform | Google | Facebook | Apple |
|----------|--------|----------|-------|
| React Native (iOS) | ✅ | ✅ | ✅ Native |
| React Native (Android) | ✅ | ✅ | ✅ Web fallback |
| React Web | ✅ | ✅ | ✅ |

## Installation

```bash
npm install fiction-expo-social-auth
```

### For Expo/React Native

Install the required peer dependencies:

```bash
npx expo install expo-web-browser expo-linking expo-apple-authentication
```

### For React Web / Next.js

No additional dependencies required!

## Quick Start

### Using the Hook (Recommended)

```tsx
import { useSocialLogin } from 'fiction-expo-social-auth';

function LoginScreen() {
  const google = useSocialLogin('google');
  const facebook = useSocialLogin('facebook');
  const apple = useSocialLogin('apple');
  
  const handleGoogleLogin = async () => {
    const result = await google.login();
    if (result.action === 'success') {
      console.log('Welcome,', result.user.email);
    }
  };

  const handleFacebookLogin = async () => {
    const result = await facebook.login();
    if (result.action === 'success') {
      console.log('Welcome,', result.user.email);
    }
  };
  
  return (
    <View>
      <Button 
        onPress={handleGoogleLogin} 
        disabled={google.loading}
        title={google.loading ? 'Signing in...' : 'Sign in with Google'}
      />
      <Button 
        onPress={handleFacebookLogin} 
        disabled={facebook.loading}
        title={facebook.loading ? 'Signing in...' : 'Sign in with Facebook'}
      />
    </View>
  );
}
```

### Using Direct Functions

```tsx
import { googleLogin, facebookLogin, appleLogin } from 'fiction-expo-social-auth';

// Google Sign-In
const result = await googleLogin();

// Facebook Sign-In
const result = await facebookLogin();

// Apple Sign-In
const result = await appleLogin();
```

### Legacy API (Backward Compatible)

```tsx
import { fictionLogin } from 'fiction-expo-social-auth';

const result = await fictionLogin('google'); // or 'facebook', 'apple'
console.log(result);
// { action: 'success', email: '...', name: '...', photo: '...', id: '...' }
```

## Facebook Setup

1. Create a Facebook App at [developers.facebook.com](https://developers.facebook.com)
2. Add **Facebook Login** product
3. Configure **Valid OAuth Redirect URIs** in Facebook Login Settings:
   - `https://your-backend.com/api/account/facebook/callback`
4. Add App ID and Secret to your backend `.env`:
   ```
   NEXT_PUBLIC_FACEBOOK_CLIENT_ID=your_app_id
   FACEBOOK_CLIENT_SECRET=your_app_secret
   NEXT_PUBLIC_FACEBOOK_CALLBACK_URL=https://your-backend.com/api/account/facebook/callback
   ```

## Apple Sign-In Setup

### iOS (Native)

1. Add `expo-apple-authentication` to your project
2. Enable "Sign In with Apple" capability in your Apple Developer account
3. Configure your `app.json`:

```json
{
  "expo": {
    "ios": {
      "usesAppleSignIn": true
    },
    "plugins": ["expo-apple-authentication"]
  }
}
```

> **Important:** Apple only provides the user's name and email on their FIRST sign-in. Store this data immediately!

### Web/Android

Apple Sign-In on web and Android uses OAuth redirect flow through the backend. No additional setup required.

## API Reference

### `useSocialLogin(provider)`

React hook for social authentication.

```typescript
const { login, loading, error, result, reset } = useSocialLogin('google');
// provider: 'google' | 'facebook' | 'apple'
```

| Property | Type | Description |
|----------|------|-------------|
| `login` | `(options?) => Promise<AuthResult>` | Trigger the login flow |
| `loading` | `boolean` | Whether login is in progress |
| `error` | `string \| null` | Error message if login failed |
| `result` | `AuthResult \| null` | Full result object |
| `reset` | `() => void` | Reset state |

### `AuthResult`

```typescript
// Success
{
  action: 'success';
  user: { id, email, name, photo };
  id: string;
  email: string;
  name: string;
  photo: string;
}

// Failure
{
  action: 'failed';
  error?: string;
  errorCode?: 'ERR_REQUEST_CANCELED' | 'ERR_INVALID_TOKEN' | ...;
}
```

## Error Handling

```typescript
const { login, error } = useSocialLogin('facebook');

const handleLogin = async () => {
  const result = await login();
  
  if (result.action === 'failed') {
    switch (result.errorCode) {
      case 'ERR_REQUEST_CANCELED':
        console.log('User cancelled sign-in');
        break;
      case 'ERR_NETWORK':
        console.log('Network error');
        break;
      default:
        console.log('Error:', result.error);
    }
  }
};
```

## Privacy

**We don't store user data.** All authentication data is sent directly to your app and cleared from our sessions immediately.

## Support

- 📧 Email: csgenius786@gmail.com
- 💬 WhatsApp: +923009550284
- ☕ [Buy me coffee](https://www.buymeacoffee.com/mahevstark)

## License

ISC