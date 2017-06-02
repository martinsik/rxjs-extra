export default {
    entry: 'dist/es6/index.js',
    dest: 'dist/es5/bundles/RxPlus.js',
    format: 'umd',
    moduleName: 'RxJS_Plus',
    external: name => name.indexOf('rxjs') === 0,
    sourceMap: true
};