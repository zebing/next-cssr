import React from 'react';
import PropTypes from 'prop-types';
import requestOnServer from './requestOnServer';
import requestOnClient from './requestOnClient';
import { isObject } from '../../lib/utils';
import prefectNotify from './prefectNotify';
import { getLoading } from './loading';

export default function withPageConfig(pageConfig = {}, Component) {

  // prefetchAPI 处理，容错
  const prefetchAPI = isObject(pageConfig.prefetchAPI) ? pageConfig.prefetchAPI : {};
  const loading = getLoading(pageConfig);

  return class wrap extends React.PureComponent {
    static propTypes = {
      ssr: PropTypes.bool, // 是否为ssr渲染
    };

    static async getInitialProps(ctx) {
      // next export 模式 ctx.res.locals 为undefined
      const ssr = ctx.res && ctx.res.locals && ctx.res.locals.ssr && process.env.NODE_ENV !== 'development' ? true : false;
      let prefetchAPIResult = {};
      let initialPropsResult = {};
      ctx.prefetchAPIConfig = null;

      // 区分不同运行模式，处理页面获取到的 props
      // 服务器渲染，非开发环境
      if (ssr) {
        // 1. ssr 首页，server 已确认所有请求状态，全部注入至 App 并传递至 page。无需处理
        prefetchAPIResult = await requestOnServer(ctx.req, ctx.res, prefetchAPI);

      } else {

        // 非ssr模式，将prefetchAPI返回给客户端
        ctx.prefetchAPIConfig = prefetchAPI;
      }

      // 如果页面提供getInitialProps方法，则获取该结果，并返回
      if (Component.getInitialProps) {
        initialPropsResult = await Component.getInitialProps(ctx);
      }

      return {
        ssr,
        ...prefetchAPIResult,
        ...initialPropsResult,
      };
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
      prefectNotify((result) => {
        const isConfigEmpty = Object.getOwnPropertyNames(prefetchAPI).length;
        const isResultEmpty = Object.getOwnPropertyNames(result).length;

        // 浅层路由变化未执行接口请求
        if (isConfigEmpty !== isResultEmpty) {
          requestOnClient(prefetchAPI).then((result) => {
            this.prefetchRequestresult = true;
            this.setState({ prefetchAPIResults: result });
          });
        } else {
          this.prefetchRequestresult = true;
          this.setState({ prefetchAPIResults: result });
        }
      });
    }

    render() {
      const TargetComponent = Component;
      const { prefetchAPIResults } = this.state;

      return this.prefetchRequestresult
        ? <TargetComponent {...this.props} {...prefetchAPIResults} />
        : loading;
    }
  };
}