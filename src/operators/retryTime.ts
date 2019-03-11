import { throwError, of, MonoTypeOperatorFunction, Observable, SchedulerLike } from 'rxjs';
import { retryWhen, delay, concatMap } from 'rxjs/operators';

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
