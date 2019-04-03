/**
 * Using `randomTimer` to make random 0 - 2 seconds delay between emissions.
 */
import { take } from 'rxjs/operators';
import { randomTimer } from '../src';

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
