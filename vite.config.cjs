
module.exports = {
  minify: false,
  alias: {
    // Q: How to make this to work?? #help #vite
    '/@/': require('path').resolve(__dirname, 'src')
  }
}
