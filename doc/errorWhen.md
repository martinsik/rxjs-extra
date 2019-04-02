# errorWhen

*operator*

Emits an `error` notification when a value matches the predicate function. If value matches the predicate, `errorWhen` will emit an error based on `errorOrFactory` parameter.

```
errorWhen<T>(predicate: (value: T) => boolean, errorOrFactory: ErrorOrErrorFactory = new Error())
```

![errorWhen](https://raw.githubusercontent.com/martinsik/rxjs-extra/master/doc/marble-diagrams/errorWhen.png "The errorWhen() operator")

The `errorOrFactory` parameter can be one of the following:
 
- A method that receives the value that passed the predicate and that has to return an object that will be thrown.

- An object that will be thrown.

```
import { range } from 'rxjs';
import { errorWhen } from 'rxjs-extra/operators';

range(10).pipe(
  errorWhen(v => v === 3),
).subscribe({
  next: (v) => console.log(v),
  error: (e) => console.log(e.constructor.prototype.name),
});

/*
$ npm run demo -- demo/errorWhen.ts
0
1
2
Error
*/
```

Demo: [`demo/errorWhen.ts`](https://github.com/martinsik/rxjs-extra/blob/master/demo/errorWhen.ts)
