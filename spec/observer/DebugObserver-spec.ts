import { expect } from 'chai';
import { TestScheduler } from 'rxjs/testing';
import { tap } from 'rxjs/operators';

import { hot, cold, time, expectObservable } from '../marble-testing';
import { DebugObserver } from "../../src";

declare const rxTestScheduler: TestScheduler;

let logs: string[] = [];
const logger = (...message: string[]) => {
  logs.push(message.join(' '));
};

describe('DebugObserver', () => {
  beforeEach(() => {
    logs = [];
  });
  
  it('should subscribe to all notifications and make timestamped logs', () => {
    const e1 = cold('-a---b-c--(d|)');
    e1.subscribe(new DebugObserver('MyObs', logger, rxTestScheduler));

    rxTestScheduler.flush();

    const expected = [
      '[MyObs]N@     10: a',
      '[MyObs]N@     50: b',
      '[MyObs]N@     70: c',
      '[MyObs]N@    100: d',
      '[MyObs]C@    100:',
    ];
    expect(logs).to.be.eql(expected);
  });

  it('should tap to all notifications and make timestamped logs', () => {
    const e1 = cold('-a---b-c--(d|)');
    e1.pipe(
      tap(new DebugObserver('MyObs', logger, rxTestScheduler)),
    ).subscribe();

    rxTestScheduler.flush();

    const expected = [
      '[MyObs]N@     10: a',
      '[MyObs]N@     50: b',
      '[MyObs]N@     70: c',
      '[MyObs]N@    100: d',
      '[MyObs]C@    100:',
    ];
    expect(logs).to.be.eql(expected);
  });
});