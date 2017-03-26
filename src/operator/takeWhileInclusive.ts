import { Operator, Observable, Subscriber } from 'rxjs';


export function takeWhileInclusive<T>(this: Observable<T>, predicate: (value: T, index: number) => boolean): Observable<T> {
  return this.lift(new TakeWhileInclusiveOperator(predicate));
}

class TakeWhileInclusiveOperator<T> implements Operator<T, T> {
  constructor(private predicate: (value: T, index: number) => boolean) { }

  call(subscriber: Subscriber<T>, source: any) {
    return source.subscribe(new TakeWhileInclusiveSubscriber(subscriber, this.predicate));
  }
}

class TakeWhileInclusiveSubscriber<T> extends Subscriber<T> {
  private index: number = 0;

  constructor(destination: Subscriber<T>, private predicate: (value: T, index: number) => boolean) {
    super(destination);
  }

  protected _next(value: T): void {
    let result: boolean;

    try {
      result = this.predicate(value, this.index++);
    } catch (e) {
      this.destination.error(e);
      return;
    }

    if (Boolean(result)) {
      this.destination.next(value);
    } else {
      const destination = this.destination;
      destination.next(value);
      destination.complete();
    }
  }
}