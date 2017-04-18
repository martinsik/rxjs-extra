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

describe('Observable.prototype.rateLimit', () => {

  asDiagram('rateLimit(3, 100)')('should re-emit each chunk with 100 delay', () => {
    //                  ----------
    //                            xx----------
    //                                        ----------
    const source = hot('1--2-3------4-5678-----9--|');
    const expected =   '----------x-----------y---------(z|)';
    const values = {
      x: ['1', '2', '3'],
      y: ['4', '5', '6'],
      z: ['7', '8', '9'],
    };

    expectObservable(source.rateLimit(3, 100, rxTestScheduler)).toBe(expected, values);
  });

  it('should split very fast emitting source into chunks with constant delay', () => {
    const source = hot('abcdefghijklmnopqr|');
    //                  ----------
    //                            ----------
    //                                      ----------
    //                                                ----------
    const expected =   '----------x---------y---------z---------(u|)';
    const values = {
      x: ['a', 'b', 'c', 'd', 'e'],
      y: ['f', 'g', 'h', 'i', 'j'],
      z: ['k', 'l', 'm', 'n', 'o'],
      u: ['p', 'q', 'r'] ,
    };

    expectObservable(source.rateLimit(5, 100, rxTestScheduler)).toBe(expected, values);
  });

});