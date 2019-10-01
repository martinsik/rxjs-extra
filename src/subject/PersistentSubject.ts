import { BehaviorSubject } from 'rxjs';
import { PersistentStorage, localPersistentStorage } from '../utils/storage';
import { mockStorage } from '../mock/MockPersistentStorage';

const currentStorage = typeof localStorage ? localPersistentStorage : mockStorage

/**
 * Just like `BehaviorSubject` but stores every item in a persistent storage (`LocalStorage` by default).
 */
export class PersistentSubject<T> extends BehaviorSubject<T> {
  private storageKey: string;
  private storage: PersistentStorage<T>;

  constructor(storageKey: string, defaultValue: T, storage: PersistentStorage<T> = currentStorage) {
    const stored = storage.getItem(storageKey);
    const value = stored ? stored : defaultValue;

    super(value);

    this.storage = storage;
    this.storageKey = storageKey;
  }

  next(value: T): void {
    this.storage.setItem(this.storageKey, value);
    super.next(value);
  }
}
