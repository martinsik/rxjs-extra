export default {
    entry: 'dist/es2015/RxPlus.js',
    dest: 'dist/es5/bundles/RxPlus.js',
    format: 'umd',
    moduleName: 'RxJS_Plus',
    external: name => name.indexOf('rxjs') === 0,
    sourceMap: true
};