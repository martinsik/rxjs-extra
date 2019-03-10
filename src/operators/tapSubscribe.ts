import { MonoTypeOperatorFunction, Observable, defer } from 'rxjs';

export const tapSubscribe =  <T>(callback:  () => void): MonoTypeOperatorFunction<T> =>
  (source: Observable<T>): Observable<T> =>
    defer(() => {
      callback();
      return source;
    });
