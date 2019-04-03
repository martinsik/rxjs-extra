import { expect } from 'chai';

import { PersistentSubject } from '../../src';
import { mockStorage, MOCK_DEFAULT_KEY, MOCK_DEFAULT_VALUE } from '../../src/mock/MockPersistentStorage';

describe('PersistentSubject', () => {
  it('should use the default value when there\'s no storaged value', () => {
    const s = new PersistentSubject('non-existent-key', MOCK_DEFAULT_VALUE, mockStorage);

    let value: number = null;
    s.subscribe(v => value = v);

    expect(value).to.be.equal(MOCK_DEFAULT_VALUE);
  });

  it('should emit when the value is in the storage', () => {
    const s = new PersistentSubject(MOCK_DEFAULT_KEY, null, mockStorage);

    let value: number = null;
    s.subscribe(v => value = v);

    expect(value).to.be.equal(MOCK_DEFAULT_VALUE);
  });

  it('should not emit after receiving complete', () => {
    const s = new PersistentSubject(MOCK_DEFAULT_KEY, null, mockStorage);
    s.complete();

    let called: boolean = false;
    s.subscribe(v => called = true);

    expect(called).to.be.equal(false);
  });

  it('should not emit after receiving error', () => {
    const s = new PersistentSubject(MOCK_DEFAULT_KEY, null, mockStorage);
    s.error(`it's broken`);

    let called: boolean = false;
    s.subscribe({
      next: v => called = true,
      error: () => void 0,
    });

    expect(called).to.be.equal(false);
  });

  it('should store every next notification', () => {
    const newValue = 'new-val';
    const s = new PersistentSubject(MOCK_DEFAULT_KEY, null, mockStorage);

    s.next(newValue);

    expect(mockStorage.getItem(MOCK_DEFAULT_KEY)).to.be.equal(newValue);
  });

  it('should remember every next emission and re-emit it after unsubscribing all subscribers', () => {
    const newValue = 'new-val-1';
    const s = new PersistentSubject(MOCK_DEFAULT_KEY, null, mockStorage);

    s.subscribe();
    s.next(newValue);

    expect(mockStorage.getItem(MOCK_DEFAULT_KEY)).to.be.equal(newValue);

    let value: string = null;
    s.subscribe(v => value = v);

    expect(value).to.be.equal(newValue);
  });
});
