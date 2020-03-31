const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV !== 'production' ? 'export' : 'ssr',
  // ssr 的服务器配置
  server: {
    port: 3002,
  },
  devServerProxy: {
    '/gapi': {
      target: 'https://test-vendor.akulaku.com',
      changeOrigin: true,
      cookieDomainRewrite: 'localhost',
      secure: false,
      // pathRewrite: {
      //   "^/toutiao": "",
      // },
    },
  },
  webpack: (webpackConfig, { dev, isServer, buildId, defaultLoaders }) => {
    // 调整引用目录
    webpackConfig.resolve.alias = {
      ...webpackConfig.resolve.alias,
      '@lib': path.resolve(__dirname, './lib'),
      '@components': path.resolve(__dirname, './components'),
    };

    // 编译时常量
    webpackConfig.plugins.push(
      new webpack.DefinePlugin({
        // 'process.env.BUILD_ENV': JSON.stringify(process.env.BUILD_ENV || 'local'),
        // 'process.env.BUILD_MODE': JSON.stringify(process.env.BUILD_MODE || 'export'),
      })
    );
    return webpackConfig;
  },
};
