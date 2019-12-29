import { TestScheduler } from 'rxjs/testing';

import { hot, cold, time, expectObservable, expectSubscriptions } from '../marble-testing';
import { resetTime } from '../../src/operators';

declare function asDiagram(arg: string): Function;
declare const rxTestScheduler: TestScheduler;

describe('resetTime', () => {
  asDiagram(`resetTime(20, 'x')`)('should emit reset value after every emission from source', () => {
    const e1 =  cold('-a---bc--|');
    const e1sub =    '^        !';
    const expected = '-a-x-bc-x|';
    const t = time('--|');

    const source = e1.pipe(
      resetTime(t, 'x', rxTestScheduler),
    );

    expectObservable(source).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1sub);
  });

  it('should delay complete notification', () => {
    const e1 =  cold('-a-|');
    const e1sub =    '^  !';
    const expected = '-a----(x|)';
    const t = time('-----|');

    const source = e1.pipe(
      resetTime(t, 'x', rxTestScheduler),
    );

    expectObservable(source).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1sub);
  });

  it('should discard scheduled next notification when source emits too fast', () => {
    const e1 =  cold('-a--b---(cde|)');
    const e1sub =    '^       !';
    const expected = '-a--b---(cde)(x|)';
    const t = time('-----|');

    const source = e1.pipe(
      resetTime(t, 'x', rxTestScheduler),
    );

    expectObservable(source).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1sub);
  });

  it('should call "resetWith" function', () => {
    const e1 =  cold('-a---b--|');
    const e1sub =    '^       !';
    const expected = '-a-x-b-y|';
    const t = time('--|');

    const source = e1.pipe(
      resetTime(t, (v) => v + 'x', rxTestScheduler),
    );

    expectObservable(source).toBe(expected, {
      a: 'a',
      b: 'b',
      x: 'ax',
      y: 'bx'
    });
    expectSubscriptions(e1.subscriptions).toBe(e1sub);
  });

  it('should error immediately when source errors', () => {
    const error = new Error(`It's broken`);
    const e1 =  cold('-a-#', undefined, error);
    const e1sub =    '^  !';
    const expected = '-a-#';
    const t = time('-----|');

    const source = e1.pipe(
      resetTime(t, 'x', rxTestScheduler),
    );

    expectObservable(source).toBe(expected, undefined, error);
    expectSubscriptions(e1.subscriptions).toBe(e1sub);
  });

  it('should error immediately when "resetWith" function throws exception', () => {
    const e1 =  cold('-a-|');
    const e1sub =    '^  !';
    const expected = '-a----#';
    const t = time('-----|');
    const error = new Error(`It's broken`);

    const source = e1.pipe(
      resetTime(t, () => {
        throw error;
      }, rxTestScheduler),
    );

    expectObservable(source).toBe(expected, undefined, error);
    expectSubscriptions(e1.subscriptions).toBe(e1sub);
  });

  it('should complete immediately with EMPTY source', () => {
    const e1 =  cold('|');
    const e1sub =    '(^!)';
    const expected = '|';
    const t = time('-----|');

    const source = e1.pipe(
      resetTime(t, 'x', rxTestScheduler),
    );

    expectObservable(source).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1sub);
  });
});
