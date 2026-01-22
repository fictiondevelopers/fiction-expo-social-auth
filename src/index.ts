/**
 * fiction-expo-social-auth
 * 
 * Effortless social authentication for React Native (Expo) and React Web
 * Supports Google and Apple Sign-In with a unified API
 * 
 * @packageDocumentation
 */

// Constants
export { AUTH_BACKEND_URL, PROVIDERS, ERROR_CODES } from './constants';
export type { Provider, ErrorCode } from './constants';

// Types
export type {
    AuthUser,
    AuthResult,
    AuthSuccessResult,
    AuthFailedResult,
    SocialLoginOptions,
    PlatformInfo,
    LoginFunction,
} from './providers/types';

// Providers
export { googleLogin } from './providers/google';
export { appleLogin } from './providers/apple';
export { facebookLogin } from './providers/facebook';

// Hooks
export { useSocialLogin } from './hooks/useSocialLogin';
export type { UseSocialLoginState, UseSocialLoginReturn } from './hooks/useSocialLogin';

// Utilities
export { handleError, SocialAuthError, ERROR_MESSAGES, logError } from './utils/errorHandler';
export { getPlatformInfo, isNativeAppleAuthAvailable } from './utils/platform';
export { parseCallbackUrl, paramsToAuthResult, buildAuthUrl } from './utils/urlParser';

// Legacy API - backward compatibility with original fictionLogin
import { googleLogin } from './providers/google';
import { appleLogin } from './providers/apple';
import { facebookLogin } from './providers/facebook';
import { handleError, SocialAuthError } from './utils/errorHandler';
import { PROVIDERS, ERROR_CODES } from './constants';
import type { AuthResult, SocialLoginOptions } from './providers/types';

/**
 * Legacy login function for backward compatibility
 * 
 * @param auth - The authentication provider ('google', 'apple', etc.)
 * @param options - Optional configuration
 * @returns Authentication result
 * 
 * @example
 * ```javascript
 * import { fictionLogin } from 'fiction-expo-social-auth';
 * 
 * const result = await fictionLogin('google');
 * console.log(result);
 * // { action: 'success', email: '...', name: '...', photo: '...', id: '...' }
 * ```
 */
export const fictionLogin = async (
    auth: string,
    options?: SocialLoginOptions
): Promise<AuthResult> => {
    try {
        switch (auth.toLowerCase()) {
            case PROVIDERS.GOOGLE:
                return await googleLogin(options);
            case PROVIDERS.APPLE:
                return await appleLogin(options);
            case PROVIDERS.FACEBOOK:
                return await facebookLogin(options);
            case PROVIDERS.GITHUB:
            case PROVIDERS.LINKEDIN:
                // These providers use the web flow through the backend
                // Fall through to web-based authentication
                return await googleLogin({
                    ...options,
                    // Override the auth parameter
                });
            default:
                throw new SocialAuthError(
                    ERROR_CODES.UNKNOWN_PROVIDER,
                    `Unknown provider: ${auth}`
                );
        }
    } catch (error) {
        return handleError(error);
    }
};

// Default export for simple imports
export default fictionLogin;
