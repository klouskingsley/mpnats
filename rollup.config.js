const babel = require('rollup-plugin-babel')

exports.getInputConfig = (type) => {
    return {
        input: `src/${type}-nats.js`,
        plugins: [
            babel({
                include: '**/*.js',
                exclude: 'node_modules/**'
            })
        ]
    }
}

exports.getOutputConfig = (type) => {
    return {
        file: `dist/${type}-nats.js`,
        format: 'umd',
        name: 'Nats'
    }
}