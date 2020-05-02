import React from 'react';
import { config } from '../../../../lib';
import '@babel/polyfill';

@config({
  prefetchAPI: {
    getList: {
      type: 'get',
      url: '/api/index/edit/info',
      data: {
        componentType: 'query.componentType',
        locationTest: 'location.href',
        cookieTest: 'cookie.name',
        otherTest: 'other'
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
      <div>hello</div>
    );
  }
}
export default Index;