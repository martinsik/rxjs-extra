/**
 * Using `randomDelay` to make random 1-3 second delays between `next` emissions.
 */
import { range } from 'rxjs';
import { randomDelay } from '../src/operators';

range(5).pipe(
  randomDelay(1000, 3000),
).subscribe(console.log);

/* Will emit with random delays
$ npm run demo -- demo/randomDelay.ts
0
1
2
3
4
