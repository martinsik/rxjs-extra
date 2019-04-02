# cache

*operator*

Operator that stores and replays its cached value for a period of time.

```
cache<T>(windowTime: number, mode: CacheMode = CacheMode.Default, scheduler?: SchedulerLike)
```

This operator works in three different modes:

- `Default` - The default behavior that just stores and replays the cached value for a period of time:
  
   ```
   cache(1000)
   ```

  This is equivalent of using the following operator chain:

   ```
   publishReplay(1, 1000),
   refCount(),
   take(1),
   ```
      
   Demo: [`demo/cache.ts`](https://github.com/martinsik/rxjs-extra/blob/master/demo/cache.ts)

- `TolerateExpired` - The operators emits one or two items depending on whether the currently cached item has expired:

   ```
   cache(1000, CacheMode.TolerateExpired)
   ```
   
   - When the cached item is still fresh it works just like in the `Default` mode. The cache item is emitted and the operators completes immediately.
   
   - When the cached item is already expired it emits it anyway immediately but at also subscribes to the source Observable that is supposed to emit another fresh item that is stored by the operator instead of the expired one. This means that in this case the operator emits two items, the old one and then the new one. The complete notification is sent after the new item is emitted.
   
   Demo: [`demo/cache_tolerate_expired.ts`](https://github.com/martinsik/rxjs-extra/blob/master/demo/cache_tolerate_expired.ts)

- `SilentRefresh` - The operator emits always only the current one item no matter whether it has already expired or not:
 
   ```
   cache(1000, CacheMode.SilentRefresh)
   ```
 
   - When it's not expired it's emitted and the operator send complete notification immediately.
   
   - When its already expired the operator will subscribe to its source Observable and wait until it produces a new item that is stored instead of the expired one. However, the new item is not sent to the observer and is silently surpressed. The operator sends complete notification only after the new item is received from the source Observable.
   
   Demos: [`demo/cache_silent_refresh.ts`](https://github.com/martinsik/rxjs-extra/blob/master/demo/cache_silent_refresh.ts) and [`demo/cache_silent_refresh_02.ts`](https://github.com/martinsik/rxjs-extra/blob/master/demo/cache_silent_refresh_02.ts).
