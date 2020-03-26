/* eslint-disable */
/*
 * 降级客户端请求
 * 使用 https://tool.lu/js/ 混淆后，在 _document 上 内联至 HTML
 * 
 */
(function (window, document, prefetchAPIConfig) {
  // prefetchAPI 请求完成触发通知事件名称
  var NOTYFY_EVENT_NAME = '__NEXT_PREFETCHAPI_RESULT_EVENT_NAME';

  // prefetchAPI 请求结果数据名称
  var PREFETCHAPI_RESULTS = '__NEXT_PREFETCHAPI_RESULT_DATA';

  // prefetchAPI 请求完成状态
  var PREFETCHAPI_RESULTS_STATUS = '__NEXT_PREFETCHAPI_RESULT_STATUS';
  var requestTasksKeyList = [];
  var requestTasks = [];
  requestTasksKeyList = Object.keys(prefetchAPIConfig);

  requestTasksKeyList.map(function(requestTask) {
    return requestTasks.push(new Promise(function(resolve, reject) {
      requestAction(prefetchAPIConfig[requestTask], resolve)
    }))
  })

  return Promise.all(requestTasks).then(function(results) {
    var result = results.reduce(function(tasksResult, item, key) {
      tasksResult[requestTasksKeyList[key]] = item;
      return tasksResult;
    }, {})
    window[PREFETCHAPI_RESULTS_STATUS] = true;
    window[PREFETCHAPI_RESULTS] = result;
    notify();
  })

  // 发起请求
  function requestAction(requestTaskConfig, resolve) {
    var xhr = new XMLHttpRequest();
    var method = requestTaskConfig.type ? requestTaskConfig.type.toUpperCase() : 'GET';
    var url = window.location.origin + requestTaskConfig.url;
    var headers = []
    var postData = null;

    // header
    Object.keys(requestTaskConfig.headers || {}).map(function (key) {
      headers.push([[key], requestTaskConfig.headers[key]])
    })

    if (method === 'GET') {
      var params = [];
      headers.push(["Content-Type", "application/x-www-form-urlencoded; charset=utf-8"]);

      // body
      Object.keys(requestTaskConfig.data || {}).map(function (key) {
        params.push(encodeURIComponent(key) + '=' + encodeURIComponent(requestTaskConfig.data[key]))
      })

      params = params.join('&');
      url = url + '?' + params;
    } else {
      headers.push(["Content-Type", "application/json; charset=utf-8"]);
      postData = JSON.stringify(requestTaskConfig.data || {});
    }
    xhr.open(method, url, true);
    headers.map(function (item) {
      xhr.setRequestHeader(item[0], item[1])
    })
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
    }
    xhr.send(postData);
  }

  function notify () {
    var event;
    if (typeof window.Event) {
      event = new Event(NOTYFY_EVENT_NAME);
    } else {
      event = document.createEvent("Event");
      event.initEvent(NOTYFY_EVENT_NAME, true, true);
    }
    document.dispatchEvent(event);
  }
})(window, document, prefetchAPIConfig)

