import Vue from "core/index"
import { patch } from './patch';
import { query } from 'web/util';
import { mountComponent } from "core/instance/lifecycle";

Vue.prototype.__patch__ = patch;

Vue.prototype.$mount = function(el){
    el = query(el);
    return mountComponent(this,el);
}

export default Vue;