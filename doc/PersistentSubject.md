# PersistentSubject

*Subject*

```
new PersistentSubject<T>(storageKey: string, defaultValue: T, storage: PersistentStorage<T> = localPersistentStorage)
```

Just like `BehaviorSubject` but stores every item in a persistent storage (by default `LocalStorage`) under a user defined `storageKey`. `PersistentSubject` tries to load its default value from `storage` and only when there's none it uses `defaultValue` parameter.

The purpose of `PersistentSubject` is to create a `BehaviorSubject` with a persistent value among browser page reloads.

```
import { PersistentSubject } from 'rxjs-extra';
import { mockStorage } from 'rxjs-extra/mock';

// using in-memory `mockStorage` for testing purposes
const s1 = new PersistentSubject('my-key', 'default', mockStorage);
s1.subscribe(console.log);
s1.next(1);
s1.next(2);

const s2 = new PersistentSubject('my-key', null, mockStorage);
s2.subscribe(console.log);

/*
$ npm run demo -- demo/PersistentSubject.ts

default
1
2
2
*/
```

Demo: [`demo/PersistentSubject.ts`](https://github.com/martinsik/rxjs-extra/blob/master/demo/PersistentSubject.ts)
