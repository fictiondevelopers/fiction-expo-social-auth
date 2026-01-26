/**
 * Angular Service for Social Authentication
 * 
 * Provides an injectable service for social login in Angular applications.
 * 
 * @example
 * ```typescript
 * import { Component } from '@angular/core';
 * import { SocialLoginService } from 'fiction-expo-social-auth/angular';
 * 
 * @Component({
 *   selector: 'app-login',
 *   template: `
 *     <button (click)="loginWithGoogle()" [disabled]="loading">
 *       {{ loading ? 'Signing in...' : 'Sign in with Google' }}
 *     </button>
 *   `
 * })
 * export class LoginComponent {
 *   loading = false;
 *   
 *   constructor(private socialLogin: SocialLoginService) {}
 *   
 *   async loginWithGoogle() {
 *     this.loading = true;
 *     const result = await this.socialLogin.login('google');
 *     this.loading = false;
 *     console.log(result);
 *   }
 * }
 * ```
 */

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

/**
 * Angular Service for social authentication
 * 
 * Note: This is a framework-agnostic class that can be used as an Angular service.
 * For Angular, you can wrap this in an @Injectable() decorator or use it directly.
 * 
 * @example
 * ```typescript
 * // In your module or component
 * import { SocialLoginService } from 'fiction-expo-social-auth/angular';
 * 
 * // Create an Angular-injectable wrapper
 * @Injectable({ providedIn: 'root' })
 * export class AuthService extends SocialLoginService {}
 * ```
 */
export class SocialLoginService {
    private _state: SocialLoginState = {
        loading: false,
        error: null,
        result: null,
        user: null,
    };

    get loading(): boolean {
        return this._state.loading;
    }

    get error(): string | null {
        return this._state.error;
    }

    get result(): AuthResult | null {
        return this._state.result;
    }

    get user(): AuthUser | null {
        return this._state.user;
    }

    get state(): SocialLoginState {
        return { ...this._state };
    }

    private getLoginFunction(provider: string) {
        switch (provider.toLowerCase()) {
            case PROVIDERS.GOOGLE:
                return googleLogin;
            case PROVIDERS.FACEBOOK:
                return facebookLogin;
            case PROVIDERS.APPLE:
                return appleLogin;
            default:
                throw new Error(`Unknown provider: ${provider}`);
        }
    }

    /**
     * Perform social login
     * @param provider - The provider to use ('google', 'facebook', 'apple')
     * @param options - Optional configuration
     */
    async login(provider: Provider | string, options?: SocialLoginOptions): Promise<AuthResult> {
        this._state = {
            ...this._state,
            loading: true,
            error: null,
            result: null,
            user: null,
        };

        try {
            const loginFn = this.getLoginFunction(provider);
            const authResult = await loginFn(options);

            this._state = {
                ...this._state,
                loading: false,
                result: authResult,
                user: authResult.action === 'success' ? authResult.user : null,
                error: authResult.action === 'failed' ? (authResult.error || 'Authentication failed') : null,
            };

            return authResult;
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Unknown error';
            const failedResult: AuthResult = {
                action: 'failed',
                error: errorMessage,
                errorCode: ERROR_CODES.AUTH_FAILED,
            };

            this._state = {
                ...this._state,
                loading: false,
                error: errorMessage,
                result: failedResult,
                user: null,
            };

            return failedResult;
        }
    }

    /**
     * Quick login methods for each provider
     */
    async loginWithGoogle(options?: SocialLoginOptions): Promise<AuthResult> {
        return this.login('google', options);
    }

    async loginWithFacebook(options?: SocialLoginOptions): Promise<AuthResult> {
        return this.login('facebook', options);
    }

    async loginWithApple(options?: SocialLoginOptions): Promise<AuthResult> {
        return this.login('apple', options);
    }

    /**
     * Reset the service state
     */
    reset(): void {
        this._state = {
            loading: false,
            error: null,
            result: null,
            user: null,
        };
    }
}

/**
 * Factory function to create a new SocialLoginService instance
 */
export function createSocialLoginService(): SocialLoginService {
    return new SocialLoginService();
}
