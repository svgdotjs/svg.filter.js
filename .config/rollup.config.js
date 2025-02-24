import pkg from "../package.json" with { type: 'json' }
import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
import { terser } from 'rollup-plugin-terser'

const buildDate = Date()

const headerLong = `/*!
* ${pkg.name} - ${pkg.description}
* @version ${pkg.version}
* ${pkg.homepage}
*
* @copyright ${pkg.author.name}
* @license ${pkg.license}
*
* BUILT: ${buildDate}
*/;`

const headerShort = `/*! ${pkg.name} v${pkg.version} ${pkg.license}*/;`

const getBabelConfig = (node = false) => {

  let targets = pkg.browserslist
  const plugins = [
    ['@babel/transform-runtime', {
      version: "^7.14.5",
      regenerator: false,
      useESModules: true
    }],
    ["polyfill-corejs3", {
      "method": "usage-pure"
    }]
  ]

  if (node) {
    targets = 'maintained node versions'
  }

  return babel({
    include: 'src/**',
    babelHelpers: 'runtime',
    babelrc: false,
    targets: targets,
    presets: [['@babel/preset-env', {
      modules: false,
      // useBuildins and plugin-transform-runtime are mutually exclusive
      // https://github.com/babel/babel/issues/10271#issuecomment-528379505
      // use babel-polyfills when released
      useBuiltIns: false,
      bugfixes: true,
      loose: true
    }]],
    plugins
  })
}

// When few of these get mangled nothing works anymore
// We loose literally nothing by let these unmangled
const classes = [
  'Filter'
]

const config = (node, min, esm = false) => ({
  external: ['@svgdotjs/svg.js'],
  input: 'src/svg.filter.js',
  output: {
    file: esm ? './dist/svg.esm.js'
      : node ? './dist/svg.filter.node.cjs'
      : min ? './dist/svg.filter.min.js'
      : './dist/svg.filter.js',
    format: esm ? 'esm' : node ? 'cjs' : 'iife',
    name: 'SVG.Filter',
    sourcemap: true,
    banner: headerLong,
    // remove Object.freeze
    freeze: false,
    exports: 'auto',
    globals: {
      '@svgdotjs/svg.js': 'SVG',
    },
  },
  treeshake: {
    // property getter have no sideeffects
    propertyReadSideEffects: false
  },
  plugins: [
    resolve({ browser: !node }),
    commonjs(),
    getBabelConfig(node),
    filesize(),
    !min ? {} : terser({
      mangle: {
        reserved: classes
      },
      output: {
        preamble: headerShort
      }
    })
  ]
})

// [node, minified]
const modes = [[false], [false, true], [true]]

export default modes.map(m => config(...m))
