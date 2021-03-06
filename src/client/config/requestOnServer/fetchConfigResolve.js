import resolveRequestData from './resolveRequestData';

// fetch config 参数处理
export default function fetchConfigResolve(req, res, { type, data = {}, headers, url }) {
  let urlResolve = `${req.protocol}://${req.headers.host}${url}`;
  data = resolveRequestData(data, req);

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
    if (params) {
      urlResolve = `${urlResolve}?${params}`;
    }

  } else {
    config.headers['Content-Type'] = 'application/json; charset=utf-8';
    config.body = JSON.stringify(data);
  }

  return {
    url: urlResolve,
    config,
  };
}
