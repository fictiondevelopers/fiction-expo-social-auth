/**
 * Vue.js module for fiction-expo-social-auth
 * 
 * @module fiction-expo-social-auth/vue
 * 
 * @example
 * ```vue
 * <script setup>
 * import { useSocialLogin } from 'fiction-expo-social-auth/vue';
 * 
 * const google = useSocialLogin('google');
 * const facebook = useSocialLogin('facebook');
 * </script>
 * ```
 */

export { useSocialLogin } from './useSocialLogin';
export type { UseSocialLoginReturn } from './useSocialLogin';

// Re-export common types and constants for convenience
export { PROVIDERS, AUTH_BACKEND_URL, ERROR_CODES } from '../constants';
export type { Provider, ErrorCode } from '../constants';
export type { AuthUser, AuthResult, SocialLoginOptions } from '../providers/types';

// Re-export direct login functions for advanced usage
export { googleLogin } from '../providers/google';
export { facebookLogin } from '../providers/facebook';
export { appleLogin } from '../providers/apple';
