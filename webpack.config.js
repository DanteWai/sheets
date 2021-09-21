const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')


module.exports = (env, argv) => {

	const mode = argv.mode || 'development'
	const prod = mode === 'production'
	const dev = !prod

	return {
		context: path.resolve(__dirname, 'src'),
		mode,
		entry: './index.js',
		output: {
			filename: 'bundle.[hash].js',
			path: path.resolve(__dirname, 'dist'),
			//publicPath: "/dist/"
		},
		resolve: {
			extensions: ['.js'],
			alias: {
				'@': path.resolve(__dirname, 'src'),
				'@core': path.resolve(__dirname, 'src/core'),
			}
		},
		devServer: {
			port: 3000,
			hot: dev,
		},
		plugins: [
			new HtmlWebpackPlugin({
				title: 'App',
				template: path.resolve(__dirname, './src/template.html'),
				filename: 'index.html',
			}),
			new CleanWebpackPlugin(),
			new MiniCssExtractPlugin({
				filename: 'bundle.[hash].css'
			}),
		],
		module: {
			rules: [
				//css/scss
				{
					test: /\.(scss|css)$/,
					use: [prod ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
				},
				//javascript
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: dev ? ['babel-loader', 'eslint-loader'] : ['babel-loader']
				},
				// images
				{
					test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
					type: 'asset/resource',
				},
				// fonts and SVG
				{
					test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
					type: 'asset/inline',
				},
			]
		},
		//eval //eval-cheap-source-map //eval-cheap-module-source-map //eval-source-map //'source-map',
		devtool: dev ? 'eval-source-map' : false,
		optimization: {
			minimizer: [
				'...',
				new CssMinimizerPlugin(),
			],
		},
	}
}
