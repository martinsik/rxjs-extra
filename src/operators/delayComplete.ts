import { concat, of, Subject, MonoTypeOperatorFunction, SchedulerLike } from 'rxjs';
import { multicast, ignoreElements, delay, tap } from 'rxjs/operators';

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
