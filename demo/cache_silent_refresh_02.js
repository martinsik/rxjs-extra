/**
 * Demo featuring the cache() operator with in CacheMode.SilentRefresh.
 *
 * The order of things is as follows:
 *     0ms: The first observer subscribes.
 *   100ms: The response is ready and the first observer receives the result and completes.
 *  1500ms: The second observer subscribes. It receives the first value immediately and then the cache() operator
 *           subscribes to the source Observable but the fresh emitted value is silently suppressed.
 *  1700ms: The third observer subscribes. It receives only value "1" and completes.
 */
const Rx = require('rxjs');
const Observable = Rx.Observable;
const RxPlus = require('../dist/cjs/index');

function now() {
  return (new Date()).getTime();
}

let observer = {
  next: (val) => console.log(now(), val),
  complete: () => console.log(now(), 'complete'),
};
let counter = 0;

let source = Observable.defer(() => {
    console.log('Observable.defer');
    return Observable.of(counter++).delay(100);
  })
  .cache(1000, {mode: RxPlus.CacheMode.SilentRefresh});

setTimeout(() => source.subscribe(observer), 0);
setTimeout(() => source.subscribe(observer), 1500);
setTimeout(() => source.subscribe(observer), 1700);

/**
 * Notice that the second 'complete' notification should arrive roughly 100ms after the second '0' value.
 * This is because cache() refreshes silently and doesn't re-emit the new value. The third 'complete' notification
 * follows immediately after the value "1" because it's been already cached.
 *
 * Expected output:
Observable.defer
1491827410972 0
1491827410990 'complete'
1491827412339 0
Observable.defer
1491827412446 'complete'
1491827412538 1
1491827412538 'complete'
*/