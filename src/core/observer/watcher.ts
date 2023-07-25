import { isFunction, isObject, noop, parsePath } from "shared/util";
import { popTarget, pushTarget } from "./dep";
import { queueWatcher } from "./scheduler";

let uid = 0;

export class Watcher {
  vm;
  cb;
  id;
  deep;
  user;
  lazy;
  sync;
  dirty;
  active;
  deps;
  newDeps;
  depIds;
  newDepIds;
  getter;
  value;
  expression;

  constructor(vm, expOrFn, cb, options, isRenderWatcher) {
    if ((this.vm = vm) && isRenderWatcher) {
      vm._watcher = this;
    }
    if (options) {
      this.deep = !!options.deep;
      this.user = !!options.user;
      this.lazy = !!options.lazy;
      this.sync = !!options.sync;
    } else {
      this.deep = this.user = this.lazy = this.sync = false;
    }

    this.cb = cb;
    this.id = ++uid;
    this.dirty = this.lazy;

    this.deps = [];
    this.newDeps = [];
    this.depIds = new Set();
    this.newDepIds = new Set();
    this.expression = "";

    if(isFunction(expOrFn)){
        this.getter = expOrFn;
    }else{
        this.getter = parsePath(expOrFn);
        if(!this.getter){
            this.getter = noop;
        }
    }

    this.value = this.lazy ? undefined : this.get();
  }

  get(){
    pushTarget(this);
    let value;
    const vm = this.vm;
    try{    
        value = this.getter.call(vm,vm);
    }catch(error){
        console.log("Watcher get error",error)
    }finally{
        popTarget();
    }
    return value;
  }

  addDep(dep){
    const id = dep.id;
    if(!this.newDepIds.has(id)){
        this.newDepIds.add(id);
        this.newDeps.push(dep);
        if(!this.depIds.has(id)){
            dep.addSub(this);
        }
    }
  }

  update(){
    if(this.lazy){
        this.dirty = true;
    }else if(this.sync){
        this.run();
    }else {
        queueWatcher(this);
    }
  }

  run(){
    if(this.active){
        const value = this.get();
        if(value !== this.value || isObject(value) || this.deep){
            const oldValue = value;
            if(this.user){

            }else{
                this.cb.call(this.vm,value,oldValue);
            }
        }
    }
  }

  evaluate(){
    this.value = this.get();
    this.dirty = false;
  }

  depend(){
    let i = this.deps.length;
    while(i--){
        this.deps[i].depend();
    }
  }
}
