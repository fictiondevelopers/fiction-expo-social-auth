/**
 * Constants for the fiction-expo-social-auth package
 */

// Backend URL for OAuth handling
export const AUTH_BACKEND_URL = 'https://our-app-delta.vercel.app';

// Supported authentication providers
export const PROVIDERS = {
    GOOGLE: 'google',
    APPLE: 'apple',
    FACEBOOK: 'facebook',
    GITHUB: 'github',
    LINKEDIN: 'linkedin',
} as const;

export type Provider = (typeof PROVIDERS)[keyof typeof PROVIDERS];

// Error codes
export const ERROR_CODES = {
    REQUEST_CANCELED: 'ERR_REQUEST_CANCELED',
    INVALID_TOKEN: 'ERR_INVALID_TOKEN',
    NETWORK_ERROR: 'ERR_NETWORK',
    APPLE_NOT_AVAILABLE: 'ERR_APPLE_NOT_AVAILABLE',
    UNKNOWN_PROVIDER: 'ERR_UNKNOWN_PROVIDER',
    AUTH_FAILED: 'ERR_AUTH_FAILED',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
