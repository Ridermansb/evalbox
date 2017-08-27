const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const webpack = require('webpack');
const {resolve, join} = require('path');

const host = 'localhost';
const port = 6001;

module.exports = {
    entry: {
        app: [
            'babel-polyfill',
            'react-hot-loader/patch',
            `webpack-dev-server/client?http://${host}:${port}`,
            './index.jsx',
        ],
        vendor: ['react', 'react-dom'],
        html: "./index.html",
    },
    output: {
        path: resolve('dist'),
        library: `[name]`,
        filename: `[name].js`,
        chunkFilename: `[id].[name].js`,
        publicPath: '/',
        sourceMapFilename: `[name].js.map`,
    },
    plugins: [
        new webpack.EnvironmentPlugin({NODE_ENV: 'development'}),
        new CompressionPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.(js|html)$/,
            threshold: 10240,
            minRatio: 0.8,
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.[hash].js',
            chunks: ['vendor'],
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.NamedModulesPlugin(),
        new ExtractTextPlugin({
            filename: `[name].css`,
            allChunks: true,
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            beautify: false,
            comments: false,
            parallel: {
                cache: true,
                workers: 2,
            },
            compress: {
                warnings: false,
                drop_console: true,
                screw_ie8: true,
            },
            mangle: {
                except: [
                    '$', 'webpackJsonp',
                ],
                screw_ie8: true,
                keep_fnames: true,
            },
            output: {
                comments: false,
                screw_ie8: true,
            },
        }),
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {assets: resolve(__dirname, 'assets')},
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: {
                    loader: 'file-loader',
                    query: {name: '[name].[ext]'},
                },
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {loader: 'babel-loader'},
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(eot|woff|woff2|ttf)$/,
                use: {
                    loader: 'file-loader',
                    query: {
                        limit: 30000,
                        name: '[name].[hash:8].[ext]',
                        outputPath: 'assets/fonts/',
                    },
                },
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                loaders: [
                    {
                        loader: 'file-loader',
                        query: {outputPath: 'assets/images/'},
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            query: {
                                progressive: true,
                                pngquant: {quality: '65-90', speed: 4},
                                mozjpeg: {progressive: true},
                                gifsicle: {interlaced: true},
                                optipng: {optimizationLevel: 7},
                            },
                        },
                    },
                ]
            },
        ]
    },
    devServer: {
        contentBase: join(__dirname, 'assets'),
        publicPath: '/',
        overlay: true,
        compress: true,
        host,
        port,
        hot: true,
        historyApiFallback: true,
        noInfo: true,
    }
};
