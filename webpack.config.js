/*
 * Custom webpack config that gets merged into default config
 */

import webpack from 'webpack';

export default function generateConfig(environment) {
  return {
    module: {
      loaders: [
        {
          test: /\.scss$/,
          loaders: ['style', 'css', 'sass']
        },
        {
          test: /\.css$/,
          loaders: ['style', 'css']
        },
        {
          test: /\.(eot|otf|svg|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'file-loader'
        }
      ]
    }
  };
}
