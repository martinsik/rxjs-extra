/**
 * Using `errorWhen` to emit `error` notification when a value matches the predicate function
 */
import { range } from 'rxjs';

import { errorWhen } from '../src/operators';

range(10).pipe(
  errorWhen(v => v === 3),
).subscribe({
  next: (v) => console.log(v),
  error: (e) => console.log(e.constructor.prototype.name),
});
