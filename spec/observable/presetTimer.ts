import { expect } from 'chai';
import { of, defer } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';

import { hot, cold, expectObservable, expectSubscriptions } from '../marble-testing';
import { FinalizeReason, tapSubscribe } from "../../src/operators";

declare function asDiagram(arg: string): Function;
declare const rxTestScheduler: TestScheduler;

describe.only('presetTimer', () => {
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

    expect(called).to.be.true;
  });
});