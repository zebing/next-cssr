import proxy from 'http-proxy-middleware';
import { isObject } from '../utils';

export default function devProxy(server, app) {
  const devServerProxy = app.nextConfig.devServerProxy;

  if (isObject(devServerProxy)) {
    Object.keys(devServerProxy).map((key) => {
      server.use(proxy(key, devServerProxy[key]));
    })
  }
}