import { nextTick } from "core/util/next-tick";
import { Dep } from "./dep";

let has = {};
let index = 0;
let waiting = false;
let queue:any[] = [];
let flushing = false;
let getNow = Date.now;
export let currentFlushTimestamp = 0;



function sortCompareFn(a,b){
    if(a.post){
        if(!b.post){
            return 1;
        }
    }else if(b.post){
        return -1;
    }
    return a.id - b.id;
}

export function flushSchedulerQueue(){
    currentFlushTimestamp = getNow();
    flushing = true;
    let watcher;
    let id;
    queue.sort(sortCompareFn);
    for(index=0;index<queue.length;index++){
        watcher = queue[index];
        if(watcher.before){
            watcher.before();
        }
        id = watcher.id;
        has[id] = null;
        watcher.run();
    }
}

export function queueWatcher(watcher){
    const id = watcher.id;
    if(has[id] != null){
        return;
    }
    if(watcher === Dep.target && watcher.noResource){
        return;
    }
    has[id] = true;
    if(!flushing){
        queue.push(watcher);
    }else{
        let i = queue.length -1;
        while(i > index && queue[i].id > watcher.id){
            i--;
        }
        queue.splice(i+1,0,watcher);
    }
    if(!waiting){
        waiting = true;
        nextTick(flushSchedulerQueue);
    }
}