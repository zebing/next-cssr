import React from 'react';
import { config } from '../../../dist/lib';
import '@babel/polyfill';

// http://m.toutiao.com/list/?tag=__all__&format=json_raw&as=A115EEA70D57259

@config({
  prefetchAPI: {
    getList: {
      type: 'get',
      url: '/gapi/snowflake/api/json/public/area/province/list',
      data: {
        countryId: 1,
        format: 'json_raw',
        as: 'A115EEA70D57259',
      }
    }
  }
})
class Index extends React.Component {
  static async getInitialProps(ctx) {

    return { testgetInitialProps: true };
  }
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>hello
        {/* <SearchList /> */}
      </div>
    );
  }
}
export default Index;