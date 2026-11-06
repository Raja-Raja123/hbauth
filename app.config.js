const config = require('./app.json');

const iosUrlScheme = process.env.IOS_GOOGLE_SIGNIN_URL_SCHEME;

if (iosUrlScheme) {
  config.expo.plugins = config.expo.plugins.map((plugin) =>
    plugin === '@react-native-google-signin/google-signin'
      ? [
          plugin,
          {
            iosUrlScheme,
          },
        ]
      : plugin
  );
}

module.exports = config;
