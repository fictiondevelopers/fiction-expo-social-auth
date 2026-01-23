# Fiction Expo Social Auth

[![npm version](https://badge.fury.io/js/fiction-expo-social-auth.svg)](https://www.npmjs.com/package/fiction-expo-social-auth)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-green.svg)](https://opensource.org/licenses/ISC)

**Universal social authentication for React, React Native, Vue.js, Svelte, and Next.js.**

Get Google, Facebook, and Apple Sign-In working in **under 5 minutes** — no OAuth credential management required!

---

## ✨ Features

- 🔐 **Google Sign-In** — Full support across all platforms
- 📘 **Facebook Sign-In** — OAuth flow for all platforms  
- 🍎 **Apple Sign-In** — Native on iOS, web fallback on others
- 📱 **Cross-Platform** — React Native (Expo), React Web, Vue.js, Svelte, Next.js
- 🎯 **Unified API** — Same code pattern works everywhere
- ⚡ **Framework Hooks/Stores** — Native integrations for React, Vue, Svelte
- 🔷 **TypeScript** — Full type definitions included
- 🔒 **Privacy First** — We don't store any user data

---

## 📊 Platform Support

| Platform | Google | Facebook | Apple |
|----------|:------:|:--------:|:-----:|
| React / Next.js | ✅ | ✅ | ✅ |
| React Native (Expo) | ✅ | ✅ | ✅ Native |
| Vue.js 3 | ✅ | ✅ | ✅ |
| Svelte | ✅ | ✅ | ✅ |

---

## 📦 Installation

```bash
npm install fiction-expo-social-auth
```

---

## 🚀 Quick Start

### React / React Native / Next.js

```tsx
import { useSocialLogin } from 'fiction-expo-social-auth';

function LoginButton() {
  const { login, loading, user, error } = useSocialLogin('google');

  const handleLogin = async () => {
    const result = await login();
    if (result.action === 'success') {
      console.log('Welcome!', result.user.name);
    }
  };

  return (
    <button onClick={handleLogin} disabled={loading}>
      {loading ? 'Signing in...' : 'Sign in with Google'}
    </button>
  );
}
```

---

### Vue.js 3

```vue
<script setup>
import { useSocialLogin } from 'fiction-expo-social-auth/vue';

const google = useSocialLogin('google');
const facebook = useSocialLogin('facebook');
</script>

<template>
  <button @click="google.login" :disabled="google.loading.value">
    {{ google.loading.value ? 'Signing in...' : 'Sign in with Google' }}
  </button>
  
  <button @click="facebook.login" :disabled="facebook.loading.value">
    {{ facebook.loading.value ? 'Signing in...' : 'Sign in with Facebook' }}
  </button>
  
  <div v-if="google.user.value">
    Welcome, {{ google.user.value.name }}!
  </div>
</template>
```

---

### Svelte

```svelte
<script>
  import { createSocialLogin } from 'fiction-expo-social-auth/svelte';
  
  const google = createSocialLogin('google');
  const facebook = createSocialLogin('facebook');
</script>

<button on:click={google.login} disabled={$google.loading}>
  {$google.loading ? 'Signing in...' : 'Sign in with Google'}
</button>

<button on:click={facebook.login} disabled={$facebook.loading}>
  {$facebook.loading ? 'Signing in...' : 'Sign in with Facebook'}
</button>

{#if $google.user}
  <p>Welcome, {$google.user.name}!</p>
{/if}
```

---

### Direct Functions (Any Framework)

```javascript
import { googleLogin, facebookLogin, appleLogin } from 'fiction-expo-social-auth';

// Works in any JavaScript environment
const result = await googleLogin();

if (result.action === 'success') {
  console.log('Email:', result.user.email);
  console.log('Name:', result.user.name);
  console.log('Photo:', result.user.photo);
}
```

---

## 📖 API Reference

### React Hook: `useSocialLogin(provider)`

```typescript
const { login, loading, error, user, result, reset } = useSocialLogin('google');
```

| Property | Type | Description |
|----------|------|-------------|
| `login` | `() => Promise<AuthResult>` | Trigger login flow |
| `loading` | `boolean` | True while authenticating |
| `error` | `string \| null` | Error message if failed |
| `user` | `AuthUser \| null` | User data if successful |
| `result` | `AuthResult \| null` | Full result object |
| `reset` | `() => void` | Reset state |

### Vue Composable: `useSocialLogin(provider)`

Import from `fiction-expo-social-auth/vue`

```typescript
const { login, loading, error, user, result, reset } = useSocialLogin('google');
```

Returns `Readonly<Ref<T>>` for reactive properties.

### Svelte Store: `createSocialLogin(provider)`

Import from `fiction-expo-social-auth/svelte`

```typescript
const google = createSocialLogin('google');

// Access state with $ prefix
$google.loading
$google.error
$google.user

// Call methods directly
await google.login();
google.reset();
```

### AuthResult

```typescript
// Success
{
  action: 'success';
  user: {
    id: string;
    email: string;
    name: string;
    photo: string;
  };
}

// Failure
{
  action: 'failed';
  error: string;
  errorCode?: string;
}
```

---

## 🍎 Apple Sign-In Setup (iOS)

For native Apple Sign-In on iOS:

```bash
npx expo install expo-apple-authentication
```

Configure `app.json`:

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

---

## ⚠️ Error Handling

```typescript
const result = await googleLogin();

if (result.action === 'failed') {
  switch (result.errorCode) {
    case 'ERR_REQUEST_CANCELED':
      // User cancelled - don't show error
      break;
    case 'ERR_NETWORK':
      alert('Check your internet connection');
      break;
    default:
      alert(result.error);
  }
}
```

---

## 🔒 Privacy

- ✅ **No data storage** — All data goes directly to your app
- ✅ **Session-only** — Cleared immediately after auth
- ✅ **No tracking** — We don't collect analytics
- ✅ **Open source** — Review our code on GitHub

---

## 📞 Support

- 📧 **Email:** csgenius786@gmail.com
- 💬 **WhatsApp:** +923009550284
- 🐛 **Issues:** [GitHub Issues](https://github.com/fictiondevelopers/fiction-expo-social-auth/issues)

---

## 📜 License

ISC License © [Fiction Developers](https://fictiondevelopers.com)