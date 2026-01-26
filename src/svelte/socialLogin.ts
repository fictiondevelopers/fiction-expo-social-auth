/**
 * Svelte Store for Social Authentication
 * 
 * Provides a reactive store factory for social login in Svelte applications.
 * 
 * @example
 * ```svelte
 * <script>
 * import { createSocialLogin } from 'fiction-expo-social-auth/svelte';
 * 
 * const google = createSocialLogin('google');
 * const facebook = createSocialLogin('facebook');
 * </script>
 * 
 * <button on:click={google.login} disabled={$google.loading}>
 *   {$google.loading ? 'Signing in...' : 'Sign in with Google'}
 * </button>
 * 
 * {#if $google.error}
 *   <p class="error">{$google.error}</p>
 * {/if}
 * 
 * {#if $google.user}
 *   <p>Welcome, {$google.user.name}!</p>
 * {/if}
 * ```
 */

import { writable, derived, type Readable, type Writable } from 'svelte/store';
import { googleLogin } from '../providers/google';
import { appleLogin } from '../providers/apple';
import { facebookLogin } from '../providers/facebook';
import { PROVIDERS, ERROR_CODES } from '../constants';
import type { AuthResult, AuthUser, SocialLoginOptions } from '../providers/types';
import type { Provider } from '../constants';

export interface SocialLoginState {
    /** Whether login is in progress */
    loading: boolean;
    /** Error message if login failed */
    error: string | null;
    /** Full result object after login attempt */
    result: AuthResult | null;
    /** User data if login was successful */
    user: AuthUser | null;
}

export interface SocialLoginStore extends Readable<SocialLoginState> {
    /** Trigger the login flow */
    login: (options?: SocialLoginOptions) => Promise<AuthResult>;
    /** Reset the store state */
    reset: () => void;
}

const initialState: SocialLoginState = {
    loading: false,
    error: null,
    result: null,
    user: null,
};

/**
 * Create a Svelte store for social authentication
 * 
 * @param provider - The authentication provider ('google', 'facebook', 'apple')
 * @returns A Svelte store with login functionality
 */
export function createSocialLogin(provider: Provider | string): SocialLoginStore {
    const { subscribe, set, update } = writable<SocialLoginState>({ ...initialState });

    const getLoginFunction = (p: string) => {
        switch (p.toLowerCase()) {
            case PROVIDERS.GOOGLE:
                return googleLogin;
            case PROVIDERS.FACEBOOK:
                return facebookLogin;
            case PROVIDERS.APPLE:
                return appleLogin;
            default:
                throw new Error(`Unknown provider: ${p}`);
        }
    };

    const login = async (options?: SocialLoginOptions): Promise<AuthResult> => {
        update(state => ({
            ...state,
            loading: true,
            error: null,
            result: null,
            user: null,
        }));

        try {
            const loginFn = getLoginFunction(provider);
            const authResult = await loginFn(options);

            update(state => ({
                ...state,
                loading: false,
                result: authResult,
                user: authResult.action === 'success' ? authResult.user : null,
                error: authResult.action === 'failed' ? (authResult.error || 'Authentication failed') : null,
            }));

            return authResult;
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Unknown error';
            const failedResult: AuthResult = {
                action: 'failed',
                error: errorMessage,
                errorCode: ERROR_CODES.AUTH_FAILED,
            };

            update(state => ({
                ...state,
                loading: false,
                error: errorMessage,
                result: failedResult,
                user: null,
            }));

            return failedResult;
        }
    };

    const reset = () => {
        set({ ...initialState });
    };

    return {
        subscribe,
        login,
        reset,
    };
}

/**
 * Helper to create multiple social login stores at once
 * 
 * @example
 * ```svelte
 * <script>
 * import { createSocialLogins } from 'fiction-expo-social-auth/svelte';
 * 
 * const { google, facebook, apple } = createSocialLogins();
 * </script>
 * ```
 */
export function createSocialLogins() {
    return {
        google: createSocialLogin('google'),
        facebook: createSocialLogin('facebook'),
        apple: createSocialLogin('apple'),
    };
}
