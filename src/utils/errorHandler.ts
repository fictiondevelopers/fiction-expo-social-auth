/**
 * Centralized error handling for authentication flows
 */

import { ERROR_CODES, ErrorCode } from '../constants';
import { AuthFailedResult } from '../providers/types';

/**
 * Error messages for each error code
 */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
    [ERROR_CODES.REQUEST_CANCELED]: 'Sign-in was cancelled. Please try again.',
    [ERROR_CODES.INVALID_TOKEN]: 'Authentication failed. Please try again.',
    [ERROR_CODES.NETWORK_ERROR]: 'Network error. Please check your connection and try again.',
    [ERROR_CODES.APPLE_NOT_AVAILABLE]: 'Apple Sign-In is not available on this device.',
    [ERROR_CODES.UNKNOWN_PROVIDER]: 'Unknown authentication provider.',
    [ERROR_CODES.AUTH_FAILED]: 'Authentication failed. Please try again.',
};

/**
 * SocialAuthError class for typed error handling
 */
export class SocialAuthError extends Error {
    code: ErrorCode;

    constructor(code: ErrorCode, message?: string) {
        super(message || ERROR_MESSAGES[code] || 'Unknown error');
        this.name = 'SocialAuthError';
        this.code = code;
    }
}

/**
 * Convert various error types to AuthFailedResult
 */
export const handleError = (error: unknown): AuthFailedResult => {
    // Handle SocialAuthError
    if (error instanceof SocialAuthError) {
        return {
            action: 'failed',
            error: error.message,
            errorCode: error.code,
        };
    }

    // Handle standard Error
    if (error instanceof Error) {
        // Check for known error patterns
        const message = error.message.toLowerCase();

        if (message.includes('cancel') || message.includes('cancelled') || message.includes('dismissed')) {
            return {
                action: 'failed',
                error: ERROR_MESSAGES[ERROR_CODES.REQUEST_CANCELED],
                errorCode: ERROR_CODES.REQUEST_CANCELED,
            };
        }

        if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
            return {
                action: 'failed',
                error: ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR],
                errorCode: ERROR_CODES.NETWORK_ERROR,
            };
        }

        if (message.includes('token') || message.includes('invalid') || message.includes('expired')) {
            return {
                action: 'failed',
                error: ERROR_MESSAGES[ERROR_CODES.INVALID_TOKEN],
                errorCode: ERROR_CODES.INVALID_TOKEN,
            };
        }

        return {
            action: 'failed',
            error: error.message,
            errorCode: ERROR_CODES.AUTH_FAILED,
        };
    }

    // Handle unknown error types
    return {
        action: 'failed',
        error: 'An unexpected error occurred',
        errorCode: ERROR_CODES.AUTH_FAILED,
    };
};

/**
 * Log error for debugging (only in development)
 */
export const logError = (context: string, error: unknown): void => {
    if (__DEV__ || process.env.NODE_ENV === 'development') {
        console.error(`[fiction-expo-social-auth] ${context}:`, error);
    }
};

// Polyfill for __DEV__ in non-React Native environments
declare global {
    const __DEV__: boolean | undefined;
}
