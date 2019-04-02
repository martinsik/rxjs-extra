# retryTime

*operator*

Just like `retry()` but resubscribes to its source Observable with constant delays or resubscribes only `N` times based on a predefined array of delays.

```
retryTime<T>(delayTime: number | number[], scheduler?: SchedulerLike)
```

![retryTime](https://raw.githubusercontent.com/martinsik/rxjs-extra/master/doc/marble-diagrams/retryTime.png "The retryTime() operator")

```
import { throwError, of, defer } from 'rxjs';
import { retryTime } from 'rxjs-extra/operators';

let retries = 0;

defer(() => {
  if (retries++ === 3) {
    return of(1)
  } else {
    console.log('throw');
    return throwError('Error');
  }
}).pipe(
  retryTime(3000),
).subscribe();

/*
$ npm run demo -- demo/retryTime.ts
throw
throw
throw
*/
```

`retryTime` also supports using an array of predefined delays instead of a constant. When using array `retryTime` will make only `delayTime.length` retries and then propagate the error further.

```
import { throwError, of, defer } from 'rxjs';
import { retryTime } from 'rxjs-extra/operators';

let retries = 0;
const start = new Date().getTime();
const now = () => new Date().getTime() - start;

defer(() => {
  console.log(now(), 'throw');
  return throwError('Error');
}).pipe(
  retryTime([100, 2000, 5000]),
).subscribe({ error: () => void 0 });

/*
$ npm run demo -- demo/retryTime_preset_delays.ts
2 'throw'
113 'throw'
2118 'throw'
7121 'throw'
*/
```

Demo: [`demo/retryTime.ts`](https://github.com/martinsik/rxjs-extra/blob/master/demo/retryTime.ts)
Demo: [`demo/retryTime_preset_delays.ts`](https://github.com/martinsik/rxjs-extra/blob/master/demo/retryTime_preset_delays.ts)
