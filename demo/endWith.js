/**
 * This demo shows the most basic usage the endWith() operator
 */
const Observable = require('rxjs/Observable').Observable;
require('rxjs/add/observable/of');
require('../dist/cjs/add/operator/endWith');

Observable.timer(0, 1000)
    .take(3)
    .endWith('Hello', 'World!')
    .subscribe(console.log);
