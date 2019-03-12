import { expect } from 'chai';
import { EMPTY, defer } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { hot, cold, time, expectObservable, expectSubscriptions } from '../marble-testing';
import { takeUntilComplete } from '../../src/operators';

declare function asDiagram(arg: string): Function;
declare const rxTestScheduler: TestScheduler;

describe('takeUntilComplete', () => {
  asDiagram('takeUntilComplete(notifier)')('should complete when notifier completes', () => {
    const e1 =       cold('--a--b--c--|');
    const e1subs =        '^      !    ';
    const expected =      '--a--b-|    ';
    const notifier = cold('-------|    ');

    const source = e1.pipe(
      takeUntilComplete(notifier),
    );

    expectObservable(source).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should ignore all next notifications from the notifier', () => {
    const e1 =       cold('--a--b--c--|');
    const e1subs =        '^      !    ';
    const expected =      '--a--b-|    ';
    const notifier = cold('-1--2--|    ');

    const source = e1.pipe(
      takeUntilComplete(notifier),
    );

    expectObservable(source).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should not complete if the notifier doesn\'t complete', () => {
    const e1 =       cold('--a--b--c--');
    const e1subs =        '^          ';
    const expected =      '--a--b--c--';
    const notifier = cold('-1--2------');

    const source = e1.pipe(
      takeUntilComplete(notifier),
    );

    expectObservable(source).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should complete immediately if the notifier is empty without subscribing to its source', () => {
    const e1 =  cold('--a--b--c--');
    const expected = '|';

    let called = false;
    const source = defer(() => {
      called = true;
      return e1;
    }).pipe(
      takeUntilComplete(EMPTY),
    );

    rxTestScheduler.flush();

    expectObservable(source).toBe(expected);
    expect(called).to.be.equal(false);
  });
});
