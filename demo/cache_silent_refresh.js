/**
 * Demo featuring the cache() operator with in CacheMode.SilentRefresh mode.
 *
 * In this demo the cache() operator always emits just one item and then eventually refreshes
 * the cache without emitting the result. This means that this operator will emit immediately but
 * if the cache needs to be refreshed the complete notification is send after the source emits.
 * See cache_silent_refresh_02.js for another example with timestamps.
 */
const Rx = require('rxjs');
const Observable = Rx.Observable;
const RxPlus = require('../dist/cjs/index');

let counter = 0;

let source = Observable.defer(() => {
    console.log('Observable.defer');
    return Observable.of(counter++).delay(100);
  })
  .cache(1000, {mode: RxPlus.CacheMode.SilentRefresh});

setTimeout(() => source.subscribe(val => console.log('sub1', val)), 0);
setTimeout(() => source.subscribe(val => console.log('sub2', val)), 200);
setTimeout(() => source.subscribe(val => console.log('sub3', val)), 1200);
setTimeout(() => source.subscribe(val => console.log('sub4', val)), 1500);
setTimeout(() => source.subscribe(val => console.log('sub5', val)), 3000);

/**
 * Expected output:
Observable.defer
sub1 0
sub2 0
sub3 0
Observable.defer
sub4 1
sub5 1
Observable.defer
*/