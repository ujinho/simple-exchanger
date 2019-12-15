import path from 'path';
import merge from 'webpack-merge';

// just for typings injection
import 'webpack-dev-server';

/**
 * Плагин формирования html с чанками
 */
import HtmlWebpackPlugin from 'html-webpack-plugin';
/**
 * Оптимизактор js
 */
import TerserJsPlugin from 'terser-webpack-plugin';
/**
 * экстрактор и сплиттер css (делает кусочки css, связанные с js-файлом, импортящем стили)
 */
import CssExtractPlugin from 'extract-css-chunks-webpack-plugin';
/**
 * Оптимизатор css (по умолчанию юзает cssnano)
 */
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';

/**
 * Лоадеры стилей
 */
import styleLoaders from './style-loaders';

/**
 * Общая часть конфига
 */
import common from './webpack.config.common';

const srcPath = path.resolve(__dirname, '../src');
const entry = path.join(srcPath, 'index.tsx');
const distPath = path.resolve(__dirname, '../dist');

const filename = '[name].js';
const chunkFilename = '[name].[hash].js';

export default merge(common, {
	target: 'web',
	mode: 'production',
	entry: {
		main: [ path.resolve(__dirname, entry) ]
	},
	output: {
		filename,
		chunkFilename,
		path: distPath,
		publicPath: '/'
	},
	devtool: false,
	module: {
		rules: [ ...styleLoaders(true) ]
	},
	optimization: {
		minimizer: [
			new TerserJsPlugin({
				cache: true,
				sourceMap: true,
				parallel: 4,
				terserOptions: {
					ecma: undefined,
					warnings: false,
					parse: {},
					compress: true,
					mangle: true,
					module: false,
					output: null,
					toplevel: false,
					nameCache: null,
					ie8: false,
					keep_classnames: undefined,
					keep_fnames: false,
					safari10: false
				}
			})
		],
		splitChunks: {
			chunks: 'async',
			minSize: 30000,
			maxSize: 300000,
			minChunks: 2,
			maxAsyncRequests: 5,
			maxInitialRequests: 3,
			automaticNameDelimiter: '-',
			name: true,
			cacheGroups: {
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					enforce: true,
					chunks: 'all',
					reuseExistingChunk: true
				},
				default: {
					minChunks: 2,
					priority: -20,
					reuseExistingChunk: true
				}
			}
		},
		runtimeChunk: true
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
			minify: {}
		}),
		new CssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[name].[hash].css'
		}),
		new OptimizeCssAssetsPlugin()
	]
});
