export default {
  entry: './dist/es5/umd.js',
  dest: './dist/es5/bundles/rxjs-extra.umd.js',
  format: 'umd',
  moduleName: 'RxJS_Extra',
  external: name => name.indexOf('rxjs') === 0,
  sourceMap: true
};
