import path from 'path';
/**
 * Плагин формирования html с чанками
 */
import HtmlWebpackPlugin from 'html-webpack-plugin';

/**
 * Плагин для проверки тайпингов
 */
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

/**
 * Общий конфиг
 */
export default {
  entry: [
    "babel-runtime/regenerator", // это для кас-клиента
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.styl'],
    alias: {
      "api": path.resolve(__dirname, "../src/api"),
      "components": path.resolve(__dirname, "../src/components"),
      "const": path.resolve(__dirname, "../src/const"),
      "reducers": path.resolve(__dirname, "../src/reducers"),
      "types": path.resolve(__dirname, "../src/types"),
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            },
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        use: 'file-loader?name=public/[name].[hash].[ext]',
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
    new ForkTsCheckerWebpackPlugin(),
  ]
}
