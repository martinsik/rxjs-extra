import * as Rx from 'rxjs';
import '../../dist/cjs/index';
import {expect} from 'chai';
import marbleTestingSignature = require('../helpers/marble-testing');

declare const { asDiagram, time };
declare const hot: typeof marbleTestingSignature.hot;
declare const cold: typeof marbleTestingSignature.cold;
declare const expectObservable: typeof marbleTestingSignature.expectObservable;
declare const expectSubscriptions: typeof marbleTestingSignature.expectSubscriptions;
declare const rxTestScheduler: Rx.TestScheduler;
const Observable = Rx.Observable;

describe('Observable.prototype.rateLimit', () => {
  asDiagram('rateLimit(3, 100)')('should re-emit each chunk with 100 delay', () => {
    //                  x----------
    //                             xx----------
    //                                         ----------
    const t = time('----------|');
    const source = hot('-1--2-3------4-5678------9--|');
    const expected =   '-----------x-----------y---------(z|)';
    const values = {
      x: ['1', '2', '3'],
      y: ['4', '5', '6'],
      z: ['7', '8', '9'],
    };

    expectObservable(source.rateLimit(3, t, false, rxTestScheduler)).toBe(expected, values);
  });

  it('should split very fast emitting source into chunks with constant delay', () => {
    //                  ----------
    //                            ----------
    //                                      ----------
    //                                                ----------
    const source = hot('abcdefghijklmnopqr|');
    const expected =   '----------x---------y---------z---------(u|)';
    const values = {
      x: ['a', 'b', 'c', 'd', 'e'],
      y: ['f', 'g', 'h', 'i', 'j'],
      z: ['k', 'l', 'm', 'n', 'o'],
      u: ['p', 'q', 'r'] ,
    };

    expectObservable(source.rateLimit(5, 100, false, rxTestScheduler)).toBe(expected, values);
  });

  it('should complete when the source is empty', () => {
    const source = hot('--|');
    const expected =   '--|';

    expectObservable(source.rateLimit(5, 100, false, rxTestScheduler)).toBe(expected);
  });

  it('should only once if the source emission fir into a single window', () => {
    //                  ----------
    //                            ----------
    const source = hot('a-bc--------------------|');
    const expected =   '----------x-------------|';
    const values = {
      x: ['a', 'b', 'c'],
    };

    expectObservable(source.rateLimit(5, 100, false, rxTestScheduler)).toBe(expected, values);
  });

  it('should propagate error immediately', () => {
    const err = new Error();
    const source = hot('a-bc--#', undefined, err);
    const expected =   '------#';

    expectObservable(source.rateLimit(5, 100, false, rxTestScheduler)).toBe(expected, undefined, err);
  });

  it('should emit the first value immediately even after long delay', () => {
    //                  -----
    //                       -----
    //                            x-----
    //                                  -----
    //                                       xx-----
    const source = hot('12-3-------4-567-------8------|');
    const expected =   '-----x----------y-----------z-|';
    const values = {
      x: ['1', '2', '3'],
      y: ['4', '5', '6', '7'],
      z: ['8'],
    };

    expectObservable(source.rateLimit(5, 50, false, rxTestScheduler)).toBe(expected, values);
  });


  it('should emit the first value immediately after receiving it when asap mode enabled', () => {
    //                  x
    //                   ----------
    //                             ----------
    //                                       ----------
    const source = hot('-1-2-3------4-5678-----9--|');
    const expected =   '-x---------y---------z---------(i|)';
    const values = {
      x: ['1'],
      y: ['2', '3'],
      z: ['4', '5', '6', '7', '8'],
      i: ['9'],
    };

    expectObservable(source.rateLimit(5, 100, true, rxTestScheduler)).toBe(expected, values);
  });

  it('should emit the first value immediately even after long delay when asap mode enabled', () => {
    //                  x-----
    //                        -----
    //                             x
    //                              xx---
    //                                   -----
    const source = hot('-12-3-------4-567-8--9----|');
    const expected =   '-x----y-----z----i----j---|';
    const values = {
      x: ['1'],
      y: ['2', '3'],
      z: ['4'],
      i: ['5', '6', '7'],
      j: ['8', '9'],
    };

    expectObservable(source.rateLimit(5, 50, true, rxTestScheduler)).toBe(expected, values);
  });
});
