import { expect } from 'chai';
import { TestScheduler } from 'rxjs/testing';

import { hot, cold, expectObservable, expectSubscriptions } from '../marble-testing';
import { errorWhen } from '../../src/operators';

declare function asDiagram(arg: string): Function;
declare const rxTestScheduler: TestScheduler;

describe('errorWhen', () => {
  asDiagram('errorWhen(val => val === 3)')('should emit an error when an item matches predicate', () => {
    const e1 =  cold('--1--2--3--4--|');
    const e1subs =   '^       !';
    const expected = '--1--2--#';

    const source = e1.pipe(
      errorWhen(value => Number(value) === 3),
    );

    expectObservable(source).toBe(expected, undefined, new Error());
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should re-emit an error from source', () => {
    const e1 =  cold('--1--2--#', undefined, new Error());
    const e1subs =   '^       !';
    const expected = '--1--2--#';

    const source = e1.pipe(
      errorWhen(value => Number(value) === 3),
    );

    expectObservable(source).toBe(expected, undefined, new Error());
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should use a custom error object', () => {
    const error = new Error('My custom error object');
    const e1 =  cold('--1--2--3--4--|');
    const e1subs =   '^       !';
    const expected = '--1--2--#';

    const source = e1.pipe(
      errorWhen(value => Number(value) === 3, error),
    );

    expectObservable(source).toBe(expected, undefined, error);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should call an error factory function with the value that passed the predicate', () => {
    const error = new Error('My custom error object');
    const e1 =  cold('--1--2--3--4--|');
    const e1subs =   '^       !';
    const expected = '--1--2--#';

    let invoked = false;

    const source = e1.pipe(
      errorWhen<string>(
        value => Number(value) === 3,
        (value: string) => {
          expect(value).to.be.equal('3');
          invoked = true;

          return error;
        }
      ),
    );

    expectObservable(source).toBe(expected, undefined, error);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);

    rxTestScheduler.flush();

    expect(invoked).to.be.equal(true);
  });
});
