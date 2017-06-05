import {Observable} from 'rxjs/Observable';
import {rateLimit} from '../../operator/rateLimit';

Observable.prototype.rateLimit = rateLimit;

declare module 'rxjs/Observable' {
  interface Observable<T> {
    rateLimit: typeof rateLimit;
  }
}