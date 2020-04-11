// fetch config 参数处理
export default function fetchConfigResolve(req, res, { type, data = {}, headers, url }) {
  // 处理请求url
  // const host = process.env.NODE_ENV === 'development' ? req.headers.host : 'test-vendor.akulaku.com';
  const host = 'test-vendor.akulaku.com';
  let urlResolve = `https://${host}${url}`;

  const config = {
    method: type ? type.toUpperCase() : 'GET',
    headers: {
      ...headers,
      cookie: req.headers.cookie,
      'user-agent': req.headers['user-agent'],
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
    timeout: 60 * 1000,
  };

  if (config.method === 'GET') {
    let params = [];
    Object.keys(data).map((key) => params.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`));
    params = params.join('&');
    urlResolve = `${urlResolve}?${params}`;

  } else {
    config.headers['Content-Type'] = 'application/json; charset=utf-8';
    config.body = JSON.stringify(data);
  }

  return {
    url: urlResolve,
    config,
  };
}