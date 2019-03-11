import { of } from 'rxjs';
import { concatMap, delay, tap } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';
import { assert } from 'chai';

import { queueTime } from '../src/operators';

const delayMarbles =             '-----|';
const inputMarbles =             '--1-2-3-------------4--5---6------------7-|';
//                                  1x-----2----3xxxx------4----5----6xxxx-----(7|)
const expectedConcatMarbles =    '--1------2----3----------4----5----6---------(7|)';
const expectedQueueTimeMarbles = '--1----2----3-------4----5----6---------7-|';

const scheduler = new TestScheduler(assert.deepEqual);

scheduler.run(() => {
  const t = scheduler.createTime(delayMarbles);

  const source1 = scheduler.createHotObservable(inputMarbles).pipe(
    queueTime(t, scheduler)
  );

  scheduler.expectObservable(source1.pipe(
    tap({
      complete: () => console.log('complete1'),
    }),
  )).toBe(expectedQueueTimeMarbles);

  const source2 = scheduler.createHotObservable(inputMarbles).pipe(
    concatMap((item, i) => i === 0
      ? of(item)
      : of(item).pipe(
        delay(t, scheduler),
      )
    ),
  );

  scheduler.expectObservable(source2.pipe(
    tap({
      complete: () => console.log('complete2'),
    }),
  )).toBe(expectedConcatMarbles);
});
