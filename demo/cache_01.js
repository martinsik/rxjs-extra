const Rx = require('rxjs');
const RxPlus = require('../dist/cjs/index');

const Observable = Rx.Observable;

let counter = 0;

let source = Observable.defer(() => {
    console.log('Observable.defer');
    return Observable.of(counter++).delay(100);
  })
  .cache(1000);

source.subscribe(val => console.log(val));

setTimeout(() => source.subscribe(val => console.log(val)), 200);
setTimeout(() => source.subscribe(val => console.log(val)), 1200);
setTimeout(() => source.subscribe(val => console.log(val)), 1500);
setTimeout(() => source.subscribe(val => console.log(val)), 3000);