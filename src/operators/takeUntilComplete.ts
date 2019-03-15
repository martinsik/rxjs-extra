import { of, Observable, concat, MonoTypeOperatorFunction } from 'rxjs';
import { takeUntil, ignoreElements, tap } from 'rxjs/operators';

/**
 * Just like `takeUntil()` but completes only when the notifier completes and ignores all `next` notifications.
 *
 * @param notifier
 */
export const takeUntilComplete = <T>(notifier: Observable<any>): MonoTypeOperatorFunction<T> =>
  takeUntil(
    concat(
      notifier.pipe(ignoreElements()),
      of(undefined),
    )
  );
