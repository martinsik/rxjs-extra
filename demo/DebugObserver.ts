/**
 * Using `DebugObserver` to make emission with preset delays.
 */
import { presetTimer, DebugObserver } from '../src';

presetTimer([500, 1000, 2000])
  .subscribe(new DebugObserver('MyObs'));

/*
[MyObs]N@    510: 0
[MyObs]N@   1522: 1
[MyObs]N@   3523: 2
[MyObs]C@   3523:
*/
