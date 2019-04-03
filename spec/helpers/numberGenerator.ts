import { NumberGenerator } from '../../src';
import { time } from '../marble-testing';

export const createTestNumberGenerator = (): NumberGenerator => {
  let counter = 0;
  return (min: number, max: number) => {
    counter = (counter + 3) % 5;
    return time(new Array(counter + 1).join('-') + '|');
  };
};
