
export const isObject = obj => (typeof obj === 'object' && !isArray(obj) ? true : false);

export const isArray = arr => arr instanceof Array;

export const isFunction = func => (typeof func === 'function' ? true : false);