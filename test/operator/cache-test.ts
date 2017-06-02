import * as Rx from 'rxjs';
import {CacheMode, CacheOptions} from '../../dist/cjs/index';
import '../../dist/cjs/index';
import {expect} from 'chai';
import marbleTestingSignature = require('../helpers/marble-testing'); // tslint:disable-line:no-require-imports

declare const { asDiagram, time };
declare const hot: typeof marbleTestingSignature.hot;
declare const cold: typeof marbleTestingSignature.cold;
declare const expectObservable: typeof marbleTestingSignature.expectObservable;
declare const expectSubscriptions: typeof marbleTestingSignature.expectSubscriptions;
declare const rxTestScheduler: Rx.TestScheduler;
const Observable = Rx.Observable;

// @todo: rework these tests when RxJS supports creating multiple subscriptions as different times.
describe('Observable.prototype.cache', () => {

  function createSource() {
    let counter = 0;
    return Observable.defer(() => cold('-(v|)', {'v': String.fromCharCode(97 + counter)}).do(() => counter++));
  }

  asDiagram('cache(50)')('should cache the items for 50 time window', () => {
    //                  a -----
    //                  b      -----
    //                  c           -----
    const t = time('-----|');
    const notifier = hot('---1--2-34--5--');
    const expected1 =    '-a-a---bbb---c-';

    const source = createSource().cache(t, null, rxTestScheduler);
    expectObservable(source.repeatWhen(() => notifier)).toBe(expected1);
  });

  it('should propagate the error when source emits error by default', () => {
    const err = new Error();
    const t = time('-----|');
    const source = createSource()
        .map(item => {
          if (item === 'b') {
            throw err;
          }
          return item;
        })
        .cache(t, null, rxTestScheduler);

    //                  a -----
    //                  b      -----
    const notifier = hot('------1-');
    const expected1 =    '-a-----#';

    expectObservable(source.repeatWhen(() => notifier)).toBe(expected1, undefined, err);
  });

  it('should send complete when requesting a single value', () => {
    const source = cold('--(a|)');
    const t = time('-----|');
    const cached = source.cache(t, null, rxTestScheduler);
    const e1 =          '--(a|)';
    const e1sub =       '^-!';

    expectObservable(cached).toBe(e1);
    expectSubscriptions(source.subscriptions).toBe(e1sub);
  });

  it("shouldn't emit anything if the source doesn't emit", () => {
    const source = cold('----');
    const t = time('-----|');
    const cached = source.cache(t, null, rxTestScheduler);
    const e1 =          '----';
    const e1sub =       '^---';

    expectObservable(cached).toBe(e1);
    expectSubscriptions(source.subscriptions).toBe(e1sub);
  });

  it("should emit when the source takes longer that the time window", () => {
    const source = cold('---------a');
    const t = time('-----|');
    const cached = source.cache(t, null, rxTestScheduler);
    const e1 =          '---------(a|)';
    const e1sub =       '^--------!';

    expectObservable(cached).toBe(e1);
    expectSubscriptions(source.subscriptions).toBe(e1sub);
  });

  it("should emit the same value to multiple observers withing the same time window", () => {
    const t = time('-----|');
    const cached = createSource().cache(t, null, rxTestScheduler);
    const e1 =           '-(a|)';
    const e2 =           '-(a|)';
    //                  a -----
    //                  b      -----
    const notifier = hot('------1---');
    const e3 =           '-a-----b--';

    expectObservable(cached).toBe(e1);
    expectObservable(cached).toBe(e2);
    expectObservable(cached.repeatWhen(() => notifier)).toBe(e3);
  });

  it("should emit the same error to multiple observers withing the same time window", () => {
    const err = new Error();
    const t = time('-----|');
    const source = createSource()
        .map(item => {
          if (item === 'a') {
            throw err;
          }
          return item;
        })
        .cache(t, null, rxTestScheduler);

    const e1 =          '-#';
    const e2 =          '-#';

    expectObservable(source).toBe(e1, undefined, err);
    expectObservable(source).toBe(e2, undefined, err);
  });

  it("should throw a single error when using catchErrors=false option", () => {
    const err = new Error();
    const t = time('-----|');
    const source = createSource()
        .map(item => {
          if (item === 'b') {
            throw err;
          }
          return item;
        })
        .cache(t, {catchErrors: false}, rxTestScheduler);

    const notifier = hot('---1--2-34--5--');
    const expected1 =    '-a-a---#';

    expectObservable(source.repeatWhen(() => notifier)).toBe(expected1, undefined, err);
  });

  it("should emit one or two items when tolerating the expired items", () => {
    const opts = <CacheOptions>{mode: CacheMode.TolerateExpired};
    const t = time('-----|');
    const source = createSource().cache(t, opts, rxTestScheduler);

    //                  a -----
    //                  b      -----
    const notifier = hot('---1---2--');
    const expected1 =    '-a-a---ab-';

    expectObservable(source.repeatWhen(() => notifier)).toBe(expected1);
  });

  it("should emit two items when tolerating the expired items", () => {
    const opts = <CacheOptions>{mode: CacheMode.TolerateExpired};
    const t = time('-----|');
    const source = createSource().cache(t, opts, rxTestScheduler);

    //                  a -----
    //                  b      -----
    const notifier = hot('-------1--');
    const expected1 =    '-a-----ab-';

    expectObservable(source.repeatWhen(() => notifier)).toBe(expected1);
  });

  it("should emit one item and silently refresh in silent mode", () => {
    const opts = <CacheOptions>{mode: CacheMode.SilentRefresh};
    const t = time('-----|');
    const source = createSource().cache(t, opts, rxTestScheduler);

    //                  a -----
    //                  b      -----
    const notifier = hot('------1---');
    const expected1 =    '-a----a---';

    expectObservable(source.repeatWhen(() => notifier)).toBe(expected1);
  });

});