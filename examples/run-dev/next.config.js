const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV !== 'production' ? 'export' : 'ssr',
  devServerProxy: {
    '/api': {
      target: 'http://example.cn',
      changeOrigin: true,
      cookieDomainRewrite: 'localhost',
      secure: false,
    },
  },
  webpack: (webpackConfig, { dev, isServer, buildId, defaultLoaders }) => {
    // 调整引用目录
    webpackConfig.resolve.alias = {
      ...webpackConfig.resolve.alias,
      '@lib': path.resolve(__dirname, './lib'),
      '@components': path.resolve(__dirname, './components'),
    };
    return webpackConfig;
  },
};
