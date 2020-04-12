import downgrade from './dowmgrade';

// 开始提交渲染
export default function startHandle({ app, req, res, overload }) {
  res.locals.ssr = true;
  app.renderToHTML(req, res, req.path, { hash: Math.random() }, {}).then((html) => {
    // 降级时已提前返回响应
    if (!res.locals.isHandle) {
      res.locals.isHandle = true;
      res.header('X-SSR-Render', `over load : ${overload.toString()}`);
      app.sendHTML(req, res, html);
    }
  });

  // 超时降级，最多2.5s
  // 为何为2.5s
  setTimeout(() => {
    downgrade({ app, req, res, reason: 'ssr render too long. More than 2.5s' });
  }, 2500);
}