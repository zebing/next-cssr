import fetch from 'node-fetch';

let requestTasksKeyList = [];

export default function (req, res, prefechAPIConfing) {
  const requestTasks = [];
  requestTasksKeyList = Object.keys(prefechAPIConfing);

  requestTasksKeyList.map((requestTask) =>
    requestTasks.push(new Promise((resolve, reject) => {
      requestAction(req, res, prefechAPIConfing[requestTask], resolve);
    })));

  // 如果prefechAPIConfing 为空对象{}，则返回结果为{}
  return Promise.all(requestTasks).then((results) =>
    results.reduce((tasksResult, item, key) => {
      tasksResult[requestTasksKeyList[key]] = item;
      return tasksResult;
    },
    {}));
}

// 发起请求
function requestAction(req, res, requestTaskConfig, resolve) {
  const { url, config } = fetchConfigResolve(req, res, requestTaskConfig);
  fetch(url, config)
    .then((res) => {
      const response = {
        code: 10001,
        msg: 'fetch request unknown error',
      };

      // 开发环境，将err内容返回
      if (process.env.NODE_ENV === 'development') {
        response.err = res;
      }

      const result = res.status === 200
        ? res.json()
        : {
          code: res.status,
          msg: 'fetch request unknown error',
          err: res.json(),
        };
      return resolve(result);
    })
    .catch((err) => {
      const response = {
        code: 10001,
        msg: 'fetch request unknown error',
      };

      // 开发环境，将err内容返回
      if (process.env.NODE_ENV === 'development') {
        response.err = err;
      }
      return resolve(response);
    });
}

// fetch config
function fetchConfigResolve(req, res, { type, data = {}, headers, url }) {
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