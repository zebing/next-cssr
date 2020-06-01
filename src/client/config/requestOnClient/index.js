/**
 * 客户端请求
 * 主要解决浅层路由变化不重新执行prefechAPI接口问题
 */

export default function requestOnClient(prefetchAPIConfig = {}) {
  // prefechAPI任务列表
  let requestTasks = [];

  // prefechAPI任务key列表
  const requestTasksKeyList = Object.keys(prefetchAPIConfig);

  requestTasksKeyList.map(function (requestTask) {
    return requestTasks.push(new Promise(function (resolve, reject) {
      requestAction(prefetchAPIConfig[requestTask], resolve);
    }));
  });

  return Promise.all(requestTasks).then(function (results) {
    return results.reduce(function (tasksResult, item, key) {
      tasksResult[requestTasksKeyList[key]] = item;
      return tasksResult;
    }, {});
  });

  // 发起请求
  function requestAction(requestTaskConfig, resolve) {
    const xhr = new XMLHttpRequest();
    const method = requestTaskConfig.type ? requestTaskConfig.type.toUpperCase() : 'GET';
    let url = window.location.origin + requestTaskConfig.url;
    const headers = [];
    let requestData = resolveData(requestTaskConfig.data);

    // header
    Object.keys(requestTaskConfig.headers || {}).map((key) => headers.push([[key], requestTaskConfig.headers[key]]));

    if (method === 'GET') {
      let params = [];
      headers.push(['Content-Type', 'application/x-www-form-urlencoded; charset=utf-8']);

      // body
      Object.keys(requestData).map((key) => params.push(encodeURIComponent(key) + '=' + encodeURIComponent(requestData[key])));

      params = params.join('&');
      if (params) {
        url = url + '?' + params;
      }
    } else {
      headers.push(['Content-Type', 'application/json; charset=utf-8']);
      requestData = JSON.stringify(requestData);
    }
    xhr.open(method, url, true);
    headers.map((item) => xhr.setRequestHeader(item[0], item[1]));
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.response));
        } else {
          resolve({
            code: xhr.status,
            msg: JSON.parse(xhr.response).msg,
          });
        }
      }
    };
    xhr.send(requestData);
  }

  // 请求参数 data 处理
  function resolveData(data = {}) {
    // data 支持location，query，cookie三个动态参数
    const location = document.location;
    const params = (new URL(document.location)).searchParams;
    const newData = {};

    Object.keys(data).map((key) => {
      if (typeof data[key] === 'string') {
        newData[key] = getRealValue(data[key], location, params);
      } else {
        newData[key] = data[key];
      }
    });

    return newData;
  }

  // 处理字符串参数, 获取data真实值
  function getRealValue(value, location, params) {
    let newValue = '';

    // cookie 变量
    if (/^cookie\./.test(value)) {
      newValue = getCookie(value.replace('cookie.', ''));

      // query 参数
    } else if (/^query\./.test(value)) {
      newValue = params.get(value.replace('query.', ''));

      // location参数
    } else if (/^location\./.test(value)) {
      newValue = location[value.replace('location.', '')];

      // 普通字符串
    } else {
      newValue = value;
    }

    return newValue;
  }

  // 获取cookie 值
  function getCookie(key) {
    return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(key).replace(/[-.+*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
  }
}

