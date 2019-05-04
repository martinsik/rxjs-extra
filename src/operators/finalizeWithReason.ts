import { defer, Observable, MonoTypeOperatorFunction } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

export enum FinalizeReason {
  Unsubscribe = 'unsubscribe',
  Complete = 'complete',
  Error = 'error',
}

/**
 * @todo(): Review when https://github.com/ReactiveX/rxjs/issues/2823 is resolved.
 * Just like `finalize()` but passes to its callback also `reason` why the chain is being
 * disposed (chain completed, errored or on unsubscription).
 *
 * @param callback (reason: FinalizeReason) => void
 */
export const finalizeWithReason = <T>(callback: (reason: FinalizeReason) => void): MonoTypeOperatorFunction<T> =>
  (source: Observable<T>) =>
    defer(() => {
      let completed = false;
      let errored = false;

      return source.pipe(
        tap({
          error: () => errored = true,
          complete: () => completed = true,
        }),
        finalize(() => {
          if (errored) {
            callback(FinalizeReason.Error);
          } else if (completed) {
            callback(FinalizeReason.Complete);
          } else {
            callback(FinalizeReason.Unsubscribe);
          }
        }),
      );
    });
