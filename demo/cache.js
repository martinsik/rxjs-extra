/**
 * Demo featuring the cache() operator with default options.
 */
const Rx = require('rxjs');
const Observable = Rx.Observable;
require('../dist/es5/bundles/RxPlus');

let counter = 0;

let source = Observable.defer(() => {
    console.log('Observable.defer');
    return Observable.of(counter++).delay(100);
  })
  .cache(1000);

setTimeout(() => source.subscribe(val => console.log('sub1', val)), 0);
setTimeout(() => source.subscribe(val => console.log('sub2', val)), 200);
setTimeout(() => source.subscribe(val => console.log('sub3', val)), 1200);
setTimeout(() => source.subscribe(val => console.log('sub4', val)), 1500);
setTimeout(() => source.subscribe(val => console.log('sub5', val)), 3000);

/** Expected output:
Observable.defer
sub1 0
sub2 0
Observable.defer
sub3 1
sub4 1
Observable.defer
sub5 2
*/