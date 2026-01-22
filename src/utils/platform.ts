/**
 * Platform detection utilities
 */

import { PlatformInfo } from '../providers/types';

/**
 * Detect the current platform
 */
export const getPlatformInfo = (): PlatformInfo => {
    // Check if we're in a React Native environment
    const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';

    // Check if running in Expo
    // @ts-ignore - Expo specific check
    const isExpo = typeof expo !== 'undefined' || isReactNative;

    // Check platform
    let isIOS = false;
    let isAndroid = false;
    let isWeb = false;

    if (isReactNative) {
        // In React Native, check Platform module
        try {
            // Dynamic import to avoid bundling issues on web
            // @ts-ignore
            const { Platform } = require('react-native');
            isIOS = Platform.OS === 'ios';
            isAndroid = Platform.OS === 'android';
        } catch (e) {
            // Fallback to web if Platform module not available
            isWeb = true;
        }
    } else {
        // In web environment
        isWeb = true;

        // Check user agent for iOS web
        if (typeof navigator !== 'undefined') {
            const ua = navigator.userAgent || '';
            isIOS = /iPhone|iPad|iPod/i.test(ua);
            isAndroid = /Android/i.test(ua);
        }
    }

    return {
        isIOS,
        isAndroid,
        isWeb,
        isExpo,
        // Native Apple auth only supported on iOS via expo-apple-authentication
        supportsNativeAppleAuth: isIOS && isExpo && !isWeb,
    };
};

/**
 * Check if native Apple authentication is available
 */
export const isNativeAppleAuthAvailable = async (): Promise<boolean> => {
    const platform = getPlatformInfo();

    if (!platform.supportsNativeAppleAuth) {
        return false;
    }

    try {
        // Try to check if expo-apple-authentication is available
        // @ts-ignore
        const AppleAuthentication = require('expo-apple-authentication');
        return await AppleAuthentication.isAvailableAsync();
    } catch (e) {
        return false;
    }
};
