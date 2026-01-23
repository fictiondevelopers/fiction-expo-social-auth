/**
 * Vue.js Composable for Social Authentication
 * 
 * Provides a reactive composable for social login in Vue 3 applications.
 * 
 * @example
 * ```vue
 * <script setup>
 * import { useSocialLogin } from 'fiction-expo-social-auth/vue';
 * 
 * const { login, loading, error, user } = useSocialLogin('google');
 * </script>
 * 
 * <template>
 *   <button @click="login" :disabled="loading">
 *     {{ loading ? 'Signing in...' : 'Sign in with Google' }}
 *   </button>
 *   <p v-if="error">{{ error }}</p>
 *   <p v-if="user">Welcome, {{ user.name }}!</p>
 * </template>
 * ```
 */

import { ref, readonly, type Ref } from 'vue';
import { googleLogin } from '../providers/google';
import { appleLogin } from '../providers/apple';
import { facebookLogin } from '../providers/facebook';
import { PROVIDERS, ERROR_CODES } from '../constants';
import type { AuthResult, AuthUser, SocialLoginOptions } from '../providers/types';
import type { Provider } from '../constants';

export interface UseSocialLoginReturn {
    /** Trigger the login flow */
    login: (options?: SocialLoginOptions) => Promise<AuthResult>;
    /** Whether login is in progress */
    loading: Readonly<Ref<boolean>>;
    /** Error message if login failed */
    error: Readonly<Ref<string | null>>;
    /** Full result object after login attempt */
    result: Readonly<Ref<AuthResult | null>>;
    /** User data if login was successful */
    user: Readonly<Ref<AuthUser | null>>;
    /** Reset the composable state */
    reset: () => void;
}

/**
 * Vue 3 composable for social authentication
 * 
 * @param provider - The authentication provider ('google', 'facebook', 'apple')
 * @returns Reactive state and login function
 */
export function useSocialLogin(provider: Provider | string): UseSocialLoginReturn {
    const loading = ref(false);
    const error = ref<string | null>(null);
    const result = ref<AuthResult | null>(null);
    const user = ref<AuthUser | null>(null);

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
        loading.value = true;
        error.value = null;
        result.value = null;
        user.value = null;

        try {
            const loginFn = getLoginFunction(provider);
            const authResult = await loginFn(options);

            result.value = authResult;

            if (authResult.action === 'success') {
                user.value = authResult.user;
            } else {
                error.value = authResult.error || 'Authentication failed';
            }

            return authResult;
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Unknown error';
            error.value = errorMessage;
            const failedResult: AuthResult = {
                action: 'failed',
                error: errorMessage,
                errorCode: ERROR_CODES.AUTH_FAILED,
            };
            result.value = failedResult;
            return failedResult;
        } finally {
            loading.value = false;
        }
    };

    const reset = () => {
        loading.value = false;
        error.value = null;
        result.value = null;
        user.value = null;
    };

    return {
        login,
        loading: readonly(loading),
        error: readonly(error),
        result: readonly(result),
        user: readonly(user),
        reset,
    };
}
