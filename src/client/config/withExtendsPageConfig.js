import React from 'react';
import requestOnServer from './requestOnServer';
import { isObject, isFunction } from '../../lib/utils';
import {
  NOTYFY_EVENT_NAME,
  PREFETCHAPI_RESULTS,
  PREFETCHAPI_RESULTS_STATUS,
} from '../../lib/constants';

export default function withExtendsPageConfig(pageConfig, Component) {

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

  return class wrap extends React.Component {
    static async getInitialProps(ctx) {
      let pageInitialProps = {};
      ctx.prefetchAPIConfig = null;

      // 区分不同运行模式，处理页面获取到的 props
      // 服务器渲染，非开发环境
      if (process.env.BUILD_MODE === 'ssr') {

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
      this.prefetchRequestresult = true;
      this.state = {
        prefetchAPIResults: {},
      };

      // 非 ssr 模式
      if (process.env.BUILD_MODE !== 'ssr') {
        this.prefetchRequestresult = false;
      }
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