import React from 'react';
import Router from 'next/router';
import { config } from '../../../lib';

@config({
  prefetchAPI: {
    userInfo: {
      url: '/api/user/userInfo',
    }
  }
})
class Index1 extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>hello<button onClick={() => Router.push({ pathname: '/test', query: { test: 1 }})}>跳转</button></div>
    );
  }
}
export default Index1;