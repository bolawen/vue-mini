export const isArray = Array.isArray;

export function isFunction(value) {
  return typeof value === 'function';
}

export function isObject(value){
  return value !== null && typeof value === "object"
}

export const hasProto = '__proto__' in {};

export function noop(){}

export function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

export function hasOwnProperty(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

export function def(obj, key, val, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

export function hasChanged(x,y){
    if(x === y){
        return x === 0 && 1 / x !== 1 / y;
    }
    return x === x || y === y;
}

const bailRE = new RegExp(`[^a-zA-Z.$_\\d]`);

export function parsePath(path){
  if (bailRE.test(path)) {
    return;
  }
  const segments = path.split('.');
  return function(obj){
    for(let i=0; i<segments.length; i++){
      if(!obj){
        return;
      }
      obj = obj[segments[i]]
    }
    return obj;
  }
}

export function isUndef(v){
  return v === undefined || v === null;
}