const path = require('path');
const webpack = require('webpack');

module.exports = (env, argv) => {
    return {
        entry: './src/index.js',
        mode: 'development', // development / production
        output: {
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/',
            filename: 'bundle.js'
        },
        module: {
            rules: [
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
                    test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
                    loader: 'url-loader?limit=100000'
                }
            ],
        },
        plugins: [
            new webpack.DefinePlugin({
                // creates a global PRODUCTION boolean const that can be evaluated anywhere
                'PRODUCTION': (argv.mode && argv.mode === "production")
            })
        ]
    };
};
