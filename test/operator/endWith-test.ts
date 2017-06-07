import * as Rx from 'rxjs';
import '../../dist/cjs/RxPlus';
import {expect} from 'chai';
import marbleTestingSignature = require('../helpers/marble-testing'); // tslint:disable-line:no-require-imports

declare const {asDiagram};
declare const hot: typeof marbleTestingSignature.hot;
declare const cold: typeof marbleTestingSignature.cold;
declare const expectObservable: typeof marbleTestingSignature.expectObservable;
declare const expectSubscriptions: typeof marbleTestingSignature.expectSubscriptions;
declare const rxTestScheduler: Rx.TestScheduler;

const Observable = Rx.Observable;

// Tests based on startWith() from https://github.com/ReactiveX/rxjs/blob/master/spec/operators/startWith-spec.ts
describe('Observable.prototype.endWith', () => {

  const endWithValue = 'x';

  asDiagram("endWith('d', 'e', 'f')")("should end Observable with values", () => {
    const source = cold('--a--b--c--|');
    const sub = '^          !';
    const expected = '--a--b--c--(def|)';

    expectObservable(source.endWith('d', 'e', 'f')).toBe(expected);
    expectSubscriptions(source.subscriptions).toBe(sub);
  });

  it('should end an observable with given value', () => {
    const e1 = hot('--a--|');
    const e1subs = '^    !';
    const expected = '--a--(x|)';

    expectObservable(e1.endWith(endWithValue)).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should not end with given value if the source does not complete', () => {
    const e1 = hot('----a-');
    const e1subs = '^     ';
    const expected = '----a-';

    expectObservable(e1.endWith(endWithValue)).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should end with given value and complete if source does not emits', () => {
    const e1 = hot('---|');
    const e1subs = '^  !';
    const expected = '---(x|)';

    expectObservable(e1.endWith(endWithValue)).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should end with given value and complete if source is empty', () => {
    const e1 = cold('|');
    const e1subs = '(^!)';
    const expected = '(x|)';

    expectObservable(e1.endWith(endWithValue)).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should end with both given value and the source value if source emits single value', () => {
    const e1 = cold('(a|)');
    const e1subs = '(^!)';
    const expected = '(ax|)';

    expectObservable(e1.endWith(endWithValue)).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should end with given values when given more than one value', () => {
    const e1 = hot('-----a--|');
    const e1subs = '^       !';
    const expected = '-----a--(yz|)';

    expectObservable(e1.endWith('y', 'z')).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should end with given value and raises error if source raises error', () => {
    const e1 = hot('--#');
    const e1subs = '^ !';
    const expected = '--#';

    expectObservable(e1.endWith(endWithValue)).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should allow unsubscribing explicitly and early', () => {
    const e1 = hot('---a--b----c--d--|');
    const unsub = '         !        ';
    const e1subs = '^        !        ';
    const expected = '---a--b---';

    const result = e1.endWith('s');

    expectObservable(result, unsub).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should not break unsubscription chains when result is unsubscribed explicitly', () => {
    const e1 = hot('---a--b----c--d--|');
    const e1subs = '^        !        ';
    const expected = '---a--b---        ';
    const unsub = '         !        ';

    const result = e1
      .mergeMap((x: string) => Observable.of(x))
      .endWith('s')
      .mergeMap((x: string) => Observable.of(x));

    expectObservable(result, unsub).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should end with empty if given value is not specified', () => {
    const e1 = hot('-a-|');
    const e1subs = '^  !';
    const expected = '-a-|';

    expectObservable(e1.endWith()).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should accept scheduler as last argument with single value', () => {
    const e1 = hot('--a--|');
    const e1subs = '^    !';
    const expected = '--a--(x|)';

    expectObservable(e1.endWith(endWithValue)).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should accept scheduler as last argument with multiple value', () => {
    const e1 = hot('-----a--|');
    const e1subs = '^       !';
    const expected = '-----a--(yz|)';

    expectObservable(e1.endWith('y', 'z')).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should dispose the source properly before endWith when using a scheduler', (done) => {
    Observable.of(42)
      .finally(done)
      .endWith<number | string>(endWithValue)
      .subscribe(() => {
      });
  });

  it('should dispose the source properly after endWith when using a scheduler', (done) => {
    Observable.of(42)
      .endWith<number | string>(endWithValue)
      .finally(done)
      .subscribe(() => {
      });
  });

});