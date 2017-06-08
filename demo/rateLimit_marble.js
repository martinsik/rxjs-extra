const TestScheduler = require('rxjs/testing/TestScheduler').TestScheduler;
const Observable = require('rxjs/Observable').Observable;
const chai = require('chai');
require('rxjs/add/operator/do');
require('../dist/cjs/add/operator/rateLimit');

const delayMarbles =                 '----------|';
const inputMarbles =                 '--1-2-3-------------4--5---6------------7-|';
//                                    xx----------                  xxxxxxxxxx----------
//                                            xxxxxxxx----------
const expectedRateLimitMarbles =     '------------x-----------------y-------------------(z|)';
//                                    xx----------        xx----------          ----------
//                                      xxxxxxxxxx--------            ----------
const expectedRateLimitMarblesAsap = '--x---------y---------z---------i---------(j|)';
const values1 = {
    x: ['1', '2', '3'],
    y: ['4', '5', '6'],
    z: ['7'],
};
const values2 = {
    x: ['1', ],
    y: ['2', '3'],
    z: ['4'],
    i: ['5', '6'],
    j: ['7'],
};
const scheduler = new TestScheduler(chai.assert.deepEqual);
const t = scheduler.createTime(delayMarbles);

source1 = scheduler.createHotObservable(inputMarbles).rateLimit(3, t, false, scheduler);
scheduler.expectObservable(source1.do(null, null, () => console.log('complete1'))).toBe(expectedRateLimitMarbles, values1);

source2 = scheduler.createHotObservable(inputMarbles).rateLimit(3, t, true, scheduler);
scheduler.expectObservable(source2.do(null, null, () => console.log('complete2'))).toBe(expectedRateLimitMarblesAsap, values2);

scheduler.flush();
