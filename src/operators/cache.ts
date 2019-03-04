import { Observable, SchedulerLike, MonoTypeOperatorFunction, Timestamp, asyncScheduler } from 'rxjs';
import { timestamp, publishReplay, refCount, filter, map, takeWhile, take, tap } from 'rxjs/operators';

export enum CacheMode {
  Default,
  TolerateExpired,
  SilentRefresh,
}

export function cache<T>(windowTime: number, mode: CacheMode = CacheMode.Default, scheduler: SchedulerLike = asyncScheduler): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>): Observable<T> => {
    if (mode === CacheMode.SilentRefresh) {
      return source.pipe(
        timestamp(scheduler),
        publishReplay(1, Number.POSITIVE_INFINITY, scheduler),
        refCount(),
        takeWhile<Timestamp<T>>((item, i) => {
          if (i === 0) { // check only the first item if it's still valid
            return getNow(scheduler) > item.timestamp + windowTime;
          }
          // the second item always needs to be the last one
          return false;
        }, true),
        filter((item, i) => i === 0), // always pass only the first item
        map<Timestamp<T>, T>((item) => item.value),
      );

    } else if (mode === CacheMode.TolerateExpired) {
      return source.pipe(
        timestamp(scheduler),
        publishReplay(1, Number.POSITIVE_INFINITY, scheduler),
        refCount(),
        takeWhile<Timestamp<T>>((item) => {
          // check whether the cached item is still valid
          return getNow(scheduler) > item.timestamp + windowTime;
        }, true),
        map<Timestamp<T>, T>((item) => item.value),
      );

    } else {
      return source.pipe(
        publishReplay(1, windowTime, scheduler),
        refCount(),
        take(1),
      );
    }
  };
}

const getNow = (scheduler: SchedulerLike): number => {
  return scheduler.now();
};
