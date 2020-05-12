import {
  NOTYFY_EVENT_NAME,
  PREFETCHAPI_RESULTS,
  PREFETCHAPI_RESULTS_STATUS,
} from '../../lib/constants';

export default function prefectNotify(callback) {
  function listener() {
    const isCompelete = window[PREFETCHAPI_RESULTS_STATUS];
    if (isCompelete) {
      const resultData = window[PREFETCHAPI_RESULTS];
      window['__NEXT_DATA__']['props']['pageProps'] = { ...window['__NEXT_DATA__']['props']['pageProps'], ...resultData };
      callback(resultData);
      document.removeEventListener(NOTYFY_EVENT_NAME, listener);
    }
  }
  document.addEventListener(NOTYFY_EVENT_NAME, listener, false);
  listener();
}