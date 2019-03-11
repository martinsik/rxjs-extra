import { expect } from 'chai';
import { TestScheduler } from 'rxjs/testing';

import { hot, cold, time, expectObservable } from '../marble-testing';
import { presetTimer } from '../../src';

declare function asDiagram(arg: string): Function;
declare const rxTestScheduler: TestScheduler;

describe('presetTimer', () => {
  asDiagram('presetTimer([10, 40, 20, 30])')('should make different delays based on its params', () => {
    const expected = '-a---b-c--(d|)';
    const values = { a: 0, b: 1, c: 2, d: 3 };
    const source = presetTimer([10, 40, 20, 30], rxTestScheduler);

    expectObservable(source).toBe(expected, values);
  });

  it('should emit immediately with 0 delay', () => {
    const expected = '(a|)';
    const values = { a: 0 };
    const source = presetTimer([0], rxTestScheduler);

    expectObservable(source).toBe(expected, values);
  });

  it('should asynchronously emit values scheduled at the same time', () => {
    const expected = 'a(bcd|)';
    const values = { a: 0, b: 1, c: 2, d: 3 };
    const source = presetTimer([0, 10, 0, 0], rxTestScheduler);

    expectObservable(source).toBe(expected, values);
  });

  it('should complete immediately with empty array', () => {
    const expected = '|';
    const source = presetTimer([], rxTestScheduler);

    expectObservable(source).toBe(expected);
  });
});
