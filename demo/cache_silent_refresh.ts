/**
 * Demo featuring the `cache()` operator in `CacheMode.SilentRefresh` mode.
 *
 * In this demo the `cache()` operator always emits just one item and then eventually refreshes
 * the cache without emitting the refreshed result. This means that this operator will emit immediately any item that
 * is currently in cache but if the cache needs to be refreshed then the complete notification is send
 * after the source emits.
 */
import { defer, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { cache, CacheMode } from '../src/operators';

let counter = 0;

const source = defer(() => {
  console.log('defer');
  return of(counter++).pipe(
    delay(100)
  );
}).pipe(
  cache(1000, CacheMode.SilentRefresh),
);

setTimeout(() => source.subscribe(val => console.log('sub1', val)), 0);
setTimeout(() => source.subscribe(val => console.log('sub2', val)), 200);
setTimeout(() => source.subscribe(val => console.log('sub3', val)), 1200);
setTimeout(() => source.subscribe(val => console.log('sub4', val)), 1500);
setTimeout(() => source.subscribe(val => console.log('sub5', val)), 3000);

/**
 * Expected output:
defer
sub1 0
sub2 0
sub3 0
defer
sub4 1
sub5 1
defer
*/