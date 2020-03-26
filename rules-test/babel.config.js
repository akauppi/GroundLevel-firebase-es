module.exports = {
  presets: [
    ['@babel/preset-env',
      {
        targets: { node: 'current' }
      },
    ]
    /* tbd. Typescript currently not enabled
    ['@babel/preset-typescript']
    */
  ]
};
