import { Operator, Observable, Subscriber, Scheduler } from 'rxjs';
import { Scheduler as SchedulerI } from 'rxjs/Scheduler';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/take';
import '../add/operator/takeWhileInclusive';


class CaughtError {
  constructor(public error: any) {}
}

export enum CacheMode { Default, TolerateExpired, SilentRefresh }

export type CacheOptions = {
  catchErrors?: boolean,
  mode?: CacheMode
};

export function cache<T>(this: Observable<T>, windowTime: number, options: CacheOptions = {}, scheduler?: SchedulerI): Observable<T> {
  if (!options) {
    options = <CacheOptions>{};
  }
  options.catchErrors = typeof options.catchErrors === 'undefined' ? true : options.catchErrors;
  options.mode = options.mode || CacheMode.Default;

  let observable = this;
  if (options.catchErrors) {
    observable = <Observable<any>>this.catch(err => Observable.of(new CaughtError(err)));
  }

  if (options.mode === CacheMode.SilentRefresh) {
    observable = observable
        .timestamp()
        .publishReplay(1, Number.POSITIVE_INFINITY, scheduler)
        .refCount()
        .takeWhileInclusive((item, i) => {
          if (i === 0) { // check only the first item whether it's still valid
            return getNow(scheduler) > item.timestamp + windowTime;
          }
          // the second item always needs to be the last one
          return false;
        })
        .map((item, i) => i === 0 ? item : null) // always ignore the second item
        .filter(Boolean)
        .map(item => item.value);

  } else if (options.mode === CacheMode.TolerateExpired) {
    observable = observable
        .timestamp()
        .publishReplay(1, Number.POSITIVE_INFINITY, scheduler)
        .refCount()
        .takeWhileInclusive(item => {
          // check whether the cached item is still valid
          return getNow(scheduler) > item.timestamp + windowTime;
        })
        .map(item => item.value);

  } else {
    observable = observable
        .publishReplay(1, windowTime, scheduler)
        .refCount()
        .take(1);
  }

  if (options.catchErrors) {
    observable = observable.map(item => {
      if (item instanceof CaughtError) {
        throw item.error;
      }
      return item;
    });
  }

  return <Observable<T>>observable;
}

function getNow(scheduler: SchedulerI): number {
  return (scheduler || Scheduler.async).now()
}