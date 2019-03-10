import { Observable, SchedulerLike, defer, of, asyncScheduler } from 'rxjs';
import { delay, take, repeat, concatMap } from 'rxjs/operators';
import { NumberGenerator, randomNumberGenerator } from '..';

export const randomTimer = (min: number, max: number, generator: NumberGenerator = randomNumberGenerator, scheduler: SchedulerLike = asyncScheduler): Observable<number> =>
  defer(() => {
    let index = 0;
    return defer(() => of(index++)).pipe(
      concatMap(value => of(value).pipe(
        delay(generator(min, max), scheduler),
      )),
      take(1),
      repeat(),
    );
  });
