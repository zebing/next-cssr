import React from 'react';
// import { CONFIG_FILE } from '../../lib/constants';

const defaultLoading = `
    <style>
    .pre-loading-hkdndhj{
      background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAFT0lEQVR4Xu1bTV7bRhT/z7iW2JUDFONsir0qnKBwAsgJAicIOUHICSAnKDkBcIKYE1Ss7HYTx2RfvAO56PU3Ywmk0Uga6wusepbSm3lv/u/pfc2IocLxd7e93cZs/GaMuzQ2gs4j9hGEAwBjMDg2c4+y5pUhOitjEXWNvzasA2L4A8C6/84hzt/2x/djlVZu3mNfQ7QByR1xvqObU6bMpQMw7K7tMs8TG1LH2ObuTlir37pYf/CsPwF0Ezbl9CbuTpkbVtcqHYBRx/pHo02fL33uTWbHgRC+pVykbZA43+uP7wdVgVAqAL45C40mjYhGhx3rhAEf0zfHPvQmD2cqzfCXn34Xz/o//r0uAk6pAAy7a13med8SBWLsuvf9YbeIBYw69nuATsJWxoCTrYn7KQ8QpQIgBBhtWA4YftMJQ8Cn/sQVwsvh+wAHwKZWeMJN79bdDt6NOvYxQKc6Wgacb03co0VBMAZACOt61ilBhiow4NLi7gc1VPmfgfhmf44Io2g/eJfiNKec0+6v45kACCnR4okNI7zdunUvFwHBGIBRR3rrJ21IJkSD3u1sT2XoCys0vQ9gCtC5zWcnSXF9ngfwMxDJ7xrAFed0EmxeWlanfQaw96mbSwA5bY4RAGmmB+id1CJaMKEdbdqDEECJU3oT12hPwQJGxMOOdc6Ad3qu0dBmspk8NOky+CsqPsOEjykAieFKdWwmTPPQGOUMipM14WMEgO+tRRobdWzA1OZut46cfe4HLOHghF+JjxzaF4sYARDywmHv/p1zOgg7KhPEi9BIRZB9GfMFhBtq8YM8dYMxAEJwIcA91mQkqDI9zQJJhE54nkyoOMEJhz4/rIpcIYhYDhF97t/OznXrLgRAlmAv/X640T5kjIkqNDaSEqXGAOCn4SJXCUrwOAiaRCkGwGjD2mcM20Rwerfu1Utr1ZS/UZgEYuV1BIDRpnXhd2Uk37z5tanQZdLlTZSeAEjK9ojoKMmBlLmBomuNOpYI0/qiKrQ4cf4mHC2eAUhONa96E1cWQK95FLaA5G+onlS3KLhpESBYm4Av/Yl7GOb1ZAEJZeyUON/Ok2AU3VCe+Wm9CFGV6rLWiBOUScSjdyYbGoQb3qLDOjO9PJsOz5GZ4qM10DRkIr0FrQUUZf6a5ovCyWN+Jkg0XmvNLpPqlcYkQnkV0GgAlDaeyBAdBjjhVl5jAcjoId5xTnvCvzUWAG0PM/qdyJOqRgKQ3sN8RkF0syQAwmuK0EFgdzZ/+FJXhyev48qal9o5isRAds00GVTlB5JZGyj63jQtlgWf/jCznlZ30Y0mzTcGgHAjACB1obo6vZUBYHKIMmd+xXRoqSVjVYJWtW7mIa3PWBy9MyV/nhLR8TLU/1ngZR+9z6vcRobBABwfBHEhQznPeC7xGw2AAEK28h/bB2CsC6IxWq2BtiOUZVJNfd94C8hS3AqALISa/n5lAbGemme/Y6B1xulqmfqBeS01ejK00f4Kxp6usXFOO00HQW2LK5ccl+NMIK/2ZTUYTPZvgYhrrqGx3FWhCTDRc4Hw+Trhxm65u8veHMkCIRYFRCUlbm+/5A2QLKFN3otGj5r26uatwqAJmk2mWVlAk7VrsreVBZigFNCMOu1TgIk2Uq67+YvwqovW2ALi5wfNSJKMAYgfN/3PAIh0j184S/Tb3hec01HRYs3YAur6Jk34+HXLOXF+XPT+0lICYAKSKU1lAMx/cGCbr/20uRIAwj9Q6u7m6bQz/65pv27AKgFA+b3F6Kbp8xllvdGlEgCEhv3f3Lrq729J36ZPf0hc/vlR2b/CKv//AJvVg1iPv0tMAAAAAElFTkSuQmCC);
      background-repeat:no-repeat;
      background-size:cover;
      display:inline-block;
      width:32px;
      height:32px;
      -webkit-animation:loading 1s linear infinite;
      animation:loading 1s linear infinite}
      @-webkit-keyframes loading{
        0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}
        to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}
      }
      @keyframes loading{
        0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}
        to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}
      }
    }
    </style>
    <div class="pre-loading-hkdndhj"></div>
`;

export function getLoading(pageConfig) {
  const Loading = pageConfig.loading;
  const LoadingDom = Loading
    ? <Loading />
    : (<div
      style={{
        width: '100%',
        textAlign: 'center',
        lineHeight: '100vh',
      }}
      dangerouslySetInnerHTML={{ __html: defaultLoading }}
    ></div>);

  return LoadingDom;
}
