const gulp = require('gulp')
const rollup = require('rollup')
const rollupConfig = require('./rollup.config')
const cp = require('cp-file')

const path = require('path')

gulp.task('rollup-wx', function () {
    const inputConfig = rollupConfig.getInputConfig('wx')
    const outputCoinfig = rollupConfig.getOutputConfig('wx')
    return rollup.rollup(inputConfig)
        .then(function (bundle) {
            bundle.write(outputCoinfig)
        })
        .then(() => {
            return cp(path.resolve(__dirname, './wx.js'), path.resolve(__dirname, './examples/mp-fragment/utils/', 'wx-nats.js'))
        })
})

gulp.task('rollup-baidu', function () {
    const inputConfig = rollupConfig.getInputConfig('baidu')
    const outputCoinfig = rollupConfig.getOutputConfig('baidu')
    return rollup.rollup(inputConfig)
        .then(function (bundle) {
            bundle.write(outputCoinfig)
        })
        .then(() => {
            return cp(path.resolve(__dirname, './baidu.js'), path.resolve(__dirname, './examples/baidu-program/utils/', 'wx-nats.js'))
        })
})

gulp.task('default', ['rollup-wx'])