import { def, hasChanged, hasOwnProperty, hasProto, isArray, isPlainObject } from "shared/util";
import { Dep } from "./dep";
import { arrayMethods } from "./array";

const NO_INITIAL_VALUE = {}
const arrayKeys = Object.getOwnPropertyNames(arrayMethods);

export class Observer{
    dep;
    vmCount;

    constructor(public value){
        this.dep = new Dep();
        this.vmCount = 0;
        def(value,'__ob__',this);

        if(isArray(value)){
            if(hasProto){
                (value as any).__proto__ = arrayMethods;
            }else{
                for(let i=0, l = arrayKeys.length; i < l; i++){
                    const key = arrayKeys[i];
                    def(value,key,arrayMethods[key]);
                }
            }
            this.observeArray(value);
        }else{
            const keys = Object.keys(value)
            for(let i=0; i<keys.length; i++){
                const key = keys[i];
                defineReactive(value,key,NO_INITIAL_VALUE);
            }
        }
    }

    observeArray(value){
        for(let i=0, l = value.length; i<l ; i++){
            observe(value[i]);
        }
    }
}

export function observe(value){
    if (value && hasOwnProperty(value,"__ob__") && value.__ob__ instanceof Observer) {
        return value.__ob__;
    }
    if(isArray(value) || isPlainObject(value)){
        return new Observer(value);
    }
}

export function defineReactive(obj,key,val){
    const dep = new Dep();

    const property = Object.getOwnPropertyDescriptor(obj,key);
    if(property && property.configurable === false){
        return;
    }

    const getter = property?.get;
    const setter = property?.set;

    if((!getter || setter) && (val === NO_INITIAL_VALUE || arguments.length === 2)){
        val = obj[key];
    }

    let childOb = observe(val);

    Object.defineProperty(obj,key,{
        enumerable: true,
        configurable: true,
        get: function reactiveGetter(){
            const value = getter ? getter.call(obj) : val;
            if(Dep.target){
                dep.depend();
                if(childOb){
                    childOb.dep.depend();
                    if(isArray(value)){
                        dependArray(value);
                    }
                }
            }
            return value;
        },
        set: function reactiveSetter(newVal){
            const value = getter ? getter.call(obj) : val;
            
            if(!hasChanged(value,newVal)){
                return;
            }

            if(setter){
                setter.call(obj,newVal);
            }else if(getter){
                return;
            }else{
                val = value;
            }

            childOb = observe(newVal);
            dep.notify();
        }
    });
    return dep;
}   

function dependArray(value){
    for(let e,i = 0,l = value.length; i < l ; i++){
        e = value[i];
        if(e && e.__ob__){
            e.__ob__.dep.depend();
        }
        if(isArray(e)){
            dependArray(e);
        }
    }
}