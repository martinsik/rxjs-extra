import { expect } from 'chai';
import { hot, cold, expectObservable, expectSubscriptions } from '../marble-testing';
import { finalizeWithReason, FinalizeReason } from '../../src/operators';
import { TestScheduler } from "../../.rxjs-repo/src/internal/testing/TestScheduler";

declare function asDiagram(arg: string): Function;

declare const rxTestScheduler: TestScheduler;

describe('finalizeWithReason', () => {
  asDiagram('finalizeWithReason((reason) => void)')('should recognise that the chain disposed because observer unsubscribed', () => {
    const e1 =  cold('---a--b--c--');
    const e1subs =   '^       !';
    const expected = '---a--b--';
    const unsub =    '        !';

    let reason: FinalizeReason;
    const source = e1.pipe(
      finalizeWithReason((r: FinalizeReason) => {
        reason = r;
      }),
    );
    
    expectObservable(source, unsub).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);

    rxTestScheduler.flush();

    expect(reason).to.be.equal(FinalizeReason.Unsubscribe);
  });
});
