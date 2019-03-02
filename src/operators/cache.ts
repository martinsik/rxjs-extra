import { Observable, SchedulerLike, MonoTypeOperatorFunction, Timestamp } from 'rxjs';
import { timestamp, publishReplay, refCount, filter, map, takeWhile, take } from 'rxjs/operators';

export enum CacheMode {
  Default,
  TolerateExpired,
  SilentRefresh,
}

export interface CacheOptions {
  mode?: CacheMode;
}

export function cache<T>(windowTime: number, options: CacheOptions = {}, scheduler?: SchedulerLike): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>): Observable<T> => {
    if (!options) {
      options = {} as CacheOptions;
    }
    options.mode = options.mode || CacheMode.Default;

    let observable: Observable<T>;

    if (options.mode === CacheMode.SilentRefresh) {
      observable = observable.pipe(
        timestamp(scheduler),
        publishReplay(1, Number.POSITIVE_INFINITY, scheduler),
        refCount(),
        takeWhile<Timestamp<T>>((item, i) => {
          if (i === 0) { // check only the first item whether it's still valid
            return getNow(scheduler) > item.timestamp + windowTime;
          }
          // the second item always needs to be the last one
          return false;
        }),
        filter((item, i) => i === 0), // always pass only the first item
        map<Timestamp<T>, T>((item) => item.value),
      );

    } else if (options.mode === CacheMode.TolerateExpired) {
      observable = observable.pipe(
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
      observable = observable.pipe(
        publishReplay(1, windowTime, scheduler),
        refCount(),
        take(1),
      );
    }

    return observable as Observable<T>;
  };
}

const getNow = (scheduler: SchedulerLike): number => {
  return scheduler.now();
};
