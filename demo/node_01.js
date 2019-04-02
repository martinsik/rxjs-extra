const { map } = require('rxjs/operators');
const { randomTimer } = require('../dist/package');
const { tapSubscribe } = require('../dist/package/operators');

randomTimer(100, 2000).pipe(
  tapSubscribe(() => console.log('subscribed')),
  map(i => String.fromCharCode(97 + i)),
).subscribe(console.log);
