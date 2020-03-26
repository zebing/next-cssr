import fs from 'fs';

export default function handle(req, res, { app, handle, latencyP99, remainDowngradeTimes }) {
  // 是否已经提交响应
  let isHandleRequest = false;
  const dev = app.renderOpts.dev;
  const dir = app.dir;

  // 本地开发一律handle返回
  if (dev || /^\/_next/.test(req.path)) {
    handle(req, res);
    return;
  }


  // 服务降级
  // 1. 开发者调试降级
  // 2. 当前 event loop 时间过长时降级，通常服务器负载已过高
  // 3. 页面渲染时间过长时降级，通常是后端接口引起的长时间 pending

  if (req.query['downgrade_to_export'] === '1') {
    if (downgrade('query assignation') !== false) {
      return;
    }
  }

  // 服务器过载降级
  if (remainDowngradeTimes > 0) {
    if (downgrade(`Event loop latency p99: ${latencyP99.toFixed(3)}ms`) !== false) {
      return;
    }
  }
  handle_start();

  // 降级函数
  function downgrade(reason) {
    const pathFormat = req.path === '/' ? '/index.html' : req.path.replace(/.html$/gi, '') + '.html';
    const export_url = dir + '/out' + pathFormat;

    // 降级文档路径无效，降级失败
    if (!fs.existsSync(export_url)) {
      return false;
    }

    // 如果handle已提交，则不执行
    if (!isHandleRequest) {
      isHandleRequest = true;
      let html = fs.readFileSync(export_url, { encoding: 'utf8' });
      res.header('X-SSR-Downgrade', reason || true);
      app.sendHTML(req, res, html);
      return true;
    }

    // 如执行到此说明降级失败
    return false;
  }

  // 开始提交渲染
  function handle_start() {
    app.renderToHTML(req, res, req.path, { hash: Math.random() }, {}).then((html) => {
      // 降级时已提前返回响应
      if (!isHandleRequest) {
        isHandleRequest = true;
        res.header('X-SSR-Native', `p99: ${latencyP99.toFixed(3)}ms`);
        app.sendHTML(req, res, html);
      }
    });

    // 超时降级，最多2.5s
    // 为何为2.5s
    const t0 = Date.now();
    setTimeout(() => {
      downgrade(`next render too long. wait ${Date.now() - t0}ms. p99: ${latencyP99.toFixed(3)}ms`);
    }, 2500);
  }
}
