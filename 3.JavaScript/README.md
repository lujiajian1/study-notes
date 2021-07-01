### javascript

| 语法（Grammar）           | 语义 | 运行时（Runtime）  |
| ------------------------- | ---- | ----------------- |
| 字面量（LIteral）         |      | 类型（Types）      |
| 变量（Variable）          |      | Execution Context |
| 关键字（Keywords）        |      |                   |
| 空白符（Whitespace）      |      |                   |
| 换行符（Line Terminator） |      |                   |
| 语法树与运算符（Grammar Tree vs Priority） |      | 类型转换（Type Convertion） |
| Left hand side & Right hand side |      | 引用类型（Reference） |
| 简单语句 |      | Completion Record （执行结果记录） |
| 组合语句 |      | Lexical Environment（作用域） |
| 声明 |      |                   |

### 类型

* Number（精度丢失问题）
* String（字符集，编码方式）
* Boolean
* Object
* Null
* Undefined（void 0 生成undefined）
* Symbol
* BigInt： 是一种特殊的数字类型，它提供了对任意长度整数的支持
```js
//创建 bigint 的方式有两种:

//在一个整数字面量后面加 n
const bigint = 1234567890123456789012345678901234567890n; 
//调用 BigInt 函数
const sameBigint = BigInt("1234567890123456789012345678901234567890");
```

### 判断数据类型的方法及原理

* typeof 运算符
    * 识别所有值类型
    * 识别函数
    * 判断是否引用数据类型（不可在细分）
* instanceof 运算符
    * instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上，所有说instanceof是基于原型链实现的
    ```js
    xialuo instanceof Stutent //true
    xialuo instanceof People //true
    xialuo instanceof Object //true

    [] instanceof Array //true
    [] instanceof Object //true

    {} instanceof Object //true
    ```
* prototype
    ```js
    alert(Object.prototype.toString.call(a) === ‘[object String]’) -------> true;
    alert(Object.prototype.toString.call(b) === ‘[object Number]’) -------> true;
    alert(Object.prototype.toString.call(c) === ‘[object Array]’) -------> true;
    alert(Object.prototype.toString.call(d) === ‘[object Date]’) -------> true;
    alert(Object.prototype.toString.call(e) === ‘[object Function]’) -------> true;
    alert(Object.prototype.toString.call(f) === ‘[object Function]’) -------> true;
    ```
* jquery.type()
    ```js
    jQuery.type( true ) === "boolean"
    jQuery.type( 3 ) === "number"
    jQuery.type( "test" ) === "string"
    jQuery.type( function(){} ) === "function"
    jQuery.type( [] ) === "array"
    jQuery.type( new Date() ) === "date"
    ```

### 精度丢失问题(0.2+0.1==! 0.3)

https://github.com/haizlin/fe-interview/issues/80

### 表达式

* 运算符（优先级）和表达式
* 类型转换
    * 字符串拼接
    * ==
    * if语句和逻辑运算
* 类型转换规则
![类型转换规则](https://github.com/lujiajian1/study-notes/blob/main/img/type-change.jpg)

### 深拷贝

```js
function deepClone(obj = {}){    
    if(obj typeof !== 'object' || obj typeof == null) {
        return obj;
    }    
    let result = {};    
    if(obj instanceof Array) {
        result = [];
    }    
    for(let key in obj){        
        if(obj.hasOwnProperty(key)){            
            result[key] = deepClone(obj[key]);        
        }    
    }    
    return result;
}
```

### 闭包

##### 闭包原理：[执行上下文和作用域链](https://juejin.cn/post/6844903858636849159#heading-0)

##### 作用域应用的特殊情况，有两种表现：

* 函数作为返回值（闭包）
```js
function create() {
    const a = 100
    return function () {
        console.log(a)
    }
}

const fn = create()
const a = 200
fn() // 100
```
* 函数作为参数（非闭包）
```js
function print(fn) {
    const a = 200
    fn()
}
const a = 100
function fn() {
    console.log(a)
}
print(fn) // 100
```
* 解题关键：所有的自由变量的查找，是在函数定义的地方，向上级作用域查找，而不是在执行的地方查找。

##### 闭包的应用：隐藏数据，只提供 API
```js
function createCache() {
    const data = {} // 闭包中的数据，被隐藏，不被外界访问
    return {
        set: function (key, val) {
            data[key] = val
        },
        get: function (key) {
            return data[key]
        }
    }
}

const c = createCache()
c.set('a', 100)
console.log( c.get('a') )
```
### 原型
每一个函数，包括构造函数，都会自动创建一个prototype属性，prototype属性指向当前函数的原型对象，原型对象自动创建constructor属性，constructor属性指针指向当前原型对象的构造函数。想要理解原型，首先要理解js创建的对象的方式，了解js创建对象是如何发展到原型模式的，从原型模式了解原型。

##### 创建对象的方式
* 使用原生构造函数创建对象
```js
var o = new Object();
o.name = '张三'；
```
* 使用对象字面量
```js
var o = {
    name: '张三'
}
```
* 工厂模式
```js
function people(){
    var o = new Object();
    o.name = '张三'；
    return o;
}
var newp = people();
```
* 构造函数：解决对象无法识别问题
```js
function People(){
    this.name = '张三'；
}
var newp = new People();
```
* 原型模式（每一个函数都有一个prototype 原型对象）：解决公共属性重复声明问题
```js
function People(){
}
People.prototype.name = '张三'；
var newp = new People();
```
* 构造函数 + 原型模式
```js
function People(name){
    this.name = name;
}
People.prototype.sayName = function() {
    console.log(this.name);
}；
var newp = new People('张三');
```
* 寄生构造函数模式（类似工厂模式，目的是防止污染原生构造函数时如：Array、Object）
##### 原型关系

* 每个函数（构造函数、class） 都有显示原型 prototype
* 每个实例都有隐式原型 __proto__ 
* 实例的 __proto__ 指向对应函数（构造函数、class）的 prototype
![原型关系](https://github.com/lujiajian1/study-notes/blob/main/img/prototype.png)

#### 基于原型的执行规则
现在自身属性和方法中寻找，如果找不到则自动去 __proto__ 中查找

### 原型链
原型对象等于另一个类型的实例，就形成原型链。
![原型链](https://github.com/lujiajian1/study-notes/blob/main/img/prototype-line.jpg)

### js实现继承的方法

* 原型链继承：将父类的实例作为子类的原型
```js
function Cat(){ 
}
Cat.prototype = new Animal();
Cat.prototype.name = 'cat';
```
* 构造继承：使用父类的构造函数来增强子类实例，等于是复制父类的实例属性给子类（没用到原型）
```js
function Cat(name){
  Animal.call(this);
  this.name = name || 'Tom';
}
```
* 实例继承：为父类实例添加新特性，作为子类实例返回
```js
function Cat(name){
  var instance = new Animal();
  instance.name = name || 'Tom';
  return instance;
}
```
* 拷贝继承
```js
function Cat(name){
  var animal = new Animal();
  for(var p in animal){
    Cat.prototype[p] = animal[p];
  }
  Cat.prototype.name = name || 'Tom';
}
```
* 组合继承：通过调用父类构造，继承父类的属性并保留传参的优点，然后通过将父类实例作为子类原型，实现函数复用
```js
function Cat(name){
  Animal.call(this);
  this.name = name || 'Tom';
}
Cat.prototype = new Animal();
Cat.prototype.constructor = Cat;
```
* 寄生组合继承：通过寄生方式，砍掉父类的实例属性，这样，在调用两次父类的构造的时候，就不会初始化两次实例方法/属性，避免的组合继承的缺点
```js
function Cat(name){
  Animal.call(this);
  this.name = name || 'Tom';
}
(function(){
  // 创建一个没有实例方法的类
  var Super = function(){};
  Super.prototype = Animal.prototype;
  //将实例作为子类的原型
  Cat.prototype = new Super();
})();
```

### ES6 class
class 是 ES6 语法规范，有 ECMA 委员会发布，ECMA 只规定语法规则，即我们代码的书写规范，不规定如何实现，以上实现方式都是v8 引擎的实现方式，也是主流的。
* constructor
* 属性
* 方法

##### [class语法糖](https://juejin.cn/post/6844903638674980872)
* constructor 方法是类的构造函数，是一个默认方法，通过 new 命令创建对象实例时，自动调用该方法。一个类必须有 constructor 方法，如果没有显式定义，一个默认的 consructor 方法会被默认添加。
```js
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function() {
  return '(' + this.x + ',' + this.y + ')';
}
//等同于
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ',' + this.y + ')';
  }
}
```
* super当作函数使用相当于A.prototype.constructor.call(this, props)。当做对象使用，指向父类的原型对象。
```js
// super当作函数使用
class A {
  constructor() {
    console.log(new.target.name); // new.target 指向当前正在执行的函数
  }
}
class B extends A {
  constructor {
    super();
  }
}
new A(); // A
new B(); // B

// super当作对象使用
//子类 B 当中的 super.c()，就是将 super 当作一个对象使用。这时，super 在普通方法之中，指向 A.prototype，所以 super.c() 就相当于 A.prototype.c()
class A {
  c() {
    return 2;
  }
}

class B extends A {
  constructor() {
    super();
    console.log(super.c()); // 2 // 当作对象
  }
}

let b = new B();
```
##### ES6 class 继承（extends，super）

```js
//父类
class People { //类首字母要大写
    constructor(name) {
        this.name = name;
    }
    eat() {
        console.log(`${this.name} eat something`)
    }
}
//子类
class Student extends People {
    constructor(number){
        super(name);
        this.number = number;
    }
    sayHi(){
        console.log(`姓名：${this.name} 学号：${this.Number}`)
    }
}
```

### this
this的值不是在函数定义的时候决定的，而是在函数执行的时候决定的

* 作为普通函数
```js
function fn1(){
    console.log(this);
}
fn1(); //window
```
* 使用call、apply、bind
```js
function fn1(){
    console.log(this);
}
fn1.call({x: 100}); //{x: 100}
const fn2 = fn1.bind({x: 200});
fn2();//{x: 200}
```
* 作为对象方法被调用
```js
const zhangsan = {
    name: "张三",
    sayHi() {
        console.log(this); //this 当前对象
    }
}
```
* 在class方法中调用
```js
class People{
    constructor(name){
        this.name = name;
    }
    sayHi() {
        console.log(this);
    }
}
const zhangsan = new People('张三');
zhangsan.sayHi(); //this 当前对象
```
* 箭头函数
```js
const zhangsan = {
    name: "张三",
    wait(){
        setTimeout(()=>{
            console.log(this); //zhangsan 对象
        })
    }
}
```

### bind,call,apply的[区别](https://juejin.cn/post/6844903496253177863)，手写实现
* apply 和 call 的区别：其实 apply 和 call 基本类似，他们的区别只是传入的参数不同，call 方法接受的是若干个参数列表，而 apply 接收的是一个包含多个参数的数组。
```js
 b.apply(a,[1,2]); 
 b.call(a,1,2);
```
* bind 和 apply、call 区别：bind()方法创建一个新的函数, 当被调用时，将其this关键字设置为提供的值，在调用新函数时，在任何提供之前提供一个给定的参数序列，所以bind 是创建一个新的函数，我们必须要手动去调用，bind和apply一样也是接受的若干个参数列表。
```js
b.bind(a,1,2)() 
```
* 手写apply
```js
Function.prototype.myapply = function (context, arr) {
    var context = context || window;
    context.fn = this; //this就是fn1

    var result;
    if (!arr) {
        result = context.fn();
    } else {
        var args = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            args.push('arr[' + i + ']');
        }
        result = eval('context.fn(' + args + ')')
    }

    delete context.fn
    return result;
}
function fn1(a, b, c){
    console.log('this', this);
    console.log(a,b,c);
    return 'this is fn1';
}
const fn2 = fn1.myapply({x:100}, []);
```
* 手写call
```js
Function.prototype.mycall = function (context) {
    var context = context || window;
    context.fn = this;

    var args = [];
    for(var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }

    var result = eval('context.fn(' + args +')');

    delete context.fn
    return result;
}
```
* 手写bind
```js
//手写bind
Function.prototype.mybind = function(){
    // 参数转化为数组
    const args = Array.prototype.slice.call(argument);
    // 获取this
    const t = args.shift();
    // 获取绑定mybind的function
    const self = this;
    // 返回一个函数
    return function(){
        return self.apply(t, args);
    }
}

function fn1(a, b, c){
    console.log('this', this);
    console.log(a,b,c);
    return 'this is fn1';
}

const fn2 = fn1.mybind({x:100}, 10. 20. 30);
const res = fn2():
console.log(res);
```
### new操作符具体干了什么
1. 创建一个新对象
2. 将构造函数的作用域赋给新对象（因此this指向了这个新对象）
3. 执行构造函数中的代码（为这个新对象添加属性）
4. 返回新对象

### 写一个简单的jQuery
```js
class jQuery {
    constructor(selector) {
        const result = document.querySelectorAll(selector)
        const length = result.length
        for (let i = 0; i < length; i++) {
            this[i] = result[i]
        }
        this.length = length
        this.selector = selector
    }
    get(index) {
        return this[index]
    }
    each(fn) {
        for (let i = 0; i < this.length; i++) {
            const elem = this[i]
            fn(elem)
        }
    }
    on(type, fn) {
        return this.each(elem => {
            elem.addEventListener(type, fn, false)
        })
    }
    // 扩展很多 DOM API
}

// 插件
jQuery.prototype.dialog = function (info) {
    alert(info)
}

// “造轮子”
class myJQuery extends jQuery {
    constructor(selector) {
        super(selector)
    }
    // 扩展自己的方法
    addClass(className) {

    }
    style(data) {

    }
}

const $p = new jQuery('p')
$p.get(1)
$p.each((elem) => console.log(elem.nodeName))
$p.on('click', () => alert('clicked'))
```

### 微任务和宏任务

* 宏任务：setTimeout，setInterval, Ajax, DOM事件
* 微任务：Promise async/await
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

##### 手写简易的ajax
```js
function ajax(url) {
    const p = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(
                        JSON.parse(xhr.responseText)
                    )
                } else if (xhr.status === 404 || xhr.status === 500) {
                    reject(new Error('404 not found'))
                }
            }
        }
        xhr.send(null)
    })
    return p
}

const url = '/data/test.json'
ajax(url)
.then(res => console.log(res))
.catch(err => console.error(err))
```

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

##### async/await

* 执行 async 函数返回的是 Promise 对象
* await 相当于 Promise的 then
* try...catch...可捕获异常，代替 Promise 的 catch

### JS-Web-API

JS基础知识，是规定语法 （ECMA262标准），JS Web API，网页操作的API（Ｗ３Ｃ标准） ，前者是后者的基础，两者结合才能真正实际应用
* DOM
* BOM
* 事件绑定
* ajax
* 存储

### property 和 attribute
* property：修改JS对象属性，不会体现到HTML结构中
* attribute：修改HTML属性，会改变HTML 结构（标签结构）
* 两者都有可能引起DOM重新渲染
建议：尽量用 property 操作，因为property可能会在JS机制中，避免一些不必要的DOM渲染；但是attribute是修改HTML结构，一定会引起DOM结构的重新渲染，而DOM重新渲染是比较耗费性能的。

### DOM性能
* DOM操作非常“昂贵”，避免频繁的DOM操作
* 对DOM查询做缓存
* 将频繁操作改为一次操作（createDocumentFragment）

### 页面加载过程
1. DNS解析：域名 -> IP地址
2. 浏览器根据IP地址向服务器发起http请求
3. 服务器处理http请求，并返回给浏览器

### 页面渲染过程

1. 根据HTML代码生成DOM Tree
2. 根据CSS代码生成CSSOM 
3. 将DOM Tree和CSSOM整合形成Render Tree
4. 根据Render Tree渲染页面
5. 遇到\<script\>则暂停渲染，优先加载并执行JS代码，完成再继续
6. 图片不会阻塞DOM渲染
7. 直至把Render Tree渲染完成

### window.onload 和 DOMComtentLoaded

```js
window.addEventListener('load',function(){    
    // 页面的全部资源加载完成才会执行，包括图片、视频等
})
document.addEvenListener('DOMContentLoaded',function(){    
    // DOM 渲染完，即可执行，此时图片、视频等异步资源可能还没有加载完
})
```
### for...of 和 for...in

* for...in
    * 遍历对象及其原型链上可枚举的属性
    * 如果用于遍历数组，处理遍历其元素外，还会遍历开发者对数组对象自定义的可枚举属性及其原型链上的可枚举属性
    * 遍历对象返回的属性名和遍历数组返回的索引都是 string 类型
* for...of
    * es6 中添加的循环遍历语法；
    * 支持遍历数组，类数组对象（DOM NodeList），字符串，Map 对象，Set 对象；
    * 不支持遍历普通对象；
    * 遍历后输出的结果为数组元素的值
* for...in（以及forEach、for）是常规的同步遍历，for...of 常用于异步的遍历

### [正则表达式](https://juejin.cn/post/6844903845227659271)
