function parseHTML(html, options) {
    options.chars(html);
}

var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
function parseText(text, delimiters) {
    var tagRE = delimiters ? delimiters : defaultTagRE;
    if (!tagRE.test(text)) {
        return;
    }
    var tokens = [];
    var rwaTokens = [];
    var lastIndex = (tagRE.lastIndex = 0);
    var match, index, tokenValue;
    while ((match = tagRE.exec(text))) {
        index = match.index;
        if (index > lastIndex) {
            rwaTokens.push((tokenValue = text.slice(lastIndex, index)));
            tokens.push(JSON.stringify(tokenValue));
        }
        var exp = match[1].trim();
        tokens.push("_s(".concat(exp, ")"));
        rwaTokens.push({ '@binding': exp });
        lastIndex = index + match[0].length;
    }
    if (lastIndex < text.length) {
        rwaTokens.push(tokenValue = text.slice(lastIndex));
        tokens.push(JSON.stringify(tokenValue));
    }
    return {
        tokens: rwaTokens,
        expression: tokens.join("+"),
    };
}

function parse(template, options) {
    parseHTML(template, {
        chars: function () {
            parseText(template);
        }
    });
}

function generate(ast, options) {
    return {
        render: "",
        staticRenderFns: function () { }
    };
}

function createCompileToFunctionFn(compile) {
    return function compileToFunctions(template, options, vm) {
        compile(template, options);
        var res = {};
        res.render = function () { };
        res.staticRenderFns = function () { };
        return (res);
    };
}

function createCompilerCreator(baseCompile) {
    return function createCompiler(baseOptions) {
        function compile(template, options) {
            var finalOptions = Object.assign(baseOptions);
            var compiled = baseCompile(template.trim(), finalOptions);
            return compiled;
        }
        return {
            compile: compile,
            compileToFunctions: createCompileToFunctionFn(compile)
        };
    };
}

var createCompiler = createCompilerCreator(function baseCompile(template, options) {
    parse(template.trim());
    if (options.optimize !== false) ;
    var code = generate();
    return {
        render: code.render,
        staticRenderFns: code.staticRenderFns
    };
});

var _a = createCompiler({}), compileToFunctions = _a.compileToFunctions;

var isArray = Array.isArray;
function isFunction(value) {
    return typeof value === 'function';
}
function isObject(value) {
    return value !== null && typeof value === "object";
}
var hasProto = '__proto__' in {};
function noop() { }
function isPlainObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}
function hasOwnProperty(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}
function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    });
}
function hasChanged(x, y) {
    if (x === y) {
        return x === 0 && 1 / x !== 1 / y;
    }
    return x === x || y === y;
}
var bailRE = new RegExp("[^a-zA-Z.$_\\d]");
function parsePath(path) {
    if (bailRE.test(path)) {
        return;
    }
    var segments = path.split('.');
    return function (obj) {
        for (var i = 0; i < segments.length; i++) {
            if (!obj) {
                return;
            }
            obj = obj[segments[i]];
        }
        return obj;
    };
}

var uid$2 = 0;
var Dep = /** @class */ (function () {
    function Dep() {
        this.id = uid$2++;
        this.subs = [];
    }
    Dep.prototype.addDep = function (sub) {
        this.subs.push(sub);
    };
    Dep.prototype.depend = function () {
        if (Dep.target) {
            Dep.target.addDep(this);
        }
    };
    Dep.prototype.notify = function () {
        var subs = this.subs.filter(function (s) { return s; });
        subs.sort(function (a, b) { return a.id - b.id; });
        for (var i = 0, l = subs.length; i < l; i++) {
            var sub = subs[i];
            sub.update();
        }
    };
    return Dep;
}());
Dep.target = null;
var targetStack = [];
function pushTarget(target) {
    targetStack.push(target);
    Dep.target = target;
}
function popTarget() {
    targetStack.pop();
    Dep.target = targetStack[targetStack.length - 1];
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);
var methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
];
methodsToPatch.forEach(function (method) {
    var original = arrayProto[method];
    def(arrayMethods, method, function mutator() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var result = original.apply.apply(original, __spreadArray([this], __read(args), false));
        var ob = this.__ob__;
        var inserted;
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
                break;
        }
        if (inserted) {
            ob.observeArray(inserted);
        }
        ob.dep.notify();
        return result;
    });
});

var NO_INITIAL_VALUE = {};
var arrayKeys = Object.getOwnPropertyNames(arrayMethods);
var Observer = /** @class */ (function () {
    function Observer(value) {
        this.value = value;
        this.dep = new Dep();
        this.vmCount = 0;
        def(value, '__ob__', this);
        if (isArray(value)) {
            if (hasProto) {
                value.__proto__ = arrayMethods;
            }
            else {
                for (var i = 0, l = arrayKeys.length; i < l; i++) {
                    var key = arrayKeys[i];
                    def(value, key, arrayMethods[key]);
                }
            }
            this.observeArray(value);
        }
        else {
            var keys = Object.keys(value);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                defineReactive(value, key, NO_INITIAL_VALUE);
            }
        }
    }
    Observer.prototype.observeArray = function (value) {
        for (var i = 0, l = value.length; i < l; i++) {
            observe(value[i]);
        }
    };
    return Observer;
}());
function observe(value) {
    if (value && hasOwnProperty(value, "__ob__") && value.__ob__ instanceof Observer) {
        return value.__ob__;
    }
    if (isArray(value) || isPlainObject(value)) {
        return new Observer(value);
    }
}
function defineReactive(obj, key, val) {
    var dep = new Dep();
    var property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
        return;
    }
    var getter = property === null || property === void 0 ? void 0 : property.get;
    var setter = property === null || property === void 0 ? void 0 : property.set;
    if ((!getter || setter) && (val === NO_INITIAL_VALUE || arguments.length === 2)) {
        val = obj[key];
    }
    var childOb = observe(val);
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            var value = getter ? getter.call(obj) : val;
            if (Dep.target) {
                dep.depend();
                if (childOb) {
                    childOb.dep.depend();
                    if (isArray(value)) {
                        dependArray(value);
                    }
                }
            }
            return value;
        },
        set: function reactiveSetter(newVal) {
            var value = getter ? getter.call(obj) : val;
            if (!hasChanged(value, newVal)) {
                return;
            }
            if (setter) {
                setter.call(obj, newVal);
            }
            else if (getter) {
                return;
            }
            else {
                val = value;
            }
            childOb = observe(newVal);
            dep.notify();
        }
    });
    return dep;
}
function dependArray(value) {
    for (var e = void 0, i = 0, l = value.length; i < l; i++) {
        e = value[i];
        if (e && e.__ob__) {
            e.__ob__.dep.depend();
        }
        if (isArray(e)) {
            dependArray(e);
        }
    }
}

function initState(vm) {
    var opts = vm.$options;
    if (opts.data) {
        initData(vm);
    }
    else {
        var ob = observe((vm._data = {}));
        ob && ob.vmCount++;
    }
}
function initData(vm) {
    var data = vm.$options.data;
    data = vm._data = isFunction(data) ? getData(data, vm) : data || {};
    if (!isPlainObject(data)) {
        data = {};
    }
    var ob = observe(data);
    ob && ob.vmCount++;
}
function getData(data, vm) {
    pushTarget();
    try {
        return data.call(vm, vm);
    }
    catch (error) {
        console.log("getData 函数出现 error", error);
        return {};
    }
    finally {
        popTarget();
    }
}

var uid$1 = 0;
function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        var vm = this;
        vm._uid = uid$1++;
        vm.$options = options;
        initState(vm);
        if (vm.$options.el) {
            vm.$mount(vm.$options.el);
        }
    };
}

var timeFunc;
var pending = false;
var callbacks = [];
if (typeof Promise !== 'undefined') {
    var p_1 = Promise.resolve();
    timeFunc = function () {
        p_1.then(flushCallbacks);
    };
}
function flushCallbacks() {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
        copies[i]();
    }
}
function nextTick(cb, ctx) {
    var _resolve;
    callbacks.push(function () {
        if (cb) {
            try {
                cb.call(ctx);
            }
            catch (error) {
                console.log("next-tick error", error);
            }
        }
        else if (_resolve) {
            _resolve(ctx);
        }
    });
    if (!pending) {
        pending = true;
        timeFunc();
    }
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(function (resolve) {
            _resolve = resolve;
        });
    }
}

var has = {};
var index = 0;
var waiting = false;
var queue = [];
var flushing = false;
function sortCompareFn(a, b) {
    if (a.post) {
        if (!b.post) {
            return 1;
        }
    }
    else if (b.post) {
        return -1;
    }
    return a.id - b.id;
}
function flushSchedulerQueue() {
    flushing = true;
    var watcher;
    var id;
    queue.sort(sortCompareFn);
    for (index = 0; index < queue.length; index++) {
        watcher = queue[index];
        if (watcher.before) {
            watcher.before();
        }
        id = watcher.id;
        has[id] = null;
        watcher.run();
    }
}
function queueWatcher(watcher) {
    var id = watcher.id;
    if (has[id] != null) {
        return;
    }
    if (watcher === Dep.target && watcher.noResource) {
        return;
    }
    has[id] = true;
    if (!flushing) {
        queue.push(watcher);
    }
    else {
        var i = queue.length - 1;
        while (i > index && queue[i].id > watcher.id) {
            i--;
        }
        queue.splice(i + 1, 0, watcher);
    }
    if (!waiting) {
        waiting = true;
        nextTick(flushSchedulerQueue);
    }
}

var uid = 0;
var Watcher = /** @class */ (function () {
    function Watcher(vm, expOrFn, cb, options, isRenderWatcher) {
        if ((this.vm = vm) && isRenderWatcher) {
            vm._watcher = this;
        }
        if (options) {
            this.deep = !!options.deep;
            this.user = !!options.user;
            this.lazy = !!options.lazy;
            this.sync = !!options.sync;
        }
        else {
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
        if (isFunction(expOrFn)) {
            this.getter = expOrFn;
        }
        else {
            this.getter = parsePath(expOrFn);
            if (!this.getter) {
                this.getter = noop;
            }
        }
        this.value = this.lazy ? undefined : this.get();
    }
    Watcher.prototype.get = function () {
        pushTarget(this);
        var value;
        var vm = this.vm;
        try {
            value = this.getter.call(vm, vm);
        }
        catch (error) {
            console.log("Watcher get error", error);
        }
        finally {
            popTarget();
        }
        return value;
    };
    Watcher.prototype.addDep = function (dep) {
        var id = dep.id;
        if (!this.newDepIds.has(id)) {
            this.newDepIds.add(id);
            this.newDeps.push(dep);
            if (!this.depIds.has(id)) {
                dep.addSub(this);
            }
        }
    };
    Watcher.prototype.update = function () {
        if (this.lazy) {
            this.dirty = true;
        }
        else if (this.sync) {
            this.run();
        }
        else {
            queueWatcher(this);
        }
    };
    Watcher.prototype.run = function () {
        if (this.active) {
            var value = this.get();
            if (value !== this.value || isObject(value) || this.deep) {
                var oldValue = value;
                if (this.user) ;
                else {
                    this.cb.call(this.vm, value, oldValue);
                }
            }
        }
    };
    Watcher.prototype.evaluate = function () {
        this.value = this.get();
        this.dirty = false;
    };
    Watcher.prototype.depend = function () {
        var i = this.deps.length;
        while (i--) {
            this.deps[i].depend();
        }
    };
    return Watcher;
}());

function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        var vm = this;
        vm.$el;
        var prevVnode = vm._vnode;
        vm._vnode = vnode;
        if (!prevVnode) {
            vm.$el = vm.__patch__(vm.$el, vnode);
        }
        else {
            vm.$el = vm.__patch__(prevVnode, vnode);
        }
    };
}
function mountComponent(vm, el) {
    vm.$el = el;
    var updateComponent;
    updateComponent = function () {
        vm._update(vm._render());
    };
    var watcherOptions = {};
    new Watcher(vm, updateComponent, noop, watcherOptions, true);
    return vm;
}

function Vue(options) {
    if (!(this instanceof Vue)) {
        console.log('Vue 是一个构造函数,必须使用 new 创建 Vue 实例!');
        return;
    }
    this._init(options);
}
initMixin(Vue);
lifecycleMixin(Vue);

function insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
}

var nodeOps = /*#__PURE__*/Object.freeze({
    __proto__: null,
    insertBefore: insertBefore
});

function createPatchFunction(backend) {
    backend.nodeOps;
    return function patch(oldVnode, vnode) {
    };
}

var patch = createPatchFunction({ nodeOps: nodeOps });

function query(el) {
    if (typeof el === 'string') {
        var selected = document.querySelector(el);
        if (!selected) {
            return document.createElement('div');
        }
        return selected;
    }
    else {
        return el;
    }
}

Vue.prototype.__patch__ = patch;
Vue.prototype.$mount = function (el) {
    el = query(el);
    return mountComponent(this, el);
};

var mount = Vue.prototype.$mount;
Vue.prototype.$mount = function (el) {
    el = el && query(el);
    var options = this.$options;
    if (!options.render) {
        var template = options.template;
        if (template) ;
        else if (el) {
            template = getOuterHTML(el);
        }
        if (template) {
            var _a = compileToFunctions(template, {}, this), render = _a.render, staticRenderFns = _a.staticRenderFns;
            options.render = render;
            options.staticRenderFns = staticRenderFns;
        }
    }
    return mount.call(this, el);
};
function getOuterHTML(el) {
    if (el.outerHTML) {
        return el.outerHTML;
    }
    else {
        var container = document.createElement("div");
        container.appendChild(el.cloneNode(true));
        return container.innerHTML;
    }
}

export { Vue as default };
//# sourceMappingURL=vue.js.map
