const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const DotenvWebpackPlugin = require('dotenv-webpack');

const dotEnvPlugin = new DotenvWebpackPlugin({
  path: path.resolve(__dirname, '../environments/.env.prod'),
  favicon: path.resolve(__dirname, '../src/assets/favicon.ico'),
  allowEmptyValues: true,
  safe: true,
  silent: true,
});

const htmlPlugin = new HtmlWebPackPlugin({
  template: 'public/index.html',
  hash: true,
  filename: '../dist/index.html',
});

module.exports = {
  entry: './src/index.jsx',
  devtool: false,
  mode: 'production',
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jp(e*)g|svg|gif)$/i,
        loader: 'url-loader',
        options: {
          name: '[path][name].[ext]',
          limit: 8192,
          fallback: require.resolve('file-loader'),
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
  },
  plugins: [htmlPlugin, dotEnvPlugin],
};
