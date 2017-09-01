/**
 * Created by BANO.notIT on 09.04.17.
 */

const
    sass = require('node-sass'),
    parse = require('css').parse;

function compute() {

    const compiled = sass.renderSync({
        file: './source.sass',
        // outputStyle: 'compressed',
        // outFile: 'test.css',
        // sourceMap: true // or an absolute or relative (to outFile) path
    });

    // console.log(compiled);

    //noinspection JSUnresolvedVariable
    let rules = parse(compiled.css + '').stylesheet.rules,
        result = {};

    rules.forEach(function (rule) {
        if (rule.type !== 'rule')
            return;

        let declarations = {};

        //noinspection SpellCheckingInspection
        rule.declarations.forEach(function (decl) {

            if (decl.type === 'declaration')
                declarations[decl.property] = decl.value;

        });

        const key = Object.keys(declarations)
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

    return result;
}


if (module.parent === null)
    console.log(compute());

else
    module.exports = compute;