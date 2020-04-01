import React from 'react';
import PropTypes from 'prop-types';
import requestOnServer from './requestOnServer';
import { isObject, isFunction } from '../../lib/utils';
import {
  NOTYFY_EVENT_NAME,
  PREFETCHAPI_RESULTS,
  PREFETCHAPI_RESULTS_STATUS,
} from '../../lib/constants';

export default function config(config) {
  return function (Component) {
    let pageConfig = {};
    let middleware = [];

    // 配置参数数为函数
    if (isFunction(config)) {
      [pageConfig, ...middleware] = config();
    }

    // 配置参数为对象
    if (isObject(config)) {
      pageConfig = config;
    }

    let TargetComponent = Component;

    // 应用系统 middleware
    TargetComponent = withExtendsPageConfig(pageConfig, TargetComponent);

    return TargetComponent;
  };
}

// 扩展业务站点注入的行为
function withExtendsPageConfig(pageConfig, Component) {

  // prefetchAPI 处理，容错
  pageConfig.prefetchAPI = isObject(pageConfig.prefetchAPI) ? pageConfig.prefetchAPI : {};

  // client prefetchAPI compeleted
  function compeletedPrefetchAPILoad(callback) {
    function listener() {
      const isCompelete = window[PREFETCHAPI_RESULTS_STATUS];
      if (isCompelete) {
        const resultData = window[PREFETCHAPI_RESULTS];
        callback(resultData);
        document.removeEventListener(NOTYFY_EVENT_NAME, listener);
      }
    }
    document.addEventListener(NOTYFY_EVENT_NAME, listener, false);
    listener();
  }

  return class wrap extends React.PureComponent {
    static propTypes = {
      ssr: PropTypes.bool, // 是否为ssr渲染
    };

    static async getInitialProps(ctx) {
      // next export 模式 ctx.res.locals 为undefined
      const ssr = ctx.res.locals && ctx.res.locals.ssr && process.env.NODE_ENV !== 'development' ? true : false;
      let pageInitialProps = { ssr };
      ctx.prefetchAPIConfig = null;

      // 区分不同运行模式，处理页面获取到的 props
      // 服务器渲染，非开发环境
      if (ssr) {

        // 1. ssr 首页，server 已确认所有请求状态，全部注入至 App 并传递至 page。无需处理
        const result = await requestOnServer(ctx.req, ctx.res, pageConfig.prefetchAPI);
        pageInitialProps = { ...pageInitialProps, ...result };

      } else {
        ctx.prefetchAPIConfig = pageConfig.prefetchAPI;
      }

      return pageInitialProps;
    }

    constructor(props) {
      super(props);
      // 降级时用以控制在prefectAPI请求完成之前渲染loading页面
      this.prefetchRequestresult = props.ssr ? true : false;
      this.state = {
        prefetchAPIResults: {},
      };
    }

    componentDidMount() {
      this.handlePrefetchResult();
    }

    handlePrefetchResult() {
      compeletedPrefetchAPILoad((result) => {
        this.prefetchRequestresult = true;
        this.setState({ prefetchAPIResults: result });
      });
    }

    render() {
      const TargetComponent = Component;
      const { prefetchAPIResults } = this.state || {};
      return this.prefetchRequestresult
        ? <TargetComponent {...this.props} {...prefetchAPIResults} />
        : null;
    }
  };
}
