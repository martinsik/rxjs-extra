const Observable = require('rxjs/Observable').Observable;
const Subject = require('rxjs/Subject').Subject;
require('rxjs/add/observable/of');
require('../dist/cjs/add/operator/queueTime');

let lastEmission;
let sinceStart = (new Date()).getTime();

const delays = [];
for (let i = 0; i < 10; i++) {
    delays.push(1500 - Math.random() * 1000);
}

function run(targetSubject) {
    let lastEmission;
    let count = 0;

    function scheduleNext() {
        setTimeout(() => {
            targetSubject.next(count++);

            if (count === 10) {
                targetSubject.complete();
            } else {
                scheduleNext();
            }
        }, delays[count]);
    }
    scheduleNext();
}

const subject1 = new Subject();
const subject2 = new Subject();

let o1 = subject1.queueTime(1000).do(null, null, () => {
    console.log('\nRunning concatMap()');
    lastEmission = false;
    sinceStart = (new Date()).getTime();
    run(subject2);
});
let o2 = subject2.concatMap((val, i) => i === 0 ? Observable.of(val) : Observable.of(val).delay(1000));

o1.concat(o2)
    .subscribe(val => {
        const now = (new Date()).getTime();
        if (!lastEmission) {
            lastEmission = now;
        }
        console.log(now - sinceStart, now - lastEmission, val);
        lastEmission = now;
    });

console.log('Running queueTime()');
run(subject1);
