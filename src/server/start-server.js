import express from 'express';
import next from 'next';
import path from 'path';
import os from 'os';
import handleRequest from './handle';
import devProxy from './dev-proxy';

export default function startServer(opts) {
  const server = express();
  const dev = opts.dev;
  const app = next(opts);
  const handle = app.getRequestHandler();

  // 开发环境下
  if (dev) {
    devProxy(server, app);
  } else {
    // export 静态文件托管，可放在专属 nginx 服务器
    server.use('/_next/static', express.static(path.join(opts.dir, '/out/_next/static')));
  }

  server.all('/*', (req, res) => {
    const overload = os.loadavg();
    const cpuNumber = os.cpus().length;
    return handleRequest(req, res, { app, handle, overload, cpuNumber });
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