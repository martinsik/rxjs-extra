import { concat, of, Subject, MonoTypeOperatorFunction, SchedulerLike, asyncScheduler } from 'rxjs';
import { multicast, ignoreElements, delay, tap } from 'rxjs/operators'

export const delayComplete = <T>(time: number, scheduler: SchedulerLike = asyncScheduler): MonoTypeOperatorFunction<T> =>
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
