[![Build Status](https://travis-ci.org/martinsik/rxjs-extra.svg?branch=master)](https://travis-ci.org/martinsik/rxjs-extra)

# rxjs-extra

Collection of extra RxJS 5 operators:

- [`cache`](https://github.com/martinsik/rxjs-extra#cache) 
- [`endWith`](https://github.com/martinsik/rxjs-extra#endwith)
- [`queueTime`](https://github.com/martinsik/rxjs-extra#queuetime) 
- [`rateLimit`](https://github.com/martinsik/rxjs-extra#ratelimit)
- [`takeWhileInclusive`](https://github.com/martinsik/rxjs-extra#takewhileinclusive) 

# Usage

Install `rxjs-extra` via `npm`:

```
npm install rxjs-extra
```

The general usage is the same as with RxJS 5. This means you need to manually include operators you want to use:

In TypeScript for example:

```
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/range';
import 'rxjs-extra/add/operator/endWith';

Observable.range(1, 3)
  .endWith<number | string>('a', 'b', 'c')
  .subscribe(console.log);
```

In ES6 in `node` environment for example:

```
const Observable = require('rxjs/Observable').Observable;
require('rxjs/add/observable/range');
require('rxjs-extra/add/operator/endWith');

Observable.range(1, 3)
    .endWith('a', 'b', 'c')
    .subscribe(console.log);
```

Feel free to experiment with demos in the [`/demo`](https://github.com/martinsik/rxjs-extra/tree/master/demo) directory.

# List of operators

## cache

```
cache(windowTime: number, options: CacheOptions = {}, scheduler?: Scheduler)
```

Operator that stores and replays its cached value for a period of time.

This operator works in three different modes:

- `Default` - The default behavior that just stores and replays the cached value for a period of time:
  
   ```
   source.cache(1000)
   ```

  This is equivalent of using the following operator chain:

   ```
   source.publishReplay(1, 1000)
     .refCount()
     .take(1)
   ```
      
   See demo: [`demo/cache.js`](https://github.com/martinsik/rxjs-extra/blob/master/demo/cache.js)

- `TolerateExpired` - The operators emits one or two items depending on whether the currently cached item has expired:

   ```
   source.cache(1000, {mode: CacheMode.TolerateExpired});
   ```
   
   - When the cached item is still fresh it works just like in the `Default` mode. The cache item is emitted and the operators completes immediately.
   
   - When the cached item is already expired it emits it anyway immediately but at also subscribes to the source Observable that is supposed to emit another fresh item that is stored by the operator instead of the expired one. This means that in this case the operator emits two items, the old one and then the new one. The complete notification is sent after the new item is emitted.
   
   See demo: [`demo/cache_tolerate_expired.js`](https://github.com/martinsik/rxjs-extra/blob/master/demo/cache_tolerate_expired.js)

- `SilentRefresh` - The operator emits always only the current one item no matter whether it has already expired or not:
 
   ```
   source.cache(1000, {mode: CacheMode.SilentRefresh});
   ```
 
   - When it's not expired it's emitted and the operator send complete notification immediately.
   
   - When its already expired the operator will subscribe to its source Observable and wait until it produces a new item that is stored instead of the expired one. However, the new item is not sent to the observer and is silently surpressed. The operator sends complete notification only after the new item is received from the source Observable.
   
   See demos: [`demo/cache_silent_refresh.js`](https://github.com/martinsik/rxjs-extra/blob/master/demo/cache_silent_refresh.js) and [`demo/cache_silent_refresh_02.js`](https://github.com/martinsik/rxjs-extra/blob/master/demo/cache_silent_refresh_02.js).

For detailed explanation how caching with RxJS can be implemented have a look at *"[Caching HTTP responses](https://stackoverflow.com/documentation/rxjs/8247/common-recipes/26490/caching-http-responses)"* in the StackOverflow Documentation.

## endWith

```
endWith(...values: Array<T>)
```

Emits a sequence of values after the source Observables completes.

![endWith](https://raw.githubusercontent.com/martinsik/rxjs-extra/master/doc/endWith.png "The endWith() operator")

These two operator chains are equivalent:

```
source.endWith('a', 'b', 'c')

source.concat(Observable.of('a', 'b', 'c'))
```

However, the `endWith()` operator has much better performance than using `concat()` and `Observable.of()`.

See demo [`demo/endWith.js`](https://github.com/martinsik/rxjs-extra/blob/master/demo/endWith.js) for typical usage example or see this operator compared with `concat` using marble tests [`demo/endWith_marbles.js`](https://github.com/martinsik/rxjs-extra/blob/master/demo/endWith_marbles.js).

## queueTime

```
queueTime(delay: number, scheduler: SchedulerI = Scheduler.async)
```

Makes max `delay` delays between emissions while trying to emit as soon as possible:

![queueTime](https://raw.githubusercontent.com/martinsik/rxjs-extra/master/doc/queueTime.png "The queueTime() operator")

```
source.queueTime(1000)
```

Its behavior is similar to using `concatMap` and `delay` in the following chain:

```
source.concatMap((item, i) => i === 0
        ? Observable.of(item)
        : Observable.of(item).delay(1000)
    )
```

However, the `queueTime()` tries to keep the delay between emissions at minimum. This means that each item emitted by this operator is delayed by something between `0` and `delay`. Items comming after longer period of inactivity are emitted immediately. On the other hand items coming very quickly one after another are delay by the maximum `delay`.

This will be more obvious if we compare marble diagrams for `concatMap()` and `queueTime()`:

```
delay 50        -----
input           --1-2-3-------------4--5---6------------7-|

concatMap(...)  --1------2----3----------4----5----6---------(7|)
queueTime(50)   --1----2----3-------4----5----6---------7-|
```

Notice that with `queueTime()` items such as `1`, `4` and `7` are not delayed at all because the previous emission happened more than `50` time units ago. With `concatMap()` every item except the first one is delayed by the same amount of time. 

See demos: [`demo/queueTime.js`](https://github.com/martinsik/rxjs-extra/blob/master/demo/queueTime.js), [`demo/queueTime_2.js`](https://github.com/martinsik/rxjs-extra/blob/master/demo/queueTime_2.js), [`demo/queueTime_3.js`](https://github.com/martinsik/rxjs-extra/blob/master/demo/queueTime_3.js) or see marble tests comparing `concatMap()` and `queueTime()` [`demo/queueTime_marbles.js`](https://github.com/martinsik/rxjs-extra/blob/master/demo/queueTime_marbles.js).

## rateLimit

```
rateLimit(count: number, timeWindow: number, emitAsap: boolean = false, scheduler: Scheduler = async)
```

Buffer max `count` items for a period of `timeWindow` starting by the fist item received. 

![rateLimit](https://raw.githubusercontent.com/martinsik/rxjs-extra/master/doc/rateLimit.png "The rateLimit() operator")

```
source.rateLimit(3, 1000)
```

This operator is similar to using `bufferCount` and `delay` in the following chain:

```
source.bufferTime(1000, null, 3)
    .filter(array => array.length !== 0)
    .concatMap((buffer, i) => i === 0
        ? Observable.of(buffer)
        : Observable.of(buffer).delay(1000, scheduler)
    );
```

However, to ensure at least `1000ms` delay we had to delay some emissions twice and also `bufferTime()` might split groups of emitted items ineffectively.

The `rateLimit` operator can work in tho modes:

 - `emitAsap = false` - max `count` items are buffered for `timeWindow`.
 
 - `emitAsap = true` - the first item received after at least `timeWindow` of inactivity is re-emitted immediately. Then all consecutive items are buffered for the period of `timeWindow`.

The difference should be more obvious from the following marble diagrams comparing `rateLimit()` in the two modes and the chain using `bufferTime()`:

```
delay                     ----------
input                     --1-2-3-------------4--5---6------------7-|

rateLimit(3, 100)         ------------x-----------------y-------------------(z|)
rateLimit(3, 100, true)   --x---------y---------z---------i---------(j|)
bufferTime(100, null, 3)  ------x-----------------------------y---------z---------(i|)
```

The number of emissions and their values varies. For the complete example with values for each test case see [`demo/rateLimit_marble.js`](https://github.com/martinsik/rxjs-extra/blob/master/demo/rateLimit_marble.js).

See demos: [`demo/rateLimit.js`](https://github.com/martinsik/rxjs-extra/blob/master/demo/rateLimit.js) and [`demo/rateLimit_2.js`](https://github.com/martinsik/rxjs-extra/blob/master/demo/rateLimit_2.js).

## takeWhileInclusive

```
takeWhileInclusive(predicate: (value: T, index: number) => boolean)
```

Same as the [`takeWhile()`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-takeWhile) operator but this implementation emits also the last item that didn't match the predicate function.

![takeWhileInclusive](https://raw.githubusercontent.com/martinsik/rxjs-extra/master/doc/takeWhileInclusive.png "The takeWhileInclusive() operator")

```
Observable.range(1, 6)
    .takeWhileInclusive(n => n !== 4)
    .subscribe(console.log);
```

The preceding example will print numbers from `1` to `4` including.

This operator has also been discussed in RxJS 5 in [ReactiveX/rxjs#2420](https://github.com/ReactiveX/rxjs/issues/2420).

See demo: [`demo/takeWhileInclusive.js`](https://github.com/martinsik/rxjs-extra/blob/master/demo/takeWhileInclusive.js)

# Testing

This repository uses the same `mocha` testing helpers as RxJS 5 including rendering marble diagrams.

To run the tests this repo needs to download the RxJS 5 archive, unpack it, copy helper scripts and patch them by [files from `spec-patch`](https://github.com/martinsik/rxjs-extra/tree/master/spec-patch).

This is done automatically by running `npm run spec-setup` script. The workflow is then as follows:

```
$ clone https://github.com/martinsik/rxjs-extra
$ cd rxjs-extra
$ npm i
$ npm run spec-setup && npm run test-build
$ npm run test
```
