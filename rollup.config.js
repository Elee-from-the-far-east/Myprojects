import babel from '@rollup/plugin-babel';
import {terser}  from "rollup-plugin-terser";
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';



export default {
    input: 'js/main.js',

    output: {
        file: 'CSS/main.js',
        format: 'iife',
        sourcemap: 'inline'
    },
    plugins: [
        babel({ babelHelpers: 'bundled' }),
        // terser(),
        resolve({
            jsnext: true,
            main: true,
            browser: true,
            preferBuiltins: true
        }),
        commonjs({
            include: /node_modules/
        })

    ]
};
