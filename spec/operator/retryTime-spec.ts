import { expect } from 'chai';
import { TestScheduler } from 'rxjs/testing';

import { hot, cold, time, expectObservable, expectSubscriptions } from '../marble-testing';
import { retryTime } from '../../src/operators';

declare function asDiagram(arg: string): Function;
declare const rxTestScheduler: TestScheduler;

describe('retryTime', () => {
  asDiagram('retryTime(30)')('should make delays between retries', () => {
    const e1 =  cold('-1-2-3-#');
    const e1subs =  ['^      !                    ',
                     '          ^      !          ',
                     '                    ^      !',
    ];
    const unsub =    '^                          !';
    const expected = '-1-2-3-----1-2-3-----1-2-3--';
    const t =   time('---|');

    const source = e1.pipe(
      retryTime(t, rxTestScheduler),
    );

    expectObservable(source, unsub).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should retry with an array of delays and then re-emit the error', () => {
    const e1 =  cold('-1-2-3-#');
    const e1subs =  ['^      !                           ',
                     '          ^      !                 ',
                     '                  ^      !         ',
                     '                           ^      !'];
    const expected = '-1-2-3-----1-2-3---1-2-3----1-2-3-#';
    const t =  [time('---|'),
                time('-|'),
                time('--|'),
    ];

    const source = e1.pipe(
      retryTime(t, rxTestScheduler),
    );

    expectObservable(source).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should not retry with an empty array of delays', () => {
    const e1 =  cold('-1-2-3-#');
    const expected = '-1-2-3-#';
    const e1subs =   '^      !';

    const source = e1.pipe(
      retryTime([], rxTestScheduler),
    );

    expectObservable(source).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });
});
