const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const WebpackBar = require('webpackbar');
const CracoAlias = require('craco-alias');

process.env.BROWSER = 'none';

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Remove or modify the Prettier plugin
      webpackConfig.plugins = webpackConfig.plugins.filter(plugin => 
        !(plugin.constructor && plugin.constructor.name === 'PrettierPlugin')
      );
      webpackConfig.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      });
      
      // Split chunks to avoid large files that cause ngrok issues
      webpackConfig.optimization = {
        ...webpackConfig.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              maxSize: 1024 * 1024, // 1MB max chunk size
            },
            common: {
              minChunks: 2,
              chunks: 'all',
              maxSize: 1024 * 1024, // 1MB max chunk size
            },
          },
        },
      };
      
      return webpackConfig;
    },
    plugins: [
      new WebpackBar({ profile: true }),
      ...(process.env.NODE_ENV === 'development' ? [new BundleAnalyzerPlugin({ openAnalyzer: false })] : []),
    ],
  },
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: 'tsconfig',
        // baseUrl SHOULD be specified
        // plugin does not take it from tsconfig
        baseUrl: './src/',
        /* tsConfigPath should point to the file where "baseUrl" and "paths"
         are specified*/
        tsConfigPath: './tsconfig.paths.json',
      },
    },
  ],
};