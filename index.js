import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
const callbackUrl = Linking.createURL();


export const fictionLogin = async (auth) => {
    const authUrl = `https://our-app-delta.vercel.app?backto=${callbackUrl}&auth=${auth}`;
    const result = await WebBrowser.openAuthSessionAsync(authUrl, callbackUrl);
    if (result.type === 'success') {
        const regex = /([^?&=]+)=([^&]*)/g;
        const params = {};
        let match;
        while ((match = regex.exec(result.url))) {
            params[match[1]] = decodeURI(match[2]);
        }
        return params;
    }
    return {
        "action": "failed"
    }; // or handle error as needed
};

