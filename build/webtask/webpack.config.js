
module.exports = {
  entry: ['babel-polyfill','./server/index.js'],
  output: {
    filename:'bundle.js',
    path: './dist',
    libraryTarget: 'commonjs2'
  },
  module: {
    loaders: [
      {loader: 'babel'}
    ]
  },
  externals: [
    {"request-promise": "request-promise"}
    ,{"express": "express"}
    ,{"body-parser": "body-parser"}
    ,{"webtask-tools": "webtask-tools"}
    ,{"url": "url"}
  ]
}
