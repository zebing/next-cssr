import { isObject, isFunction } from '../../lib/utils';
import withPageConfig from './withPageConfig';

export default function config(config) {
  return function (Component) {
    let pageConfig = {};
    let middleware = [];
    let TargetComponent = Component;

    // 配置参数数为函数
    if (isFunction(config)) {
      [pageConfig, ...middleware] = config();
    }

    // 配置参数为对象
    if (isObject(config)) {
      pageConfig = config;
    }

    // 应用PageConfig
    TargetComponent = withPageConfig(pageConfig, TargetComponent);

    // 应用 middleware
    middleware.map((w) => {
      if (!isFunction(w)) {
        // eslint-disable-next-line no-console
        console.error(w);
        throw new Error('config 提供中间件配置类型需为 function 形式，请检查');
      }
    });

    return TargetComponent;
  };
}
