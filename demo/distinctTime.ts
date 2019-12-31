/**
 * Using `distinctTime` that ignores duplicate `1` emissions but passes through another `1` that
 * is emitted after 3s delay because `distinctTime` has 2s reset time.
 */
import { Subject } from 'rxjs';
import { distinctTime } from '../src/operators';
import { DebugObserver } from '../src';

const source = new Subject();

source
  .pipe(
    distinctTime(2000),
  )
  .subscribe(new DebugObserver('Obs'));

source.next(1);
source.next(1);
source.next(2);
source.next(2);

setTimeout(() => {
  source.next(1);
}, 1000);

setTimeout(() => {
  source.next(1);
  source.next(2);
  source.complete();
}, 3000);

/*
$ npm run demo -- demo/distinctTime.ts

[Obs]N@      2: 1
[Obs]N@     10: 2
[Obs]N@   3013: 1
[Obs]N@   3014: 2
[Obs]C@   3015:
*/