import { expect } from 'chai';
import { TestScheduler } from 'rxjs/testing';
import { finalize } from 'rxjs/operators';

import { hot, cold, expectObservable, expectSubscriptions } from '../marble-testing';
import { finalizeWithReason, FinalizeReason } from '../../src/operators';

declare function asDiagram(arg: string): Function;
declare const rxTestScheduler: TestScheduler;

describe('finalizeWithReason', () => {
  it('should recognise that the chain disposed because observer unsubscribed', () => {
    const e1 =  cold('---a--b--c--');
    const e1subs =   '^       !';
    const expected = '---a--b--';
    const unsub =    '        !';

    let reason: FinalizeReason;
    const source = e1.pipe(
      finalizeWithReason((r: FinalizeReason) => reason = r),
    );

    expectObservable(source, unsub).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);

    rxTestScheduler.flush();

    expect(reason).to.be.equal(FinalizeReason.Unsubscribe);
  });

  it('should recognise that the chain disposed because it completed', () => {
    const e1 =   hot('---a--b--c--|');
    const e1subs =   '^           !';
    const expected = '---a--b--c--|';

    let reason: FinalizeReason;
    const source = e1.pipe(
      finalizeWithReason((r: FinalizeReason) => reason = r),
    );

    expectObservable(source).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);

    rxTestScheduler.flush();

    expect(reason).to.be.equal(FinalizeReason.Complete);
  });

  it('should recognise that the chain disposed because it errored', () => {
    const e1 =  cold('---a--b--#--|');
    const e1subs =   '^        !';
    const expected = '---a--b--#';

    let reason: FinalizeReason;
    const source = e1.pipe(
      finalizeWithReason((r: FinalizeReason) => reason = r),
    );

    expectObservable(source).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);

    rxTestScheduler.flush();

    expect(reason).to.be.equal(FinalizeReason.Error);
  });

  it('should preserve order of finalize', () => {
    const calls: string[] = [];
    const e1 =  cold('---a--b--c--|');

    const source = e1.pipe(
      finalize(() => calls.push('2')),
      finalizeWithReason((r: FinalizeReason) => calls.push(r)),
      finalize(() => calls.push('1')),
    ).subscribe();

    rxTestScheduler.flush();

    expect(calls).to.be.eql(['1', FinalizeReason.Complete, '2']);
  });
});
