[![Build Status](https://travis-ci.org/martinsik/rxjs-plus.svg?branch=master)](https://travis-ci.org/martinsik/rxjs-plus)

# rxjs-plus
Collection of additional RxJS 5 operators

# Operators

## `cache(windowTime: number, options: CacheOptions = {}, scheduler?: Scheduler)`

Operator that stores replays its cached value for a period of time. It works in three different modes:

- `Default` - This is equivalent of using the following chain of operators:

   ```
   source.publishReplay(1, windowTime)
     .refCount()
     .take(1)
   ```
   See demo: [`demo/cache.js`](https://github.com/martinsik/rxjs-plus/blob/master/demo/cache.js)

- `TolerateExpired` - The operators emits one or two items depending on whether the currently cached item is expired:

   - When the cached item is still fresh it works just like in the `Default` mode. The cache item is emitted and the operators completes immediately.
   
   - When the cached item is already expired it emits it anyway immediately but at also subscribes to the source Observable that is supposed to emit another fresh item that is stored by the operator instead of the expired one. This means that in this case the operator emits two items, the old one and then the new one. The complete notification is sent right after the new fresh item is emitted.
   
   See demo: [`demo/cache_tolerate_expired.js`](https://github.com/martinsik/rxjs-plus/blob/master/demo/cache_tolerate_expired.js)

- `SilentRefresh` - The operator emits always only the current one item no matter whether it has already expired or not:
 
   - When it's not expired it's emitted and the operator send complete notification immediately.
   
   - When its already expired it'll subscribe to its source and wait until it produces a new item that is stored instead of the expired one. However, the new item is not sent to the observer and is silently surpressed. The operator sends complete notification only after the new item is received from the source Observable.
   
   See demos: [`demo/cache_silent_refresh.js`](https://github.com/martinsik/rxjs-plus/blob/master/demo/cache_silent_refresh.js) and [`cache_silent_refresh_02.js`](https://github.com/martinsik/rxjs-plus/blob/master/demo/cache_silent_refresh_02.js).

## `endWith(...values: Array<T>)`

Emits a sequence of values after the source Observables emits a complete notification.

![endWith](https://raw.githubusercontent.com/martinsik/rxjs-plus/master/doc/endWith.png "The endWith() operator")

These two operator chains are equivalent:

```
source.endWith('a', 'b', 'c');
source.concat(Observable.of('a', 'b', 'c'));
```

However, the `endWith()` operator has much better performance than using `concat()` and `Observable.of()`.

## `queueTime(delay: number, scheduler?: Scheduler)`

![queueTime](https://raw.githubusercontent.com/martinsik/rxjs-plus/master/doc/queueTime.png "The queueTime() operator")

## `rateLimit(count: number, timeWindow: number, emitAsap: boolean = false, scheduler?: Scheduler)`

![rateLimit](https://raw.githubusercontent.com/martinsik/rxjs-plus/master/doc/rateLimit.png "The rateLimit() operator")


## `takeWhileInclusive(predicate: (value: T, index: number) => boolean)`

![takeWhileInclusive](https://raw.githubusercontent.com/martinsik/rxjs-plus/master/doc/takeWhileInclusive.png "The takeWhileInclusive() operator")

# Testing

This repository uses the same `mocha` testing helpers as RxJS 5 including rendering marble diagrams.

To run the tests this repo needs to download the RxJS 5 archive, unpack it, copy helper scripts and patch them by [files from `spec-patch`](https://github.com/martinsik/rxjs-plus/tree/master/spec-patch).

In order to run tests do the following tests:

```
$ clone https://github.com/martinsik/rxjs-plus
$ cd rxjs-plus
$ npm i
$ npm run spec-setup && npm run test-build
$ npm run test
```
