# tapSubscribe

*operator*

Triggers callback every time a new observer subscribes to this chain.

```
tapSubscribe<T>(callback: () => void)
```

```
import { of, defer } from 'rxjs';
import { tapSubscribe } from 'rxjs-extra/operators';

defer(() => {
  console.log('defer');
  return of(1);
}).pipe(
  tapSubscribe(() => console.log('subscribe')),
).subscribe(console.log);

/* Will emit with random delays
$ npm run demo -- demo/tapSubscribe.ts
subscribe
defer
1
*/
```

Demo: [`demo/tapSubscribe.ts`](https://github.com/martinsik/rxjs-extra/blob/master/demo/tapSubscribe.ts)
