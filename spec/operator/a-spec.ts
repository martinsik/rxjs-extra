import { startWith } from 'rxjs/operators';
import { expect } from 'chai';
import { hot, cold, expectObservable, expectSubscriptions } from '../marble-testing';

declare function asDiagram(arg: string): Function;

describe('Test', () => {
  asDiagram('startWith(s)')('should prepend to a cold Observable', () => {
    const e1 =  cold('---a--b--c--|');
    const e1subs =   '^           !';
    const expected = 's--a--b--c--|';

    expectObservable(e1.pipe(startWith('s'))).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it('should not break', () => {
    expect(true).to.be.true;
  });
});
