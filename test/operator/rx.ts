import * as Rx from 'rxjs';
import { expect } from 'chai';
import marbleTestingSignature = require('../helpers/marble-testing'); // tslint:disable-line:no-require-imports

declare const { asDiagram };
declare const hot: typeof marbleTestingSignature.hot;
declare const expectObservable: typeof marbleTestingSignature.expectObservable;
declare const expectSubscriptions: typeof marbleTestingSignature.expectSubscriptions;

const Observable = Rx.Observable;

/** @test {bufferCount} */
describe('Observable.prototype.bufferCount', () => {
  asDiagram('bufferCount(3,2)')('should emit buffers at intervals', () => {
    const values = {
      v: ['a', 'b', 'c'],
      w: ['c', 'd', 'e'],
      x: ['e', 'f', 'g'],
      y: ['g', 'h', 'i'],
      z: ['i']
    };
    const e1 =   hot('--a--b--c--d--e--f--g--h--i--|');
    const expected = '--------v-----w-----x-----y--(z|)';

    expectObservable(e1.bufferCount(3, 2)).toBe(expected, values);
  });
});