import { Observable } from 'rxjs/Observable';
import { takeWhileInclusive } from '../../operator/takeWhileInclusive';

Observable.prototype.takeWhileInclusive = takeWhileInclusive;

declare module 'rxjs/Observable' {
  interface Observable<T> {
    takeWhileInclusive: typeof takeWhileInclusive;
  }
}