import { isUndef } from "shared/util";

export function createPatchFunction(backend){
    const { nodeOps } = backend;

    function createElm(vnode,insertVnodeQueue,parentElm?){

    }

    return function patch(oldVnode,vnode){
        const insertVnodeQueue: any[] = [];

        if (isUndef(oldVnode)) {
            createElm(vnode,insertVnodeQueue);
        }
    }   
}