import { Subject } from 'rxjs';

import { queueTime } from '../src/operators';

let count = 0;
let lastEmission: number;
const sinceStart = (new Date()).getTime();
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

let o1 = subject.pipe(
  queueTime(1000),
).subscribe(val => {
  const now = (new Date()).getTime();
  if (!lastEmission) {
    lastEmission = now;
  }
  console.log(now - sinceStart, now - lastEmission, val);
  lastEmission = now;
});

scheduleNext();