import { assert } from "chai";

declare const global: any;

export const cold = (...args: any[]) => global.rxTestScheduler.createColdObservable.apply(global.rxTestScheduler, args);
export const hot = (...args: any[]) => global.rxTestScheduler.createHotObservable.apply(global.rxTestScheduler, args);
export const expectObservable = (...args: any[]) => global.rxTestScheduler.expectObservable.apply(global.rxTestScheduler, args);
export const expectSubscriptions = (...args: any[]) => global.rxTestScheduler.expectSubscriptions.apply(global.rxTestScheduler, args);
