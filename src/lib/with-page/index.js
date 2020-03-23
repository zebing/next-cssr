import { isObject, isArray, isFunction } from "../utils"
import React from 'react'
import requestOnServer from "./requestOnServer"

const CtxContext = React.createContext('ctx')

// prefetchAPI 请求完成触发通知事件名称
const NOTYFY_EVENT_NAME = '__NEXT_prefetchAPI_result_event_name';

// prefetchAPI 请求结果数据名称
const PREFETCHAPI_RESULTS = '__NEXT_prefetchAPI_results_data';

// prefetchAPI 请求完成状态
const PREFETCHAPI_RESULTS_STATUS = '__NEXT_prefetchAPI_results_status';

export default function (config) {
  return function (Component) {
    let pageConfig = {}
    let middleware = []

    // 配置参数数为函数
    if (isFunction(config)) {
      [pageConfig, ...middleware] = config();
    }

    // 配置参数为对象
    if (isObject(config)) {
      pageConfig = config;
    }

    let TargetComponent = Component

    // 应用系统 middleware
    TargetComponent = withExtendsPageConfig(pageConfig, TargetComponent)

    return TargetComponent;
  }
}

// 扩展业务站点注入的行为
function withExtendsPageConfig(pageConfig, Component) {

  // prefetchAPI 处理，容错
  pageConfig.prefetchAPI = isObject(pageConfig.prefetchAPI) ? pageConfig.prefetchAPI : {};

  // client prefetchAPI compeleted
  function compeletedPrefetchAPILoad (callback) {
    function listener() {
      const isCompelete = window[PREFETCHAPI_RESULTS_STATUS];
      if (isCompelete) {
        const resultData = window[PREFETCHAPI_RESULTS];
        callback(resultData);
        document.removeEventListener(NOTYFY_EVENT_NAME, listener);
      }
    }
    document.addEventListener(NOTYFY_EVENT_NAME, listener, false)
    listener();
  }

  return class wrap extends React.PureComponent {
    static async getInitialProps(ctx) {
      let pageInitialProps = {}
      ctx.prefetchAPIConfig = null;

      // 区分不同运行模式，处理页面获取到的 props
      // 服务器渲染，非开发环境
      if (process.env.BUILD_MODE === 'ssr') {

        // 1. ssr 首页，server 已确认所有请求状态，全部注入至 App 并传递至 page。无需处理
        const result = await requestOnServer(ctx.req, ctx.res, pageConfig.prefetchAPI)
        pageInitialProps = {...pageInitialProps, ...result}

      } else {
        ctx.prefetchAPIConfig = pageConfig.prefetchAPI;
      }
      
      return pageInitialProps;
    }

    constructor (props) {
      super(props)
      this.prefetchRequestresult = true;
      this.state = {
        prefetchAPIResults: {},
      }

      // 非 ssr 模式
      if (process.env.BUILD_MODE !== 'ssr') {
        this.prefetchRequestresult = false;
      }
    }

    componentDidMount () {
      this.handlePrefetchResult();
    }

    handlePrefetchResult () {
      compeletedPrefetchAPILoad((result) => {
        this.prefetchRequestresult = true;
        this.setState({ prefetchAPIResults: result });
      })
    }

    render () {
      const TargetComponent = Component
      const { prefetchAPIResults } = this.state || {};
      console.log("prefetchRequestresult", this.prefetchRequestresult)
      
      return this.prefetchRequestresult
      ? <TargetComponent {...this.props} {...prefetchAPIResults} />
      : null;
    }
  }
}


