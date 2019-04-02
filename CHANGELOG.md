### 2.0.0

Complete rewrite that supports RxJS 6 and pipable operators.

**Features**

- **delayComplete** - Operator added.
- **errorWhen** - Operator added.
- **finalizeWithReason** - Operator added.
- **randomDelay** - Operator added.
- **retryTime** - Operator added.
- **takeUntilComplete** - Operator added.
- **tapSubscribe** - Operator added.
- **presetTimer** - Observable creation method added.
- **randomTimer** - Observable creation method added.
- **DebugObserver** - Observer added.

**Breaking changes**

- **cache** - For now doesn't catch errors. Will need to reconsider what should be the expected behavior from this.

**Deprecations**

- **endWith** - Removed as it's supported by RxJS out of the box
- **takeWhileInclusive** - Removed as it's supported by RxJS out of the box
- **rateLimit** - Although it was a useful operator its functionality was so complicated that it was very hard to understand what it does.
