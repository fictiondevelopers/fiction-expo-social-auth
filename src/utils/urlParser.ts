/**
 * URL parsing utilities for OAuth callback handling
 */

import { AuthResult, AuthUser } from '../providers/types';

/**
 * Parse URL query parameters from a callback URL
 */
export const parseCallbackUrl = (url: string): Record<string, string> => {
    const params: Record<string, string> = {};

    try {
        // Handle both full URLs and URLs with just query strings
        const queryString = url.includes('?') ? url.split('?')[1] : url;

        if (!queryString) {
            return params;
        }

        // Use regex to parse query params (works in both RN and Web)
        const regex = /([^?&=]+)=([^&]*)/g;
        let match;

        while ((match = regex.exec(queryString))) {
            params[match[1]] = decodeURIComponent(match[2].replace(/\+/g, ' '));
        }
    } catch (e) {
        console.error('Error parsing callback URL:', e);
    }

    return params;
};

/**
 * Convert parsed URL params to AuthResult
 */
export const paramsToAuthResult = (params: Record<string, string>): AuthResult => {
    if (params.action === 'success' && params.id && params.email) {
        const user: AuthUser = {
            id: params.id,
            email: params.email,
            name: params.name || '',
            photo: params.photo || '',
        };

        return {
            action: 'success',
            user,
            id: params.id,
            email: params.email,
            name: params.name || '',
            photo: params.photo || '',
        };
    }

    return {
        action: 'failed',
        error: params.error || 'Authentication failed',
    };
};

/**
 * Build auth URL with callback parameter
 */
export const buildAuthUrl = (
    backendUrl: string,
    provider: string,
    callbackUrl: string
): string => {
    return `${backendUrl}?backto=${encodeURIComponent(callbackUrl)}&auth=${provider}`;
};
