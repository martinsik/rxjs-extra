import { defer, of, Observable, MonoTypeOperatorFunction, SchedulerLike } from 'rxjs';
import { concatMap, delay } from 'rxjs/operators';

export const queueTime = <T>(timeDelay: number, scheduler?: SchedulerLike): MonoTypeOperatorFunction<T> =>
  (source: Observable<T>) => defer(() => {
    let nextEarliestEmission: number = null;

    return source.pipe(
      concatMap((value) => {
        const now = scheduler.now();
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
