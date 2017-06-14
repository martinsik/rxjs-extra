/**
 * Demo featuring the cache() operator with in CacheMode.SilentRefresh mode.
 *
 * The order of things is as follows:
 *     0ms: The first observer subscribes.
 *   100ms: The response is ready and the first observer receives the result and completes.
 *  1500ms: The second observer subscribes. It receives the first value immediately and then the cache() operator
 *           subscribes to the source Observable but the fresh emitted value is silently suppressed.
 *  1700ms: The third observer subscribes. It receives only value "1" and completes.
 */
const Observable = require('rxjs/Observable').Observable;
require('rxjs/add/observable/defer');
require('rxjs/add/observable/of');
require('rxjs/add/operator/delay');
const CacheMode = require('../dist/cjs/operator/cache').CacheMode;
require('../dist/cjs/add/operator/cache');

function now() {
  return (new Date()).getTime();
}
const start = now();

let observer = {
  next: (val) => console.log(now() - start, val),
  complete: () => console.log(now() - start, 'complete'),
};
let counter = 0;

let source = Observable.defer(() => {
    console.log('Observable.defer');
    return Observable.of(counter++).delay(100);
  })
  .cache(1000, {mode: CacheMode.SilentRefresh});

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
137 0
140 'complete'
1506 0
Observable.defer
1609 'complete'
1705 1
1705 'complete'
*/