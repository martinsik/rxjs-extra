import { MonoTypeOperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

type ErrorOrErrorFactory = any | (<T>(value: T) => any);

/**
 * Emits an `error` notification when a value matches the predicate function.
 * If value matches predicate `errorWhen` will emit an error based on `errorOrFactory` parameter.
 *
 * @param predicate
 * @param errorOrFactory An object or a function used to generate error objects
 */
export const errorWhen = <T>(predicate: (value: T) => boolean, errorOrFactory: ErrorOrErrorFactory = new Error()): MonoTypeOperatorFunction<T> =>
  map((value: T): T => {
    if (predicate(value)) {
      throw typeof errorOrFactory === 'function' ? errorOrFactory(value) : errorOrFactory;
    }
    return value;
  });
