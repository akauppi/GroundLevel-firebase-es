//import replace from "@rollup/plugin-replace";

module.exports = {
  alias: {
    // key "must start and end with a slash" (Vite)
    //'/@/': path.resolve(__dirname, 'src')
  },
  minify: false

  /* tbd. try out rollup replace options, some day
  rollupOutputOptions: {
    plugins: [
      // Does this affect the contents of imported modules, as well?
      replace({
        'abc': '"ABC"',
        'import * as firebase from': 'import firebase from'
      })
    ]
  }*/
}
