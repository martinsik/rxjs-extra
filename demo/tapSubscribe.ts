/**
 * Using `tapSubscribe` to perform side-effects when an observer subscribes.
 */
import { of, defer } from 'rxjs';
import { tapSubscribe } from '../src/operators';

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
