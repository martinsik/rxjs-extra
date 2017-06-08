const Observable = require('rxjs/Observable').Observable;
const Subject = require('rxjs/Subject').Subject;
require('rxjs/add/observable/of');
require('../dist/cjs/add/operator/queueTime');

let lastEmission;
let sinceStart = (new Date()).getTime();
let count = 0;
const subject = new Subject();

function scheduleNext() {
    const delay = Math.round(1500 - Math.random() * 1000);
    console.log('Next delay:', delay, 'ms');

    setTimeout(() => {
        subject.next(count++);

        if (count === 10) {
            subject.complete();
        } else {
            scheduleNext();
        }
    }, delay);
}

let o1 = subject
    .queueTime(1000)
    .subscribe(val => {
        const now = (new Date()).getTime();
        if (!lastEmission) {
            lastEmission = now;
        }
        console.log(now - sinceStart, now - lastEmission, val);
        lastEmission = now;
    });

scheduleNext();