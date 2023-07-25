import { observe } from "core/observer";
import { popTarget, pushTarget } from "core/observer/dep";
import { isFunction, isPlainObject } from "shared/util";


export function initState(vm){
    const opts = vm.$options;

    if(opts.data){
        initData(vm);
    }else{
        const ob = observe((vm._data = {}));
        ob && ob.vmCount++;
    }
}

function initData(vm){
    let data = vm.$options.data;
    data = vm._data = isFunction(data) ? getData(data,vm): data || {};
    if(!isPlainObject(data)){
        data = {};
    }

    const ob = observe(data);
    ob && ob.vmCount++;
}

function getData(data,vm){
    pushTarget();
    try{
        return data.call(vm,vm);
    }catch(error){
        console.log("getData 函数出现 error",error)
        return {}
    }finally{
        popTarget();
    }
}