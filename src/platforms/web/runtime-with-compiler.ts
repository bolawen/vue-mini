import { compileToFunctions } from "./compiler";
import Vue from "./runtime/index"
import { query } from "./util";

const mount = Vue.prototype.$mount;

Vue.prototype.$mount = function(el){
    el = el && query(el);
    const options = this.$options;
    if(!options.render){
        let template = options.template;
        if(template){

        }else if(el){
            template = getOuterHTML(el);
        }

        if(template){
            const { render,staticRenderFns } = compileToFunctions(template,{},this);
            options.render = render;
            options.staticRenderFns = staticRenderFns;
        }
    }
    return mount.call(this,el);
}

function getOuterHTML(el){
    if(el.outerHTML){
        return el.outerHTML;
    }else{
        const container = document.createElement("div");
        container.appendChild(el.cloneNode(true));
        return container.innerHTML;
    }
}

export default Vue;