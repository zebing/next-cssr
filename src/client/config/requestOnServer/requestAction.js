import fetch from 'node-fetch';
import fetchConfigResolve from './fetchConfigResolve';

// 处理请求，获取结果
export default function requestAction(req, res, requestTaskConfig, resolve) {
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