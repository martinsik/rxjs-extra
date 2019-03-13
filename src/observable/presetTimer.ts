import { Observable, SchedulerLike, range, of, asyncScheduler } from 'rxjs';
import { delay, concatMap } from 'rxjs/operators';

export const presetTimer = (delays: number[], scheduler?: SchedulerLike): Observable<number> =>
  range(delays.length).pipe(
    concatMap(index => of(index).pipe(
      delay(delays[index], scheduler),
    )),
  );
