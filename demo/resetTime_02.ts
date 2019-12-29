/**
 * Using `resetTime` to automatically schedule emission with fixed delay after every emission from source.
 * Each value is passed to a projection function.
 */
import { Subject } from 'rxjs';
import { resetTime } from '../src/operators';
import { DebugObserver } from '../src';

const source = new Subject<number>();

source
  .pipe(
    resetTime<number | string>(1000, v => v + 'x'),
  )
  .subscribe(new DebugObserver('Obs'));

source.next(1);
setTimeout(() => {
  source.next(2);
  source.complete();
}, 3000);

/*
$ npm run demo -- demo/resetTime_02.ts

[Obs]N@      2: 1
[Obs]N@   1011: 1x
[Obs]N@   3012: 2
[Obs]N@   4016: 2x
[Obs]C@   4017:
*/
