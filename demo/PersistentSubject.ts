import { PersistentSubject } from '../src';
import { mockStorage } from '../src/mock/MockPersistentStorage';

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
