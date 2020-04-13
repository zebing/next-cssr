import express from 'express';
import next from 'next';
import path from 'path';
import handleRequest from './handle';
import devProxy from './dev-proxy';

export default function startServer(options) {
  const server = express();
  const dev = options.dev;
  const app = next(options);
  const handle = app.getRequestHandler();

  // 开发环境下
  if (dev) {
    devProxy(server, app);
  } else {
    // export 静态文件托管，可放在专属 nginx 服务器
    server.use('/_next/static', express.static(path.join(options.dir, '/out/_next/static')));
  }

  server.all('/*', (req, res) => {
    return handleRequest(req, res, { app, handle, downgradeStrategy: options.downgradeStrategy });
  });

  // 其余所有路由
  server.all('*', (req, res) => {
    // TODO 转到友好的 404 页
    res.sendStatus(404);
  });

  return new Promise((resolve, reject) => {
    // 如未配置端口，则默认为3000
    const port = (app.nextConfig.server && app.nextConfig.server.port) || 3000;
    server.listen(port, err => {
      if (err) {
        reject(err);
      } else {
        resolve(app);
      }
    });
  });
}