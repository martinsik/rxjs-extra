import { throwError, of, MonoTypeOperatorFunction, Observable, SchedulerLike } from 'rxjs';
import { retryWhen, delay, concatMap } from 'rxjs/operators';

/**
 * Just like `retry()` but resubscribes to its source Observable with constant delays or
 * resubscribes only `N` times based on a predefined array of delays.
 *
 * @param delayTime
 * @param scheduler
 */
export const retryTime = <T>(delayTime: number | number[], scheduler?: SchedulerLike): MonoTypeOperatorFunction<T> =>
  retryWhen((errors: Observable<any>) => typeof delayTime === 'number'
    ? errors.pipe(
        delay(delayTime, scheduler),
      )
    : errors.pipe(
        concatMap((e, index) => delayTime.length === index
          ? throwError(e)
          : of(e).pipe(delay(delayTime[index], scheduler))
        ),
      )
  );
