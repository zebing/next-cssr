import express from 'express';
import next from 'next';
import path from 'path';
import monitor from 'event-loop-monitor';
import handle from './handle';
import devProxy from './dev-proxy';

let latencyP99 = 0
let latencyP99List = []
let remainDowngradeTimes = 0

export default function startServer(opts) {
  const server = express();
  const dev = opts.dev;
  const app = next(opts)

  // 开发环境下
  if (dev) {
    devProxy(server, app);
  }

  // 非开发环境下
  if (!dev) {
    // export 静态文件托管，可放在专属 nginx 服务器
    server.use('/_next/static', express.static(path.join(opts.dir, '/out/_next/static')))

    // 支持 event loop latency 统计
    monitor.on('data', function (latency) {
      // { p50: 1026, p90: 1059, p95: 1076, p99: 1110, p100: 1260 }
      latencyP99 = latency.p99 / 1000 // ms

      if (latencyP99List.length >= 5) {
        latencyP99List.shift()
      }
      latencyP99List.push(latencyP99)

      if (remainDowngradeTimes <= 0) {
        if (latencyP99 > 50) {
          remainDowngradeTimes = 3
        } else {
          // 不实现滑动窗口，手动展开优化性能
          const p4 = latencyP99List[4] > 25
          const p3 = latencyP99List[3] > 25
          if (p4 && p3) {
            remainDowngradeTimes = 2
          } else {
            const p2 = latencyP99List[2] > 25
            const p1 = latencyP99List[1] > 25
            const p0 = latencyP99List[0] > 25
            const overCount = (p4 && 1) + (p3 && 1) + (p2 && 1) + (p1 && 1) + (p0 && 1)
            if (overCount >= 2) {
              remainDowngradeTimes = 1
            }
          }
        }
      } else {
        remainDowngradeTimes--
        if (remainDowngradeTimes === 0) {
          // 本次从降级变为非降级
          // 额外检查本周期延迟
          if (latencyP99 > 18) {
            remainDowngradeTimes = 1
          }
        }
      }
    })
    monitor.resume(1000)
  }

  server.all('/*', (req, res) => {
    return handle(req, res, { app, handle, latencyP99, remainDowngradeTimes });
  })

  // 其余所有路由
  server.all('*', (req, res) => {
    // TODO 转到友好的 404 页
    res.sendStatus(404)
  })

  return new Promise((resolve, reject) => {
    // 如未配置端口，则默认为3000
    const port = (app.nextConfig.server && app.nextConfig.server.port) || 3000;
    server.listen(port, err => {
      if (err) {
        reject(err);
      } else {
        resolve(app);
      }
    })
  })
}