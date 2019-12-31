# distinctTime

*operator*

Just like `distinct` operator but periodically resets every `distinctTimeSpan` which means it allows duplicate items. Resets happen periodically and independently on whether the source Observable is emitting.

```
distinctTime = <T, K>(distinctTimeSpan: number, keySelector?: (value: T) => K, scheduler?: SchedulerLike)
```

![distinctTime](https://raw.githubusercontent.com/martinsik/rxjs-extra/master/doc/marble-diagrams/distinctTime.png "The distinctTime() operator")

```
const source = new Subject();

source
  .pipe(
    distinctTime(2000),
  )
  .subscribe(new DebugObserver('Obs'));

source.next(1);
source.next(1);
source.next(2);
source.next(2);

setTimeout(() => {
  source.next(1);
}, 1000);

setTimeout(() => {
  source.next(1);
  source.next(2);
  source.complete();
}, 3000);

/*
$ npm run demo -- demo/distinctTime.ts

[Obs]N@      2: 1
[Obs]N@     10: 2
[Obs]N@   3013: 1
[Obs]N@   3014: 2
[Obs]C@   3015:
*/
```