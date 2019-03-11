import { expect } from 'chai';
import { of, defer } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';

import { hot, cold, expectObservable, expectSubscriptions } from '../marble-testing';
import { FinalizeReason, tapSubscribe } from '../../src/operators';

declare const rxTestScheduler: TestScheduler;

describe('tapSubscribe', () => {
  it('should invoke handler when a new observer subscribes', () => {
    const e1 =  cold('---a--b--c-|');
    const e1subs =   '^          !';
    const expected = '---a--b--c-|';

    let called = false;
    const source = e1.pipe(
      tapSubscribe(() => called = true),
    );

    expectObservable(source).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);

    rxTestScheduler.flush();

    expect(called).to.be.equal(true);
  });

  it('should invoke callback before emiting any next notifications', () => {
    const calls: number[] = [];

    defer(() => {
      calls.push(2);
      return of(undefined);
    }).pipe(
      tapSubscribe(() => calls.push(1)),
      finalize(() => calls.push(4)),
    ).subscribe(() => calls.push(3));

    expect(calls).to.be.eql([1, 2, 3, 4]);
  });

  it('should invoke multiple tapSubscribe operators in bottom-up order', () => {
    const calls: number[] = [];

    of(undefined).pipe(
      tapSubscribe(() => calls.push(3)),
      tapSubscribe(() => calls.push(2)),
      tapSubscribe(() => calls.push(1)),
    ).subscribe();

    expect(calls).to.be.eql([1, 2, 3]);
  });

  it('should invoke the callback for every observer', () => {
    let calls = 0;

    const source = of(undefined).pipe(
      tapSubscribe(() => calls++),
    );

    source.subscribe();
    source.subscribe();

    expect(calls).to.be.equal(2);
  });

  it('should invoke the callback for every observer when source is a hot Observables', () => {
    const e1 = hot('---a--b--c--');

    let calls = 0;
    const source = e1.pipe(
      tapSubscribe(() => calls++),
    );

    source.subscribe();
    source.subscribe();

    expect(calls).to.be.equal(2);
  });
});
