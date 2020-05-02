/**
 * 降级客户端请求
 */

export default function requestOnDowngrade(prefetchAPIConfig = {}) {
  return prefetchAPIConfig ? `(${startRequest.toString()})(window, document, ${JSON.stringify(prefetchAPIConfig)})` : '';
}

function startRequest(window, document, prefetchAPIConfig) {
  // prefetchAPI 请求完成触发通知事件名称
  const NOTYFY_EVENT_NAME = '__NEXT_PREFETCHAPI_RESULT_EVENT_NAME';

  // prefetchAPI 请求结果数据名称
  const PREFETCHAPI_RESULTS = '__NEXT_PREFETCHAPI_RESULT_DATA';

  // prefetchAPI 请求完成状态
  const PREFETCHAPI_RESULTS_STATUS = '__NEXT_PREFETCHAPI_RESULT_STATUS';

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
    const result = results.reduce(function (tasksResult, item, key) {
      tasksResult[requestTasksKeyList[key]] = item;
      return tasksResult;
    }, {});
    window[PREFETCHAPI_RESULTS_STATUS] = true; // 任务列表完成标记状态
    window[PREFETCHAPI_RESULTS] = result; // 任务列表结果
    notify(); // 触发完成监听事件
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

  // frefetchAPI请求完成触发
  function notify() {
    let event;
    if (typeof window.Event === 'function') {
      event = new Event(NOTYFY_EVENT_NAME);
    } else {
      event = document.createEvent('Event');
      event.initEvent(NOTYFY_EVENT_NAME, true, true);
    }
    document.dispatchEvent(event);
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

