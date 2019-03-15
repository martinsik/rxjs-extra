import { defer, of, Observable, MonoTypeOperatorFunction, SchedulerLike } from 'rxjs';
import { concatMap, delay } from 'rxjs/operators';
import { schedulerNow } from '../utils/now';

/**
 * Mirrors the source Observable and makes at most `timeDelay` delay between two emissions to keep at
 * least `timeDelay` intervals while re-emitting source asap.
 *
 * @param timeDelay number
 * @param scheduler
 */
export const queueTime = <T>(timeDelay: number, scheduler?: SchedulerLike): MonoTypeOperatorFunction<T> =>
  (source: Observable<T>) => defer(() => {
    let nextEarliestEmission: number = null;

    return source.pipe(
      concatMap((value) => {
        const now = schedulerNow(scheduler);
        const expectedEmissionTime = nextEarliestEmission;

        if (expectedEmissionTime === null || now > expectedEmissionTime) {
          nextEarliestEmission = now + timeDelay;

          return of(value);
        } else {
          const requiredDelay = expectedEmissionTime - now;
          nextEarliestEmission = now + timeDelay + requiredDelay;

          return of(value).pipe(
            delay(requiredDelay, scheduler),
          );
        }
      }),
    );
  });
