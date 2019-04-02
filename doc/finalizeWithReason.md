# finalizeWithReason

*operator*

Just like `finalize()` but passes also `reason` to its callback why the chain is being disposed (chain completed, errored or on unsubscription).

```
finalizeWithReason<T>(callback: (reason: FinalizeReason) => void)
```

```
import { of, throwError, asyncScheduler } from 'rxjs';
import { finalizeWithReason, FinalizeReason } from 'rxjs-extra/operators';

of(1).pipe(
  finalizeWithReason((reason: FinalizeReason) => console.log(reason)),
).subscribe();

of(1, asyncScheduler).pipe(
  finalizeWithReason((reason: FinalizeReason) => console.log(reason)),
).subscribe().unsubscribe();

throwError('error').pipe(
  finalizeWithReason((reason: FinalizeReason) => console.log(reason)),
).subscribe({ error: () => void 0 });

/*
$ npm run demo -- demo/finalizeWithReason.ts
complete
unsubscribe
error
*/
```

Demo: [`demo/finalizeWithReason.ts`](https://github.com/martinsik/rxjs-extra/blob/master/demo/finalizeWithReason.ts)
