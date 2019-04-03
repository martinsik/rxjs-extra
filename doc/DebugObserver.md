# DebugObserver

*Observer*

Observer for debugging purposes that timestamps each notification with time offset since the instance was created.

```
new DebugObserver(identifier: string, logger = console.debug, scheduler?: SchedulerLike)
```

Each notification is prefixed with user identifier for this `DebugObserver` instance and the notification type:

- `N` for next notifications 
- `E` for error notifications 
- `C` for complete notifications 

The format for each log is as follows:

```
[${identifier}]${notificationType}@${timestamp}: ${value}
```

```
import { presetTimer, DebugObserver } from 'rxjs-extra';

presetTimer([500, 1000, 2000])
  .subscribe(new DebugObserver('MyObs'));

/*
[MyObs]N@    510: 0
[MyObs]N@   1522: 1
[MyObs]N@   3523: 2
[MyObs]C@   3523:
*/
```

Demo: [`demo/DebugObserver.ts`](https://github.com/martinsik/rxjs-extra/blob/master/demo/DebugObserver.ts)
