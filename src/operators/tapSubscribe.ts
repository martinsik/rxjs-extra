import { MonoTypeOperatorFunction, Observable, defer } from 'rxjs';
import { tap } from 'rxjs/operators';

type callbackFn = () => void;

export const tapSubscribe =  <T>(callback: callbackFn): MonoTypeOperatorFunction<T> =>
  (source: Observable<T>): Observable<T> =>
    defer(() => {
      callback();
      return source;
    });
