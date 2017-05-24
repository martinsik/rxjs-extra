import { Observable } from 'rxjs/Observable';
import { queueTime } from '../../operator/queueTime';

Observable.prototype.queueTime = queueTime;

declare module 'rxjs/Observable' {
    interface Observable<T> {
        queueTime: typeof queueTime;
    }
}