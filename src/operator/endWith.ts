import {Observable} from 'rxjs/Observable';
import {Operator} from 'rxjs/Operator';
import {Subscriber} from 'rxjs/Subscriber';
import {Scheduler as IScheduler} from 'rxjs/Scheduler';
import 'rxjs/add/observable/from';

export function endWith<T>(this: Observable<T>, ...values: Array<IScheduler | T>): Observable<T> {
  return this.lift(new EndWithOperator(values));
}

class EndWithOperator<T> implements Operator<T, T> {
  constructor(private values: T[]) {
  }

  call(subscriber: Subscriber<T>, source: any) {
    return source.subscribe(new EndWithSubscriber(subscriber, this.values));
  }
}

class EndWithSubscriber<T> extends Subscriber<T> {
  constructor(destination: Subscriber<T>, private values: T[], private scheduler?: IScheduler) {
    super(destination);
  }

  protected _complete() {
    const {destination, values, scheduler} = this;

    if (scheduler) {
      Observable.from(values, scheduler).subscribe(destination);
    } else {
      const len = values.length;

      for (let i = 0; i < len; i++) {
        destination.next(values[i]);
      }

      super._complete();
    }
  }
}
