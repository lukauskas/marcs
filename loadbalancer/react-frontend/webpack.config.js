// Based on https://github.com/przemek-nowicki/multi-page-app-with-react
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const TEMPLATE = path.join('src', 'pages', 'template.html');

const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = (env, argv) => ({
    entry: {
        index: './src/pages/index',
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].[hash:4].js',
        publicPath: '/',
    },
    devServer: {
        compress: true,
        historyApiFallback: true,
    },
    devtool: argv.mode === 'production' ? false : 'eval-source-maps',
    plugins: [
        new LodashModuleReplacementPlugin,
        new HtmlWebPackPlugin({
           chunks: ['index', 'vendor', 'data'],
           template: TEMPLATE,
           filename: 'index.html',
        }),
    ],
    resolve: {
        alias: {
            src: path.resolve(__dirname, 'src'),
            components: path.resolve(__dirname, 'src', 'components'),
            data: path.resolve(__dirname, 'data'),
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react',
                        ],
                        plugins: ['@babel/plugin-proposal-class-properties'],
                    },
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(svg|jpg|gif|png)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: (url, resourcePath, context) => {
                                if (argv.mode === 'development') {
                                    const relativePath = path.relative(context, resourcePath);
                                    return `${relativePath}`;
                                }
                                return `assets/images/${path.basename(resourcePath)}`;
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: (url, resourcePath, context) => {
                                if (argv.mode === 'development') {
                                    const relativePath = path.relative(context, resourcePath);
                                    return `${relativePath}`;
                                }
                                return `assets/fonts/${path.basename(resourcePath)}`;
                            },
                        },
                    },
                ],
            }],
    },
    optimization: {
        minimize: argv.mode === 'production',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /node_modules/,
                    chunks: 'initial',
                    name: 'vendor',
                    enforce: true,
                },
                data: {
                    test: /data/,
                    chunks: 'initial',
                    name: 'data',
                    enforce: true,
                },
            },
        },
    },
});
