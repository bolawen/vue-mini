import { initState } from './state';

let uid = 0;

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    vm._uid = uid++;
    vm.$options = options;

    initState(vm);

    if(vm.$options.el){
      vm.$mount(vm.$options.el);
    }
  };
}
