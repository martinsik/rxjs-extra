# resetTime

*operator*

Mirrors source Observable and schedules a delayed emission after every `next` emission from source.  
This operator is useful for showing/hiding notification messages in UI. 

```
resetTime<T, N>(resetDelay: number, resetWith: N | <T, N>(value: T | N) => N, scheduler?: SchedulerLike)
```

![resetTime](https://raw.githubusercontent.com/martinsik/rxjs-extra/master/doc/marble-diagrams/resetTime.png "The resetTime() operator")

```
const source = new Subject<number>();

source
  .pipe(
    resetTime<number | string>(1000, 'x'),
  )
  .subscribe(new DebugObserver('Obs'));

source.next(1);
setTimeout(() => {
  source.next(2);
  source.complete();
}, 3000);

/*
$ npm run demo -- demo/resetTime.ts

[Obs]N@      1: 1
[Obs]N@   1012: x
[Obs]N@   3013: 2
[Obs]N@   4015: x
[Obs]C@   4016:
*/
```

Instead of a fixed value for `resetWith` it also accepts a projection function that takes one argument which is the most recent value emitted by source and has to return a value that is pushed further.

```
source
  .pipe(
    resetTime<number | string>(1000, v => v + 'x'),
  )
  .subscribe(new DebugObserver('Obs'));
```

Demos:
- [`demo/resetTime.ts`](https://github.com/martinsik/rxjs-extra/blob/master/demo/resetTime.ts)
- [`demo/resetTime_02.ts`](https://github.com/martinsik/rxjs-extra/blob/master/demo/resetTime_02.ts)
