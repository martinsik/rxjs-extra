import * as Rx from 'rxjs';
import '../../dist/cjs/index';
import {expect} from 'chai';
import marbleTestingSignature = require('../helpers/marble-testing'); // tslint:disable-line:no-require-imports

declare const { asDiagram };
declare const hot: typeof marbleTestingSignature.hot;
declare const cold: typeof marbleTestingSignature.cold;
declare const expectObservable: typeof marbleTestingSignature.expectObservable;
declare const expectSubscriptions: typeof marbleTestingSignature.expectSubscriptions;
declare const rxTestScheduler: Rx.TestScheduler;
const Observable = Rx.Observable;

describe('Observable.prototype.cache', () => {

  function createSource() {
    let counter = 0;
    return Observable.defer(() => cold('-(v|)', {'v': String.fromCharCode(97 + counter)}).do(() => counter++));
  }

  asDiagram('cache(50)')('should cache the items for 50 time window', () => {
    const source = createSource().cache(50, null, rxTestScheduler);
    //                  a -----
    //                  b      -----
    //                  c           -----
    const notifier = hot('---1--2-34--5--');
    const expected1 =    '-a-a---bbb---c-';

    expectObservable(source.repeatWhen(() => notifier)).toBe(expected1);
  });

  it('should propagate the error when source emits error by default', () => {
    const err = new Error();
    const source = createSource()
        .map(item => {
          if (item === 'b') {
            throw err;
          }
          return item;
        })
        .cache(50, null, rxTestScheduler);

    const notifier = hot('------1-');
    const expected1 =    '-a-----#';

    expectObservable(source.repeatWhen(() => notifier)).toBe(expected1, undefined, err);
  });

});