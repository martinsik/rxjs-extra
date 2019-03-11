import { range } from 'rxjs';

import { queueTime } from '../src/operators';

range(10).pipe(
  queueTime(1000),
).subscribe(console.log);
