import { expect } from 'chai';
import { defer } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { map, tap, repeatWhen, mergeMapTo } from 'rxjs/operators';

import { hot, cold, time, expectObservable, expectSubscriptions } from '../marble-testing';
import { cache, CacheMode } from '../../src/operators';

declare function asDiagram(arg: string): Function;
declare const rxTestScheduler: TestScheduler;

// @todo: rework these tests when RxJS supports creating multiple subscriptions as different times.
describe('cache', () => {

  function createSource() {
    let counter = 0;

    return defer(() => cold('-(v|)', {'v': String.fromCharCode(97 + counter)}).pipe(
      tap(() => counter++)),
    );
  }

  asDiagram('cache(50)')('should cache the items for 50 time window', () => {
    //                  a -----
    //                  b      -----
    //                  c           -----
    const t = time('-----|');
    const notifier = hot('---1--2-34--5--');
    const expected1 =    '-a-a---bbb---c-';

    const source = createSource().pipe(
      cache(t, undefined, rxTestScheduler),
    );

    expectObservable(source.pipe(
      repeatWhen(() => notifier))
    ).toBe(expected1);
  });

  it('should propagate the error when source emits error by default', () => {
    //                  a -----
    //                  b      -----
    const err = new Error();
    const t =       time('-----|');
    const notifier = hot('------1-');
    const expected1 =    '-a-----#';
    const source = createSource().pipe(
      map(item => {
        if (item === 'b') {
          throw err;
        }
        return item;
      }),
      cache(t, undefined, rxTestScheduler),
    );

    expectObservable(source.pipe(
      repeatWhen(() => notifier),
    )).toBe(expected1, undefined, err);
  });

  it('should send complete when requesting a single value', () => {
    const source = cold('--(a|)');
    const t =      time('-----|');
    const e1 =          '--(a|)';
    const e1sub =       '^-!';
    const cached = source.pipe(
      cache(t, undefined, rxTestScheduler),
    );

    expectObservable(cached).toBe(e1);
    expectSubscriptions(source.subscriptions).toBe(e1sub);
  });

  it("shouldn't emit anything if the source doesn't emit", () => {
    const source = cold('----');
    const t =      time('-----|');
    const e1 =          '----';
    const e1sub =       '^---';
    const cached = source.pipe(
      cache(t, undefined, rxTestScheduler),
    );

    expectObservable(cached).toBe(e1);
    expectSubscriptions(source.subscriptions).toBe(e1sub);
  });

  it('should emit when the source takes longer that the time window', () => {
    const source = cold('---------a');
    const t =      time('-----|');
    const e1 =          '---------(a|)';
    const e1sub =       '^--------!';
    const cached = source.pipe(
      cache(t, undefined, rxTestScheduler),
    );

    expectObservable(cached).toBe(e1);
    expectSubscriptions(source.subscriptions).toBe(e1sub);
  });

  it('should emit the same value to multiple observers withing the same time window', () => {
    //                  a -----
    //                  b      -----
    const notifier = hot('------1---');
    const e3 =           '-a-----b--';
    const t =       time('-----|');
    const e1 =           '-(a|)';
    const e2 =           '-(a|)';
    const cached = createSource().pipe(
      cache(t, undefined, rxTestScheduler),
    );

    expectObservable(cached).toBe(e1);
    expectObservable(cached).toBe(e2);
    expectObservable(cached.pipe(
      repeatWhen(() => notifier),
    )).toBe(e3);
  });

  it('should emit the same error to multiple observers withing the same time window', () => {
    const err = new Error();
    const t = time('-----|');
    const e1 =     '-#';
    const e2 =     '-#';
    const source = createSource().pipe(
      map(item => {
        if (item === 'a') {
          throw err;
        }
        return item;
      }),
      cache(t, undefined, rxTestScheduler),
    );

    expectObservable(source).toBe(e1, undefined, err);
    expectObservable(source).toBe(e2, undefined, err);
  });

  it('should emit one or two items when tolerating the expired items', () => {
    //                  a -----
    //                  b      -----
    const notifier = hot('---1---2--');
    const expected1 =    '-a-a---ab-';

    const t = time('-----|');
    const source = createSource().pipe(
      cache(t, CacheMode.TolerateExpired, rxTestScheduler),
    );

    expectObservable(source.pipe(
      repeatWhen(() => notifier)),
    ).toBe(expected1);
  });

  it('should emit two items when tolerating the expired items', () => {
    //                  a -----
    //                  b      -----
    const notifier = hot('-------1--');
    const expected1 =    '-a-----ab-';
    const t = time('-----|');
    const source = createSource().pipe(
      cache(t, CacheMode.TolerateExpired, rxTestScheduler),
    );

    expectObservable(source.pipe(
      repeatWhen(() => notifier)),
    ).toBe(expected1);
  });

  it('should emit one item and silently refresh', () => {
    const t = time('-----|');
    const source = createSource().pipe(
      cache(t, CacheMode.Default, rxTestScheduler),
    );

    //                       -----     -----     -----
    //                            -----     -----
    const notifier = hot('-1---1---------1-');
    const expected =     '-a---a----------b';

    expectObservable(source.pipe(
      repeatWhen(() => notifier)),
    ).toBe(expected);
  });

  // it('should complete properly after emitting cache', () => {
  //
  // });
});
