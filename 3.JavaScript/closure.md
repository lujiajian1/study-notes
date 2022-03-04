### 执行上下文与作用域
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

### 什么是闭包
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

### 闭包的应用：隐藏数据，只提供 API
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

### 闭包的缺点
因为闭包会保留它们包含函数的作用域，所以比其他函数更占用内存。过度使用闭包可能导致内存过度占用，因此建议仅在十分必要时使用。V8等优化的JavaScript引擎会努力回收被闭包困住的内存，不过我们还是建议在使用闭包时要谨慎。


### 闭包常见面试题
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
### 总结
执行上下文在A函数调用结束后一定会销毁的，所以A函数上下文销毁时也会将自己内部变量销毁，但是闭包是不同的，A函数如果调用结束 return 的是一个函数时，也会将当前上下文的作用域打包一起 return 出去，所以虽然A函数上下文被销毁，但是依然可以在内存中，通过作用域链中的标识索引找到A函数中的变量。关键点：闭包就是一个背包，在上下文执行机制中，但是不受上下文销毁的影响。

另外，本文为了容易理解一些，所以很多地方描述会比较白话一些，有时候会缺失一部分准确性。如果想要系统的学习的话，推荐看下《JavaScript高级程序设计》，本文中有部分内容也是引用了书中的原文。《JavaScript高级程序设计》每看一遍都受益匪浅，强烈推荐。欢迎在评论区多多交流指正，感谢感谢。