import { merge, MonoTypeOperatorFunction, of, OperatorFunction, SchedulerLike } from 'rxjs';
import { switchMap, delay, map } from 'rxjs/operators';

type ResetWithFunc = <T, N>(value: T | N) => N;

export function resetTime<T>(resetDelay: number, resetWith: T | ((v: T) => T), scheduler?: SchedulerLike): MonoTypeOperatorFunction<T>;

export function resetTime<T, N>(
  resetDelay: number,
  resetWith: N | ResetWithFunc,
  scheduler?: SchedulerLike
): OperatorFunction<T, T | N> {
  let resetWithGenerator: ResetWithFunc;
  if (resetWith instanceof Function) {
    resetWithGenerator = resetWith;
  } else {
    resetWithGenerator = (() => resetWith) as ResetWithFunc;
  }

  return switchMap(v => merge(
    of(v),
    of(null).pipe(
      delay(resetDelay, scheduler),
      map(() => resetWithGenerator(v)),
    ),
  ));
}
