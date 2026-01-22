/**
 * Apple OAuth provider
 * Uses native expo-apple-authentication on iOS, falls back to web OAuth otherwise
 */

import { AUTH_BACKEND_URL, ERROR_CODES, PROVIDERS } from '../constants';
import { AuthResult, SocialLoginOptions } from './types';
import { handleError, logError, SocialAuthError } from '../utils/errorHandler';
import { getPlatformInfo, isNativeAppleAuthAvailable } from '../utils/platform';
import { buildAuthUrl, parseCallbackUrl, paramsToAuthResult } from '../utils/urlParser';

/**
 * Perform Apple login
 * Uses native authentication on iOS, web OAuth on other platforms
 */
export const appleLogin = async (options?: SocialLoginOptions): Promise<AuthResult> => {
    const platform = getPlatformInfo();
    const backendUrl = options?.backendUrl || AUTH_BACKEND_URL;

    try {
        // Check if native Apple auth is available (iOS only)
        const nativeAvailable = await isNativeAppleAuthAvailable();

        if (nativeAvailable && platform.isIOS && !platform.isWeb) {
            // Use native Apple authentication on iOS
            return await appleLoginNative(backendUrl);
        } else if (platform.isWeb && !platform.isExpo) {
            // Web implementation using popup
            return await appleLoginWeb(backendUrl, options?.callbackUrl);
        } else {
            // Fallback to web-based OAuth for Android and other platforms
            return await appleLoginMobile(backendUrl, options?.callbackUrl);
        }
    } catch (error) {
        logError('Apple login error', error);
        return handleError(error);
    }
};

/**
 * Native Apple login using expo-apple-authentication (iOS only)
 */
const appleLoginNative = async (backendUrl: string): Promise<AuthResult> => {
    try {
        // @ts-ignore - Dynamic import for Expo module
        const AppleAuthentication = require('expo-apple-authentication');

        // Check availability
        const isAvailable = await AppleAuthentication.isAvailableAsync();
        if (!isAvailable) {
            throw new SocialAuthError(ERROR_CODES.APPLE_NOT_AVAILABLE);
        }

        // Request Apple Sign-In
        const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
        });

        // Extract user info
        // Note: fullName and email are only provided on FIRST sign-in
        const userId = credential.user;
        const email = credential.email || '';
        const firstName = credential.fullName?.givenName || '';
        const lastName = credential.fullName?.familyName || '';
        const fullName = `${firstName} ${lastName}`.trim();

        // Get identity token for backend verification
        const identityToken = credential.identityToken;
        const authorizationCode = credential.authorizationCode;

        if (identityToken) {
            // Send to backend for verification and token exchange
            try {
                const response = await fetch(`${backendUrl}/api/auth/apple/verify`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        identityToken,
                        authorizationCode,
                        user: userId,
                        email,
                        fullName,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    return {
                        action: 'success',
                        user: {
                            id: data.id || userId,
                            email: data.email || email,
                            name: data.name || fullName,
                            photo: data.photo || '',
                        },
                        id: data.id || userId,
                        email: data.email || email,
                        name: data.name || fullName,
                        photo: data.photo || '',
                    };
                }
            } catch (e) {
                // Backend verification failed, but we still have local user info
                logError('Backend verification failed', e);
            }
        }

        // Return local user info if backend verification not available
        return {
            action: 'success',
            user: {
                id: userId,
                email: email,
                name: fullName,
                photo: '',
            },
            id: userId,
            email: email,
            name: fullName,
            photo: '',
        };
    } catch (error: any) {
        // Handle specific Apple auth errors
        if (error.code === 'ERR_REQUEST_CANCELED' || error.code === 'ERR_CANCELED') {
            return {
                action: 'failed',
                error: 'Sign-in was cancelled',
                errorCode: ERROR_CODES.REQUEST_CANCELED,
            };
        }
        throw error;
    }
};

/**
 * Apple login for web using popup
 */
const appleLoginWeb = async (backendUrl: string, customCallbackUrl?: string): Promise<AuthResult> => {
    return new Promise((resolve) => {
        const callbackUrl = customCallbackUrl || window.location.origin + '/auth/callback';
        const authUrl = buildAuthUrl(backendUrl, PROVIDERS.APPLE, callbackUrl);

        // Open popup
        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const popup = window.open(
            authUrl,
            'appleAuth',
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

                // Try to read popup URL
                const popupUrl = popup.location.href;
                if (popupUrl.includes('action=success') || popupUrl.includes('action=failed')) {
                    clearInterval(pollInterval);
                    window.removeEventListener('message', handleMessage);
                    const params = parseCallbackUrl(popupUrl);
                    popup.close();
                    resolve(paramsToAuthResult(params));
                }
            } catch (e) {
                // Cross-origin - continue polling
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
 * Apple login for React Native using expo-web-browser (Android/fallback)
 */
const appleLoginMobile = async (backendUrl: string, customCallbackUrl?: string): Promise<AuthResult> => {
    try {
        // @ts-ignore
        const WebBrowser = require('expo-web-browser');
        // @ts-ignore
        const Linking = require('expo-linking');

        const callbackUrl = customCallbackUrl || Linking.createURL();
        const authUrl = buildAuthUrl(backendUrl, PROVIDERS.APPLE, callbackUrl);

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

export default appleLogin;
