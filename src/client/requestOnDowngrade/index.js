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
  let requestTasksKeyList = [];
  let requestTasks = [];
  requestTasksKeyList = Object.keys(prefetchAPIConfig);

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
    window[PREFETCHAPI_RESULTS_STATUS] = true;
    window[PREFETCHAPI_RESULTS] = result;
    notify();
  });

  // 发起请求
  function requestAction(requestTaskConfig, resolve) {
    const xhr = new XMLHttpRequest();
    const method = requestTaskConfig.type ? requestTaskConfig.type.toUpperCase() : 'GET';
    let url = window.location.origin + requestTaskConfig.url;
    const headers = [];
    let postData = null;

    // header
    Object.keys(requestTaskConfig.headers || {}).map((key) => headers.push([[key], requestTaskConfig.headers[key]]));

    if (method === 'GET') {
      let params = [];
      headers.push(['Content-Type', 'application/x-www-form-urlencoded; charset=utf-8']);

      // body
      Object.keys(requestTaskConfig.data || {}).map((key) => params.push(encodeURIComponent(key) + '=' + encodeURIComponent(requestTaskConfig.data[key])));

      params = params.join('&');
      url = url + '?' + params;
    } else {
      headers.push(['Content-Type', 'application/json; charset=utf-8']);
      postData = JSON.stringify(requestTaskConfig.data || {});
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
    xhr.send(postData);
  }

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
}

