/**
 * Using `finalizeWithReason` to perform side-effects when the chain is being disposed
 * with a reason why it's happening.
 */
import { of, throwError, asyncScheduler } from 'rxjs';
import { finalizeWithReason, FinalizeReason } from '../src/operators';

of(1).pipe(
  finalizeWithReason((reason: FinalizeReason) => console.log(reason)),
).subscribe();

of(1, asyncScheduler).pipe(
  finalizeWithReason((reason: FinalizeReason) => console.log(reason)),
).subscribe().unsubscribe();

throwError('error').pipe(
  finalizeWithReason((reason: FinalizeReason) => console.log(reason)),
).subscribe({ error: () => void 0 });

/*
$ npm run demo -- demo/finalizeWithReason.ts
complete
unsubscribe
error
*/
