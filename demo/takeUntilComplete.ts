/**
 * Using `takeUntilComplete` to complete a chain by completing the notifier Observable
 */
import { interval, Subject } from 'rxjs';
import { takeUntilComplete } from '../src/operators';

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
