import "rxjs/add/observable/of";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/map";
import "rxjs/add/operator/publishReplay";
import "rxjs/add/operator/take";
import "rxjs/add/operator/timestamp";
import { Observable } from "rxjs/Observable";
import { Scheduler as Scheduler } from "rxjs/Scheduler";
import { async as asyncScheduler } from "rxjs/scheduler/async";
import "../add/operator/takeWhileInclusive";

class CaughtError {
  constructor(public error: any) {
  }
}

export enum CacheMode {
  Default = 1,
  TolerateExpired,
  SilentRefresh,
}

export interface CacheOptions {
  catchErrors?: boolean;
  mode?: CacheMode;
}

export function cache<T>(this: Observable<T>, windowTime: number,
                         options: CacheOptions = {}, scheduler?: Scheduler): Observable<T> {
  if (!options) {
    options = {} as CacheOptions;
  }
  options.catchErrors = typeof options.catchErrors === "undefined" ? true : options.catchErrors;
  options.mode = options.mode || CacheMode.Default;

  let observable = this;
  if (options.catchErrors) {
    observable = this.catch((err) => Observable.of(new CaughtError(err))) as Observable<any>;
  }

  if (options.mode === CacheMode.SilentRefresh) {
    observable = observable
      .timestamp(scheduler)
      .publishReplay(1, Number.POSITIVE_INFINITY, scheduler)
      .refCount()
      .takeWhileInclusive((item, i) => {
        if (i === 0) { // check only the first item whether it's still valid
          return getNow(scheduler) > item.timestamp + windowTime;
        }
        // the second item always needs to be the last one
        return false;
      })
      .filter((item, i) => i === 0) // always pass only the first item
      .map((item) => item.value);

  } else if (options.mode === CacheMode.TolerateExpired) {
    observable = observable
      .timestamp(scheduler)
      .publishReplay(1, Number.POSITIVE_INFINITY, scheduler)
      .refCount()
      .takeWhileInclusive((item) => {
        // check whether the cached item is still valid
        return getNow(scheduler) > item.timestamp + windowTime;
      })
      .map((item) => item.value);

  } else {
    observable = observable
      .publishReplay(1, windowTime, scheduler)
      .refCount()
      .take(1);
  }

  if (options.catchErrors) {
    observable = observable.map((item) => {
      if (item instanceof CaughtError) {
        throw item.error;
      }
      return item;
    });
  }

  return observable as Observable<T>;
}

function getNow(scheduler: Scheduler): number {
  return (scheduler || asyncScheduler).now();
}
