let timeFunc;
let pending = false;
const callbacks:any[] = [];

if(typeof Promise !== 'undefined'){
    const p = Promise.resolve();
    timeFunc = ()=>{
        p.then(flushCallbacks);
    }
}

function flushCallbacks(){
    pending = false;
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    for(let i=0; i<copies.length ;i++){
        copies[i]();
    }
}

export function nextTick(cb,ctx?){
    let _resolve;
    callbacks.push(()=>{
        if(cb){
            try{
                cb.call(ctx);
            }catch(error){
                console.log("next-tick error",error)
            }
        } else if(_resolve){
            _resolve(ctx);
        }  
    });

    if(!pending){
        pending = true;
        timeFunc();
    }

    if(!cb && typeof Promise !== 'undefined'){
        return new Promise(resolve=>{
            _resolve = resolve;
        });
    }
}