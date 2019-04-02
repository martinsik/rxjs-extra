export interface PersistentStorage<T> {
  setItem(key: string, value: T): boolean;
  getItem(key: string): T;
}

export class LocalStoragePersistentStorage<T> {
  setItem(key: string, value: T): boolean {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  }

  getItem(key: string): T {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  }
}

export const localPersistentStorage = new LocalStoragePersistentStorage<any>();
