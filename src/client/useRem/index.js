
export default function useRem(minWidthPx = 0, maxWidthPx = 540, designLogicPx = 360) {
  return `(${calcRem.toString()})(document, window, ${designLogicPx}, ${minWidthPx}, ${maxWidthPx})`;
}

function calcRem(doc, win, designLogicPx, minWidthPx, maxWidthPx) {
  // 依赖
  // <head> 正确设置 <meta name="viewport" content="width=device-width" />
  // <body> 正确设置 font-size（否则继承字体过大），正确处理 overflow-x: hidden

  const docEl = doc.documentElement;
  const resizeEvt = 'orientationchange' in win ? 'orientationchange' : 'resize';
  let rootFontSize;

  // 处理屏幕宽度 过大、过小 时的问题
  docEl.style.minWidth = minWidthPx + 'px';
  docEl.style.maxWidth = maxWidthPx + 'px';

  function calc() {
    const clientWidth = docEl.clientWidth;
    if (!clientWidth) {
      // 预期外行为
      rootFontSize = 100;
    } else {
      // 放大50倍，使得设计稿逻辑宽度360（通常此时设计稿物理大小为720或1080）时，3.6rem === 100% 设计稿宽
      // 对 html 设置最大、最小宽度，保证超出适配范围的设备也基本可用
      const layoutWith = Math.min(maxWidthPx, Math.max(minWidthPx, clientWidth));
      rootFontSize = layoutWith / designLogicPx * 100;
    }
    docEl.style.fontSize = rootFontSize + 'px';
  }

  calc();
  win.addEventListener(resizeEvt, calc, false);

  win.rem2px = function(rem) {
    return rem * rootFontSize;
  };
  win.px2rem = function(px) {
    return px / rootFontSize;
  };
}