import { of, Observable, concat, MonoTypeOperatorFunction } from 'rxjs';
import { takeUntil, ignoreElements, tap } from 'rxjs/operators';

export const takeUntilComplete = <T>(notifier: Observable<any>): MonoTypeOperatorFunction<T> =>
  takeUntil(
    concat(
      notifier.pipe(ignoreElements()),
      of(undefined),
    )
  );
