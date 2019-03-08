import { MonoTypeOperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

type ErrorOrErrorFactory = any | (<T>(value: T) => Error);

export const errorWhen = <T>(predicate: (value: T) => boolean, errorOrFactory: ErrorOrErrorFactory = new Error()): MonoTypeOperatorFunction<T> =>
  map((value: T): T => {
    if (predicate(value)) {
      throw typeof errorOrFactory === 'function' ? errorOrFactory(value) : errorOrFactory;
    }
    return value;
  });
