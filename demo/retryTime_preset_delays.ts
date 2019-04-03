/**
 * Using `retryTime` to retry the source Observable with three preset `[100, 2000, 5000]` delays between retries.
 * If the
 */
import { throwError, defer } from 'rxjs';
import { retryTime } from '../src/operators';

let retries = 0;
const start = new Date().getTime();
const now = () => new Date().getTime() - start;

defer(() => {
  console.log(now(), 'throw');
  return throwError('Error');
}).pipe(
  retryTime([100, 2000, 5000]),
).subscribe({ error: () => void 0 });

/*
$ npm run demo -- demo/retryTime_preset_delays.ts
2 'throw'
113 'throw'
2118 'throw'
7121 'throw'
*/
