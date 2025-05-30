# JavaScript的三座大山：异步（asynchronous）及事件循环（event loop）

# 了解异步
### 单线程和异步
* js 是单线程语言，任何时候只能做一件事情, 只有一个主线程，直到前面的操作完成，才能继续向下执行
* 浏览器和 node.js 支持 js 启动进程（webWorker），但是 js 依然是单线程
* js 和 DOM 渲染共用同一线程，因为 js 可修改 DOM 结构
* 遇到等待（定时器，网络请求）不能卡住，启动异步，异步不会阻塞代码执行，等待执行回调（callback）函数

### 异步应用场景
* 网络请求，如 ajax、图片加载
* 定时任务，如 setTimeout

### 异步的本质
* js 还是单线程，异步还是基于 event loop 实现的
* async/await 是消灭异步回调的终极武器，async/await 是一个语法糖，但是这个语法糖特别香

### 使用 XMLHttpRequest 请求接口
XMLHttpRequest（XHR）对象用于与服务器交互。通过 XMLHttpRequest 可以在不刷新页面的情况下请求特定 URL，获取数据。这允许网页在不影响用户操作的情况下，更新页面的局部内容。
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

# Promise

Promise 对象用于表示一个异步操作的最终完成 (或失败)及其结果值。一个 Promise 对象代表一个在这个 promise 被创建出来时不一定已知的值。它让您能够把异步操作最终的成功返回值或者失败原因和相应的处理程序关联起来。 这样使得异步方法可以像同步方法那样返回值：异步方法并不会立即返回最终的值，而是会返回一个 promise，以便在未来某个时候把值交给使用者。

### Promise 基本用法 
* Promise构造函数接受一个函数作为参数，该函数的两个参数分别是resolve和reject。它们是两个函数，由 JavaScript 引擎提供，不用自己部署。resolve函数的作用是，将Promise对象的状态从“未完成”变为“成功”（即从 pending 变为 resolved），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；reject函数的作用是，将Promise对象的状态从“未完成”变为“失败”（即从 pending 变为 rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。
```js
const promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});
```
* Promise实例生成以后，可以用then方法分别指定resolved状态和rejected状态的回调函数，then方法可以接受两个回调函数作为参数。第一个回调函数是Promise对象的状态变为resolved时调用，第二个回调函数是Promise对象的状态变为rejected时调用。第二个回调函数是 Promise.then 方法中的reject回调，它与 catch 中的回调是有区别的，下文会解释。
```js
promise.then(function(value) {
  // success
}, function(error) {
  // failure
});
```
* Promise 新建后就会立即执行。
```js
let promise = new Promise(function(resolve, reject) {
  console.log('Promise');
  resolve();
});

promise.then(function() {
  console.log('resolved.');
});

console.log('Hi!');

// Promise
// Hi!
// resolved
```
* 调用resolve或reject并不会终结 Promise 的参数函数的执行。这是因为立即 resolved 的 Promise 是在本轮事件循环的末尾执行，总是晚于本轮循环的同步任务。
```js
new Promise((resolve, reject) => {
  resolve(1); // 虽然执行了 resolve() 但是之后的 console.log(2) 依然执行了
  console.log(2);
}).then(r => {
  console.log(r);
});
// 2
// 1
```

### promise解决 callback hell（回调地狱）的问题
```js
const url1 = 'https://img.mukewang.com/5a9fc8070001a82402060220-100-100.jpg'
const url2 = 'https://img.mukewang.com/5a9fc8070001a82402060220-160-140.jpg'
const url3 = 'https://img.mukewang.com/5a9fc8070001a82402060220-100-100.jpg'
const url4 = 'https://img.mukewang.com/5a9fc8070001a82402060220-160-140.jpg'

// 使用回调
const loadImg = (src, callback) => {
    const img = document.createElement('img');
    img.onload = (e) => {
        callback(e.target);
    }
    img.src = src
}
loadImg(url1, (img) => {
    console.log(img.width);
    loadImg(url2, (img) => {
        console.log(img.width)
        loadImg(url3, (img) => {
            console.log(img.width)
            loadImg(url4, (img) => {
                console.log(img.width)
                console.log('done');
                // 如果继续回调的话，会一直嵌套下去，形成回调地狱
            })
        })
    })
})


// 使用Promise
function loadImg(src) {
    const p = new Promise(
        (resolve, reject) => {
            const img = document.createElement('img');
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
### Promise 三种状态
* 三种状态
  * 待定（pending）: 初始状态，既没有被兑现，也没有被拒绝
  * 已兑现（fulfilled）: 意味着操作成功完成。
  * 已拒绝（rejected）: 意味着操作失败
* 只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。这也是Promise这个名字的由来，它的英语意思就是“承诺”，表示其他手段无法改变
* 状态变化，只有两种可能，从 pending 变为 fulfilled 和从 pending 变为 rejected。
* 变化不可逆，一旦状态改变，就不会再变，任何时候都可以得到这个结果。但是变化之后状态会最为下一个Promise的状态，也就是说状态会传递。
```js
// 比如上面创建图片的例子
loadImg(url1).then(img1 => {
   // .then 会创建新的 Promise
   // 新的 Promise 不报错，将触发新Promise的then的回调
   // 有报错则触发 catch 回调
    console.log(img1.width)
    return img1
}).then(img1 => {
    // 新Promise的then的回调
    console.log(img1.height)
    return loadImg(url2) // promise 实例
})
```

### Promise 状态表现
* pending状态，不会出发then和catch
* resolved状态，会触发后续的then回调函数
* rejected状态，会出发后续的catch回调函数

### Promise 的 then 和 catch 改变状态
* then正常返回resolved，里面有报错则返回rejected
* catch正常返回resolved，里面有报错则返回rejected

### Promise.then方法中的reject回调和catch中的回调有什么区别？
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
    // then中没有写第二个回调，则进入catch
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

### [Promise API 总结](https://es6.ruanyifeng.com/#docs/promise#Promise-prototype-then)
* Promise.prototype.then()
* Promise.prototype.catch()
* Promise.prototype.finally() 
* Promise.all()
* Promise.race()
* Promise.allSettled() 
* Promise.any()
* Promise.resolve()
* Promise.reject()

### 补充：Generator（生成器）函数的语法（async/await 的原理）
* Generator 函数是一个生成遍历器对象的状态机。有两个特征。一是，function关键字与函数名之间有一个星号；二是，函数体内部使用yield表达式，定义不同的内部状态（yield在英语里的意思就是“产出”）。
* 调用 Generator 函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的遍历器对象（Iterator Object）。
* Generator 函数是分段执行的，yield表达式是暂停执行的标记，而next方法可以恢复执行。调用 next 方法，内部指针就从函数头部或上一次停下来的地方开始执行，直到遇到下一个yield表达式（或return语句）为止。所以其实提供了一种可以暂停执行的函数。yield表达式就是暂停标志。
* 每次调用遍历器对象的next方法，就会返回一个有着value和done两个属性的对象。value属性表示当前的内部状态的值，是yield表达式后面那个表达式的值；done属性是一个布尔值，表示是否遍历结束。
```js
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}
var hw = helloWorldGenerator(); // 调用 Generator 函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的遍历器对象（Iterator Object）。
// 下一步，必须调用遍历器对象的next方法，使得指针移向下一个状态。
hw.next() // { value: 'hello', done: false }
hw.next() // { value: 'world', done: false }
hw.next() // { value: 'ending', done: true }
hw.next() // { value: undefined, done: true }
```
* for...of 循环可以自动遍历 Generator 函数运行时生成的Iterator对象，且此时不再需要调用next方法。
```js
function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}

for (let v of foo()) {
  console.log(v);
}
// 1 2 3 4 5
```


### async/await：Generator 函数的语法糖，解决了 Promise 用链式的方式书写代码的问题，可以用同步的方式写异步代码
* 执行 async 函数返回的是 Promise 对象
* await 相当于 Promise 的 then
* try...catch...可捕获异常，代替 Promise 的 catch
```js
const getData = async () => {
    try {
        const res = await fetchData();
        const { data } = res;
    } catch (e) {
        console.log('page data fetch error ', e);
    }
}
```

### async 函数的实现原理
async 函数的实现原理，就是将 Generator 函数和自动执行器，包装在一个函数里。
```js
function sleep(num) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      console.log('time start');
      resolve();
      }, num)
  })
}

async function fn(args) {
  await sleep(3000);
  console.log('time end');
}
fn();
// time start
// time end

// 等同于

function fn(args) {
  return spawn(function* () {
    // function 关键字后有星号，代表这是一个 Generator（生成器）函数
    yield sleep(3000);
    yield console.log('time end')
    return 'ending';
  });
}

function spawn(genF) {
  return new Promise(function(resolve, reject) {
    const gen = genF();
    function step(nextF) {
      let next;
      try {
        next = nextF();
      } catch(e) {
        return reject(e);
      }
      if(next.done) {
        return resolve(next.value);
      }
      Promise.resolve(next.value).then(function(v) {
        // 当前 resolve() 的参数 next.value 是一个 Promise，所以会等 Promise 也就是 sleep 结束后，才执行 then 后的回调 step()
        step(function() { return gen.next(v); });
      }, function(e) {
        step(function() { return gen.throw(e); });
      });
    }
    step(function() { return gen.next(undefined); });
  });
}

// time start
// time end
```

# 微任务和宏任务
### 基本概念
* 宏任务：setTimeout，setInterval, Ajax, DOM事件
* 微任务：Promise async/await MutationObserver
* 微任务执行时机比宏任务要早：微任务（ES6语法规定）DOM渲染前触发，宏任务（浏览器规定）DOM渲染后触发。
* js同步代码执行后，会执行所有微任务，然后执行一个宏任务，如果产生新的微任务，那执行所有微任务，然后执行下一个宏任务，然后执行微任务，以此不断循环（事件循环 event loop）。

### 经典面试题讲解
* 第一步执行所有js同步代码。
* 1-5 行代码，声明 async1 函数
* 6-8 行代码，声明 async2 函数
* 执行 9 行代码，打印“script start”
* 10-18 行代码，创建一个定时器，将定时器的回调放到宏任务队列中等待执行
* 19-24 行代码，创建一个定时器，将定时器的回调放到宏任务队列中等待执行
* 25 行，执行 async1 函数，async/await 函数就是一个 Promise，所以 console.log('async1 start') 和 await async2() 会立即执行，但是 console.log('async1 end') 相当于 Promise.then 是微任务，放到微任务队列中，等待执行。所以立即执行 console.log('async1 start')，控制台打印“async1 start”，执行 async2()，控制台打印“async2”。
* 26-31 行，新建一个Promise，new Promise() 会被立即执行，控制台打印“promise1”，then 后的回调是微任务，放入微任务队列中等待执行。
* 32 行，控制台打印“script end”。
* 第二步，js同步代码执行完毕，执行微任务队列中所有可以执行的回调。
* 控制台打印“async1 end”。
* 控制台打印“promise2”。
* 第三步，执行一个可以执行的宏任务。宏任务第一个队列中的回调。
* 控制台打印“setTimeout1”。
* 当前宏任务产生两个微任务。
* 第四步，宏任务执行结束，执行微任务队列中所有可以执行的回调。
* 控制台打印“promise3”。
* 控制台打印“promise4”。
* 第五步，执行一个可以执行的宏任务。
* 控制台打印“setTimeout2”。
* 当前宏任务产生一个微任务。
* 第六步，宏任务执行结束，执行微任务队列中所有可以执行的回调。
* 控制台打印“promise5”。
* 宏任务队列中，还有可以执行的吗？没有则不执行。
* 微任务队列中，还有可以执行的吗？没有则不执行。
* 宏任务队列中，还有可以执行的吗？没有则不执行。
* 微任务队列中，还有可以执行的吗？没有则不执行。
* ...

注意：上面的例子，定时器的时间设置为 0，如果不是零的话，浏览器会等待到了时间后才将回调函数放到回调函数队列中，所以宏任务不一定按照创建的顺序执行。另外，同理，微任务如果是接口请求的话，也是会等待接请求返回之后才会放到微任务队列中。
```js
async function async1() {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
} 
async function async2() {
  console.log('async2')
}
console.log('script start')
setTimeout(function () {
  console.log('setTimeout1')
  Promise.resolve().then(function () {
    console.log('promise3')
  })
  Promise.resolve().then(function () {
    console.log('promise4')
  })
}, 0)
setTimeout(function () {
  console.log('setTimeout2')
  Promise.resolve().then(function () {
    console.log('promise5')
  })
}, 0)
async1()
new Promise(function (resolve) {
  console.log('promise1')
  resolve()
}).then(function () {
  console.log('promise2')
})
console.log('script end')

// script start
// async1 start
// async2
// promise1
// script end
// async1 end
// promise2
// setTimeout1
// promise3
// promise4
// setTimeout2
// promise5
```


# event loop（事件循环/事件轮询）

### 什么是event loop
* js 是单线程执行的
    * 从前到后，一行行执行
    * 遇到报错，则下面代码停止执行
    * 先把同步代码执行完，再执行异步
* 异步要基于回调来实现
* event loop 就是异步回调的实现原理

### event loop 执行过程
* 同步代码，一行一行放在 call stack(调用栈) 中执行
* 遇到异步，先“记录”下，等待时间（定时，网络请求等）
* 时机到了，就移动到 calllback queue（回调队列）
* 如果call stack 为空（即同步代码执行完），event loop 开始工作
* 轮询查找 callback queue，如有则移动到call stack 执行
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

### event loop  和 DOM 渲染
* 每次 Call Stack 清空（即每次轮询结束），即同步任务执行完成
* 都是DOM重新渲染的机会（DOM结构如有改变则重新渲染）
* 然后再去触发下一次的 event loop

### 结合DOM渲染，微任务执行的 event loop 示意图
![event loop](https://github.com/lujiajian1/study-notes/blob/main/img/event-loop-DOM.png)