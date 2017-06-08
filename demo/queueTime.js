const Observable = require('rxjs/Observable').Observable;
require('../dist/cjs/add/operator/queueTime');

Observable.range(1, 10)
    .queueTime(1000)
    .subscribe(console.log);
