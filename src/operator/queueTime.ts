import {Operator, Observable, Subscriber, Subscription, Scheduler} from 'rxjs';
import {PartialObserver} from 'rxjs/Observer';
import {Action} from 'rxjs/scheduler/Action';
import {Scheduler as SchedulerI} from 'rxjs/Scheduler';


export function queueTime<T>(this: Observable<T>, delay: number, scheduler: SchedulerI = Scheduler.async): Observable<T> {
  return this.lift(new QueueTimeOperator(delay, scheduler));
}

class QueueTimeOperator<T> implements Operator<T, T> {
  constructor(private windowTime: number, private scheduler?: SchedulerI) {
  }

  call(subscriber: Subscriber<T>, source: any) {
    return source.subscribe(new QueueTimeSubscriber(subscriber, this.windowTime, this.scheduler));
  }
}

class QueueTimeSubscriber<T> extends Subscriber<T> {
  private scheduledAction: Subscription;
  private lastEmissionTime: number = null;
  private buffer: T[] = [];

  constructor(destination: Subscriber<T>, private delay: number, private scheduler?: SchedulerI) {
    super(destination);
  }

  _next(value?: T): void {
    const {scheduler, delay} = this;

    const now = scheduler.now();
    const sinceLastEmission = now - this.lastEmissionTime;

    if (this.lastEmissionTime === null || sinceLastEmission > delay) {
      this.lastEmissionTime = scheduler.now();
      this.destination.next(value);

      return;
    }

    this.buffer.push(value);

    if (!this.scheduledAction) {
      this.scheduleBufferEmission(sinceLastEmission > delay ? delay : delay - sinceLastEmission);
    }
  }

  private scheduleBufferEmission(time: number) {
    const {destination, delay, buffer, scheduler} = this;

    const state: QueueTimeScheduledState<T> = {
      delay,
      destination,
      buffer,
      scheduler: this.scheduler,
      clear: this.clearScheduledAction.bind(this),
      isStopped: this.checkStopped.bind(this),
      storeLastEmissionTime: this.storeLastEmissionTime.bind(this),
      complete: this.doComplete.bind(this)
    };

    this.scheduledAction = scheduler.schedule(this.emitScheduledBuffer, time, state);
  }

  private emitScheduledBuffer(state: QueueTimeScheduledState<T>): void {
    const {destination, delay, buffer, clear, isStopped, storeLastEmissionTime, scheduler, complete} = state;

    destination.next(buffer.shift());

    if (isStopped() && buffer.length === 0) {
      complete();
      return;
    }

    storeLastEmissionTime(scheduler.now());

    if (buffer.length === 0) {
      clear();
    } else {
      (<Action<QueueTimeScheduledState<T>>>(<any>this)).schedule(state, delay);
    }
  }

  private checkStopped(): boolean {
    return this.isStopped;
  }

  private storeLastEmissionTime(now): void {
    this.lastEmissionTime = now;
  }

  private clearScheduledAction(): void {
    this.scheduledAction = null;
  }

  private doComplete() {
    super._complete();
  }

  protected _complete() {
    if (this.buffer.length === 0) {
      this.doComplete();
    }
  }
}

type QueueTimeScheduledState<T> = {
  delay: number;
  destination: PartialObserver<T>;
  buffer: T[];
  scheduler: SchedulerI;
  clear: Function;
  isStopped: Function;
  storeLastEmissionTime: Function;
  complete: Function;
}