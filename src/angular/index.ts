/**
 * Angular module for fiction-expo-social-auth
 * 
 * @module fiction-expo-social-auth/angular
 * 
 * @example
 * ```typescript
 * import { SocialLoginService, createSocialLoginService } from 'fiction-expo-social-auth/angular';
 * 
 * // Option 1: Use the factory function
 * const authService = createSocialLoginService();
 * const result = await authService.loginWithGoogle();
 * 
 * // Option 2: Create an Angular injectable wrapper
 * @Injectable({ providedIn: 'root' })
 * export class AuthService extends SocialLoginService {}
 * ```
 */

export { SocialLoginService, createSocialLoginService } from './social-login.service';
export type { SocialLoginState } from './social-login.service';

// Re-export common types and constants for convenience
export { PROVIDERS, AUTH_BACKEND_URL, ERROR_CODES } from '../constants';
export type { Provider, ErrorCode } from '../constants';
export type { AuthUser, AuthResult, SocialLoginOptions } from '../providers/types';

// Re-export direct login functions for advanced usage
export { googleLogin } from '../providers/google';
export { facebookLogin } from '../providers/facebook';
export { appleLogin } from '../providers/apple';
