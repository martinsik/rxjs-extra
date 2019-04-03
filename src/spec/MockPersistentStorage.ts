import { PersistentStorage } from '../../src/utils/storage';

export const MOCK_DEFAULT_KEY = 'mock-key';
export const MOCK_DEFAULT_VALUE = 'default-value';

class MockPersistentStorage implements PersistentStorage<any> {
  private storate: { [key: string]: any } = {};

  constructor(storateStorage: any = {}) {
    this.storate = storateStorage;
  }

  getItem(key: string): any {
    return this.storate[key];
  }

  setItem(key: string, value: any): boolean {
    this.storate[key] = value;
    return true;
  }
}

export const mockStorage = new MockPersistentStorage({
  [MOCK_DEFAULT_KEY]: MOCK_DEFAULT_VALUE,
});
