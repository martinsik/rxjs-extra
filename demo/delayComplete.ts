/**
 * Using `delayComplete` to delay the `complete` notification by 3s.
 */
import { of } from 'rxjs';

import { delayComplete } from '../src/operators';

of(1).pipe(
  delayComplete(3000),
).subscribe({
  next: console.log,
  complete: () => console.log('complete'),
});
