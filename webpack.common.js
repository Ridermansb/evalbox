// Follow https://webpack.js.org/guides/production/

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { resolve } = require('path');

require('dotenv').config();

module.exports = {
    entry: {
        vendor: ['react', 'react-dom', 'semantic-ui-css'],
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
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'development',
        }),
        new webpack.DefinePlugin({
            "require.specified": "require.resolve"
        }),
        new HtmlWebpackPlugin({
            title: 'Evalbox',
            template: resolve(__dirname, 'ui', 'index.tpl.html'),
            minify: { collapseWhitespace: true },
        }),
        new FaviconsWebpackPlugin({
            logo: resolve(__dirname, 'favicon.png'),
            persistentCache: true,
            icons: {
                android: false,
                appleIcon: false,
                appleStartup: true,
                coast: false,
                favicons: true,
                firefox: true,
                opengraph: false,
                twitter: false,
                yandex: false,
                windows: false
            }
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
        }),
        new CompressionPlugin({
            algorithm: 'gzip',
            test: /\.(js|html)$/,
            threshold: 10240,
            minRatio: 0.8,
        }),
        new MiniCssExtractPlugin()
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            assets: resolve(__dirname, 'ui', 'assets'),
            components: resolve(__dirname, 'ui', 'components')
        },
    },
    module: {
        rules: [
            {
                test: /\.(html)$/,
                use: {loader: 'file-loader'},
                exclude: [ resolve(__dirname, 'ui', 'index.tpl.html'), ]
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {loader: 'babel-loader'},
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
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
                use: [
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
    }
};
