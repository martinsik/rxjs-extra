import { assert } from "chai";

declare const global: any;

export const cold = global.cold;
export const hot = global.createHotObservable;
export const expectObservable = global.expectObservable;
export const expectSubscriptions = global.expectSubscriptions;
