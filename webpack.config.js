/* eslint-env node */

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const merge = require('webpack-merge');
const { resolve } = require('path');
const package_ = require('./package.json');
const webpackProductionConfig = require('./webpack.production')
const webpackDevelopmentConfig = require('./webpack.development')

/**
 * Assume version as git describe
 * @see https://medium.com/bind-solution/dynamic-version-update-with-git-describe-477e8cd2a306
 */
const gitRevisionPlugin = new GitRevisionPlugin();

require('dotenv').config();

const sourceFolder = resolve(__dirname, 'src');

module.exports = function(environment, opts) {
    const mode = opts.mode || 'development';
    const appVersion = gitRevisionPlugin.version();
    console.log(
        'Building version "%s" with webpack in "%s" mode',
        appVersion,
        mode
    );

    const defaultConfig = {
        target: 'web',
        entry: {
            vendor: ['react', 'react-dom', 'semantic-ui-css'],
        },
        plugins: [
            new webpack.DefinePlugin({
                "require.specified": "require.resolve",
                __VERSION__: JSON.stringify(appVersion),
                __DEVELOPMENT__: JSON.stringify(mode === 'development'),
                __PRODUCTION__: JSON.stringify(mode === 'production'),
            }),
            new webpack.EnvironmentPlugin({
                NODE_ENV: 'development',
            }),
            new HtmlWebpackPlugin({
                title: 'EvalBox',
                favicon: resolve(sourceFolder, '../favicon.png'),
                template: resolve(__dirname, 'src', 'index.ejs'),
                minify: {collapseWhitespace: true},
                inlineSource: 'runtime.+\\.js',
            }),
            new FaviconsWebpackPlugin({
                logo: resolve(__dirname, 'favicon.png'),
                persistentCache: true,
                cache: true,
                inject: true,
                favicons: {
                    appName: package_.name,
                    appDescription: package_.description,
                    developerName: 'ridermansb',
                    background: '#ffffff',
                    theme_color: '#00aba9',
                },
            }),
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery',
            }),
            new MiniCssExtractPlugin(),
            new webpack.HashedModuleIdsPlugin(),
        ],
        resolve: {
            extensions: ['.js', '.jsx'],
        },
        module: {
            rules: [
                {
                    test: /\.m?jsx?$/i,
                    exclude: /node_modules|dist|vendors/,
                    include: [sourceFolder],
                    use: {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true, // important for performance
                        },
                    },
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


    const modeConfig = {
        production: webpackProductionConfig,
        development: webpackDevelopmentConfig,
    };

    return merge.merge(defaultConfig, modeConfig[mode] || {});
};
