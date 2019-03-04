[![Build Status](https://travis-ci.org/martinsik/rxjs-extra.svg?branch=master)](https://travis-ci.org/martinsik/rxjs-extra)

# rxjs-extra

Collection of extra RxJS 5 operators:

- [`cache`](https://github.com/martinsik/rxjs-extra#cache) 
- [`queueTime`](https://github.com/martinsik/rxjs-extra#queuetime) 
- [`rateLimit`](https://github.com/martinsik/rxjs-extra#ratelimit)

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

# Testing

This repository tests are based completely on RxJS marble tests and its helpers. First you'll have to clone the original RxJS repo becase tests in this repo rely on the tools available only in the official RxJS repo.
                                                                                
```
$ npm run clone_rxjs_repo
```
 
To run the test suit simply run the following `npm` script:

```
$ npm run test
```

This repository also uses the same marble to png generator as the originial RxJS repo. Since this isn't an officially exported feature of RxJS the process is a little more complicated but fully automatic by running:

```
$ npm run tests2png_full
```

The `tests2png_full` script does the following things:

1. Clones `https://github.com/ReactiveX/rxjs.git` repo into `.rxjs-repo` directory.

2. Creates `./docs_app/content/img/` directory.

3. Runs `mocha` tests with `tests2png.opts` options.

4. Copies content of `./docs_app/content/img/` to `./doc`.

5. Removes temp directories `.rxjs-repo` and `./docs_app`.

If you know you're about to run the png generator a lot you can just prepare the temp directories and re-run the test suit. The temp directories won't be removed after running the tests:

 ```
$ npm run prepare_tests2png
$ npm run tests2png
 ```
