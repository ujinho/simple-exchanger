/**
 * экстрактор и сплиттер css (делает кусочки css, связанные с js-файлом, импортящем стили)
 */
import CssExtractPlugin from 'extract-css-chunks-webpack-plugin';
/**
 * Плагины PostCSS
 */
import autoprefixer from 'autoprefixer';
// @ts-ignore
import postCssImport from 'postcss-import';

const styleOrChunksLoader = (isProduction: boolean) =>
  !isProduction
    ? 'style-loader'
    : {
      loader: CssExtractPlugin.loader,
      options: {
        modules: false,
      }
    };


export default (isProduction: boolean) => [
  {
    test: /\.css$/,
    use: [
      styleOrChunksLoader(isProduction),
      'css-loader',
    ]
  },
  {
    test: /\.styl$/,
    exclude: /node_modules/,
    use: [
      styleOrChunksLoader(isProduction),
      'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          plugins: () => [
            autoprefixer,
            postCssImport
          ],
        },
      },
      'stylus-loader'
    ]
  },
];
