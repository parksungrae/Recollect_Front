const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// NativeWind v4 configuration
config.resolver = config.resolver || {};
config.resolver.sourceExts = config.resolver.sourceExts || [];
config.resolver.sourceExts.push('css');

module.exports = config;
