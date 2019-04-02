import { Observable, SchedulerLike, range, of, asyncScheduler } from 'rxjs';
import { delay, concatMap } from 'rxjs/operators';

/**
 * Creates an Observable that emits sequential numbers in predefined delays on a specified scheduler.
 *
 * @param delays Delays between emissions. Each item represents delay from the previous emission.
 * @param scheduler
 */
export const presetTimer = (delays: number[], scheduler?: SchedulerLike): Observable<number> =>
  range(delays.length).pipe(
    concatMap(index => of(index).pipe(
      delay(delays[index], scheduler),
    )),
  );
