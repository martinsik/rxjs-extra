import { Observable, SchedulerLike, MonoTypeOperatorFunction, Timestamp } from 'rxjs';
import { timestamp, filter, map, takeWhile, take, publishReplay, refCount } from 'rxjs/operators';

import { schedulerNow } from '../utils/now';

export enum CacheMode {
  Default,
  TolerateExpired,
  SilentRefresh,
}

export function cache<T>(windowTime: number, mode: CacheMode = CacheMode.Default, scheduler?: SchedulerLike): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>): Observable<T> => {
    // @todo(): Use `shareReplay` when https://github.com/ReactiveX/rxjs/issues/4558 is fixed
    // const shareReplayConfig = {
    //   bufferSize: 1,
    //   refCount: true,
    //   windowTime,
    //   scheduler,
    // };

    if (mode === CacheMode.SilentRefresh) {
      return source.pipe(
        timestamp(scheduler),
        publishReplay(1, Number.POSITIVE_INFINITY, scheduler),
        refCount(),
        takeWhile<Timestamp<T>>((item, i) => {
          if (i === 0) { // check only the first item if it's still valid
            return schedulerNow(scheduler) > item.timestamp + windowTime;
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
        // check whether the cached item is still valid
        takeWhile<Timestamp<T>>((item) => schedulerNow(scheduler) > item.timestamp + windowTime, true),
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
