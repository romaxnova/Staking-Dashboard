const { override, addWebpackPlugin } = require('customize-cra');

module.exports = override(
  // Disable TypeScript checking to reduce memory usage
  (config) => {
    // Remove fork-ts-checker-webpack-plugin
    config.plugins = config.plugins.filter(
      plugin => plugin.constructor.name !== 'ForkTsCheckerWebpackPlugin'
    );
    
    // Reduce bundle splitting to minimize memory usage
    if (config.optimization && config.optimization.splitChunks) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
          },
        },
      };
    }
    
    return config;
  }
);