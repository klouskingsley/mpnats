# 微信/支付宝/百度的[nats](https://nats.io)客户端

## 安装

```
$ npm install nats -S
```

## 使用

- 微信小程序

```js
const Nats = require('nats/wx')
const nats = new Nats()
nats.connect({url: 'wss://younatsserver.io'})
    .then(() => {
        return nats.subscribe('topic1', function (data) {
            console.log('topic1 data received: ', data)
        })
    })
```

- 支付宝小程序

```js
const Nats = require('nats/alipay')
const nats = new Nats()
nats.connect({url: 'wss://younatsserver.io'})
    .then(() => {
        return nats.subscribe('topic1', function (data) {
            console.log('topic1 data received: ', data)
        })
    })
```

- 百度小程序

```js
const Nats = require('nats/baidu')
const nats = new Nats()
nats.connect({url: 'wss://younatsserver.io'})
    .then(() => {
        return nats.subscribe('topic1', function (data) {
            console.log('topic1 data received: ', data)
        })
    })
```

## Api

#### 订阅

```
nats.subscribe(topic: string, callback: Function): Promise<sid: number>

返回Promise, promise resolve 表示订阅消息发送成功, promise reject 表示订阅消息发送失败
promise resolve会返回sid，可以用这个sid来取消订阅
```

例子

```js
const Nats = require('nats/wx')
const nats = new Nats()
(async function () {
    await nats.connect({url: 'wss://yournatserver.io'})
    const sid = await nats.subscribe('topic', function (data) {
        console.log('topic1 data received: ', data)
    })
})()
```

#### 取消订阅

```
nats.unsubscribe(sid: number): Promise<void>

返回Promise, promise resolve 表示取消订阅消息发送成功, promise reject 表示取消订阅消息发送失败
```

例子

```js
const Nats = require('nats/wx')
const nats = new Nats()
(async function () {
    await nats.connect({url: 'wss://yournatserver.io'})
    const sid = await nats.subscribe('topic', function (data) {
        console.log('topic1 data received: ', data)
    })
    await nats.unsubscribe(sid)
})()
```

#### 发送消息

```
nats.publish(topic: string, message: string)

返回Promise, promise resolve 表示发送消息成功, promise reject 表示发送消息失败
```
例子

```js
const Nats = require('nats/wx')
const nats = new Nats()
(async function () {
    await nats.connect({url: 'wss://yournatserver.io'})
    const sid = await nats.subscribe('topic', function (data) {
        console.log('topic1 data received: ', data)
    })
    await nats.publish('topic', 'hello topic')
})()
```

#### 关闭连接

```
nats.close()

返回Promise, promise resolve表示关闭成功, promise reject 表示关闭失败
```

例子

```js
const Nats = require('nats/wx')
const nats = new Nats()
(async function () {
    await nats.connect({url: 'wss://yournatserver.io'})
    await nats.close()
})()
```

#### 监听连接关闭

```
nats.on('close', callback: Function) // 监听关闭
nats.off('close', callback: Function) // 取消监听

```

例子


```js
const Nats = require('nats/wx')
const nats = new Nats()
nats.on('close', function () {
    console.log('nats连接由于某种原因关闭了')
})
nats.connect({url: 'wss://yournatserver.io'})
```

#### 监听连接出错

```
nats.on('error', callback: Function) // 监听出错
nats.off('error', callback: Function) // 取消监听
```

```js
const Nats = require('nats/wx')
const nats = new Nats()
nats.on('error', function () {
    console.log('nats连接由于某种原因出错了')
})
nats.connect({url: 'wss://yournatserver.io'})
```
