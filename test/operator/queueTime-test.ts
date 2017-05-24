import * as Rx from 'rxjs';
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

describe('Observable.prototype.endWith', () => {

    asDiagram("queueTime(50)")("should make equal delays between emissions", () => {
        //                  x-----     xx-----     -----
        //                        -----       -----     -----
        const source = hot('-1--2--------3-45------6--|');
        const expected =   '-1----2------3----4----5----(6|)';
        const subs =       '^                           !';
        const t = time('-----|');

        expectObservable(source.queueTime(t, rxTestScheduler)).toBe(expected);
        expectSubscriptions(source.subscriptions).toBe(subs);
    });

    it('should not delay item when long delay between emissions', () => {
        //                  -----     xxx-----     xx-----
        //                       -----        -----       -----
        const source = hot('1------------2-----------3----|');
        const expected =   '1------------2-----------3----|';
        const subs =       '^                             !';
        const t = time('-----|');

        expectObservable(source.queueTime(t, rxTestScheduler)).toBe(expected);
        expectSubscriptions(source.subscriptions).toBe(subs);
    });

    it('should complete when the source is empty', () => {
        const source = hot('--|');
        const expected =   '--|';
        const subs =       '^ !';
        const t = time('-----|');

        expectObservable(source.queueTime(t, rxTestScheduler)).toBe(expected);
        expectSubscriptions(source.subscriptions).toBe(subs);
    });

    it('should propagate error immediately', () => {
        const err = new Error();
        const source = hot('1-23--#', undefined, err);
        const expected =   '1-----#';
        const subs =       '^     !';
        const t =     time('----------|');

        expectObservable(source.queueTime(t, rxTestScheduler)).toBe(expected, undefined, err);
        expectSubscriptions(source.subscriptions).toBe(subs);
    });

    it('should make equal delay when source emitting too fast', () => {
        const source = hot('1234567|');
        const expected =   '1----2----3----4----5----6----(7|)';
        const subs =       '^                             !';
        const t = time('-----|');

        expectObservable(source.queueTime(t, rxTestScheduler)).toBe(expected);
        expectSubscriptions(source.subscriptions).toBe(subs);
    });

});
