## 类型
#### 八种类型
* 七种基本数据类型
    * 数字（Number），整数或浮点数，例如：42 或者 3.14159
    * 字符串（String），字符串是一串表示文本值的字符序列，例如："Howdy" 
    * 布尔值（Boolean），有2个值分别是：true 和 false
    * null ， 一个表明 null 值的特殊关键字。 JavaScript 是大小写敏感的，因此 null 与 Null、NULL或变体完全不同
    * undefined ，和 null 一样是一个特殊的关键字，undefined 表示变量未赋值时的属性
    * 代表（[Symbol](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)）(在 ECMAScript 6 中新添加的类型)，一种实例是唯一且不可改变的数据类型
    * 任意精度的整数 ([BigInt](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt)) ，可以安全地存储和操作大整数，甚至可以超过数字的安全整数限制
    ```js
    //创建 bigint 的方式有两种:
    //1.在一个整数字面量后面加 n
    const bigint = 1234567890123456789012345678901234567890n; 
    //2.调用 BigInt 函数
    const sameBigint = BigInt("1234567890123456789012345678901234567890");
    ```
* 以及对象（Object）

#### [undefined与null的区别](https://www.ruanyifeng.com/blog/2014/03/undefined-vs-null.html)
简单总结就是一句话，null：变量有值，这个值就是null，undefined：变量声明了，但没有赋值。

#### 类型转换
* 定义：JavaScript是一种动态类型语言(dynamically typed language)。这意味着你在声明变量时可以不必指定数据类型，而数据类型会在代码执行时会根据需要自动转换。
* 触发类型转换
    * 字符串拼接
    * ==
    * if语句和逻辑运算
* 类型转换规则
![类型转换规则](https://github.com/lujiajian1/study-notes/blob/main/img/type-change.jpg)

#### 判断数据类型的方法及原理
* [typeof 运算符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof)
    * 识别所有值类型
    * 识别函数
    * 判断是否引用数据类型（不可在细分）
    ```js
    console.log(typeof 42); //"number"
    console.log(typeof 'blubber'); //"string"
    console.log(typeof(true)); //"boolean"
    console.log(typeof undeclaredVariable); //"undefined"
    ```
* [instanceof 运算符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof)
    * instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上，所有说instanceof是基于原型链实现的
    ```js
    xialuo instanceof Stutent //true
    xialuo instanceof People //true
    xialuo instanceof Object //true
    [] instanceof Array //true
    [] instanceof Object //true
    {} instanceof Object //true
    ```
* [prototype.toString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString) 方法返回一个表示该对象的字符串
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
    jQuery.type(true) === "boolean"
    jQuery.type(3) === "number"
    jQuery.type("test") === "string"
    jQuery.type(function(){}) === "function"
    jQuery.type([]) === "array"
    jQuery.type(new Date()) === "date"
    ```

#### [精度丢失问题(0.2+0.1 !== 0.3)](https://github.com/haizlin/fe-interview/issues/80)
简单概括就是：计算内部存储数据使用的是二进制，二进制能精确地表示位数有限且分母是2的倍数的小数，比如，1/2，1/4，1/6，1/8，1/10 等。但是我们日常生活中使用的是十进制，所以十进制中的0.2也就是1/5是无法在计算机二进制中精确表示的，所以 0.2+0.1 有精度丢失问题。

## 闭包和作用域链
#### 执行上下文与作用域
解释闭包之前，需要先了解执行上下文及作用域的概念，对后面理解闭包有很大的帮助。

变量或函数的上下文决定了它们可以访问哪些数据。每个上下文都有一个与之关联的变量对象（作用域），上下文中定义的所有变量和函数都保存在这个对象中。我们编写的代码是无法访问这个对象的，但是解析器在处理数据时会在后台使用它。上下文包括两类：全局上下文、每个函数自己的上下文。（有的文章会把上下文翻译为执行环境，本质上是一个东西，《JavaScript高级程序设计》的第三版中文翻译是执行环境，第四版中文翻译是执行上下文）

全局上下文是最外层的上下文。宿主环境不同，表示全局上下文的对象可能不一样。在web浏览器中，全局上下文就是我们常说的 window 对象，因此所有通过 var 定义的全局变量和函数都会成为 window 对象的属性和方法。每个函数调用都有自己的上下文。当代码执行流进入函数时，函数的上下文被推到一个上下文栈上。上下文在其所有代码都执行完毕后会被销毁，包括定义在它上面的所有变量和函数，例如：函数上下文在函数执行完毕后，上下文栈会弹出该函数上下文并销毁，全局上下文在应用程序退出前才会被销毁，比如关闭网页或应用程序退出。

上下文中的代码在执行的时候，会创建一个作用域链。这个作用域链决定了各级上下文中的代码在访问变量和函数时的顺序。代码正在执行的上下文的变量对象（作用域）始终位于作用域链的最前端。作用域链中的下一个变量对象（作用域）来自包含上下文，再下一个对象来自再下一个包含上下文。以此类推直至全局上下文；全局上下文的变量对象始终是作用域链的最后一个变量对象。代码执行时是通过沿作用域链逐级搜索完成的。搜索过程始终从作用域链的最前端开始，然后逐级往后，直到找到变量。

举个例子：
```js
var a = 1
function fn1() {
    var b = 2;
    function fn2() {
        var c = 3;
        console.log(a); // 1;
    }
    fn2();
}
fn1();
```
下面会按照代码执行顺序一步步解释：
1. 创建全局上下文，将全局上下文推入上下文栈中。
2. 全局上下文中创建变量 a，并赋值 1。
3. 2-9行，全局上下文中声明一个新的变量 fn1，并分配一个函数定义。
4. 从全局上下文创建的作用域链中找到变量 fn1，并执行。注意：全局上下文的作用域链只有：全局上下文的变量对象（全局作用域）。
5. fn1 函数调用执行，创建一个 fn1 函数执行上下文，并推入上下文栈中。注意：现在的上下文栈：函数 fn1 上下文 -> 全局上下文。
6. 在 fn1 函数上下文中创建变量 b，并赋值为 2。
7. 4-7行，在 fn1 函数上下文中创建变量 fn2，并分配一个函数定义。
8. 从 fn1 函数上下文创建的作用域链中找到变量 fn2，并执行。注意：函数 fn1 创建的作用域链：函数 fn1 上下文的变量对象（局部作用域） -> 全局上下文的变量对象（全局作用域）。
9. 函数 fn2 调用执行，创建一个 fn2 函数执行上下文，并推入上下文栈中。注意：现在的上下文栈：函数 fn2 上下文 -> 函数 fn1 上下文 -> 全局上下文。
10. 在函数 fn2 上下文中创建变量 c，并赋值 3。
11. 从 fn2 函数上下文创建的作用域链中找到变量 a，并console。注意：函数 fn2 创建的作用域链：函数 fn2 上下文的变量对象（局部作用域） -> 函数 fn1 上下文的变量对象（局部作用域） -> 全局上下文的变量对象（全局作用域）。fn2 函数中可以访问变量 a 就是通过作用域链找到的。
12. fn2 执行结束，fn2 上下文从上下文栈中弹出并销毁。注意：现在的上下文栈：函数 fn1 上下文 -> 全局上下文。
13. fn1 执行结束，fn1 上下文从上下文栈中弹出并销毁。注意：现在的上下文栈：全局上下文。

#### 什么是闭包
官方定义：闭包指的是那些引用了另一个函数作用域中变量的函数，通常是在嵌套函数中实现的。

大白话：A函数中return的值是引用类型，或者就理解为return的值为函数的时候，return的B函数会携带A函数作用域内的所有变量，如同带着背包一样一起return出去。这样B函数执行时的作用域链就变成了 B函数的作用域 -> A函数的作用域（闭包）-> 其他 -> 全局作用域，这样B函数中就可以访问A函数中的变量。

举个例子：
```js
function fn1() {
    var b = 2;
    function fn2() {
        var c = 3;
        console.log(b); // 2;
    }
    return fn2;
}
var a = fn1();
a();
```
下面会按照代码执行顺序一步步解释：
1. 创建全局上下文，将全局上下文推入上下文栈中。
2. 1-8行，全局上下文中声明一个新的变量 fn1，并分配一个函数定义。
3. 全局上下文中创建变量 a，并将 fn1 执行后的结果赋值给 a。
4. fn1 函数调用执行，创建一个 fn1 函数执行上下文，并推入上下文栈中。注意：现在的上下文栈：函数 fn1 上下文 -> 全局上下文。
5. 在 fn1 函数上下文中创建变量 b，并赋值为 2。
6. 3-6行，fn1 函数上下文中声明一个新的变量 fn2，并分配一个函数定义。另外，我们还会创建一个闭包，作为函数定义的一部分，闭包包含 fn1 中的所有变量。
7. 从 fn1 函数上下文创建的作用域链中找到变量 fn2，并将 fn2 以及闭包（fn1 中的所用变量）一起 return。注意：函数 fn1 创建的作用域链：函数 fn1 上下文的变量对象（局部作用域） -> 全局上下文的变量对象（全局作用域）。 
8. fn1 执行结束，fn1 上下文从上下文栈中弹出并销毁。注意：现在的上下文栈只有：全局上下文。
9. 执行 a 函数，也就是调用执行 fn2。
10. fn2 函数调用执行，创建一个 fn2 函数执行上下文，并推入上下文栈中。注意：现在的上下文栈：函数 fn2 上下文 -> 全局上下文。
11. 在 fn2 函数上下文中创建变量 c，并赋值为 3。
12. 从 fn2 函数上下文创建的作用域链中找到变量 b，并console。注意：函数 fn2 创建的作用域链：函数 fn2 上下文的变量对象（局部作用域） -> 函数 fn1 上下文的变量对象（闭包） -> 全局上下文的变量对象（全局作用域）。fn2 函数中可以访问变量 b 就是通过作用域链在闭包中找到的。
13. fn2 执行结束，fn2 上下文从上下文栈中弹出并销毁。注意：现在的上下文栈：全局上下文。

#### 闭包的应用：隐藏数据，只提供 API
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

#### 闭包的缺点
因为闭包会保留它们包含函数的作用域，所以比其他函数更占用内存。过度使用闭包可能导致内存过度占用，因此建议仅在十分必要时使用。V8等优化的JavaScript引擎会努力回收被闭包困住的内存，不过我们还是建议在使用闭包时要谨慎。

#### 闭包常见面试题
```js
// 最基础的闭包
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

```js
// 这不是闭包，这是函数作为参数
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

```js
// 多次执行产生的闭包也是内存中的同一个活动对象
function createCounter() {
    let counter = 0
    const myFunction = function() {
        counter = counter + 1
        return counter
    }
    return myFunction
}
const increment = createCounter()
const c1 = increment()
const c2 = increment()
const c3 = increment()
console.log('example increment', c1, c2, c3) //example increment 1 2 3
```

```js
function createFunctions(){
    var result = new Array();
    for (var i = 0; i < 10; i++) {
        result[i] = function(){
            return i;
        };
    }
    return result;
}
var res = createFunctions();
res[0](); //10
res[3](); //10
res[7](); //10
res[9](); //10

// 闭包封装可以达到 res[n]() 输出的就是 n
function createFunctions(){
    var result = new Array();
    for (var i = 0; i < 10; i++) {
        result[i] = function(num){
            return function(){
                return num;
            };
        }(i); //立即调用函数
    }
    return result;
}
var res = createFunctions();
res[0](); //0
res[3](); //3
res[7](); //7
res[9](); //9

// 使用 let 的块级作用域
function createFunctions(){
    var result = new Array();
    for (let i = 0; i < 10; i++) {
        result[i] = function(){
            return i;
        };
    }
    return result;
}
var res = createFunctions();
res[0](); //0
res[3](); //3
res[7](); //7
res[9](); //9
```
```js
//形成了闭包。total 被外层引用没有被销毁。
var result = [];
var a = 3;
var total = 0;

function foo(a) {
    for (var i = 0; i < 3; i++) {
        result[i] = function () {
            total += i * a;
            console.log(total);
        }
    }
}

foo(1);
result[0]();  // 3
result[1]();  // 6
result[2]();  // 9
```
```js
// 节流 throttle
const div1 = document.getElementById("div1");
function throttle(fn, delay = 100) {
  let timer = null;

  return function () {
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
      timer = null;
    }, delay);
  };
}

div1.addEventListener(
  "drag",
  throttle(function (e) {
    console.log(e.offsetX, e.offsetY);
  })
);
```
```js
// 防抖 debounce
const input1 = document.getElementById("input1");
function debounce(fn, delay = 500) {
  // timer 是闭包中的
  let timer = null;

  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
      timer = null;
    }, delay);
  };
}

input1.addEventListener(
  "keyup",
  debounce(function (e) {
    console.log(e.target);
    console.log(input1.value);
  }, 600)
);
```
```js
// 函数柯里化
//add(1)(2)(3) = 6;
//add(1, 2, 3)(4) = 10;
//add(1)(2)(3)(4)(5) = 15;
function add(...args) {
  let allArg = args;
  var _adder = function () {
    allArg.push(...arguments);
    return _adder;
  };
  _adder.toString = function () {
    return allArg.reduce(function (a, b) {
      return a + b;
    }, 0);
  };
  return _adder;
}
console.log(add(1)(2)(3).toString()); //6
console.log(add(1, 2, 3)(4).toString()); //10
console.log(add(1)(2)(3)(4)(5).toString()); //15
console.log(add(2, 6)(1).toString()); //9
```

## 原型和原型链

#### 原型
每一个函数，包括构造函数，都会自动创建一个prototype属性，prototype属性指向当前函数的原型对象，原型对象自动创建constructor属性，constructor属性指针指向当前原型对象的构造函数。想要理解原型，首先要理解js创建的对象的方式，了解js创建对象是如何发展到原型模式的，从原型模式了解原型。

#### 创建对象的方式
* 使用原生构造函数创建对象
```js
var o = new Object(); // 创建 Object 的一个新的实例
o.name = '张三'; // 添加属性或者方法
var o1 = new Object();
o1.name = '李四';
var o2 = new Object();
o2.name = '王五';
```
* 使用对象字面量
```js
var o = {
    name: '张三'
}
var o1 = {
    name: '李四'
}
var o2 = {
    name: '王五'
}
```
* 工厂模式：使用原生构造函数或对象字面量创建对象，创建具有同样接口的多个对象需要重复编写很多代码，所以产生了工厂模式。
```js
function people(name){
    var o = new Object();
    o.name = name；
    return o;
}
var newp1 = people('张三');
var newp2 = people('李四');
var newp3 = people('王五');
```
* 构造函数：解决工厂模式创建的对象无法识别问题
```js
function People(name){
    this.name = name;
    this.sayName = function(){
      console.log(this.name);
    }
}
var newp = new People('张三');
var newp1 = new People('李四');

newp.constructor == People; // true 以确保实例被标识为特定类型，相比于工厂模式，这是一个很大的好处

newp.sayName === newp1.sayName; // false 同样的function，内存中被创建了多次，每个实例都会创建，所有有了原型模式
```
* 原型模式: 每个函数都会创建一个 prototype 属性，这个属性是一个对象，包含所有实例共享的属性和方法。实际上，这个对象就是通过调用构造函数创建的对象的原型。使用原型对象的好处是，在它上面定义的属性和方法可以被对象实例共享。构造函数模式中在构造函数中直接赋给对象实例的值，可以直接赋值给它们的原型。
```js
function People(){
}
People.prototype.name = '张三';
People.prototype.sayName = function() { console.log(this.name)};
var newp = new People();
newp.sayName(); // "张三"

var newp1 = new People();

newp.sayName === newp1.sayName; // true sayName内存中只创建了一次
newp.name === newp1.name; // true '张三' 实例属性无法定制，这是原型模式的缺点
```
* 构造函数 + 原型模式：构造函数模式用于定义实例属性，而原型模式用于定义共享的属性和方法。这样最大限度的节省了内存，又支持了向构造函数传参的能力，可谓是集两种模式之长。
```js
function People(name){
    this.name = name;
}
People.prototype.sayName = function() {
    console.log(this.name);
}；
var newp = new People('张三');
var newp1 = new People('李四');
newp.sayName === newp1.sayName; // true
newp.name === newp1.name; // false
```
* 寄生构造函数模式（类似工厂模式，目的是防止污染原生构造函数如：Array、Object）
```js
// 假如我们想要创建一个具有额外方法的特殊数组，不能直接修改构造函数，就可以使用寄生模式
function SpecialArray() {
  // 创建数组
  var values = new Array();
  // 添加值
  valuse.push.apply(values, arguments);
  // 添加方法，不会污染原生构造函数 Array
  values.toPipedString = function() {
    return this.join('|');
  }
  // 返回数组
  return values;
}
var colors = new SpecialArray('red', 'blue', 'green');
console.log(colors.toPipedString()); // red|blue|green
```

#### 补充：构造函数 new 操作符具体干了什么
1. 创建一个新对象
2. 将构造函数的作用域赋给新对象（因此this指向了这个新对象）
3. 执行构造函数中的代码（为这个新对象添加属性）
4. 返回新对象
```js
function _new(ctor, ...args) {
  if (typeof ctor !== 'function') {
    throw 'ctor must be a function';
  }
  // 创建新的对象
  let newObj = new Object();
  // 让新创建的对象可以访问构造函数原型（constructor.prototype）所在原型链上的属性；
  newObj.__proto__ = Object.create(ctor.prototype);
  // 将构造函数的作用域赋给新对象（this指向新对象）；
  // 执行构造函数中的代码
  let res = ctor.apply(newObj, [...args]);

  let isObject = typeof res === 'object' && res !== null;
  let isFunction = typeof res === 'function';
  return isObject || isFunction ? res : newObj;
}

function people(name, age) {
  this.name = name;
  this.age = age;
  this.saySome = function(){
    console.log(this.name + '今年' + this.age);
  }
};

var newp = _new(people, '张三', 18);
newp.saySome(); // 张三今年18
```
#### 原型关系

* 每个函数（构造函数、class） 都有显示原型 prototype
* 每个实例都有隐式原型 \_\_proto\_\_ 
* 实例的 \_\_proto\_\_ 指向对应函数（构造函数、class）的 prototype
![原型关系](https://github.com/lujiajian1/study-notes/blob/main/img/prototype.png)

#### 实例基于原型的执行规则
先在实例自身属性和方法中寻找，如果找不到则自动去 \_\_proto\_\_ 中查找

#### 原型链
原型对象等于另一个类型的实例，就形成原型链。
```js
function People(){}
People.prototype.eat = function(){
  console.log('People 的 eat 方法被执行');
}

function Student(){}
Student.prototype = new People(); // Student 的原型对象是 People 的实例
Student.prototype.sayHi = function(){}

var xialuo = new Student()
xialuo.eat();
```
![原型链](https://github.com/lujiajian1/study-notes/blob/main/img/prototype-line.jpg)

#### js实现继承的方法

* 原型链继承：将父类的实例作为子类的原型
```js
function Animal() {
  this.sayHi = function(){
    console.log('hello, world!');
  }
}
function Cat(){
  this.name = 'cat';
}
Cat.prototype = new Animal();
var newCat = new Cat();
newCat.sayHi(); // hello, world!
```
* class 继承：class 用 extends 实现继承
```js
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
    constructor(name,number){
        super(name);
        this.number = number;
    }
    sayHi(){
        console.log(`姓名：${this.name} 学号：${this.number}`)
    }
}

var xialuo = new Student('夏洛','001');
xialuo.sayHi(); // 姓名：夏洛 学号：001
xialuo.eat(); // 夏洛 eat something
```
* 构造继承：使用父类的构造函数来增强子类实例，等于是复制父类的实例属性给子类（没用到原型）
```js
function Animal(){
  this.sayHi = function(){
    console.log(this.name + 'hello, world!');
  }
}
Animal.prototype.sayName = function(){
  console.log(this.name)
}
function Cat(name){
  Animal.call(this);
  this.name = name || 'Tom';
}

var newCat = new Cat('夏洛');
newCat.sayHi(); // 夏洛hello, world!
newCat.sayName(); // 报错：newCat.sayName is not a function 没用到原型
```
* 实例继承：为父类实例添加新特性，作为子类实例返回，可以访问父类原型中的属性和方法
```js
function Animal(){
  this.sayHi = function(){
    console.log(this.name + 'hello, world!');
  }
}
Animal.prototype.sayName = function(){
  console.log(this.name)
}
function Cat(name){
  var instance = new Animal();
  instance.name = name || 'Tom';
  return instance;
}
var newCat = new Cat('夏洛');
newCat.sayHi(); // 夏洛hello, world!
newCat.sayName(); // 夏洛
```
* 拷贝继承
```js
function Animal(){
  this.sayHi = function(){
    console.log(this.name + 'hello, world!');
  }
}
Animal.prototype.sayName = function(){
  console.log(this.name)
}
function Cat(name){
  var animal = new Animal();
  for(var p in animal){
    Cat.prototype[p] = animal[p];
  }
  Cat.prototype.name = name || 'Tom';
}
var newCat = new Cat('夏洛');
newCat.sayHi(); // 夏洛hello, world!
newCat.sayName(); // 夏洛
```
* 组合继承：通过调用父类构造，继承父类的属性并保留传参的优点，然后通过将父类实例作为子类原型，实现函数复用
```js
function Animal(){}
Animal.prototype.sayHi = function(){
  console.log(this.name + 'hello, world!');
}
function Cat(name){
  Animal.call(this);
  this.name = name || 'Tom';
}
Cat.prototype = new Animal();
Cat.prototype.constructor = Cat;
var newCat = new Cat('夏洛');
newCat.sayHi(); // 夏洛hello, world!
var newCat1 = new Cat('马冬梅');
newCat1.sayHi(); // 马冬梅hello, world!
newCat.sayHi === newCat1.sayHi; // true
```
* 寄生组合继承：通过寄生方式，砍掉父类的实例属性，这样，在调用两次父类的构造的时候，就不会初始化两次实例方法/属性，避免的组合继承的缺点
```js
function Animal(){}
Animal.prototype.sayHi = function(){
  console.log(this.name + 'hello, world!');
}
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
var newCat = new Cat('夏洛');
newCat.sayHi(); // 夏洛hello, world!
```

#### ES6 class
class 是 ES6 语法规范，有 ECMA 委员会发布，ECMA 只规定语法规则，即我们代码的书写规范，不规定如何实现，以上实现方式都是v8 引擎的实现方式，也是主流的。
* constructor
* 属性
* 方法

#### ES6 class 继承（extends，super）

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
    constructor(name,number){
        super(name);
        this.number = number;
    }
    sayHi(){
        console.log(`姓名：${this.name} 学号：${this.number}`)
    }
}
var xialuo = new Student('夏洛','001');
xialuo.sayHi(); // 姓名：夏洛 学号：001
xialuo.eat(); // 夏洛 eat something
```

#### [class语法糖](https://juejin.cn/post/7085726930808340510/)
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

#### this
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

#### bind,call,apply的[区别](https://juejin.cn/post/6844903496253177863)
* apply 和 call 的区别：其实 apply 和 call 基本类似，他们的区别只是传入的参数不同，call 方法接受的是若干个参数列表，而 apply 接收的是一个包含多个参数的数组。
```js
 b.apply(a,[1,2]); 
 b.call(a,1,2);
```
* bind 和 apply、call 区别：bind()方法创建一个新的函数, 当被调用时，将其this关键字设置为提供的值，在调用新函数时，在任何提供之前提供一个给定的参数序列，所以bind 是创建一个新的函数，我们必须要手动去调用，bind和apply一样也是接受的若干个参数列表。
```js
b.bind(a,1,2)() 
```

## 异步
#### 单线程和异步
* js 是单线程语言，任何时候只能做一件事情, 只有一个主线程，直到前面的操作完成，才能继续向下执行
* 浏览器和 node.js 支持 js 启动进程（webWorker），但是 js 依然是单线程
* js 和 DOM 渲染共用同一线程，因为 js 可修改 DOM 结构
* 遇到等待（定时器，网络请求）不能卡住，启动异步，异步不会阻塞代码执行，等待执行回调（callback）函数

#### 异步应用场景
* 网络请求，如 ajax、图片加载
* 定时任务，如 setTimeout

#### 异步的本质
* js 还是单线程，异步还是基于 event loop 实现的
* async/await 是消灭异步回调的终极武器，async/await 是一个语法糖，但是这个语法糖特别香

#### 使用 XMLHttpRequest 请求接口
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

#### Promise

Promise 对象用于表示一个异步操作的最终完成 (或失败)及其结果值。一个 Promise 对象代表一个在这个 promise 被创建出来时不一定已知的值。它让您能够把异步操作最终的成功返回值或者失败原因和相应的处理程序关联起来。 这样使得异步方法可以像同步方法那样返回值：异步方法并不会立即返回最终的值，而是会返回一个 promise，以便在未来某个时候把值交给使用者。

#### Promise 基本用法 
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

#### promise解决 callback hell（回调地狱）的问题
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
#### Promise 三种状态
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

#### Promise 状态表现
* pending状态，不会出发then和catch
* resolved状态，会触发后续的then回调函数
* rejected状态，会出发后续的catch回调函数

#### Promise 的 then 和 catch 改变状态
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

#### [Promise API 总结](https://es6.ruanyifeng.com/#docs/promise#Promise-prototype-then)
* Promise.prototype.then()
* Promise.prototype.catch()
* Promise.prototype.finally() 
* Promise.all()
* Promise.race()
* Promise.allSettled() 
* Promise.any()
* Promise.resolve()
* Promise.reject()

#### 补充：Generator（生成器）函数的语法（async/await 的原理）
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


#### async/await：Generator 函数的语法糖，解决了 Promise 用链式的方式书写代码的问题，可以用同步的方式写异步代码
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

#### async 函数的实现原理
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

#### 微任务和宏任务的基本概念
* 宏任务：setTimeout，setInterval, Ajax, DOM事件
* 微任务：Promise async/await MutationObserver
* 微任务执行时机比宏任务要早：微任务（ES6语法规定）DOM渲染前触发，宏任务（浏览器规定）DOM渲染后触发。
* js同步代码执行后，会执行所有微任务，然后执行一个宏任务，如果产生新的微任务，那执行所有微任务，然后执行下一个宏任务，然后执行微任务，以此不断循环（事件循环 event loop）。

#### 微任务和宏任务的经典面试题讲解
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


## event loop（事件循环/事件轮询）

#### 什么是event loop
* js 是单线程执行的
    * 从前到后，一行行执行
    * 遇到报错，则下面代码停止执行
    * 先把同步代码执行完，再执行异步
* 异步要基于回调来实现
* event loop 就是异步回调的实现原理

#### event loop 执行过程
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

#### event loop  和 DOM 渲染
* 每次 Call Stack 清空（即每次轮询结束），即同步任务执行完成
* 都是DOM重新渲染的机会（DOM结构如有改变则重新渲染）
* 然后再去触发下一次的 event loop

#### 结合DOM渲染，微任务执行的 event loop 示意图
![event loop](https://github.com/lujiajian1/study-notes/blob/main/img/event-loop-DOM.png)

## JS-Web-API
JS基础知识，是规定语法 （ECMA262标准），JS Web API，网页操作的API（Ｗ３Ｃ标准） ，前者是后者的基础，两者结合才能真正实际应用
* DOM
* BOM
* 事件绑定
* ajax
* 存储

## property 和 attribute
* property：修改JS对象属性，不会体现到HTML结构中
* attribute：修改HTML属性，会改变HTML 结构（标签结构）
* 两者都有可能引起DOM重新渲染
建议：尽量用 property 操作，因为property可能会在JS机制中，避免一些不必要的DOM渲染；但是attribute是修改HTML结构，一定会引起DOM结构的重新渲染，而DOM重新渲染是比较耗费性能的。

## DOM性能
* DOM操作非常“昂贵”，避免频繁的DOM操作
* 对DOM查询做缓存
* 将频繁操作改为一次操作（createDocumentFragment）

## 页面加载过程
1. DNS解析：域名 -> IP地址
2. 浏览器根据IP地址向服务器发起http请求
3. 服务器处理http请求，并返回给浏览器

## 页面渲染过程
1. 根据HTML代码生成DOM Tree
2. 根据CSS代码生成CSSOM 
3. 将DOM Tree和CSSOM整合形成Render Tree
4. 根据Render Tree渲染页面
5. 遇到\<script\>则暂停渲染，优先加载并执行JS代码，完成再继续
6. 图片不会阻塞DOM渲染
7. 直至把Render Tree渲染完成

## window.onload 和 DOMComtentLoaded
```js
window.addEventListener('load',function(){    
    // 页面的全部资源加载完成才会执行，包括图片、视频等
})
document.addEvenListener('DOMContentLoaded',function(){    
    // DOM 渲染完，即可执行，此时图片、视频等异步资源可能还没有加载完
})
```
## for...of 和 for...in
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

## [正则表达式](https://juejin.cn/post/6844903845227659271)

## 数组API
* split：将字符串拆成数组
* join：将数组拼接为字符串
* push：数组最后面添加一个元素，返回值为添加后数组的length
* pop：删除数组最后一个元素，返回值为删除的元素
* unshift：数组前面添加一个元素，返回添加后数组的length
* shift：删除数组的第一个元素，返回删除的元素
* concat：数组合并，不改变原数组，返回合并后的新数组
* map：不改变原数组，返回新数组
* filter：过滤数组，不改变原数组，返回新数组
* slice：slice(start,end)，从已有的数组中返回一个新的数组，包含从 start 到 end （不包括该元素），不改变原数组，返回新数组
* splice：从数组中添加/删除项目，然后返回被删除的项目，splice(index,howmany,item1,.....,itemX)，删除从 index 处开始的howmany个元素，并且用参数列表中声明的一个或多个值（item1,.....,itemX）来替换那些被删除的元素

## ES6
* let const
* 箭头函数
* iterator迭代器
    * 可迭代的数据结构会有一个[Symbol.iterator]方法
    * [Symbol.iterator]执行后返回一个iterator对象
    * iterator对象有一个next方法
    * 执行一次next方法(消耗一次迭代器)会返回一个有value,done属性的对象
* 解构赋值
    * 数组解构
    ```js
    var [name, pwd, sex]=["小周", "123456", "男"];
    console.log(name) //小周
    console.log(pwd)//123456
    console.log(sex)//男
    ```
    * 对象的解构赋值
    ```js
    var obj={name:"小周", pwd:"123456", sex:"男"}
    var {name, pwd, sex}=obj;
    console.log(name) //小周
    console.log(pwd)//123456
    console.log(sex)//男
    ```
* 扩展运算符
    * 将字符串转成数组
    ```js
    var str="abcd";
    console.log([...str]) // ["a", "b", "c", "d"]
    ```
    * 将集合转成数组
    ```js
    var sets=new Set([1,2,3,4,5])
    console.log([...sets]) // [1, 2, 3, 4, 5]
    ```
    * 两个数组的合并
    ```js
    var a1=[1,2,3];
    var a2=[4,5,6];
    console.log([...a1,...a2]); //[1, 2, 3, 4, 5, 6]
    ```
    * 在函数中，用来代替arguments参数，rest参数  …变量名称，rest 参数是一个数组 ，它的后面不能再有参数，不然会报错
    ```js
    function func(...args){
    console.log(args);//[1, 2, 3, 4]
    }
    func(1, 2, 3, 4);
    
    function f(x, ...y) {
        console.log(x);
        console.log(y);
    }
    f('a', 'b', 'c');     //a 和 ["b","c"]
    f('a')                //a 和 []
    f()                   //undefined 和 []
    ```
    * 移除某几项
    ```js
    //数组
    const number = [1,2,3,4,5]
    const [first, ...rest] = number
    console.log(rest) //2,3,4,5
    //对象
    const user = {
        username: 'lux',
        gender: 'female',
        age: 19,
        address: 'peking'
    }
    const { username, ...rest } = user
    console.log(rest) //{"address": "peking", "age": 19, "gender": "female"
    ```
* for ... of循环
* Promise
* 模块化（Module）
```js
//导入部分
//全部导入
import Person from './example'
 
//将整个模块所有导出内容当做单一对象，用as起别名
import * as example from "./example.js"
console.log(example.name)
console.log(example.getName())
 
//导入部分
import { name } from './example'
 
//导出部分
// 导出默认
export default App
 
// 部分导出
export class User extend Component {};
```
* 函数默认值
* Proxy
* 对象合并（Object.assign）
* set：ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。Set函数可以接受一个数组（或者具有 iterable 接口的其他数据结构）作为参数，用来初始化。
    * Set 实例的属性
        * Set.prototype.constructor：构造函数，默认就是Set函数
        * Set.prototype.size：返回Set实例的成员总数。
    * 操作方法（用于操作数据）
        * Set.prototype.add(value)：添加某个值，返回 Set 结构本身。
        * Set.prototype.delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
        * Set.prototype.has(value)：返回一个布尔值，表示该值是否为Set的成员。
        * Set.prototype.clear()：清除所有成员，没有返回值。
    * 遍历方法（用于遍历成员）
        * Set.prototype.keys()：返回键名的遍历器
        * Set.prototype.values()：返回键值的遍历器
        * Set.prototype.entries()：返回键值对的遍历器
        * Set.prototype.forEach()：使用回调函数遍历每个成员
```js
const items = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
const set = new Set(document.querySelectorAll('div'));

let s = new Set();
s.add(1).add(2).add(2); // 注意2被加入了两次
s.size // 2
s.has(1) // true
s.has(2) // true
s.has(3) // false
s.delete(2);
s.has(2) // false

let set = new Set(['red', 'green', 'blue']);
for (let item of set.keys()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.values()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.entries()) {
  console.log(item);
}
// ["red", "red"]
// ["green", "green"]
// ["blue", "blue"]

let set = new Set([1, 4, 9]);
set.forEach((value, key) => console.log(key + ' : ' + value))

let set = new Set(['red', 'green', 'blue']);
for (let x of set) {
  console.log(x);
}
```
* WeakSet：WeakSet 结构与 Set 类似，也是不重复的值的集合。但是，它与 Set 有两个区别。
    * 首先，WeakSet 的成员只能是对象，而不能是其他类型的值。
    * 其次，WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。
```js
const a = [[1, 2], [3, 4]];
const ws = new WeakSet(a);
// WeakSet {[1, 2], [3, 4]}

const ws = new WeakSet();
const obj = {};
const foo = {};
ws.add(window);
ws.add(obj);
```

* Map：类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。也就是说，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。如果你需要“键值对”的数据结构，Map 比 Object 更合适。
    * 属性
        * size属性返回 Map 结构的成员总数
    * 操作方法
        * Map.prototype.set(key, value)
        * Map.prototype.get(key)
        * Map.prototype.has(key)
        * Map.prototype.delete(key)
        * Map.prototype.clear()
    * 遍历方法
        * Map.prototype.keys()：返回键名的遍历器。
        * Map.prototype.values()：返回键值的遍历器。
        * Map.prototype.entries()：返回所有成员的遍历器。
        * Map.prototype.forEach()：遍历 Map 的所有成员。
```js
const m = new Map();
const o = {p: 'Hello World'};
m.set(o, 'content')
m.get(o) // "content"
m.has(o) // true
m.delete(o) // true
m.has(o) // false

//也可以接受一个数组作为参数。该数组的成员是一个个表示键值对的数组
const map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);
map.size // 2
map.has('name') // true
map.get('name') // "张三"
map.has('title') // true
map.get('title') // "Author"
```
* WeakMap：WeakMap结构与Map结构类似，也是用于生成键值对的集合。WeakMap与Map的区别有两点。
    * 首先，WeakMap只接受对象作为键名（null除外），不接受其他类型的值作为键名。
    * 其次，WeakMap的键名所指向的对象，不计入垃圾回收机制。

## CommonJS 和 ES6 Module [区别](https://juejin.cn/post/6938581764432461854#heading-18)
* 共同点：
    * 解决变量污染问题，每个文件都是独立的作用域，所以不存在变量污染
    * 解决代码维护问题，一个文件里代码非常清晰
    * 解决文件依赖问题，一个文件里可以清楚的看到依赖了那些其它文件
* CommonJs
    * CommonJs可以动态加载语句，代码发生在运行时
    * CommonJs混合导出，还是一种语法，只不过不用声明前面对象而已，当我导出引用对象时之前的导出就被覆盖了
    * CommonJs导出值是拷贝，可以修改导出的值，这在代码出错时，不好排查引起变量污染
* Es Module
    * Es Module是静态的，不可以动态加载语句，只能声明在该文件的最顶部，代码发生在编译时
    * Es Module混合导出，单个导出，默认导出，完全互不影响
    * Es Module导出是引用值之前都存在映射关系，并且值都是可读的，不能修改

## [设计模式](https://blog.csdn.net/song_mou_xia/article/details/80763833)
* 单例模式：提供了一种将代码组织为一个逻辑单元的手段，这个逻辑单元中的代码可以通过单一变量进行访问。
```js

// 单体模式
var Singleton = function(name){
    this.name = name;
    this.instance = null;
};
Singleton.prototype.getName = function(){
    return this.name;
}
// 获取实例对象
function getInstance(name) {
    if(!this.instance) {
        this.instance = new Singleton(name);
    }
    return this.instance;
}
// 测试单体模式的实例
var a = getInstance("aa");
var b = getInstance("bb");
console.log(a === b); // true
console.log(a.getName());// aa
console.log(b.getName());// aa
```
* 发布—订阅模式：又叫观察者模式，它定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知。
* 工厂模式：类似于现实生活中的工厂可以产生大量相似的商品，去做同样的事情，实现同样的效果。
```js
function CreatePerson(name,age,sex) {
    var obj = new Object();
    obj.name = name;
    obj.age = age;
    obj.sex = sex;
    obj.sayName = function(){
        return this.name;
    }
    return obj;
}
var p1 = new CreatePerson("longen",'28','男');
var p2 = new CreatePerson("tugenhua",'27','女');
``