
import fs from 'fs';

// 降级函数
export default function downgrade({ app, req, res, reason }) {
  const dir = app.dir;
  const pathFormat = req.path === '/' ? '/index.html' : req.path.replace(/.html$/gi, '') + '.html';
  const export_url = dir + '/out' + pathFormat;

  // 降级文档路径无效，降级失败
  if (!fs.existsSync(export_url)) {
    return false;
  }

  // 如果handle已提交，则不执行
  if (!res.locals.isHandle) {
    res.locals.isHandle = true;
    let html = fs.readFileSync(export_url, { encoding: 'utf8' });
    res.header('X-SSR-Downgrade', reason || true);
    app.sendHTML(req, res, html);
    return true;
  }

  // 如执行到此说明降级失败
  return false;
}