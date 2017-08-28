const webpack = require('webpack');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: 'cheap-module-source-map',
    entry: {
        app: [
            'babel-polyfill',
            './index.jsx',
        ],
    },
    plugins: [
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
                except: ['$', 'webpackJsonp' ],
                screw_ie8: true,
                keep_fnames: true,
            },
            output: {comments: false, screw_ie8: true},
        }),
        new CopyWebpackPlugin([
            { from: './wedeploy-ui.json/', to: 'wedeploy.json' },
        ]),
    ]
});