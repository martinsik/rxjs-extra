const TestScheduler = require('rxjs/testing/TestScheduler').TestScheduler;
const Observable = require('rxjs/Observable').Observable;
const chai = require('chai');
require('../dist/cjs/add/operator/queueTime');

const delayMarbles =             '-----|';
const inputMarbles =             '--1-2-3-------------4--5---6------------7-|';
//                                  1x-----2----3xxxx------4----5----6xxxx-----(7|)
const expectedConcatMarbles =    '--1------2----3----------4----5----6---------(7|)';
const expectedQueueTimeMarbles = '--1----2----3-------4----5----6---------7-|';


const scheduler = new TestScheduler(chai.assert.deepEqual);
const t = scheduler.createTime(delayMarbles);

const source1 = scheduler.createHotObservable(inputMarbles).queueTime(t, scheduler);
scheduler.expectObservable(source1.do(null, null, () => console.log('complete1'))).toBe(expectedQueueTimeMarbles);

const source2 = scheduler
    .createHotObservable(inputMarbles)
    .concatMap((item, i) => i === 0
        ? Observable.of(item)
        : Observable.of(item).delay(t, scheduler)
    );

scheduler.expectObservable(source2.do(null, null, () => console.log('complete2'))).toBe(expectedConcatMarbles);

scheduler.flush();
