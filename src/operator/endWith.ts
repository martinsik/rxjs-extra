import 'rxjs/add/observable/from';
import { Observable } from 'rxjs/Observable';
import { Operator } from 'rxjs/Operator';
import { Subscriber } from 'rxjs/Subscriber';

export function endWith<T>(this: Observable<T>, ...values: T[]): Observable<T> {
  return this.lift(new EndWithOperator(values));
}

class EndWithOperator<T> implements Operator<T, T> {
  constructor(private values: T[]) {
  }

  public call(subscriber: Subscriber<T>, source: any) {
    return source.subscribe(new EndWithSubscriber(subscriber, this.values));
  }
}

// TODO: Split it
// tslint:disable-next-line:max-classes-per-file
class EndWithSubscriber<T> extends Subscriber<T> {
  constructor(destination: Subscriber<T>, private values: T[]) {
    super(destination);
  }

  protected _complete() {
    const { destination, values } = this;

    // @todo: Implement usign a custom Scheduler similarly to `Observable.from()`?

    const len = values.length;

    for (let i = 0; i < len; i++) {
      destination.next(values[i]);
    }

    super._complete();
  }
}
