import React from 'react';
import config from '../../../dist';

// http://m.toutiao.com/list/?tag=__all__&format=json_raw&as=A115EEA70D57259
// @Config({
//   prefetchAPI: {
//     '/toutiao/list': {
//       type: 'get',
//       url: 'list',
//       data: {
//         tag: '__all__',
//         format: 'format',
//         as: 'A115EEA70D57259',
//       }
//     }
//   }
// })
export default class Index extends React.Component {
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