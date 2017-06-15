const Observable = require('rxjs/Observable').Observable;
const Subject = require('rxjs/Subject').Subject;
require('rxjs/add/observable/range');
require('../dist/cjs/add/operator/takeWhileInclusive');

Observable.range(1, 6)
    .takeWhileInclusive(n => n !== 4)
    .subscribe(console.log);
