/**
 * Google OAuth provider
 * Uses expo-web-browser for mobile and window.open for web
 */

import { AUTH_BACKEND_URL, ERROR_CODES, PROVIDERS } from '../constants';
import { AuthResult, SocialLoginOptions } from './types';
import { handleError, logError, SocialAuthError } from '../utils/errorHandler';
import { getPlatformInfo } from '../utils/platform';
import { buildAuthUrl, parseCallbackUrl, paramsToAuthResult } from '../utils/urlParser';

/**
 * Perform Google login
 */
export const googleLogin = async (options?: SocialLoginOptions): Promise<AuthResult> => {
    const platform = getPlatformInfo();
    const backendUrl = options?.backendUrl || AUTH_BACKEND_URL;

    try {
        if (platform.isWeb && !platform.isExpo) {
            // Web-only implementation using popup
            return await googleLoginWeb(backendUrl, options?.callbackUrl);
        } else {
            // React Native / Expo implementation
            return await googleLoginMobile(backendUrl, options?.callbackUrl);
        }
    } catch (error) {
        logError('Google login error', error);
        return handleError(error);
    }
};

/**
 * Google login for web using popup
 */
const googleLoginWeb = async (backendUrl: string, customCallbackUrl?: string): Promise<AuthResult> => {
    return new Promise((resolve) => {
        const callbackUrl = customCallbackUrl || window.location.origin + '/auth/callback';
        const authUrl = buildAuthUrl(backendUrl, PROVIDERS.GOOGLE, callbackUrl);

        // Open popup
        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const popup = window.open(
            authUrl,
            'googleAuth',
            `width=${width},height=${height},left=${left},top=${top}`
        );

        if (!popup) {
            resolve({
                action: 'failed',
                error: 'Popup was blocked. Please allow popups for this site.',
                errorCode: ERROR_CODES.AUTH_FAILED,
            });
            return;
        }

        // Listen for callback message
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;

            if (event.data?.type === 'oauth-callback') {
                window.removeEventListener('message', handleMessage);
                popup.close();
                resolve(paramsToAuthResult(event.data.params));
            }
        };

        window.addEventListener('message', handleMessage);

        // Poll for popup close or URL change
        const pollInterval = setInterval(() => {
            try {
                if (popup.closed) {
                    clearInterval(pollInterval);
                    window.removeEventListener('message', handleMessage);
                    resolve({
                        action: 'failed',
                        error: 'Sign-in window was closed',
                        errorCode: ERROR_CODES.REQUEST_CANCELED,
                    });
                    return;
                }

                // Try to read popup URL (will fail if on different origin)
                const popupUrl = popup.location.href;
                if (popupUrl.includes('action=success') || popupUrl.includes('action=failed')) {
                    clearInterval(pollInterval);
                    window.removeEventListener('message', handleMessage);
                    const params = parseCallbackUrl(popupUrl);
                    popup.close();
                    resolve(paramsToAuthResult(params));
                }
            } catch (e) {
                // Cross-origin - popup still on external site, continue polling
            }
        }, 500);

        // Timeout after 5 minutes
        setTimeout(() => {
            clearInterval(pollInterval);
            window.removeEventListener('message', handleMessage);
            if (!popup.closed) {
                popup.close();
            }
            resolve({
                action: 'failed',
                error: 'Authentication timed out',
                errorCode: ERROR_CODES.AUTH_FAILED,
            });
        }, 5 * 60 * 1000);
    });
};

/**
 * Google login for React Native / Expo using expo-web-browser
 */
const googleLoginMobile = async (backendUrl: string, customCallbackUrl?: string): Promise<AuthResult> => {
    try {
        // Dynamic imports for Expo modules
        // @ts-ignore
        const WebBrowser = require('expo-web-browser');
        // @ts-ignore
        const Linking = require('expo-linking');

        const callbackUrl = customCallbackUrl || Linking.createURL();
        const authUrl = buildAuthUrl(backendUrl, PROVIDERS.GOOGLE, callbackUrl);

        const result = await WebBrowser.openAuthSessionAsync(authUrl, callbackUrl);

        if (result.type === 'success' && result.url) {
            const params = parseCallbackUrl(result.url);
            return paramsToAuthResult(params);
        }

        if (result.type === 'cancel' || result.type === 'dismiss') {
            return {
                action: 'failed',
                error: 'Sign-in was cancelled',
                errorCode: ERROR_CODES.REQUEST_CANCELED,
            };
        }

        return {
            action: 'failed',
            error: 'Authentication failed',
            errorCode: ERROR_CODES.AUTH_FAILED,
        };
    } catch (error) {
        throw error;
    }
};

export default googleLogin;
