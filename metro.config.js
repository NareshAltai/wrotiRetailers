// const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

// /**
//  * Metro configuration
//  * https://reactnative.dev/docs/metro
//  *
//  * @type {import('metro-config').MetroConfig}
//  */
// const config = {};

// module.exports = mergeConfig(getDefaultConfig(__dirname), config);
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    assetExts: defaultConfig.resolver.assetExts,
    sourceExts: [...defaultConfig.resolver.sourceExts, 'cjs'], // handle reanimated .cjs files
  },
  // Workaround for ENOENT watcher issues on Windows
  watchFolders: [],
  server: {
    enableVisualizer: false,
  },
  transformer: {
    ...defaultConfig.transformer,
  },
};

module.exports = mergeConfig(defaultConfig, config);
