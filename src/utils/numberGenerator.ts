export type NumberGenerator = (min: number, max: number) => number;

export const randomNumberGenerator: NumberGenerator = (min: number, max: number) => Math.random() * (max - min) + min;
