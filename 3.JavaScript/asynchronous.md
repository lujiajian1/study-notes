# JavaScript的三座大山：异步（asynchronous）及事件循环（event loop）

### 微任务和宏任务

* 宏任务：setTimeout，setInterval, Ajax, DOM事件
* 微任务：Promise async/await MutationObserver
* 微任务执行时机比宏任务要早：微任务（ES6语法规定）DOM渲染前触发，宏任务（浏览器规定）DOM渲染后触发

### event loop（事件循环/事件轮询）

##### 什么是event loop

* js 是单线程执行的
    * 从前到后，一行行执行
    * 遇到报错，则下面代码停止执行
    * 先把同步代码执行完，再执行异步
* 异步要基于回调来实现
* event loop 就是异步回调的实现原理

##### event loop 执行过程

* 同步代码，一行一行放在 call stack(调用栈) 中执行
* 遇到异步，先“记录”下，等待时间（定时，网络请求等）
* 时机到了，就移动到 calllback queue（回调队列）
* 如果call stack 为空（即同步代码执行完），event loop开始工作
* 轮询查找callback queue，如有则移动到call stack 执行
* 继续轮询查找（永动机一样） 

```js
// 示例代码
console.log('Hi');

setTimeout(function cb1(){
    console.log('cb1');
}, 500)

console.log('Bye');
```
1. 将 console.log("Hi") 推入调用栈，调用栈会执行代码
2. 执行代码，控制台打印“Hi”，调用栈清空
3. 执行 setTimeout，setTimeout由浏览器定义，不是ES6的内容；将定时器放到Web APIs中，到时间后将回调函数放到回调函数队列中
4. 执行完了setTimeout， 清空调用栈
5. console.log("Bye")进入调用栈，执行，调用栈清空
6. 同步代码被执行完,，回调栈空，浏览器内核启动时间循环机制
7. 五秒之后，定时器将cb1推到回调函数队列中
8. 事件循环将cb1放入调用栈
![event loop](https://github.com/lujiajian1/study-notes/blob/main/img/event-loop.jpg)

##### event loop  和 DOM 渲染

* 每次 Call Stack 清空（即每次轮询结束），即同步任务执行完成
* 都是DOM重新渲染的机会，DOM结构如有改变则重新渲染
* 然后再去触发下一次的 event loop

##### 结合DOM渲染，微任务执行的 event loop 示意图
![event loop](https://github.com/lujiajian1/study-notes/blob/main/img/event-loop-DOM.png)
### 单线程和异步

* js是单线程语言，只能同时做一件事
* 浏览器和node.js支持js启动 进程（webWorker），但是js依然是单线程
* js和DOM渲染共用同一线程，因为js可修改DOM结构
* 遇到等待（定时器，网络请求）不能卡住，启动异步，回调callback函数

##### 异步和同步

* JS是单线程语言
* 异步不会阻塞代码执行
* 同步会阻塞代码执行。

##### 异步应用场景

* 网络请求，如ajax、图片加载
* 定时任务，如setTimeout

##### 异步的本质

* async/await 是消灭异步回调的终极武器
* js还是单线程，异步还是基于 event loop
* async/await 是一个语法糖，但是这个语法糖特别香
##### XMLHttpRequest
```js
const xhr = new XMLHttpRequest()
xhr.open('GET', '/data/test.json', true)
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            // console.log(
            //     JSON.parse(xhr.responseText)
            // )
            alert(xhr.responseText)
        } else if (xhr.status === 404) {
            console.log('404 not found')
        }
    }
}
xhr.send(null)
```
xhr.readuState
0：未初始化，还未调用send方法
1：载入，已调用send方法，正发送请求
2：载入完成，send方法执行完毕，已接收到全部响应内容
3：交互，正在解析响应内容
4：完成，响应内容解析完成，可以再客户端调用

### promise

##### 什么是promise
promise解决callback hell的问题
```js
function loadImg(src) {
    const p = new Promise(
        (resolve, reject) => {
            const img = document.createElement('img')
            img.onload = () => {
                resolve(img)
            }
            img.onerror = () => {
                const err = new Error(`图片加载失败 ${src}`)
                reject(err)
            }
            img.src = src
        }
    )
    return p
}

const url1 = 'https://img.mukewang.com/5a9fc8070001a82402060220-140-140.jpg'
const url2 = 'https://img3.mukewang.com/5a9fc8070001a82402060220-100-100.jpg'

loadImg(url1).then(img1 => {
    console.log(img1.width)
    return img1 // 普通对象
}).then(img1 => {
    console.log(img1.height)
    return loadImg(url2) // promise 实例
}).then(img2 => {
    console.log(img2.width)
    return img2
}).then(img2 => {
    console.log(img2.height)
}).catch(ex => console.error(ex))
```
##### 三种状态

* pending resolved rejected
* pending ----->resolved 或 pending ----->rejected
* 变化不可逆

##### 状态表现

* pending状态，不会出发then和catch
* resolved状态，会触发后续的then回调函数
* rejected状态，会出发后续的catch回调函数

##### then和catch改变状态

* then正常返回resolved，里面有报错则返回rejected
* catch正常返回resolved，里面有报错则返回rejected

#### Promise.then方法中的reject回调和catch中的回调有什么区别？
* reject后的东西，一定会进入then中的第二个回调，如果then中没有写第二个回调，则进入catch
```js
var p1=new Promise((resolve,rej) => {
    console.log('没有resolve')
    rej('失败了')
 
 })
 p1.then(data =>{
    console.log('data::',data);
 },err=> {
    console.log('err::',err)
 }).catch(
    res => {
    console.log('catch data::', res)
 })

//结果
//没有resolve
//err:: 失败了

var p1=new Promise((resolve,rej) => {
    console.log('没有resolve')
    rej('失败了')
 })
 p1.then(data =>{
    console.log('data::',data);
 }).catch(
    res => {
    console.log('catch data::', res)
 })

//结果：
//没有resolve
//catch data:: 失败了

var p1=new Promise((resolve,rej) => {
    console.log('没有 resolve')
    rej('失败了')
 
 })
 p1.catch(
    res => {
    console.log('catch data::', res)
 })

//结果：
//没有resolve
//catch data:: 失败了
```
* resolve的东西，一定会进入then的第一个回调，肯定不会进入catch
```js
var p1=new Promise((resolve,rej) => {
    console.log('resolve')
    resolve('成功了')
 
 })
 p1.then(data =>{
    console.log('data::',data);
 }).catch(
    res => {
    console.log('catch data::', res)
 })
//结果：
//resolve
//data:: 成功了
```


##### async/await

* 执行 async 函数返回的是 Promise 对象
* await 相当于 Promise的 then
* try...catch...可捕获异常，代替 Promise 的 catch