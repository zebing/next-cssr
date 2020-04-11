import requestAction from './requestAction';

export default function (req, res, prefechAPIConfing) {
  // prefechAPI 任务key列表
  const requestTasksKeyList = Object.keys(prefechAPIConfing);

  // prefechAPI 任务列表
  const requestTasks = [];

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