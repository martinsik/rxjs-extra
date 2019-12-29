/**
 * Using `resetTime` to automatically schedule emission with fixed delay after every emission from source.
 */
import { Subject } from 'rxjs';
import { resetTime } from '../src/operators';
import { DebugObserver } from '../src';

const source = new Subject<number>();

source
  .pipe(
    resetTime<number | string>(1000, 'x'),
  )
  .subscribe(new DebugObserver('Obs'));

source.next(1);
setTimeout(() => {
  source.next(2);
  source.complete();
}, 3000);

/*
$ npm run demo -- demo/resetTime.ts

[Obs]N@      1: 1
[Obs]N@   1012: x
[Obs]N@   3013: 2
[Obs]N@   4015: x
[Obs]C@   4016:
*/