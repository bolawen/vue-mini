import { Watcher } from "core/observer/watcher";
import { noop } from "shared/util";

export function lifecycleMixin(Vue){
    Vue.prototype._update = function(vnode){
        const vm = this;
        const prevEl = vm.$el;
        const prevVnode = vm._vnode;
        vm._vnode = vnode;
        if(!prevVnode){
            vm.$el = vm.__patch__(vm.$el,vnode);
        }else{
            vm.$el = vm.__patch__(prevVnode,vnode);
        }
    }
}

export function mountComponent(vm,el){
    vm.$el = el;
    let updateComponent;
    updateComponent = ()=>{
        vm._update(vm._render());
    }

    const watcherOptions = {

    }
    
    new Watcher(vm, updateComponent, noop, watcherOptions,true);
    return vm;
}