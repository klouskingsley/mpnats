if (typeof wx !== 'undefined') {
    module.exports = require('./wx')
} else if (typeof swan !== 'undefined') {
    module.exports = require('./baidu')
} else if (typeof my !== 'undefined') {
    module.exports = require('./alipay')
} else {
    throw new Error('mpnats不支持当前环境')
}