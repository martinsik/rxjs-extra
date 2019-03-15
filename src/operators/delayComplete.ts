import { concat, of, Subject, MonoTypeOperatorFunction, SchedulerLike } from 'rxjs';
import { multicast, ignoreElements, delay } from 'rxjs/operators';

/**
 * Just like `delay()` but delays only the `complete` notification.
 *
 * @param time number
 * @param scheduler
 */
export const delayComplete = <T>(time: number, scheduler?: SchedulerLike): MonoTypeOperatorFunction<T> =>
  multicast(
    new Subject(),
    s => concat(
      s,
      of(void 0).pipe(
        delay(time, scheduler),
        ignoreElements(),
      ),
    )
  );
