import { expect } from 'chai';
import { TestScheduler } from 'rxjs/testing';

import { hot, cold, time, expectObservable, expectSubscriptions } from '../marble-testing';
import { delayComplete } from '../../src/operators';

declare function asDiagram(arg: string): Function;
declare const rxTestScheduler: TestScheduler;

describe.only('delayComplete', () => {
  asDiagram('delayComplete(50)')('should delay the complete notification', () => {
    const e1 =  cold('---a--b--|');
    const e1subs =   '^        !';
    const expected = '---a--b----|';
    const t =   time('--|');

    const source = e1.pipe(
      delayComplete(t, rxTestScheduler),
    );

    expectObservable(source).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should delay complete for empty Observables', () => {
    const e1 =  cold('|');
    const e1subs =   '(^!)';
    const t =   time('--|');
    const expected = '--|';
    const source = e1.pipe(
      delayComplete(t, rxTestScheduler),
    );

    expectObservable(source).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should not break errors', () => {
    const err = new Error();
    const e1 =  cold('---a--#', undefined, err);
    const e1subs =   '^     !';
    const expected = '---a--#';
    const t =   time('--|');

    const source = e1.pipe(
      delayComplete(t, rxTestScheduler),
    );

    expectObservable(source).toBe(expected, undefined, err);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });
});
