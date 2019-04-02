# randomDelay

*operator*

Mirrors the source Observable but makes random delays from `min` to `max` between emissions on a specified scheduler.

```
randomDelay<T>(min: number, max: number, generator: NumberGenerator = randomNumberGenerator, scheduler?: SchedulerLike)
```

![randomDelay](https://raw.githubusercontent.com/martinsik/rxjs-extra/master/doc/marble-diagrams/randomDelay.png "The randomDelay() operator")

```
import { range } from 'rxjs';
import { randomDelay } from '../src/operators';

range(5).pipe(
  randomDelay(1000, 3000),
).subscribe(console.log);

/* Will emit with random delays
$ npm run demo -- demo/randomDelay.ts
0
1
2
3
4
*/
```

Takes an optional `generator` parameter which is a function that is supposed to randomly generate numbers that are used by `randomDelay` as delays.

Demo: [`demo/randomDelay.ts`](https://github.com/martinsik/rxjs-extra/blob/master/demo/randomDelay.ts)
