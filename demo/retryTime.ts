/**
 * Using `retryTime` to retry the source Observable with constant 3 second delay between retries.
 */
import { throwError, of, defer } from 'rxjs';
import { retryTime } from '../src/operators';

let retries = 0;

defer(() => {
  if (retries++ === 3) {
    return of(1)
  } else {
    console.log('throw');
    return throwError('Error');
  }
}).pipe(
  retryTime(3000),
).subscribe();

/*
$ npm run demo -- demo/retryTime.ts

throw
throw
throw
*/
