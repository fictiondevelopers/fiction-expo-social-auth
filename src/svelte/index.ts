/**
 * Svelte module for fiction-expo-social-auth
 * 
 * @module fiction-expo-social-auth/svelte
 * 
 * @example
 * ```svelte
 * <script>
 * import { createSocialLogin } from 'fiction-expo-social-auth/svelte';
 * 
 * const google = createSocialLogin('google');
 * const facebook = createSocialLogin('facebook');
 * </script>
 * ```
 */

export { createSocialLogin, createSocialLogins } from './socialLogin';
export type { SocialLoginState, SocialLoginStore } from './socialLogin';

// Re-export common types and constants for convenience
export { PROVIDERS, AUTH_BACKEND_URL, ERROR_CODES } from '../constants';
export type { Provider, ErrorCode } from '../constants';
export type { AuthUser, AuthResult, SocialLoginOptions } from '../providers/types';

// Re-export direct login functions for advanced usage
export { googleLogin } from '../providers/google';
export { facebookLogin } from '../providers/facebook';
export { appleLogin } from '../providers/apple';
