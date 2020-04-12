// 服务降级
// 1. 配置文件mode降级
// 2. 开发者调试降级
// 3. 当前 event loop 时间过长时降级，通常服务器负载已过高
// 4. 页面渲染时间过长时降级，通常是后端接口引起的长时间 pending

import startHande from './start-handle';
import downgrade from './dowmgrade';

export default function handleRequest(req, res, { app, handle, overload, cpuNumber }) {
  // 开发环境
  const dev = app.renderOpts.dev;
  const isTooHight = overload[0] > cpuNumber;

  // 本地开发一律handle返回
  if (dev || /^\/_next/.test(req.path)) {
    handle(req, res);
    return;
  }

  // next.config.js mode 为export
  if (app.nextConfig.mode === 'export') {
    if (downgrade({ app, req, res, reason: 'next.config.js mode is export' }) !== false) {
      return;
    }
  }

  // query downgrade_to_export
  if (req.query['downgrade_to_export'] === '1') {
    if (downgrade({ app, req, res, reason: 'query assignation' }) !== false) {
      return;
    }
  }

  // 服务器过载降级
  if (isTooHight) {
    if (downgrade({ app, req, res, reason: `server load is too high. over load ${overload.toString()}` }) !== false) {
      return;
    }
  }

  startHande({ app, req, res, overload });
}