// 请求参数 data 处理
export default function resolveData(data = {}, req) {
  // data 支持location，query，cookie三个动态参数
  const location = {
    host: req.headers.host,
    hostname: req.headers.host,
    href: `${req.protocol}://${req.headers.host}${req.url}`,
    origin: `${req.protocol}://${req.headers.host}`,
    pathname: req._parsedUrl.pathname,
    protocol: `${req.protocol}:`,
  };
  const query = req.query;
  const cookie = req.cookies;
  const newData = {};

  Object.keys(data).map((key) => {
    if (typeof data[key] === 'string') {
      newData[key] = getRealValue(data[key], location, query, cookie);
    } else {
      newData[key] = data[key];
    }
  });

  return newData;
}

// 处理字符串参数, 获取data真实值
function getRealValue(value, location, query, cookie) {
  let newValue = '';

  // cookie 变量
  if (/^cookie\./.test(value)) {
    newValue = cookie[value.replace('cookie.', '')];

    // query 参数
  } else if (/^query\./.test(value)) {
    newValue = query[value.replace('query.', '')];

    // location参数
  } else if (/^location\./.test(value)) {
    newValue = location[value.replace('location.', '')];

    // 普通字符串
  } else {
    newValue = value;
  }

  return newValue;
}