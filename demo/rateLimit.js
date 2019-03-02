const Observable = require('rxjs/Observable').Observable;
const Subject = require('rxjs/Subject').Subject;
require('../dist/cjs/add/operator/rateLimit');

let lastEmission;
let sinceStart = (new Date()).getTime();
let count = 0;
const subject = new Subject();

function scheduleNext() {
    const delay = Math.round(500 - Math.random() * 400);
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

subject
    .rateLimit(3, 1000)
    .subscribe(val => {
        const time = (new Date()).getTime() - sinceStart;
        console.log(time.toString(), 'ms', val);
    });

scheduleNext();