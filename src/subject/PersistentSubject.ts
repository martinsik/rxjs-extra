import { Subject, Subscriber, Subscription, SubscriptionLike } from 'rxjs';
import { localPersistentStorage, PersistentStorage } from '../utils/storage';

class PersistentSubject<T> extends Subject<T> {
  private value: T;

  constructor(private storageKey: string, private storage: PersistentStorage<T> = localPersistentStorage, defaultValue: T) {
    super();

    const stored = storage.getItem(this.storageKey);
    this.value = stored ? stored : defaultValue;
  }

  _subscribe(subscriber: Subscriber<T>): Subscription {
    const subscription = super._subscribe(subscriber);
    if (subscription && !(<SubscriptionLike>subscription).closed) {
      subscriber.next(this.value);
    }
    return subscription;
  }

  next(value: T): void {
    this.storage.setItem(this.storageKey, value);
    super.next(this.value = value);
  }
}
