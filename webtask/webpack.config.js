
module.exports = {
  entry: ['./server/index.js'],
  output: {
    filename:'bundle.js',
    path: './dist',
    libraryTarget: 'commonjs2'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel'
      }
    ]
  },
  externals: [
    {"request-promise": "request-promise"}
    ,{"express": "express"}
    ,{"body-parser": "body-parser"}
    ,{"webtask-tools": "webtask-tools"}
    ,{"auth0-extension-tools": "auth0-extension-tools"}
    ,{"url": "url"}
    ,{"fs": "fs"}
    ,{"babel-runtime": "babel-runtime"}
  ]
}
