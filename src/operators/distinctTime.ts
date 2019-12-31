import { MonoTypeOperatorFunction, Observable, SchedulerLike } from 'rxjs';
import { concatMap, distinct, windowTime } from 'rxjs/operators';

/**
 * Just like `distinct` operator but periodically resets every `distinctTimeSpan`.
 *
 * @param distinctTimeSpan number
 * @param keySelector Function Same selector function used by `distinct`
 * @param scheduler
 */
export const distinctTime = <T, K>(
  distinctTimeSpan: number,
  keySelector?: (value: T) => K,
  scheduler?: SchedulerLike
): MonoTypeOperatorFunction<T> =>
  (source: Observable<T>) =>
    source.pipe(
      windowTime(distinctTimeSpan, scheduler),
      concatMap(window$ => window$.pipe(
        distinct(keySelector),
      ))
    );
