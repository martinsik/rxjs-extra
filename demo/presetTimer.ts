/**
 * Using `presetTimer` to make emission with preset delays.
 */
import { presetTimer } from '../src';

presetTimer([500, 2000, 1000]).subscribe(console.log);

/*
$ npm run demo -- demo/presetTimer.ts
0
1
2
*/
