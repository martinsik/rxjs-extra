# presetTimer

*Observable creation method*

Creates an Observable that emits sequential numbers in predefined delays on a specified scheduler.

```
presetTimer(delays: number[], scheduler?: SchedulerLike): Observable<number>
```

![presetTimer](https://raw.githubusercontent.com/martinsik/rxjs-extra/master/doc/marble-diagrams/presetTimer.png "The presetTimer() operator")

```
import { presetTimer } from 'rxjs-extra';

presetTimer([500, 2000, 1000]).subscribe(console.log);

/*
$ npm run demo -- demo/presetTimer.ts
0
1
2
*/
```

Demo: [`demo/presetTimer.ts`](https://github.com/martinsik/rxjs-extra/blob/master/demo/presetTimer.ts)
