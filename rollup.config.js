import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import visualizer from 'rollup-plugin-visualizer';
import { terser } from 'rollup-plugin-terser';
import { getFiles } from './scripts/buildUtils';

const extensions = ['.js', '.ts', '.jsx', '.tsx'];

export default {
    input: [
        ...getFiles('./src/lib', extensions),
    ],
    output: {
        dir: 'dist',
        format: 'esm',
        preserveModules: true,
        preserveModulesRoot: 'src',
        sourcemap: true,
    },
    plugins: [
        resolve(),
        commonjs(),
        typescript({
            tsconfig: './tsconfig.build.json',
            declaration: true,
            declarationDir: 'dist',
        }),
        postcss(),
        terser(),
        visualizer({
            filename: 'bundle-analysis.html',
            open: true,
        }),
    ],
    external: [
        'react',
        'react-dom',
        'redux-toolkit',
        'styled-components',
        'react-is',
        'redux-observable',
        'rxjs'
    ],
};