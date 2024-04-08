const path = require("path");

const baseConfig = {
    // bundling mode
    mode: 'production',

    // file resolutions
    resolve: {
        extensions: ['.ts', '.js'],
        fallback: {}
    },
    module: {
        rules: [
            {
                // test: /\.tsx?/,
                exclude: /node_modules/,
                use: 'ts-loader',
            }
        ]
    },
    devtool: "source-map",
    output: {
        path: path.resolve(__dirname, "lib"),
        globalObject: "this",
        filename: "[name].js",
        library: "sm",
        libraryTarget: "umd",
        libraryExport: "default",
        umdNamedDefine: true
    },
};

const configsModules = [
    {
        name: "levenshtein",
        entry: {"levenshtein.min": path.join(__dirname, "/src/algorithms/levenshtein.ts")},
        output: {library: "Levenshtein"},
    },
    {
        name: "greedy",
        entry: {"greedy.min": path.join(__dirname, "/src/algorithms/greedy.ts")},
        output: {library: "Greedy"},
    },
    {
        name: "dice-coefficient",
        entry: {"dice-coefficient.min": path.join(__dirname, "/src/algorithms/dice-coefficient.ts")},
        output: {library: "DiceCoefficient"},
    }
];


const configs = configsModules.map(function (config) {
    return Object.assign({}, baseConfig, {
        name: config.name,
        entry: config.entry,
        output: Object.assign({}, baseConfig.output, config.output),
        plugins: config.plugins
    });
});

const notMinify = configs.map(function (config) {
    const entry = {}, key = Object.keys(config.entry)[0];
    entry[key.replace(".min", "")] = config.entry[key];
    return Object.assign({}, config, {
        entry: entry,
        optimization: {minimize: false},
        plugins: []
    });
});

module.exports = notMinify.concat(configs);
