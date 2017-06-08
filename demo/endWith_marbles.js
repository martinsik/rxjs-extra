const TestScheduler = require('rxjs/testing/TestScheduler').TestScheduler;
const Observable = require('rxjs/Observable').Observable;
const chai = require('chai');
require('rxjs/add/observable/of');
require('rxjs/add/operator/do');
require('rxjs/add/operator/concat');
require('../dist/cjs/add/operator/endWith');

const inputMarbles = '1-2-3--|';
const expectedMarbles = '1-2-3--(abc|))';

const scheduler = new TestScheduler(chai.assert.deepEqual);
const source1 = scheduler.createHotObservable(inputMarbles).endWith('a', 'b', 'c');
const source2 = scheduler.createHotObservable(inputMarbles).concat(Observable.of('a', 'b', 'c'));

scheduler.expectObservable(source1.do(null, null, () => console.log('complete1'))).toBe(expectedMarbles);
scheduler.expectObservable(source2.do(null, null, () => console.log('complete2'))).toBe(expectedMarbles);

scheduler.flush();
