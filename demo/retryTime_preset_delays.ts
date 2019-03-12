/**
 * Using `retryTime` to retry the source Observable with three preset `[100, 2000, 5000]` delays between retries.
 * If the
 */
import { throwError, defer } from 'rxjs';
import { retryTime } from '../src/operators';

let retries = 0;

defer(() => {
  console.log('throw');
  return throwError('Error');
}).pipe(
  retryTime([100, 2000, 5000]),
).subscribe();

/*
$ npm run demo -- demo/retryTime_preset_delays.ts
throw
throw
throw
throw
*/
