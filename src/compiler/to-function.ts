export function createCompileToFunctionFn(compile){
    const cache = Object.create(null);
    return function compileToFunctions(template,options,vm){
        const compiled = compile(template,options);

        const res:any = {}
        res.render = ()=>{}
        res.staticRenderFns = ()=>{}

        return (res)
    }
}