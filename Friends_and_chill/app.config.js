import 'dotenv/config';

export default {
  expo: {
    name: 'Friends_and_chill',
    slug: 'Friends_and_chill',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/dogo.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    extra: {
      API_URL: process.env.API_URL,
    },
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/splash.png',
        backgroundColor: '#ffffff',
      },
    },
    web: {
      favicon: './assets/splash.png',
    },
  },
};
