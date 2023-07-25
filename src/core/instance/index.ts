import { initMixin } from './init';
import { lifecycleMixin } from './lifecycle';

function Vue(options) {
  if (!(this instanceof Vue)) {
    console.log('Vue 是一个构造函数,必须使用 new 创建 Vue 实例!');
    return;
  }
  this._init(options);
}


initMixin(Vue);
lifecycleMixin(Vue);

export default Vue;
