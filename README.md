[![Build Status](https://travis-ci.org/martinsik/rxjs-plus.svg?branch=master)](https://travis-ci.org/martinsik/rxjs-plus)

# rxjs-plus
Collection of additional RxJS 5 operators

# Operators

## cache

## endWith

![endWith](https://raw.githubusercontent.com/martinsik/rxjs-plus/master/doc/endWith.png "The endWith() operator")

## queueTime

![queueTime](https://raw.githubusercontent.com/martinsik/rxjs-plus/master/doc/queueTime.png "The queueTime() operator")

## rateLimit

![rateLimit](https://raw.githubusercontent.com/martinsik/rxjs-plus/master/doc/rateLimit.png "The rateLimit() operator")


## takeWhileInclusive

![takeWhileInclusive](https://raw.githubusercontent.com/martinsik/rxjs-plus/master/doc/takeWhileInclusive.png "The takeWhileInclusive() operator")

# Testing

This repository uses the same `mocha` testing helpers as RxJS 5 including rendering marble diagrams.

To run the tests this repo needs to download the RxJS 5 archive, unpack it, copy helper scripts and patch them by [files from `spec-patch`](https://github.com/martinsik/rxjs-plus/tree/master/spec-patch).

In order to run tests do the following tests:

```
$ clone https://github.com/martinsik/rxjs-plus
$ cd rxjs-plus
$ npm i
$ npm run spec-setup && npm run test-build
$ npm run test
```
