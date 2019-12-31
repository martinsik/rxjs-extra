[![Build Status](https://travis-ci.org/martinsik/rxjs-extra.svg?branch=master)](https://travis-ci.org/martinsik/rxjs-extra)

# RxJS Extra

Collection of extra RxJS 6 operators, Observable creation methods, Observers and Subjects for common use-cases.

## List of Features

**Operators**

 - [`cache`](https://github.com/martinsik/rxjs-extra/blob/master/doc/cache.md) - Caches the source Observable values for a time period with three different caching strategies.
 - [`delayComplete`](https://github.com/martinsik/rxjs-extra/blob/master/doc/delayComplete.md) - Just like `delay()` but delays only the `complete` notification.
 - [`distinctTime`](https://github.com/martinsik/rxjs-extra/blob/master/doc/distinctTime.md) - Just like `distinct` operator but periodically resets after a set time span.
 - [`errorWhen`](https://github.com/martinsik/rxjs-extra/blob/master/doc/errorWhen.md) - Emits an `error` notification when a value matches the predicate function.
 - [`finalizeWithReason`](https://github.com/martinsik/rxjs-extra/blob/master/doc/finalizeWithReason.md) - Just like `finalize()` but passes to its callback also `reason` why the chain is being disposed.
 - [`queueTime`](https://github.com/martinsik/rxjs-extra/blob/master/doc/queueTime.md) - Mirrors the source Observable and makes at most `timeDelay` delay between two emissions to keep at least `timeDelay` intervals while re-emitting source asap.
 - [`randomDelay`](https://github.com/martinsik/rxjs-extra/blob/master/doc/randomDelay.md) - Mirrors the source Observable but makes random delays between emissions on a specified scheduler.
 - [`resetTime`](https://github.com/martinsik/rxjs-extra/blob/master/doc/resetTime.md) - Mirrors source Observable and schedules another delayed emission after every `next` emission from source (useful for showing/hiding notifications in UI).
 - [`retryTime`](https://github.com/martinsik/rxjs-extra/blob/master/doc/retryTime.md) - Just like `retry()` but resubscribes to its source Observable with constant delays or resubscribes only `N` times based on a predefined array of delays.
 - [`takeUntilComplete`](https://github.com/martinsik/rxjs-extra/blob/master/doc/takeUntilComplete.md) - Just like `takeUntil()` but completes only when the notifier completes and ignores all `next` notifications.
 - [`tapSubscribe`](https://github.com/martinsik/rxjs-extra/blob/master/doc/tapSubscribe.md) - Triggers callback every time a new observer subscribes to this chain.
 
**Observable creation methods**

 - [`presetTimer`](https://github.com/martinsik/rxjs-extra/blob/master/doc/presetTimer.md) - Creates an Observable that emits sequential numbers in predefined delays on a specified scheduler.
 - [`randomTimer`](https://github.com/martinsik/rxjs-extra/blob/master/doc/randomTimer.md) - Creates an Observable that emits sequential numbers in random intervals on a specified scheduler.
 
**Observers**

 - [`DebugObserver`](https://github.com/martinsik/rxjs-extra/blob/master/doc/DebugObserver.md) - Observer for debugging purposes that timestamps each notification with time offset since the instance was created.

**Subjects**

 - [`PersistentSubject`](https://github.com/martinsik/rxjs-extra/blob/master/doc/PersistentSubject.md) - Just like `BehaviorSubject` but stores every item in a persistent storage (`LocalStorage` by default).

## Usage

Install `rxjs-extra` via `npm`:

```
npm install rxjs-extra
```

The general usage is the same as with any RxJS 6 operators or Observable creation methods:

In TypeScript for example:

```
import { map } from 'rxjs/operators';
import { randomTimer } from 'rxjs-extra';
import { tapSubscribe } from 'rxjs-extra/operators';

randomTimer(100, 2000).pipe(
  tapSubscribe(() => console.log('subscribed')),
  map(i => String.fromCharCode(97 + i)),
).subscribe(console.log);
```

In `node` environment for example:

```
const { map } = require('rxjs/operators');
const { randomTimer } = require('rxjs-extra');
const { tapSubscribe } = require('rxjs-extra/operators');

randomTimer(100, 2000).pipe(
  tapSubscribe(() => console.log('subscribed')),
  map(i => String.fromCharCode(97 + i)),
).subscribe(console.log);
```

## Demos

All features from this package have their small demo examples written in TypeScript. You can use NPM `demo` script with preconfigures `ts-node` to run any one of them:

```
$ npm run demo -- demo/delayComplete.ts
```

# Testing

## OS X and Linux systems

This repository tests are based completely on RxJS marble tests and its helpers. You'll have to clone the original RxJS repo because tests in this repo rely on tools available only in the official RxJS 6 repo.
                                                                                
```
$ npm run clone_rxjs_repo
```
 
To run the test suit simply run the following `npm` script:

```
$ npm run test
```

This repository also uses the same `marble2png` generator as the original RxJS repo. Since this isn't an officially exported feature of RxJS 6 the process is a little more complicated but fully automatic by running a single script:

### Generating marble diagrams

First, install ImageMagick or GraphicsMagick. Then run the following command:

```
$ npm run tests2png_full
```

The `tests2png_full` script does the following things:

1. Clones `https://github.com/ReactiveX/rxjs.git` repo into `.rxjs-repo` directory.

2. Creates `./docs_app/content/img/` directory.

3. Runs `mocha` tests with `tests2png.opts` options.

4. Copies content of `./docs_app/content/img/` to `./doc`.

5. Removes temp directories `.rxjs-repo` and `./docs_app`.

If you know you're about to run the png generator a lot you can just clone the RxJS repo and re-run the test suit:

 ```
$ npm run clone_rxjs_repo
$ npm run tests2png
 ```

## Windows

On Windows the process is a little more complicated because `gm` npm package won't be able to find the `convert` command so you'll have to manually make changes to the cloned `.rxjs-repo/spec/helpers/tests2png/painter.ts`.

The following process might be slightly different between ImageMagick and GraphicsMagick.

1. Set ImageMagick/GraphicsMagick `convert.exe` path.

   ```
   // When using ImageMagick (including portable ImageMagick)
   const gmCmd = gm.subClass({appPath: 'path to your ImageMagick dir', imageMagick: true});
   ```

   Then almost at the end of the file use `gmCmd` instead of the default `gm`:

   ```
   let out: GMObject = gmCmd(CANVAS_WIDTH, canvasHeight, '#ffffff');
   ```

2. Set `helvetica` font path.

   ImageMagick/GraphicsMagick might not be able to find `helvetica` font on your system. So download `helvetica.ttf` font from any site you like. Then in `.rxjs-repo/spec/helpers/tests2png/painter.ts` search for `out.font('helvetica'` and replace it the font name with path to the file you downloaded.


