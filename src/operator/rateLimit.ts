import { Operator, Observable, Subscriber, Subscription, Scheduler } from 'rxjs';
import { Scheduler as SchedulerI } from 'rxjs/Scheduler';


export function rateLimit<T>(this: Observable<T>, count: number, timeWindow: number, scheduler: SchedulerI = Scheduler.async): Observable<T> {
  return this.lift(new RateLimitOperator(count, timeWindow, scheduler));
}

class RateLimitOperator<T> implements Operator<T, T> {
  constructor(private count: number, private timeWindow: number, private scheduler: SchedulerI) { }

  call(subscriber: Subscriber<T>, source: any) {
    return source.subscribe(new RateLimitSubscriber(subscriber, this.count, this.timeWindow, this.scheduler));
  }
}

class RateLimitSubscriber<T> extends Subscriber<T> {
  private buffer: T[] = [];
  private lastEmission: number;
  private scheduledAction: Subscription;

  constructor(destination: Subscriber<T>, private count: number, private timeWindow: number, private scheduler: SchedulerI) {
    super(destination);
  }

  _next(value: T) {
    const { destination, count, timeWindow, buffer, scheduledAction, scheduler } = this;

    buffer.push(value);

    // if (scheduledAction) {
    //   scheduledAction.unsubscribe();
    // }

    this.scheduledAction = scheduler.schedule(() => {
      let splice = this.buffer.splice(0, 10);

      destination.next(splice);


    }, timeWindow);
  }

}