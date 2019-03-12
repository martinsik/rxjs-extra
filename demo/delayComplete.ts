/**
 * Using `delayComplete` to delay the `complete` notification by 3 seconds.
 */
import { of } from 'rxjs';
import { delayComplete } from '../src/operators';

const start = new Date().getTime();
const now = () => new Date().getTime() - start;

of('Hello').pipe(
  delayComplete(3000),
).subscribe({
  next: (v) => console.log(now(), v),
  complete: () => console.log(now(), 'complete'),
});

/*
$ npm run demo -- demo/delayComplete.ts
8 'Hello'
3020 'complete'
*/