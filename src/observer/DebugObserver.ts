import { Subscriber, SchedulerLike } from "rxjs";
import { schedulerNow } from "../utils/now";

/**
 * Observer for debugging purposes. It timestamps each notification with time offset since the instance was created.
 */
export class DebugObserver<T> extends Subscriber<T> {
  private start = schedulerNow(this.scheduler);

  private get timeSinceStart(): number {
    return schedulerNow(this.scheduler) - this.start;
  }

  /**
   * @param identifier An identifier used in the header of each log.
   * @param logger Function used to log each message.
   * @param scheduler
   */
  constructor(private identifier: string, private logger = console.debug, private scheduler?: SchedulerLike) {
    super(
      v => this.log('N', v),
      e => this.log('E', e),
      () => this.logComplete('C'),
    );
  }

  private messageTag(notificationType: string): string {
    return `[${this.identifier}]${notificationType}@${padWithZeroes(this.timeSinceStart, 7)}:`;
  }

  private log(notificationType: string, value?: any): void {
    this.logger(this.messageTag(notificationType), value);
  }

  private logComplete(notificationType: string): void {
    this.logger(this.messageTag(notificationType));
  }
}

const padWithZeroes = (number: number, length: number) => {
  let myString = number.toString();
  while (myString.length < length) {
    myString = ' ' + myString;
  }

  return myString;
};
