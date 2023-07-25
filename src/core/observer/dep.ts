let uid = 0;

export class Dep {
  static target;
  id;
  subs;
  _pending;
  constructor() {
    this.id = uid++;
    this.subs = [];
  }

  addDep(sub) {
    this.subs.push(sub);
  }

  depend() {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }

  notify() {
    const subs = this.subs.filter(s => s);
    subs.sort((a, b) => a.id - b.id);
    for (let i = 0, l = subs.length; i < l; i++) {
        const sub = subs[i];
        sub.update();
    }
  }
}


Dep.target = null;
const targetStack: any[] = [];

export function pushTarget(target?){
    targetStack.push(target);
    Dep.target = target;
}

export function popTarget(){
    targetStack.pop();
    Dep.target = targetStack[targetStack.length - 1]
}