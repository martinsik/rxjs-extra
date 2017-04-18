import { Operator, Observable, Subscriber, Subscription, Scheduler } from 'rxjs';
import { PartialObserver } from 'rxjs/Observer';
import { Action } from 'rxjs/scheduler/Action';
import { Scheduler as SchedulerI } from 'rxjs/Scheduler';


export function rateLimit<T>(this: Observable<T>, count: number, timeWindow: number, scheduler: SchedulerI = Scheduler.async): Observable<T[]> {
  return this.lift(new RateLimitOperator(count, timeWindow, scheduler));
}

class RateLimitOperator<T> implements Operator<T, T[]> {
  constructor(private count: number, private timeWindow: number, private scheduler: SchedulerI) { }

  call(subscriber: Subscriber<T[]>, source: any) {
    return source.subscribe(new RateLimitSubscriber(subscriber, this.count, this.timeWindow, this.scheduler));
  }
}

class RateLimitSubscriber<T> extends Subscriber<T> {
  private buffer: T[] = [];
  private lastEmission: number;
  private scheduledAction: Subscription;

  constructor(destination: Subscriber<T[]>, private count: number, private timeWindow: number, private scheduler: SchedulerI) {
    super(destination);
  }

  private emitScheduledBuffer(state: RateLimitScheduledState<T>): void {
    const { destination, count, timeWindow, buffer, clear, isStopped } = state;

    let chunk = buffer.splice(0, count);
    destination.next(chunk);

    if (isStopped() && buffer.length === 0) {
      destination.complete();
      return;
    }

    if (buffer.length === 0) {
      clear();
    } else {
      (<Action<RateLimitScheduledState<T>>>(<any>this)).schedule(state, timeWindow);
    }
  }

  private clearScheduledAction() {
    this.scheduledAction = null;
  }

  private checkStopped() {
    return this.isStopped;
  }

  _next(value: T): void {
    const { destination, count, timeWindow, buffer, scheduledAction, scheduler } = this;

    buffer.push(value);

    if (this.scheduledAction) {
      return;
    }

    const state: RateLimitScheduledState<T> = {
      timeWindow,
      count,
      destination,
      buffer,
      clear: this.clearScheduledAction.bind(this),
      isStopped: this.checkStopped.bind(this),
    };

    this.scheduledAction = scheduler.schedule(this.emitScheduledBuffer, timeWindow, state);
  }

  _complete() {
    const { buffer } = this;
    if (buffer.length === 0) {
      super._complete();
    }
  }

}

type RateLimitScheduledState<T> = {
  timeWindow: number;
  count: number;
  destination: PartialObserver<T[]>;
  buffer: T[];
  clear: Function;
  isStopped: Function;
}