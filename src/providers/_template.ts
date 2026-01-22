/**
 * TEMPLATE: New OAuth Provider
 * 
 * Copy this file to src/providers/{provider}.ts and customize
 */

import { AUTH_BACKEND_URL, ERROR_CODES, PROVIDERS } from '../constants';
import { AuthResult, SocialLoginOptions } from './types';
import { handleError, logError } from '../utils/errorHandler';
import { getPlatformInfo } from '../utils/platform';
import { buildAuthUrl, parseCallbackUrl, paramsToAuthResult } from '../utils/urlParser';

// TODO: Add your provider to constants.ts:
// export const PROVIDERS = {
//   NEW_PROVIDER: 'newprovider',
// } as const;

const PROVIDER_NAME = 'newprovider'; // Change this

/**
 * Perform login with this provider
 */
export const newproviderLogin = async (options?: SocialLoginOptions): Promise<AuthResult> => {
  const platform = getPlatformInfo();
  const backendUrl = options?.backendUrl || AUTH_BACKEND_URL;

  try {
    if (platform.isWeb && !platform.isExpo) {
      return await loginWeb(backendUrl, options?.callbackUrl);
    } else {
      return await loginMobile(backendUrl, options?.callbackUrl);
    }
  } catch (error) {
    logError(`${PROVIDER_NAME} login error`, error);
    return handleError(error);
  }
};

/**
 * Web implementation using popup
 */
const loginWeb = async (backendUrl: string, customCallbackUrl?: string): Promise<AuthResult> => {
  return new Promise((resolve) => {
    const callbackUrl = customCallbackUrl || window.location.origin + '/auth/callback';
    const authUrl = buildAuthUrl(backendUrl, PROVIDER_NAME, callbackUrl);

    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      authUrl,
      `${PROVIDER_NAME}Auth`,
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

    const pollInterval = setInterval(() => {
      try {
        if (popup.closed) {
          clearInterval(pollInterval);
          resolve({
            action: 'failed',
            error: 'Sign-in window was closed',
            errorCode: ERROR_CODES.REQUEST_CANCELED,
          });
          return;
        }

        const popupUrl = popup.location.href;
        if (popupUrl.includes('action=success') || popupUrl.includes('action=failed')) {
          clearInterval(pollInterval);
          const params = parseCallbackUrl(popupUrl);
          popup.close();
          resolve(paramsToAuthResult(params));
        }
      } catch (e) {
        // Cross-origin - continue polling
      }
    }, 500);

    setTimeout(() => {
      clearInterval(pollInterval);
      if (!popup.closed) popup.close();
      resolve({
        action: 'failed',
        error: 'Authentication timed out',
        errorCode: ERROR_CODES.AUTH_FAILED,
      });
    }, 5 * 60 * 1000);
  });
};

/**
 * Mobile implementation using expo-web-browser
 */
const loginMobile = async (backendUrl: string, customCallbackUrl?: string): Promise<AuthResult> => {
  try {
    // @ts-ignore
    const WebBrowser = require('expo-web-browser');
    // @ts-ignore
    const Linking = require('expo-linking');

    const callbackUrl = customCallbackUrl || Linking.createURL();
    const authUrl = buildAuthUrl(backendUrl, PROVIDER_NAME, callbackUrl);

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

export default newproviderLogin;
