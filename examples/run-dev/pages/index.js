import React from 'react';
import { config } from '../../../lib';
import '@babel/polyfill';

@config({
  prefetchAPI: {
    getList: {
      type: 'get',
      url: '/api/public/index',
    }
  }
})
class Index extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>hello</div>
    );
  }
}
export default Index;