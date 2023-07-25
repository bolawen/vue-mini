import RollupPluginCommonjs from '@rollup/plugin-commonjs';
import RollupPluginResolve from '@rollup/plugin-node-resolve';
import RollupPluginTypescript from '@rollup/plugin-typescript';

export default [
  {
    input: 'src/platforms/web/runtime-with-compiler.ts',
    output: [
      {
        name: 'Vue',
        format: 'es',
        sourcemap: true,
        file: './dist/vue.js'
      }
    ],
    plugins: [
      RollupPluginResolve(),
      RollupPluginCommonjs(),
      RollupPluginTypescript({
        sourceMap: true
      })
    ]
  }
];
