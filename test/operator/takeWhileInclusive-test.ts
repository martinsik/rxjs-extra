import * as Rx from "rxjs";
import "../../dist/cjs/RxPlus";
import {expect} from "chai";
import marbleTestingSignature = require("../helpers/marble-testing"); // tslint:disable-line:no-require-imports

declare const {asDiagram};
declare const hot: typeof marbleTestingSignature.hot;
declare const cold: typeof marbleTestingSignature.cold;
declare const expectObservable: typeof marbleTestingSignature.expectObservable;
declare const expectSubscriptions: typeof marbleTestingSignature.expectSubscriptions;

const Observable = Rx.Observable;

// Tests based on takeWhile() from https://github.com/ReactiveX/rxjs/blob/master/spec/operators/takeWhile-spec.ts
describe("Observable.prototype.takeWhileInclusive", () => {
  asDiagram("takeWhileInclusive(x => x !== 'd')")("should emit all values including the first that doesn't match", () => {
    const source = hot("--a--b--c--d--e--|");
    const sub = "^          !      ";
    const expected = "--a--b--c--(d|)   ";

    expectObservable(source.takeWhileInclusive(x => x !== "d")).toBe(expected);
    expectSubscriptions(source.subscriptions).toBe(sub);
  });

  it("should take all elements while predicate returns true", () => {
    const e1 = hot("--a-^-b--c--d--e--|");
    const e1subs = "^             !";
    const expected = "--b--c--d--e--|";

    expectObservable(e1.takeWhileInclusive(() => true)).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it("should take all elements while predicate returns any value converted to true", () => {
    const e1 = hot("--a-^-b--c--d--e--|");
    const e1subs = "^             !";
    const expected = "--b--c--d--e--|";

    expectObservable(e1.takeWhileInclusive(<any> (() => {
      return {};
    }))).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it("should skip all elements after the predicate returns false", () => {
    const e1 = hot("--a-^-b--c--d--e--|");
    const e1subs = "^ !            ";
    const expected = "--(b|)         ";

    expectObservable(e1.takeWhileInclusive(() => false)).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it("should skip all elements after the predicate returned any value converted to false inclusive", () => {
    const e1 = hot("--a-^-b--c--d--e--|");
    const e1subs = "^ !            ";
    const expected = "--(b|)         ";

    expectObservable(e1.takeWhileInclusive(() => null)).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it("should take all elements until predicate return false inclusive", () => {
    const e1 = hot("--a-^-b--c--d--e--|");
    const e1subs = "^       !      ";
    const expected = "--b--c--(d|)   ";

    expectObservable(e1.takeWhileInclusive(x => x !== "d")).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it("should take elements with predicate when source does not complete", () => {
    const e1 = hot("--a-^-b--c--d--e--");
    const e1subs = "^             ";
    const expected = "--b--c--d--e--";

    expectObservable(e1.takeWhileInclusive(() => true)).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it("should not complete when source never completes", () => {
    const e1 = cold("-");
    const e1subs = "^";
    const expected = "-";

    expectObservable(e1.takeWhileInclusive(() => true)).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it("should complete when source does not emit", () => {
    const e1 = hot("--a-^------------|");
    const e1subs = "^            !";
    const expected = "-------------|";

    expectObservable(e1.takeWhileInclusive(() => true)).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it("should complete when source is empty", () => {
    const e1 = cold("|");
    const e1subs = "(^!)";
    const expected = "|";

    expectObservable(e1.takeWhileInclusive(() => true)).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it("should pass element index to predicate", () => {
    const e1 = hot("--a-^-b--c--d--e--|");
    const e1subs = "^       !      ";
    const expected = "--b--c--(d|)   ";

    expectObservable(e1.takeWhileInclusive((value, index) => index < 2)).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it("should raise error when source raises error", () => {
    const e1 = hot("--a-^-b--c--d--e--#");
    const e1subs = "^             !";
    const expected = "--b--c--d--e--#";

    expectObservable(e1.takeWhileInclusive(() => true)).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it("should raise error when source throws", () => {
    const source = cold("#");
    const subs = "(^!)";
    const expected = "#";

    expectObservable(source.takeWhileInclusive(() => true)).toBe(expected);
    expectSubscriptions(source.subscriptions).toBe(subs);
  });

  it("should invoke predicate until return false", () => {
    const e1 = hot("--a-^-b--c--d--e--|");
    const e1subs = "^       !      ";
    const expected = "--b--c--(d|)   ";

    let invoked = 0;

    function predicate(value) {
      invoked++;
      return value !== "d";
    }

    const source = e1.takeWhileInclusive(predicate).do(null, null, () => {
      expect(invoked).to.equal(3);
    });
    expectObservable(source).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it("should raise error if predicate throws", () => {
    const e1 = hot("--a-^-b--c--d--e--|");
    const e1subs = "^ !            ";
    const expected = "--#            ";

    function predicate(value) {
      throw "error";
    }

    expectObservable(e1.takeWhileInclusive(<any> predicate)).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it("should take elements until unsubscribed", () => {
    const e1 = hot("--a-^-b--c--d--e--|");
    const unsub = "-----!         ";
    const e1subs = "^    !         ";
    const expected = "--b---         ";

    expectObservable(e1.takeWhileInclusive(x => x !== "d"), unsub).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

  it("should not break unsubscription chain when unsubscribed explicitly", () => {
    const e1 = hot("--a-^-b--c--d--e--|");
    const unsub = "-----!         ";
    const e1subs = "^    !         ";
    const expected = "--b---         ";

    const result = e1
      .mergeMap((x: string) => Observable.of(x))
      .takeWhileInclusive(x => x !== "d")
      .mergeMap((x: string) => Observable.of(x));

    expectObservable(result, unsub).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });

});