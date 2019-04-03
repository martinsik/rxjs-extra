import { expect } from 'chai';
import { TestScheduler } from 'rxjs/testing';
import { take } from 'rxjs/operators';

import { hot, cold, time, expectObservable, expectSubscriptions } from '../marble-testing';
import { randomTimer } from '../../src';
import { createTestNumberGenerator } from '../helpers/numberGenerator';

declare function asDiagram(arg: string): Function;
declare const rxTestScheduler: TestScheduler;

describe('randomTimer', () => {
  asDiagram('randomTimer(0, 50)')('should emit an ever increasing sequence of indices', () => {
    const expected = '---ab---c-';
    const unsub =    '^--------!';
    const values = { a: 0, b: 1, c: 2 };

    const source = randomTimer(null, null, createTestNumberGenerator(), rxTestScheduler);

    expectObservable(source, unsub).toBe(expected, values);
  });

  it('should properly unsubscribe', () => {
    const expected = '---ab---(c|)';
    const values = { a: 0, b: 1, c: 2 };

    const source = randomTimer(null, null, createTestNumberGenerator(), rxTestScheduler).pipe(
      take(3),
    );

    expectObservable(source).toBe(expected, values);
  });
});
