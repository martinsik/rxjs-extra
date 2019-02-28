import { Observable } from 'rxjs/Observable';
import { cache } from '../../operator/cache';

Observable.prototype.cache = cache;

declare module 'rxjs/Observable' {
  interface Observable<T> {
    cache: typeof cache;
  }
}
