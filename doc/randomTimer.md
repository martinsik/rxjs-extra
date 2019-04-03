# randomTimer

*Observable creation method*

Creates an Observable that emits sequential numbers in random intervals on a specified scheduler.

```
randomTimer(min: number, max: number, generator: NumberGenerator = randomNumberGenerator, scheduler: SchedulerLike = asyncScheduler): Observable<number>
```

![randomTimer](https://raw.githubusercontent.com/martinsik/rxjs-extra/master/doc/marble-diagrams/randomTimer.png "The randomTimer() operator")

```
import { take } from 'rxjs/operators';
import { randomTimer } from 'rxjs-extra';

randomTimer(0, 2000).pipe(
  take(5),
)
.subscribe(console.log);

/*
$ npm run demo -- demo/randomTimer.ts
0
1
2
3
4
*/
```

Demo: [`demo/randomTimer.ts`](https://github.com/martinsik/rxjs-extra/blob/master/demo/randomTimer.ts)
