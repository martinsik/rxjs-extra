import { Observable } from 'rxjs/Observable';
import { endWith } from '../../operator/endWith';

Observable.prototype.endWith = endWith;

declare module 'rxjs/Observable' {
  interface Observable<T> {
    endWith: typeof endWith;
  }
}
