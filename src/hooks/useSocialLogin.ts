/**
 * Unified social login hook
 * Provides a React hook for triggering social authentication
 */

import { useState, useCallback } from 'react';
import { Provider, PROVIDERS, ERROR_CODES } from '../constants';
import { AuthResult, SocialLoginOptions } from '../providers/types';
import { googleLogin } from '../providers/google';
import { appleLogin } from '../providers/apple';
import { facebookLogin } from '../providers/facebook';
import { handleError, SocialAuthError } from '../utils/errorHandler';

/**
 * State for the social login hook
 */
export interface UseSocialLoginState {
    loading: boolean;
    error: string | null;
    result: AuthResult | null;
}

/**
 * Return type for the useSocialLogin hook
 */
export interface UseSocialLoginReturn extends UseSocialLoginState {
    login: (options?: SocialLoginOptions) => Promise<AuthResult>;
    reset: () => void;
}

/**
 * React hook for social authentication
 * 
 * @param provider - The authentication provider ('google' or 'apple')
 * @returns Object containing login function, loading state, error, and result
 * 
 * @example
 * ```tsx
 * const { login, loading, error } = useSocialLogin('google');
 * 
 * const handleLogin = async () => {
 *   const result = await login();
 *   if (result.action === 'success') {
 *     console.log('Logged in as:', result.user.email);
 *   }
 * };
 * ```
 */
export const useSocialLogin = (provider: Provider): UseSocialLoginReturn => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<AuthResult | null>(null);

    const reset = useCallback(() => {
        setLoading(false);
        setError(null);
        setResult(null);
    }, []);

    const login = useCallback(async (options?: SocialLoginOptions): Promise<AuthResult> => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            let authResult: AuthResult;

            switch (provider) {
                case PROVIDERS.GOOGLE:
                    authResult = await googleLogin(options);
                    break;
                case PROVIDERS.APPLE:
                    authResult = await appleLogin(options);
                    break;
                case PROVIDERS.FACEBOOK:
                    authResult = await facebookLogin(options);
                    break;
                default:
                    throw new SocialAuthError(
                        ERROR_CODES.UNKNOWN_PROVIDER,
                        `Unknown provider: ${provider}`
                    );
            }

            setResult(authResult);

            if (authResult.action === 'failed') {
                setError(authResult.error || 'Authentication failed');
            }

            return authResult;
        } catch (err) {
            const failedResult = handleError(err);
            setResult(failedResult);
            setError(failedResult.error || 'Authentication failed');
            return failedResult;
        } finally {
            setLoading(false);
        }
    }, [provider]);

    return {
        login,
        loading,
        error,
        result,
        reset,
    };
};

export default useSocialLogin;
