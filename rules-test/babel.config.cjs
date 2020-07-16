// tbd. remove when Jest supports node ES modules, natively.
//
module.exports = {
  presets: [
    ['@babel/preset-env',
      {
        targets: { node: 'current' }
      },
    ],
    ['@babel/preset-typescript']
  ]
};
