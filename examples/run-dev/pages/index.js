import React from 'react';
import Router from 'next/router';
import { config } from '../../../lib';
// import '@babel/polyfill';

@config({
  prefetchAPI: {
    getList: {
      type: 'get',
      url: '/api/index/edit/info',
      data: {
        componentType: 'query.componentType'
      }
    }
  }
})
class Index extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>hello<button onClick={() => Router.push({ pathname: '/test', query: { test: 1 }})}>跳转</button></div>
    );
  }
}
export default Index;