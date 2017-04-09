/**
 * Created by BANO.notIT on 09.04.17.
 */

var sass = require('node-sass'),
    parse = require('css').parse;

var compiled = sass.renderSync({
    file: './source.sass',
    // outputStyle: 'compressed',
    outFile: 'test.css',
    sourceMap: false // or an absolute or relative (to outFile) path
});

var rules = parse(compiled.css + '').stylesheet.rules,
    result = {};

rules.forEach(function (rule) {
    if (rule.type !== 'rule')
        return;

    var declarations = {};

    rule.declarations.forEach(function (decl) {

        if (decl.type === 'declaration')
            declarations[decl.property] = decl.value;

    });

    var key = Object.keys(declarations)
        .sort()
        .map(function (key) {
            return key + ':' + declarations[key];
        })
        .join(';');


    result[key] = (result[key] || []).concat(rule.selectors);

});

result = Object.keys(result)
    .map(function (key) {
        return result[key].join(',') + '{' + key + '}';
    })
    .join('');

console.log(result);