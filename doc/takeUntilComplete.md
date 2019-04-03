# takeUntilComplete

*operator*

Just like `takeUntil()` but completes only when the notifier completes and ignores all `next` notifications.

```
takeUntilComplete<T>(notifier: Observable<any>)
```

![takeUntilComplete](https://raw.githubusercontent.com/martinsik/rxjs-extra/master/doc/marble-diagrams/takeUntilComplete.png "The takeUntilComplete() operator")

```
import { interval, Subject } from 'rxjs';
import { takeUntilComplete } from 'rxjs-extra/operators';

const s = new Subject();

interval(500).pipe(
  takeUntilComplete(s),
).subscribe(console.log);

setTimeout(() => s.complete(), 1700);

/* Will emit with random delays
$ npm run demo -- demo/takeUntilComplete.ts
0
1
2
*/
```

Demo: [`demo/takeUntilComplete.ts`](https://github.com/martinsik/rxjs-extra/blob/master/demo/takeUntilComplete.ts)
