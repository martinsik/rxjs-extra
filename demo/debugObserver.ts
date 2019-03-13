/**
 * Using `DebugObserver` to make emission with preset delays.
 */
import { presetTimer, DebugObserver } from '../src';

presetTimer([500, 1000, 2000])
  .subscribe(new DebugObserver('MyObs'));
