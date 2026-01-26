/**
 * Shared types for the fiction-expo-social-auth package
 */

import { ErrorCode } from '../constants';

/**
 * User data returned after successful authentication
 */
export interface AuthUser {
    id: string;
    email: string;
    name: string;
    photo: string;
    phoneNumber?: string;
}

/**
 * Success result from authentication
 */
export interface AuthSuccessResult {
    action: 'success';
    user: AuthUser;
    id: string;
    email: string;
    name: string;
    photo: string;
}

/**
 * Failed result from authentication
 */
export interface AuthFailedResult {
    action: 'failed';
    error?: string;
    errorCode?: ErrorCode;
}

/**
 * Combined auth result type
 */
export type AuthResult = AuthSuccessResult | AuthFailedResult;

/**
 * Options for configuring social login
 */
export interface SocialLoginOptions {
    /** Custom backend URL (defaults to our-app-delta.vercel.app) */
    backendUrl?: string;
    /** Callback URL for the app to return to */
    callbackUrl?: string;
}

/**
 * Platform detection result
 */
export interface PlatformInfo {
    isIOS: boolean;
    isAndroid: boolean;
    isWeb: boolean;
    isExpo: boolean;
    supportsNativeAppleAuth: boolean;
}

/**
 * Generic login function type
 */
export type LoginFunction = (options?: SocialLoginOptions) => Promise<AuthResult>;
