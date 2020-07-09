const path = require('path');

module.exports = {
  alias: {
    // Note: path anchors must "begin and end with a slash" (Vite)
    // BUG #19: It still doesn't work. How to use this??
    '/@/': path.resolve(__dirname,'src'),
    '/@refs/': path.resolve(__dirname,'src/refs')
    //...
  },
  minify: false,
}
