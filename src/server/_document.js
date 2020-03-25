import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
    static async getInitialProps(ctx) {
    // 页面prefetchAPI 接口， ssr 模式 prefetchAPIConfig 值为 null
        const prefetchAPIConfig = ctx.prefetchAPIConfig;
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps, prefetchAPIConfig };
    }

    render() {
        const { prefetchAPIConfig } = this.props;

        return (
            <html>
                <Head>
                    {/* <title>My page</title> */}
                    <script dangerouslySetInnerHTML={calcRem(360, 320, 540)}></script>
                    <script dangerouslySetInnerHTML={requestOnClient(prefetchAPIConfig)}></script>
                    {this.props.styleTags}
                </Head>
                <body>
                    <script dangerouslySetInnerHTML={{ __html: `window.prefetchAPIConfig = ${JSON.stringify(this.props.prefetchAPIConfig)}` }}></script>
                    {/* {JSON.stringify(this.props.prefetchAPIConfig)} */}
                    <Main />
                    <NextScript />
                </body>
            </html>
        );
    }
}

// 计算rem
// 源代码见 ／tar/calcRem.js
function calcRem(designPx, minWithPx, maxWithPx) {
    return {
        __html: `(function(h,e,n,k,l){function m(){var d=f.clientWidth;g=d?Math.min(l,Math.max(k,d))/n*100:100;f.style.fontSize=g+"px"}var f=h.documentElement;h="orientationchange"in e?"orientationchange":"resize";var g;f.style.minWidth=k+"px";f.style.maxWidth=l+"px";m();e.addEventListener(h,m,!1);e.rem2px=function(d){return d*g};e.px2rem=function(d){return d/g}})(document,window, ${designPx}, ${minWithPx}, ${maxWithPx});`
    };
}

// client XMLHttpRequest
// 源码见 /tar/requestOnClient.js
function requestOnClient(prefetchAPIConfig) {
    return {
        __html: `(function(e,d,h){function n(a,k){var b=new XMLHttpRequest,l=a.type?a.type.toUpperCase():"GET",c=e.location.origin+a.url,f=[],d=null;Object.keys(a.headers||{}).map(function(b){f.push([[b],a.headers[b]])});if("GET"===l){var g=[];f.push(["Content-Type","application/x-www-form-urlencoded; charset=utf-8"]);Object.keys(a.data||{}).map(function(b){g.push(encodeURIComponent(b)+"="+encodeURIComponent(a.data[b]))});g=g.join("&");c=c+"?"+g}else f.push(["Content-Type","application/json; charset=utf-8"]),d=JSON.stringify(a.data||
      {});b.open(l,c,!0);f.map(function(a){b.setRequestHeader(a[0],a[1])});b.onreadystatechange=function(){4===b.readyState&&(200===b.status?k(JSON.parse(b.response)):k({code:b.status,msg:JSON.parse(b.response).msg}))};b.send(d)}function p(){if(typeof e.Event)var a=new Event("__NEXT_prefetchAPI_result_event_name");else a=d.createEvent("Event"),a.initEvent("__NEXT_prefetchAPI_result_event_name",!0,!0);d.dispatchEvent(a)}var c=[],m=[];c=Object.keys(h);c.map(function(a){return m.push(new Promise(function(c,
      b){n(h[a],c)}))});return Promise.all(m).then(function(a){a=a.reduce(function(a,b,d){a[c[d]]=b;return a},{});e.__NEXT_prefetchAPI_results_status=!0;e.__NEXT_prefetchAPI_results_data=a;p()})})(window,document,${JSON.stringify(prefetchAPIConfig)});`
    };
}