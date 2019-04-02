# queueTime

*operator*

Mirrors the source Observable and makes at most `timeDelay` delay between two emissions to keep at least `timeDelay` intervals while re-emitting source asap.
 
```
queueTime<T>(timeDelay: number, scheduler?: SchedulerLike)
```
 
![queueTime](https://raw.githubusercontent.com/martinsik/rxjs-extra/master/doc/marble-diagrams/queueTime.png "The queueTime() operator")

```
import { range } from 'rxjs';
import { queueTime } from 'rxjs-extra/operators';

range(10).pipe(
  queueTime(1000),
).subscribe(console.log);
```

Its behavior is similar to using `concatMap` and `delay` in the following chain:

```
concatMap((item, i) => i === 0
  ? of(item)
  : of(item).pipe(delay(1000))
),
```

However, `queueTime()` tries to keep the delay between emissions at minimum. This means that each item emitted by this operator is delayed by something between `0` and `delay`. Items comming after longer period of inactivity are emitted immediately. On the other hand items coming very quickly one after another are delay by the maximum `delay`.

This will be more obvious if we compare marble diagrams for `concatMap()` and `queueTime()`:

```
delay 50        -----
input           --1-2-3-------------4--5---6------------7-|

concatMap(...)  --1------2----3----------4----5----6---------(7|)
queueTime(50)   --1----2----3-------4----5----6---------7-|
```

Notice that with `queueTime()` items such as `1`, `4` and `7` are not delayed at all because the previous emission happened more than `50` time units ago. With `concatMap()` every item except the first one is delayed by the same amount of time. 

### Demos:
 
 - [`demo/queueTime.ts`](https://github.com/martinsik/rxjs-extra/blob/master/demo/queueTime.ts)
 - [`demo/queueTime_2.ts`](https://github.com/martinsik/rxjs-extra/blob/master/demo/queueTime_2.ts)
 - or see marble tests comparing `concatMap()` and `queueTime()` [`demo/queueTime_marbles.ts`](https://github.com/martinsik/rxjs-extra/blob/master/demo/queueTime_marbles.ts).
