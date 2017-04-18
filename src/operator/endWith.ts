import { Observable, Operator, Subscriber } from 'rxjs';
import { Scheduler as IScheduler } from 'rxjs/Scheduler';


export function endWith<T>(this: Observable<T>, ...values: Array<IScheduler | T>): Observable<T> {
  // check if the last parameter is a Scheduler
  const len = values.length;
  let scheduler = null;
  if (values[len - 1] instanceof IScheduler) {
    scheduler = values[len - 1];
    values.pop();
  }
  return this.lift(new EndWithOperator(values, scheduler));
}

class EndWithOperator<T> implements Operator<T, T> {
  constructor(private values: T[], private scheduler?: IScheduler) { }

  call(subscriber: Subscriber<T>, source: any) {
    return source.subscribe(new EndWithSubscriber(subscriber, this.values));
  }
}

class EndWithSubscriber<T> extends Subscriber<T> {
  constructor(destination: Subscriber<T>, private values: T[], private scheduler?: IScheduler) {
    super(destination);
  }

  protected _complete() {
    const { destination, values, scheduler } = this;

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
