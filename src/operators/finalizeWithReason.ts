import { defer, Observable, MonoTypeOperatorFunction } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

export enum FinalizeReason {
  Unsubscribe = 'unsubscribe',
  Complete = 'complete',
  Error = 'error',
}

type CallbackFunc = (reason: FinalizeReason) => void;

export const finalizeWithReason = <T>(callback: CallbackFunc): MonoTypeOperatorFunction<T> =>
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
