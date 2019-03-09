import { expect } from 'chai';
import { TestScheduler } from 'rxjs/testing';

import { hot, cold, time, expectObservable, expectSubscriptions } from '../marble-testing';
import { randomDelay } from '../../src/operators';
import { createTestNumberGenerator } from '../helpers/numberGenerator';

declare function asDiagram(arg: string): Function;
declare const rxTestScheduler: TestScheduler;

describe('randomDelay', () => {
  asDiagram('randomDelay(0, 50)')('should make random delays between emissions', () => {
    const e1 =  cold('--a--b--c-----|');
    const e1subs =   '^             !';
    const expected = '-----ab-----c-|';

    const source = e1.pipe(
      randomDelay(null, null, createTestNumberGenerator(), rxTestScheduler),
    );

    expectObservable(source).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should delay simultaneous emissions and emit them one after another', () => {
    const e1 =  cold('(abc|)');
    const e1subs =   '(^!)';
    const expected = '---ab---(c|)';

    const source = e1.pipe(
      randomDelay(null, null, createTestNumberGenerator(), rxTestScheduler),
    );

    expectObservable(source).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });
});
