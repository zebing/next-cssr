import { createProxyMiddleware } from 'http-proxy-middleware';
import { isObject } from '../lib/utils';

export default function devProxy(server, app) {
  const devServerProxy = app.nextConfig.devServerProxy;

  if (isObject(devServerProxy)) {
    Object.keys(devServerProxy).map((key) => server.use(createProxyMiddleware(key, devServerProxy[key])));
  }
}