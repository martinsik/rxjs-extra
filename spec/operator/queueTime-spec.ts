import { expect } from 'chai';

import { hot, cold, time, expectObservable, expectSubscriptions } from '../marble-testing';
import { queueTime } from '../../src/operators';
import { TestScheduler } from "rxjs/testing";

declare function asDiagram(arg: string): Function;
declare const rxTestScheduler: TestScheduler;

describe('queueTime', () => {
  asDiagram('queueTime(50)')('should make equal delays between emissions', () => {
    //                x-----     xx-----     -----
    //                      -----       -----     -----
    const e1 =   hot('-1--2--------3-45------6--|');
    const expected = '-1----2------3----4----5----(6|)';
    const e1subs =   '^                         !';
    const t =   time('-----|');

    const source = e1.pipe(
      queueTime(t, rxTestScheduler),
    );

    expectObservable(source).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should not delay item when long delay between emissions', () => {
    //                -----     xxx-----     xx-----
    //                     -----        -----       -----
    const e1 =   hot('1------------2-----------3----|');
    const expected = '1------------2-----------3----|';
    const e1subs =   '^                             !';
    const t =   time('-----|');

    const source = e1.pipe(
      queueTime(t, rxTestScheduler),
    );

    expectObservable(source).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should complete when the source is empty', () => {
    const e1 =   hot('--|');
    const expected = '--|';
    const e1subs =   '^ !';
    const t =   time('-----|');

    const source = e1.pipe(
      queueTime(t, rxTestScheduler),
    );

    expectObservable(source).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should propagate error immediately', () => {
    const err = new Error();
    const e1 =   hot('1-23--#', undefined, err);
    const expected = '1-----#';
    const e1subs =   '^     !';
    const t =   time('----------|');

    const source = e1.pipe(
      queueTime(t, rxTestScheduler),
    );

    expectObservable(source).toBe(expected, undefined, err);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should make equal delay when source emitting too fast', () => {
    const e1 =   hot('1234567|');
    const expected = '1----2----3----4----5----6----(7|)';
    const e1subs =   '^      !';
    const t =   time('-----|');

    const source = e1.pipe(
      queueTime(t, rxTestScheduler),
    );

    expectObservable(source).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });
});
