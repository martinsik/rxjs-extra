#!/bin/bash

npm run bundle_es5
npm run build_cjs
npm run test_build_run

rm -rf dist/package
mkdir -p dist/package

cp -R dist/cjs/ dist/package
cp -R dist/es5/bundles dist/package/bundles
cp -R src dist/package/src
cp README.md dist/package
cp package.json dist/package
