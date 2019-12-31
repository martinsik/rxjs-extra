import { TestScheduler } from 'rxjs/testing';

import { hot, cold, time, expectObservable, expectSubscriptions } from '../marble-testing';
import { distinctTime, resetTime } from '../../src/operators';

declare function asDiagram(arg: string): Function;
declare const rxTestScheduler: TestScheduler;

describe('distinctTime', () => {
  asDiagram(`distinctTime(50)`)('should re-emit duplicate values after set time span', () => {
    const e1 =  cold('-a-ab--a--|');
    const e1sub =    '^         !';
    const expected = '-a--b--a--|';
    const t =   time('-----|');

    const source = e1.pipe(
      distinctTime(t, undefined, rxTestScheduler),
    );

    expectObservable(source).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1sub);
  });

  it('should create windows independently on whether the source is emitting', () => {
    const e1 =  cold('----aa--|');
    const e1sub =    '^       !';
    const expected = '----aa--|';
    const t =   time('-----|');

    const source = e1.pipe(
      distinctTime(t, undefined, rxTestScheduler),
    );

    expectObservable(source).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1sub);
  });

  it('should complete immediately when source completes', () => {
    const e1 =  cold('|');
    const e1sub =    '(^!)';
    const expected = '|';
    const t =   time('-----|');

    const source = e1.pipe(
      distinctTime(t, undefined, rxTestScheduler),
    );

    expectObservable(source).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1sub);
  });

  it('should pass through error notification', () => {
    const error = new Error(`It's broken`);
    const e1 =  cold('-a-a#', undefined, error);
    const e1sub =    '^   !';
    const expected = '-a--#';
    const t =   time('-----|');

    const source = e1.pipe(
      distinctTime(t, undefined, rxTestScheduler),
    );

    expectObservable(source).toBe(expected, undefined, error);
    expectSubscriptions(e1.subscriptions).toBe(e1sub);
  });

  it('should accept key selector method', () => {
    const e1 =  cold('-a-ab--a--|');
    const e1sub =    '^         !';
    const expected = '-a--b--a--|';
    const t =   time('-----|');

    const source = e1.pipe(
      distinctTime(t, (v) => v + 'x', rxTestScheduler),
    );

    expectObservable(source).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1sub);
  });
});
