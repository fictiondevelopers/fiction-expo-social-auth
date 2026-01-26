/**
 * Platform detection utilities
 * 
 * This module detects the current platform (iOS, Android, Web)
 * and works in React Native, Expo, Vue, Svelte, and plain web environments.
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
            // Use dynamic require to prevent bundlers from resolving react-native in web builds
            // The variable indirection prevents static analysis
            const moduleName = 'react-native';
            // @ts-ignore - Dynamic require
            const RN = require(moduleName);
            const Platform = RN.Platform;
            isIOS = Platform.OS === 'ios';
            isAndroid = Platform.OS === 'android';
        } catch (e) {
            // Fallback to web if Platform module not available
            isWeb = true;
        }
    } else {
        // In web environment (React Web, Vue, Svelte, etc.)
        isWeb = true;

        // Check user agent for iOS/Android web browsers
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
        // Use dynamic require to prevent bundlers from resolving in web builds
        const moduleName = 'expo-apple-authentication';
        // @ts-ignore - Dynamic require
        const AppleAuthentication = require(moduleName);
        return await AppleAuthentication.isAvailableAsync();
    } catch (e) {
        return false;
    }
};
