#!/usr/bin/env bash

npm run clean_package
npm run clean_cjs
npm run bundle_es5
npm run build_cjs
npm run build_types

mkdir -p dist/package

cp README.md dist/package
cp package.json dist/package
cp -R dist/cjs/ dist/package
cp -R dist/typings/ dist/package
cp -R dist/es5/bundles dist/package/bundles
cp -R src/ dist/package/src
