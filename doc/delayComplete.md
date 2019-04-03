# delayComplete

*operator*

Just like `delay()` but delays only the `complete` notification.

```
delayComplete(time: number, scheduler?: SchedulerLike)
```

![delayComplete](https://raw.githubusercontent.com/martinsik/rxjs-extra/master/doc/marble-diagrams/delayComplete.png "The delayComplete() operator")

```
import { of } from 'rxjs';
import { delayComplete } from 'rxjs-extra/operators';

const start = new Date().getTime();
const now = () => new Date().getTime() - start;

of('Hello').pipe(
  delayComplete(3000),
).subscribe({
  next: (v) => console.log(now(), v),
  complete: () => console.log(now(), 'complete'),
});

/*
$ npm run demo -- demo/delayComplete.ts
8 'Hello'
3020 'complete'
*/
```

Demo: [`demo/delayComplete.ts`](https://github.com/martinsik/rxjs-extra/blob/master/demo/delayComplete.ts)
