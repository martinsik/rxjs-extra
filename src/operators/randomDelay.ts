import { of, MonoTypeOperatorFunction, SchedulerLike } from 'rxjs';
import { concatMap, delay } from 'rxjs/operators';

import { NumberGenerator, randomNumberGenerator } from '../utils/numberGenerator';

/**
 * Mirrors the source Observable but makes random delays between values.
 *
 * @param min number
 * @param max number
 * @param generator NumberGenerator
 * @param scheduler
 */
export const randomDelay = <T>(
  min: number,
  max: number,
  generator: NumberGenerator = randomNumberGenerator,
  scheduler?: SchedulerLike,
): MonoTypeOperatorFunction<T> =>
  concatMap(value => of(value).pipe(
    delay(generator(min, max), scheduler),
  ));
