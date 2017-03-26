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
    return Observable.defer(() => Observable.of(String.fromCharCode(97 + counter))
        .delay(10, rxTestScheduler)
        .do(() => counter++)
    );
  }

  asDiagram('cache')('should cache the items for specified time window', () => {
    const source = createSource().cache(50, null, rxTestScheduler);
    //                    -----
    //                         -----
    //                              -----
    const notifier = hot('---2--3-45--6--');
    const expected1 =    '-a-a---bbb---c-';

    expectObservable(source.repeatWhen(() => notifier)).toBe(expected1);
    // expectSubscriptions(source.subscriptions).toBe(sub);
  });

});