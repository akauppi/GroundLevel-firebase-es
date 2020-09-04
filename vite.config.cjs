// vite.config.cjs

module.exports = {
  minify: true,
  alias: {
    // Q: How to make this to work?? #help #vite
    '/@/': require('path').resolve(__dirname, 'src')
  }
}
