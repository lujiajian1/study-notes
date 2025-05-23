## 手写
### 深拷贝

```js
function deepClone(obj = {}) {
  if (typeof obj !== "object" || obj == null) {
    return obj;
  }
  let result = {};
  if (obj instanceof Array) {
    result = [];
  }
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = deepClone(obj[key]);
    }
  }
  return result;
}
```

### 手写 apply
```js
Function.prototype.myapply = function (context, args) {
  //这里默认不传就是给window,也可以用es6给参数设置默认参数
  context = context || window;
  args = args ? args : [];
  //给context新增一个独一无二的属性以免覆盖原有属性
  const key = Symbol();
  context[key] = this; //this就是fn1
  //通过隐式绑定的方式调用函数
  const result = context[key](...args);
  //删除添加的属性
  delete context[key];
  //返回函数调用的返回值
  return result;
};
function fn1(a, b, c) {
  console.log("this", this);
  console.log(a, b, c);
  return "this is fn1";
}
const fn2 = fn1.myapply({ x: 100 }, []);
```

### 手写 call

```js
Function.prototype.mycall = function (context, ...args) {
  //这里默认不传就是给window,也可以用es6给参数设置默认参数
  context = context || window;
  args = args ? args : [];
  //给context新增一个独一无二的属性以免覆盖原有属性
  const key = Symbol();
  context[key] = this;
  //通过隐式绑定的方式调用函数
  const result = context[key](...args);
  //删除添加的属性
  delete context[key];
  //返回函数调用的返回值
  return result;
};
```

### 手写 bind

```js
//手写bind
Function.prototype.mybind = function(context, ...args){
    const fn = this// 获取绑定mybind的function
    args = args ? args : []
    // 返回一个函数
    return function(){
        return fn.apply(context, args);
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

### 手写 instanceof

```js
function new_instance_of(leftVaule, rightVaule) {
  let rightProto = rightVaule.prototype; // 取右表达式的 prototype 值
  leftVaule = leftVaule.__proto__; // 取左表达式的__proto__值
  while (true) {
    if (leftVaule === null) {
      return false;
    }
    if (leftVaule === rightProto) {
      return true;
    }
    leftVaule = leftVaule.__proto__;
  }
}
```

### 写一个简单的 jQuery

```js
class jQuery {
  constructor(selector) {
    const result = document.querySelectorAll(selector);
    const length = result.length;
    for (let i = 0; i < length; i++) {
      this[i] = result[i];
    }
    this.length = length;
    this.selector = selector;
  }
  get(index) {
    return this[index];
  }
  each(fn) {
    for (let i = 0; i < this.length; i++) {
      const elem = this[i];
      fn(elem);
    }
  }
  on(type, fn) {
    return this.each((elem) => {
      elem.addEventListener(type, fn, false);
    });
  }
  // 扩展很多 DOM API
}

// 插件
jQuery.prototype.dialog = function (info) {
  alert(info);
};

// “造轮子”
class myJQuery extends jQuery {
  constructor(selector) {
    super(selector);
  }
  // 扩展自己的方法
  addClass(className) {}
  style(data) {}
}

const $p = new jQuery("p");
$p.get(1);
$p.each((elem) => console.log(elem.nodeName));
$p.on("click", () => alert("clicked"));
```

### 实现一个事件绑定 Event 类

```js
class Event {
  constructor() {
    this._cache = {}; // 为了查找迅速使用了对象
  }
  on(eventName, callback) {
    // 绑定事件
    // 如果有就放入, 没有就新建, 然后再看下是否有放入函数,没有就加入
    let fns = (this._cache[eventName] = this._cache[eventName] || []);
    if (fns.indexOf(callback === -1)) {
      // 如果事件方法没有的话就放入到字典进去
      fns.push(callback);
    }
    return this;
  }
  once(eventName, callback) {
    callback.__once = true;
    this.on(eventName, callback);
  }
  trigger(eventName, data) {
    // 触发事件
    // 看下字典里有没有这个函数名字， 有的话就触发它
    let fns = this._cache[eventName];
    if (Array.isArray(fns)) {
      // 有的话就对立面的每一个function传入参数data
      fns.forEach((fn) => {
        fn(data);
        if (fn.__once) {
          this.off(eventName, fn);
        }
      });
    }
    return this;
  }
  off(eventName, callback) {
    //解绑
    let fns = this._cache[eventName];
    if (Array.isArray(fns)) {
      if (callback) {
        let index = fns.indexOf(callback);
        if (index !== -1) {
          fns.splice(index, 1);
        }
      } else {
        fns.length = 0; // 全部清空
      }
    }
    return this;
  }
}
const event = new Event();
event.on("test", (a) => {
  console.log(a);
});
event.trigger("thet", "hello world"); // 绑定后就输出
event.off("test");
event.trigger("test", "hello world"); // 解绑后就不显示了
```

### 手写简易的 ajax

```js
function ajax(url) {
  const p = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else if (xhr.status === 404 || xhr.status === 500) {
          reject(new Error("404 not found"));
        }
      }
    };
    xhr.send(null);
  });
  return p;
}

const url = "/data/test.json";
ajax(url)
  .then((res) => console.log(res))
  .catch((err) => console.error(err));
```

### 实现 promise

```js
function Promise(fn) {
  // Promise resolve时的回调函数集
  this.cbs = [];

  // 传递给Promise处理函数的resolve
  // 这里直接往实例上挂个data
  // 然后把onResolvedCallback数组里的函数依次执行一遍就可以
  const resolve = (value) => {
    // 注意promise的then函数需要异步执行
    setTimeout(() => {
      this.data = value;
      this.cbs.forEach((cb) => cb(value));
    });
  };

  // 执行用户传入的函数
  // 并且把resolve方法交给用户执行
  fn(resolve);
}

Promise.prototype.then = function (onResolved) {
  // 这里叫做promise2
  return new Promise((resolve) => {
    this.cbs.push(() => {
      const res = onResolved(this.data);
      if (res instanceof Promise) {
        // resolve的权力被交给了user promise
        res.then(resolve);
      } else {
        // 如果是普通值 就直接resolve
        // 依次执行cbs里的函数 并且把值传递给cbs
        resolve(res);
      }
    });
  });
};

new Promise((resolve) => {
  setTimeout(() => {
    resolve(1);
  }, 500);
})
  .then((res) => {
    console.log(res);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(2);
      }, 500);
    });
  })
  .then(console.log);
```

### 实现 Promise.all 方法

```js
function promiseAll(promises) {
  return new Promise(function (resolve, reject) {
    if (!isArray(promises)) {
      return reject(new TypeError("arguments must be an array"));
    }
    var resolvedCounter = 0;
    var promiseNum = promises.length;
    var resolvedValues = new Array(promiseNum);
    for (var i = 0; i < promiseNum; i++) {
      (function (i) {
        Promise.resolve(promises[i]).then(
          function (value) {
            resolvedCounter++;
            resolvedValues[i] = value;
            if (resolvedCounter == promiseNum) {
              return resolve(resolvedValues);
            }
          },
          function (reason) {
            return reject(reason);
          }
        );
      })(i);
    }
  });
}
```

### 利用 promise sleep 函数实现

```js
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

const repeatedGreetings = async () => {
  await sleep(1000);
  console.log(1);
  await sleep(1000);
  console.log(2);
  await sleep(1000);
  console.log(3);
};
repeatedGreetings();
```

### 手动控制并发请求

```js
function multiRequest(urls = [], maxNum) {
  const len = urls.length; // 请求总数量
  const result = new Array(len).fill(false); // 根据请求数量创建一个数组来保存请求的结果
  let count = 0; // 当前完成的数量

  return new Promise((resolve, reject) => {
    while (count < maxNum) {
      // 请求maxNum个
      next();
    }
    function next() {
      let current = count++;
      if (current >= len) {
        // 处理边界条件
        // 请求全部完成就将promise置为成功状态, 然后将result作为promise值返回
        !result.includes(false) && resolve(result);
        return;
      }
      const url = urls[current];
      console.log(`开始 ${current}`, new Date().toLocaleString());
      fetch(url)
        .then((res) => {
          result[current] = res; // 保存请求结果
          console.log(`完成 ${current}`, new Date().toLocaleString());
          if (current < len) {
            // 请求没有全部完成, 就递归
            next();
          }
        })
        .catch((err) => {
          console.log(`结束 ${current}`, new Date().toLocaleString());
          result[current] = err;
          if (current < len) {
            // 请求没有全部完成, 就递归
            next();
          }
        });
    }
  });
}
```

### 实现一个发布订阅模式

```js
class Subjects {
  constructor() {
    this.subs = [];
    this.state = 0;
  }
  addSubs(sub) {
    var isExsit = this.subs.includes(sub);
    if (isExsit) {
      return console.log("sub existed");
    }
    this.subs.push(sub);
  }
  removeSubs(sub) {
    var index = this.subs.indexOf(sub);
    if (index === -1) {
      return console.log("sub not exist");
    }
    this.subs.splice(index, 1);
  }
  notify() {
    console.log("sub update");
    this.subs.forEach((sub) => sub.update(this.state));
  }
  doSomeLogic() {
    console.log("doSomeLogic");
    this.state = Math.floor(Math.random() * 10);
    this.notify();
  }
}
class Observer {
  constructor(name) {
    this.name = name;
  }
  update(state) {
    console.log(this.name + " Recived state" + state);
  }
}
var observerA = new Observer("A");
var observerB = new Observer("B");
var subject = new Subjects();
subject.addSubs(observerA);
subject.addSubs(observerB);
subject.doSomeLogic();
subject.doSomeLogic();
subject.removeSubs(observerB);
subject.doSomeLogic();
```

### 手写防抖 debounce

```js
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

### 手写节流 throttle

```js
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

### 手写深度比较 isEqual

```js
// 判断是否是对象或数组
function isObject(obj) {
  return typeof obj === "object" && obj !== null;
}
// 全相等（深度）
function isEqual(obj1, obj2) {
  if (!isObject(obj1) || !isObject(obj2)) {
    //处理非对象的比较

    // 值类型（注意，参与 equal 的一般不会是函数）
    return obj1 === obj2;
  }
  if (obj1 === obj2) {
    // 处理两个相同值
    return true;
  }
  // 两个都是对象或数组，而且不相等
  // 1. 先取出 obj1 和 obj2 的 keys ，比较个数
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);
  if (obj1Keys.length !== obj2Keys.length) {
    //key 的长度不同
    return false;
  }
  // 2. 以 obj1 为基准，和 obj2 一次递归比较
  for (let key in obj1) {
    // 比较当前 key 的 val —— 递归！！！
    const res = isEqual(obj1[key], obj2[key]);
    if (!res) {
      return false;
    }
  }
  // 3. 全相等
  return true;
}
```

### [函数柯里化](https://www.jianshu.com/p/2975c25e4d71)

```js
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

### 解析 URL 参数为对象

```js
function parseParam(url) {
  const paramsStr = /.+\?(.+)$/.exec(url)[1]; // 将 ? 后面的字符串取出来
  const paramsArr = paramsStr.split("&"); // 将字符串以 & 分割后存到数组中
  let paramsObj = {};
  // 将 params 存到对象中
  paramsArr.forEach((param) => {
    if (/=/.test(param)) {
      // 处理有 value 的参数
      let [key, val] = param.split("="); // 分割 key 和 value
      val = decodeURIComponent(val); // 解码
      val = /^\d+$/.test(val) ? parseFloat(val) : val; // 判断是否转为数字

      if (paramsObj.hasOwnProperty(key)) {
        // 如果对象有 key，则添加一个值
        paramsObj[key] = [].concat(paramsObj[key], val);
      } else {
        // 如果对象没有这个 key，创建 key 并设置值
        paramsObj[key] = val;
      }
    } else {
      // 处理没有 value 的参数
      paramsObj[param] = true;
    }
  });

  return paramsObj;
}
```

### 实现 36 进制

```js
// 提供36位的表达 0-9 a-z
function getNums36() {
  var nums36 = [];
  for (var i = 0; i < 36; i++) {
    if (i >= 0 && i <= 9) {
      nums36.push(i);
    } else {
      nums36.push(String.fromCharCode(i + 87)); //将 Unicode 编码转为一个字符
    }
  }
  return nums36;
}
function scale36(n) {
  // 单独的功能函数 // 16进制数： 0-9  a-f    36进制数： 0-9  a-z
  const arr = [];
  var nums36 = getNums36();
  // 36 10
  if (!Number.isInteger(n)) {
    //浮点数判断，目前不支持小鼠
    console.warn("不支持小数转换");
    return n;
  }
  var neg = "";
  if (n < 0) {
    //对负数的处理
    neg = "-";
    n = Math.abs(n);
  }
  while (n) {
    var res = n % 36;
    console.log(res, "+++++++");
    arr.unshift(nums36[res]);
    // 进位
    n = parseInt(n / 36);
    console.log(n, "---------");
  }
  arr.unshift(neg);
  return arr.join("");
}

console.log(scale36(20)); // k
```

### 实现一个对象被 for of 遍历

```js
let obj2 = {
  name: "XX",
  age: 20,
  job: "teacher",
  [Symbol.iterator]() {
    const self = this;
    const keys = Object.keys(self);
    let index = 0;
    return {
      next() {
        if (index < keys.length) {
          return {
            value: self[keys[index++]],
            done: false,
          };
        } else {
          return { value: undefined, done: true };
        }
      },
    };
  },
};
```

### 实现洋葱模型

```js
let middleware = [];
middleware.push((next) => {
  console.log(1);
  next();
  console.log(1.1);
});
middleware.push((next) => {
  console.log(2);
  next();
  console.log(2.1);
});
middleware.push((next) => {
  console.log(3);
  next();
  console.log(3.1);
});
//实现compose函数
// /* 输出
// 1
// 2
// 3
// 3.1
// 2.1
// 1.1
// */
function compose(fnArr) {
  let onIndex = -1;
  let next = function () {
    onIndex++;
    if (onIndex < fnArr.length) {
      fnArr[onIndex](next);
    }
  };
  return next;
}

let fn = compose(middleware);
fn();
```

## 字符串/数组

### 手写数组 flatern（数组拍平）

```js
//使用apply
function flat(arr) {
  // 验证 arr 中，还有没有深层数组 [1, 2, [3, 4]]
  const isDeep = arr.some((item) => item instanceof Array);
  if (!isDeep) {
    return arr; // 已经是 flatern [1, 2, 3, 4]
  }

  const res = Array.prototype.concat.apply([], arr);
  return flat(res); // 递归
}

const res = flat([1, 2, [3, 4, [10, 20, [100, 200]]], 5]);
console.log(res);

//使用展开运算符
function arrf(arr) {
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] instanceof Array) {
      res = res.concat(arrf(arr[i]));
    } else {
      res.push(arr[i]);
    }
  }
  return res;
}
```

### 冒泡排序

遍历整个数组，将数组的每一项与其后一项进行对比，如果不符合要求就交换位置，一共遍历 n 轮，n 为数组的长度。n 轮之后，数组得以完全排序。时间复杂度 O(n^2)。

```js
function bubbleSort(arr) {
  //console.time('BubbleSort');
  // 获取数组长度，以确定循环次数。
  let len = arr.length;
  // 遍历数组len次，以确保数组被完全排序。
  for (let i = 0; i < len; i++) {
    // 遍历数组的前len-i项，忽略后面的i项（已排序部分）。
    for (let j = 0; j < len - 1 - i; j++) {
      // 将每一项与后一项进行对比，不符合要求的就换位。
      if (arr[j] > arr[j + 1]) {
        //从小到大排序
        [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]];
      }
    }
  }
  //console.timeEnd('BubbleSort');
  return arr;
}
```

### 快速排序

在数组中选取一个参考点（pivot），然后对于数组中的每一项，大于 pivot 的项都放到数组右边，小于 pivot 的项都放到左边，左右两边的数组项可以构成两个新的数组（left 和 right），然后继续分别对 left 和 right 进行分解，直到数组长度为 1，最后合并（其实没有合并，因为是在原数组的基础上操作的，只是理论上的进行了数组分解）。

```js
//递归
function quickSort(arr) {
  // 当数组长度不大于1时，返回结果，防止callstack溢出。
  if (arr.length <= 1) return arr;
  return [
    // 递归调用quickSort，通过Array.prototype.filter方法过滤小于arr[0]的值，注意去掉了arr[0]以防止出现死循环。
    ...quickSort(arr.slice(1).filter((item) => item < arr[0])),
    arr[0],
    ...quickSort(arr.slice(1).filter((item) => item >= arr[0])),
  ];
}
//非递归
const quickSort1 = (arr) => {
  if (arr.length <= 1) {
    return arr;
  }
  //取基准点
  const midIndex = Math.floor(arr.length / 2);
  //取基准点的值，splice(index,1) 则返回的是含有被删除的元素的数组。
  const valArr = arr.splice(midIndex, 1);
  const midIndexVal = valArr[0];
  const left = []; //存放比基准点小的数组
  const right = []; //存放比基准点大的数组
  //遍历数组，进行判断分配
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < midIndexVal) {
      left.push(arr[i]); //比基准点小的放在左边数组
    } else {
      right.push(arr[i]); //比基准点大的放在右边数组
    }
  }
  //递归执行以上操作，对左右两个数组进行操作，直到数组长度为 <= 1
  return quickSort1(left).concat(midIndexVal, quickSort1(right));
};
const array2 = [5, 4, 3, 2, 1];
console.log("quickSort1 ", quickSort1(array2));
// quickSort1: [1, 2, 3, 4, 5]
```

### 归并排序

排序一个数组，我们先把数组从中间分成前后两部分，然后对前后两部分分别排序，再将排好序的两部分合并在一起，这样整个数组就都有序了。

```js
const mergeSort = (arr) => {
  //采用自上而下的递归方法
  const len = arr.length;
  if (len < 2) {
    return arr;
  }
  // length >> 1 和 Math.floor(len / 2) 等价
  let middle = Math.floor(len / 2),
    left = arr.slice(0, middle),
    right = arr.slice(middle); // 拆分为两个子数组
  return merge(mergeSort(left), mergeSort(right));
};

const merge = (left, right) => {
  const result = [];

  while (left.length && right.length) {
    // 注意: 判断的条件是小于或等于，如果只是小于，那么排序将不稳定.
    if (left[0] <= right[0]) {
      result.push(left.shift());
    } else {
      result.push(right.shift());
    }
  }

  while (left.length) result.push(left.shift());

  while (right.length) result.push(right.shift());

  return result;
};
```

### [下一个排列](https://leetcode-cn.com/problems/next-permutation/)

```js
var nextPermutation = function (nums) {
  // 从又往左找到第一个降序的位置
  let right = nums.length - 1;
  let flag = false;
  while (right) {
    if (nums[right] > nums[right - 1]) {
      right--;
      flag = true;
      break;
    } else {
      right--;
    }
  }
  if (!flag) {
    nums.sort((next, pre) => next - pre);
  } else {
    let sorted = nums.splice(right + 1).sort((next, pre) => next - pre);
    let move;
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i] > nums[right]) {
        move = i;
        break;
      }
    }
    let temp = sorted[move];
    sorted[move] = nums[right];
    nums[right] = temp;
    sorted.sort((next, pre) => next - pre);
    nums.push(...sorted);
  }
  nums;
};
```

### 实现[['a', 'b'], ['n', 'm'], ['0', '1']] => ['an0', 'an1, 'am0', 'am1', 'bn0', 'bn1', 'bm0', 'bm1']

```js
function changeArr(arr) {
  // 赋值：赋值给一个新的对象，这样修改之后不会影响之前的值
  const newArr = [...arr];
  // 取值：获取数组的第一个值
  let result = newArr.shift();
  // 循环这个数组
  while (newArr.length) {
    // 取值：从这个数组中再次获取第一个值
    const other = newArr.shift();
    // 定义一个新的数组为 []
    const newResult = [];
    // 循环 result
    result.forEach((item) => {
      // 循环 other
      other.forEach((_item) => {
        // 把数据组合返回给定义的数组
        newResult.push(item + "" + _item);
      });
    });
    // 把 result 赋值给 newResult
    result = [...newResult];
  }
  return result;
}

const arr = [
  ["a", "b"],
  ["m", "n"],
  [0, 1],
];
const result = changeArr(arr);
console.log(result); // ["am0", "am1", "an0", "an1", "bm0", "bm1", "bn0", "bn1"]

const arr2 = [
  ["a", "b"],
  ["m", "n", "0"],
  [0, 1],
  ["#", "$"],
];
const result2 = changeArr(arr2);
console.log(result2);
// (24) ["am0#", "am0$", "am1#", "am1$", "an0#", "an0$", "an1#", "an1$", "a00#", "a00$", "a01#", "a01$", "bm0#", "bm0$", "bm1#", "bm1$", "bn0#", "bn0$", "bn1#", "bn1$", "b00#", "b00$", "b01#", "b01$"]
```

### 合并区间

```js
//输入: intervals = [[1,3],[2,6],[8,10],[15,18]]
//输出: [[1,6],[8,10],[15,18]]
//解释: 区间 [1,3] 和 [2,6] 重叠, 将它们合并为 [1,6].
var merge = function (intervals) {
  if (intervals.length <= 1) {
    return intervals;
  }

  // 先将数组按照区间最左边的大小顺序排序（升序）
  let arr = intervals.sort((a, b) => a[0] - b[0]);
  function unite(arr, i) {
    if (i == arr.length - 1) {
      return arr;
    }
    // 如果下一个区间的左区间在本区间之间，则合并一次
    if (arr[i + 1][0] <= arr[i][1]) {
      arr[i] = [arr[i][0], Math.max(arr[i][1], arr[i + 1][1])];
      // 合并之后删除冗余区间
      arr.splice(i + 1, 1);
    } else {
      // 如果没有合并，则找到下一个待合并区间
      i++;
    }
    return unite(arr, i);
  }

  return unite(arr, 0);
};
```

### 两数之和：给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target 的那 两个 整数，并返回它们的数组下标。输入：nums = [2,7,11,15], target = 9 输出：[0,1]

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
  for (let i = 0; i < nums.length; i++) {
    let onitem = nums[i];
    let next = nums.indexOf(target - onitem);
    if (next !== -1 && next !== i) {
      return [i, next];
    }
  }
};
```

### 三数之和：给你一个包含 n 个整数的数组  nums，判断  nums  中是否存在三个元素 a，b，c ，使得  a + b + c = 0 ？请你找出所有和为 0 且不重复的三元组。

```js
var threeSum = function (nums) {
  // 如果元素的个数小于4，直接返回空数组
  if (nums.length < 3) {
    return [];
  }
  let res = [];
  nums.sort((num1, num2) => num1 - num2);
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) {
      continue;
    }
    let left = i + 1;
    let right = nums.length - 1;
    while (left < right) {
      if (nums[i] + nums[left] + nums[right] === 0) {
        if (nums[left] === nums[left + 1] && right > left + 1) {
          left++;
          continue;
        } else if (nums[right] === nums[right - 1] && right > left + 1) {
          right--;
          continue;
        } else {
          res.push([nums[i], nums[left], nums[right]]);
          left++;
        }
      } else if (nums[i] + nums[left] + nums[right] < 0) {
        left++;
      } else {
        right--;
      }
    }
  }
  return res;
};
```

### [搜索旋转排序数组](https://leetcode-cn.com/problems/search-in-rotated-sorted-array/)

```js
 /**
 * 二分法
 */
public int search(int[] nums, int target) {
    int len = nums.length;
    int left = 0;   // 左边界
    int right = len -1; // 右边界
    while (left <= right) {
        int mid = (right + left) / 2;
        if (nums[mid] == target) {
            return mid;
        }
        // 右半边为升序
        else if (nums[mid] < nums[right]) {
            if (nums[mid] < target && target <= nums[right]) {
                // 如果值在右半边，则丢弃左半边
                left = mid + 1;
            } else {
                // 其他情况
                right = mid - 1;
            }
        }
        // 左半边升序
        else {
            if (nums[left] <= target && target < nums[mid]) {
                // 如果值在左半边，则丢弃右半边
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
    }
    return -1;
}
```

### [寻找两个正序数组的中位数](https://leetcode-cn.com/problems/median-of-two-sorted-arrays/)

```js
var findMedianSortedArrays = function (nums1, nums2) {
  let res = [];
  if (nums1.length < 1) {
    res = nums2;
  }
  if (nums2.length < 1) {
    res = nums1;
  }
  res = nums2.concat(nums1);
  res = res.sort((a, b) => a - b);
  let i1 = Math.ceil(res.length / 2);
  let i2 = Math.floor(res.length / 2);
  if (i1 === i2) {
    return (res[i1 - 1] + res[i1]) / 2;
  } else {
    return res[i2];
  }
};
```

### [全排列](https://leetcode-cn.com/problems/permutations/)

```js
var permute = function (nums) {
  const res = [];

  // 回溯
  const backtrack = (path) => {
    // 终点，当 path 的 length 和 nums 的 length 相等的时候，记录这一次的 path 并结束递归
    if (path.length === nums.length) {
      return res.push(path);
    }

    // 通过循环加递归的形式，模拟出所有的排列情况
    nums.forEach((v) => {
      // 当 path 中，包含这一次的循环的值的时候，进行回溯(中断递归)
      if (path.includes(v)) return;

      // 递归
      backtrack(path.concat(v));
    });
  };
  backtrack([]);

  return res;
};
```

### [字符串中的第一个唯一字符](https://leetcode-cn.com/problems/first-unique-character-in-a-string/)

```js
var firstUniqChar = function (s) {
  for (let i in s) {
    if (s.indexOf(s[i]) == s.lastIndexOf(s[i])) {
      return i;
    }
  }
  return -1;
};
```

### [无重复字符的最长子串](https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/)

```js
function lengthOfLongestSubstring(str) {
  if (str === "") return 0;
  let start = 0,
    maxLen = 0;
  const map = new Map();
  const len = str.length;
  for (let i = 0; i < len; i++) {
    const c = str[i];
    if (map.has(c)) {
      start = Math.max(map.get(c) + 1, start);
    }
    map.set(c, i);
    maxLen = Math.max(i - start + 1, maxLen);
  }
  return maxLen;
}
```

### [最长回文子串](https://leetcode-cn.com/problems/longest-palindromic-substring/)

```js
var longestPalindrome = function (s) {
  let n = s.length;
  if (n == 0) return ""; //字符串为空则返回空
  if (n == 1) return s; //字符串为一个字符, 显然返回自身
  let result = "";
  for (let i = 0; i < n; i++) {
    //字符串长度超过2
    for (let j = i + 1; j <= n; j++) {
      let str = s.slice(i, j); //可得到所有子串
      let f = str.split("").reverse().join(""); //对字符串利用数组方法倒序

      if (str == f) {
        //判断是否为回文
        result = str.length > result.length ? str : result;
      }
    }
  }
  return result;
};
```

### [整数反转](https://leetcode-cn.com/problems/reverse-integer/)

```js
var reverse = function (x) {
  const symbol = String(x).split("").reverse().join("");
  let result;
  if (x >= 0) {
    result = Number(symbol);
  } else {
    result = Number(symbol.slice(-1) + symbol.slice(0, -1));
  }
  if (result < (-2) ** 31 || result > 2 ** 31 - 1) {
    result = 0;
  }
  return result;
};
```

### 退格

```js
// 比较含有退格的字符串，"<-"代表退格键，"<"和"-"均为正常字符
// 输入："a<-b<-", "c<-d<-"，结果：true，解释：都为""
// 输入："<-<-ab<-", "<-<-<-<-a"，结果：true，解释：都为"a"
// 输入："<-<ab<-c", "<<-<a<-<-c"，结果：false，解释："<ac" !== "c"
function isEqual(str1, str2) {
  function getResStr(str) {
    let res = [];
    for (let i = 0; i < str.length; i++) {
      if (str[i] === "<" && str[i + 1] === "-") {
        res.pop();
        i++;
      } else {
        res.push(str[i]);
      }
    }
    console.log(res.join(""));
    return res.join("");
  }
  let restBo = getResStr(str1) === getResStr(str2);
  console.log(restBo);
  return restBo;
}
isEqual("a<-b<-", "c<-d<-");
isEqual("<-<-ab<-", "<-<-<-<-a");
isEqual("<-<ab<-c", "<<-<a<-<-c");
```

### 数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 有效的 括号组合，输入：n = 3，输出：["((()))","(()())","(())()","()(())","()()()"]

```js
function generateParenthesis(n: number): string[] {
  const result: string[] = [];
  const dfs = (path: string, count1: number, count2: number) => {
    // path为递归的字符串，count1为左括号的数量，count2为右括号的数量
    // 当左括号或右括号大于传入的n，括号生成后的岁数，那这个递归函数就不跑了。
    if (count1 > n || count2 > n) return;
    // 如果右括号的数量大于左括号的数量，也不符合题意，也不跑了。
    if (count2 > count1) return;
    // 左括号和右括号的数量都对了 那就把正确结果推出去
    if (count1 === n && count2 === n) {
      result.push(path);
      return;
    }

    //这边处理第一次传入空字符串的情况
    if (count1 === 0) {
      dfs(path + "(", count1 + 1, count2);
    } else {
      // 只有这两种结果
      dfs(path + "(", count1 + 1, count2);
      dfs(path + ")", count1, count2 + 1);
    }
  };
  dfs("", 0, 0);
  return result;
}
```

### [有效括号](https://leetcode-cn.com/problems/valid-parentheses/)

```js
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
  let sObj = {
    "(": ")",
    "[": "]",
    "{": "}",
  };
  let que = [];
  for (let i = 0; i < s.length; i++) {
    if (que.length === 0) {
      que.push(s[i]);
    } else if (sObj[que[que.length - 1]] === s[i]) {
      que.pop();
    } else {
      que.push(s[i]);
    }
  }
  if (que.length === 0) {
    return true;
  } else {
    return false;
  }
};
```

### [数组中出现次数超过一半的数字](https://leetcode-cn.com/problems/shu-zu-zhong-chu-xian-ci-shu-chao-guo-yi-ban-de-shu-zi-lcof/)

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function (nums) {
  let newNums = nums.sort((a, b) => a - b);
  let length = Math.floor(newNums.length / 2);
  for (let i = 0; i < length + 1; i++) {
    if (newNums[i] === newNums[i + length]) {
      return newNums[i];
    }
  }
  return -1;
};
```

### 返回该数组中出现频率>=n 的元素列表

```js
Array.prototype.findDup = function (count) {
  return this.reduce((re, val) => {
    let index = re.findIndex((o) => o.val === val);
    if (index >= 0) {
      re[index].count++;
    } else {
      re.push({ count: 1, val });
    }
    return re;
  }, [])
    .filter((o) => o.count >= count)
    .map((o) => o.val);
};
```

### 对象查找值，返回路径
```js
let obj = {
    a: {
        a_1: {
            a_1_1: 'a11',
            a_1_2: 'a12'
        },
        a_2: {
            a_2_1: 'a21',
            a_2_2: 'a22'
        }
    },
    b: {
        b_1: 'b1',
        b_2: 'b2'
    },
    c: 'c'
} 
function findPath(obj, val) {
    let keys = Object.keys(obj);
    let result = [];
    for (let i = 0; i < keys.length; i++) {
        let _ = keys[i];
        if (typeof obj[_] === 'object' && obj[_] !== null) {
            let res = findPath(obj[_], val);
            if (res.length > 0) {
                result = result.concat([_], res);
            }
        } else if (obj[_] === val) {
            result = result.concat([_]);
            break;
        }
    }
    return result;
}
console.log(findPath(obj, 'a22')); // ['a', 'a_2', 'a_2_2']
```

## 链表

### 链表（插入，删除，反转）

```js
//节点类
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class SinglyLinkedList {
  constructor(data) {
    this.head = new Node(data);
  }
  add(data) {
    let node = new Node(data);
    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    current.next = node;
  }
  addAt(data, index) {
    let node = new Node(data);
    let current = this.head;
    let currentIndex = 1;
    while (currentIndex < index) {
      current = current.next;
      currentIndex++;
    }
    node.next = current.next;
    current.next = node;
  }
  removeAt(index) {
    let current = this.head;
    let currentIndex = 1;
    let pre = null;
    while (currentIndex < index) {
      pre = current;
      current = current.next;
      currentIndex++;
    }
    pre.next = current.next;
  }
  reverse() {
    let pre = this.head;
    let current = this.head.next;
    pre.next = null;
    while (current) {
      let next = current.next;
      current.next = pre;
      pre = current;
      current = next;
    }
    this.head = pre;
  }
}
```

### 判断回文链表

```js
var isPalindrome = function (head) {
  let left = head;
  function traverse(right) {
    if (right == null) return true;
    let res = traverse(right.next);
    res = res && right.val === left.val;
    left = left.next;
    return res;
  }
  return traverse(head);
};
```

### K 个一组翻转链表（输入：head = [1,2,3,4,5], k = 2 ; 输出：[2,1,4,3,5]）

```js
var reverseKGroup = function (head, k) {
  let a = head,
    b = head;
  for (let i = 0; i < k; i++) {
    if (b == null) return head;
    b = b.next;
  }
  const newHead = reverse(a, b);
  a.next = reverseKGroup(b, k);
  return newHead;
};
function reverse(a, b) {
  let prev = null,
    cur = a,
    nxt = a;
  while (cur != b) {
    nxt = cur.next;
    cur.next = prev;
    prev = cur;
    cur = nxt;
  }
  return prev;
}
```

### 判断环形链表

```js
var hasCycle = function (head) {
  if (head == null || head.next == null) return false;
  let slower = head,
    faster = head;
  while (faster != null && faster.next != null) {
    slower = slower.next;
    faster = faster.next.next;
    if (slower === faster) return true;
  }
  return false;
};
```

### 判断相交链表

```js
var getIntersectionNode = function (headA, headB) {
  let lastHeadA = null;
  let lastHeadB = null;
  let originHeadA = headA;
  let originHeadB = headB;
  if (!headA || !headB) {
    return null;
  }
  while (true) {
    if (headB == headA) {
      return headB;
    }
    if (headA && headA.next == null) {
      lastHeadA = headA;
      headA = originHeadB;
    } else {
      headA = headA.next;
    }
    if (headB && headB.next == null) {
      lastHeadB = headB;
      headB = originHeadA;
    } else {
      headB = headB.next;
    }
    if (lastHeadA && lastHeadB && lastHeadA != lastHeadB) {
      return null;
    }
  }
  return null;
};
```

### 合并两个有序链表

```js
//输入：1->2->4, 1->3->4 输出：1->1->2->3->4->4
var mergeTwoLists = function (l1, l2) {
  if (l1 == null) return l2;
  if (l2 == null) return l1;
  if (l1.val < l2.val) {
    l1.next = mergeTwoLists(l1.next, l2);
    return l1;
  } else {
    l2.next = mergeTwoLists(l1, l2.next);
    return l2;
  }
};
```

### [两数相加](https://leetcode-cn.com/problems/add-two-numbers/)

```js
var addTwoNumbers = function (l1, l2) {
  let addOne = 0;
  let sum = new ListNode("0");
  let head = sum;
  while (addOne || l1 || l2) {
    let val1 = l1 !== null ? l1.val : 0;
    let val2 = l2 !== null ? l2.val : 0;
    let r1 = val1 + val2 + addOne;
    addOne = r1 >= 10 ? 1 : 0;
    sum.next = new ListNode(r1 % 10);
    sum = sum.next;
    if (l1) l1 = l1.next;
    if (l2) l2 = l2.next;
  }
  return head.next;
};
```

## 二叉树

### 二叉树前中后遍历

![二叉树前中后遍历](https://github.com/lujiajian1/study-notes/blob/main/img/nodetree.png)

```js
// 二叉树的生成
function NodeTree(value){
    this.value = value;
    this.left = null;
    this.right = null;
}

let ta = new NodeTree('a');
let tb = new NodeTree('b');
let tc = new NodeTree('c');
let td = new NodeTree('d');
let te = new NodeTree('e');
let tf = new NodeTree('f');
let tg = new NodeTree('g');

ta.left = tb;
ta.right = tc;
tb.left = td;
tb.right = te;
tc.left = tf;
tc.right = tg;

// 形如上面的这个格式，ta被称为一颗二叉树。 满二叉树， 完全二叉树

// 二叉树的遍历，分为三种，前序遍历，中序遍历，后续遍历（使用回调）
/**
 * 二叉树的前序遍历
 * @param treeList
 * @returns {null}
 */
function treeFrontEach(treeList){
    if (!treeList || treeList.value === null) return null;
    console.log(treeList.value);
    treeFrontEach(treeList.left);
    treeFrontEach(treeList.right);
}

treeFrontEach(ta); 输出的结果 a b d e c f g

/**
 * 中序遍历
 * @param treeList
 * @returns {null}
 */
function treeMiddleEach(treeList){
    if (!treeList || treeList.value === null) return null;
    treeMiddleEach(treeList.left);
    console.log(treeList.value);
    treeMiddleEach(treeList.right);
}
treeMiddleEach(ta); 输出的结果 d b e a c f c g

/**
 * 后序遍历
 * @param treeList
 * @returns {null}
 */
function treeEndEach(treeList){
    if (!treeList || treeList.value === null) return null;
    treeEndEach(treeList.left);
    treeEndEach(treeList.right);
    console.log(treeList.value);
}

treeEndEach(ta); 输出结果 d e b f g c a
```

```js
//不使用回调

//前序遍历
const preorderTraversal = function (root) {
  const stack = [],
    res = [];
  root && stack.push(root);
  // 使用一个栈stack，每次首先输出栈顶元素，也就是当前二叉树根节点，之后依次输出二叉树的左孩子和右孩子
  while (stack.length > 0) {
    let cur = stack.pop();
    res.push(cur.val);
    // 先入栈的元素后输出，所以先入栈当前节点右孩子，再入栈左孩子
    cur.right && stack.push(cur.right);
    cur.left && stack.push(cur.left);
  }
  return res;
};
//中序遍历
const inorderTraversal = function (root) {
  const res = [],
    stack = [];
  let node = root;
  while (stack.length > 0 || node !== null) {
    if (node) {
      //node存在
      stack.push(node); //当前节点push
      node = node.left; //找left
    } else {
      //node不存在
      node = stack.pop(); //弹出最深的left
      res.push(node.val); //res push
      node = node.right; //找right
    }
  }
  return res;
};
//后序遍历
const postorderTraversal = function (root) {
  let stack = [],
    res = [];
  root && stack.push(root);
  while (stack.length > 0) {
    let cur = stack.pop();
    res.push(cur.val);
    cur.left && stack.push(cur.left);
    cur.right && stack.push(cur.right);
  }
  return res.reverse();
};
```

### 判断对称二叉树（镜像对称）

```js
// 用于递归的helper函数，接收参数为左节点和右节点。
const helper = (left: TreeNode | null, right: TreeNode | null) => {
  // 如果传入的左节点和右节点都不存在 也是镜像
  if (left == right) return true;
  // 如果左节点和右节点有一个的值不存在，那就不是对称的两个节点
  else if (left.val === 0 || right.val === 0) return false;
  // 最后判断并递归，左节点和右节点都存在并且值为相等，那就递归他们的子节点。
  return (
    left.val === right.val &&
    helper(left.left, right.right) &&
    helper(left.right, right.left)
  );
};
function isSymmetric(root: TreeNode | null): boolean {
  //传入的root可能为null，做下判断。
  if (root === null || root === undefined) return true;
  else {
    return helper(root.left, root.right);
  }
}
```

### [平衡二叉树](https://leetcode-cn.com/problems/balanced-binary-tree/)

```js
function isBalanced(root) {
  if (root === null) {
    return true;
  }
  return (
    Math.abs(tree_height(root.left) - tree_height(root.right)) <= 1 &&
    isBalanced(root.left) &&
    isBalanced(root.right)
  );
}
function tree_height(root) {
  var deep = -Infinity;
  if (root === null) {
    return -1;
  }
  deep = Math.max(deep, tree_height(root.left));
  deep = Math.max(deep, tree_height(root.right));
  return deep + 1;
}
```

### [路径总和](https://leetcode-cn.com/problems/path-sum/submissions/)

```js
//通过递归方法来解决
var hasPathSum = function (root, targetSum) {
  if (!root) {
    return false;
  }
  if (root.val == targetSum && root.left == null && root.right == null) {
    return true;
  }
  let left = hasPathSum(root.left, targetSum - root.val);
  let right = hasPathSum(root.right, targetSum - root.val);
  return left || right;
};
```

### [路径总和 II](https://leetcode-cn.com/problems/path-sum-ii/)

```js
/**
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {number[][]}
 */
var pathSum = function (root, targetSum) {
  var res = [];
  var array = [];
  function doFind(root, targetSum) {
    if (root == null) return;
    targetSum = targetSum - root.val;
    array.push(root.val);
    if (root.left == null && root.right == null && targetSum == 0) {
      res.push([...array]);
    }
    doFind(root.left, targetSum);
    doFind(root.right, targetSum);
    array.pop();
  }
  doFind(root, targetSum);
  return res;
};
```

### [翻转二叉树](https://leetcode-cn.com/problems/invert-binary-tree/)

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
var invertTree = function (root) {
  if (root) {
    [root.left, root.right] = [invertTree(root.right), invertTree(root.left)];
  }
  return root;
};
```

### [合并二叉树](https://leetcode-cn.com/problems/merge-two-binary-trees/)

```js
var mergeTrees = function (t1, t2) {
  if (!t1) return t2;
  if (!t2) return t1;
  t1.val = t1.val + t2.val;
  t1.left = mergeTrees(t1.left, t2.left);
  t1.right = mergeTrees(t1.right, t2.right);
  return t1;
};
```

### DOM 树的 DFS(深度优先遍历)

```js
const parentDOM = document.querySelector("#container");
//非回调
function deepTravalSal(node) {
  const nodes = [];
  const stack = [];
  if (node) {
    stack.push(node);
    while (stack.length) {
      const item = stack.pop();
      const len = item.children.length;
      nodes.push(item);
      for (let i = len - 1; i >= 0; i--) {
        stack.push(item.children[i]);
      }
    }
  }
  return nodes;
}
//回调
function dfs(dom) {
  let nodeList = [];
  nodeList.push(dom);
  if (dom.children && dom.children.length) {
    for (let i = 0; i < dom.children.length; i++) {
      nodeList = nodeList.concat(dfs(dom.children[i]));
    }
  }
  return nodeList;
}
console.log(deepTravalSal(parentDOM));
```

### DOM 树的 BFS(广度优先遍历)

```js
const parentDOM = document.getElementById("container");
//非回调
function breathTravalSal(node) {
  const nodes = [];
  const queue = [];
  if (node) {
    queue.push(node);
    while (queue.length) {
      const item = queue.shift();
      nodes.push(item);
      for (const v of item.children) {
        queue.push(v);
      }
    }
  }
  return nodes;
}
//回调
function bfs(dom) {
  if (!(dom instanceof Array)) {
    dom = [dom];
  }
  let nodeList = [];
  let childrenArr = [];
  for (let i = 0; i < dom.length; i++) {
    nodeList.push(dom[i]);
    if (dom[i].children && dom[i].children.length) {
      childrenArr = childrenArr.concat(dom[i].children);
    }
  }
  if (childrenArr.length > 0) {
    nodeList = nodeList.concat(bfs(childrenArr));
  }
  return nodeList;
}
console.log(breathTravalSal(parentDOM));
```

### [二叉树右视图](https://leetcode-cn.com/problems/binary-tree-right-side-view/)

```js
//方法1
var rightSideView = function (root) {
  if (!root) return [];
  let arrList = [];
  DFS(root, 0, arrList);
  return arrList;
};

function DFS(root, depth, res) {
  if (root) {
    if (res.length === depth) {
      // 当数组长度等于当前 深度 时, 把当前的值加入数组
      res.push(root.val);
    }
    DFS(root.right, depth + 1, res); // 先从右边开始, 当右边没了, 再轮到左边
    DFS(root.left, depth + 1, res);
  }
}
//方法2
var rightSideView = function(root) {
    let nums = [];
    if (!root) return nums;

    let stack = [];
    let p = root;
    let maxDepth = 0;
    let currentDepth = 0;
    while(p || stack.length > 0) {
        while(p) {      //遍历节点的右分支
            currentDepth++;
            if (currentDepth > maxDepth) {    //推入节点
                maxDepth++;
                nums.push(p.val);
            }
            stack.push([p, currentDepth]);
            p = p.right;
        }

        let node = stack.pop();    //回溯
        p = node[0].left;     //对节点的左分支进行遍历
        currentDepth = node[1];  //当前深度也要回溯
    }

    return nums;
};
```

## 动态规划

### 爬楼梯：假设你现在正在爬楼梯，楼梯有 n 级。每次你只能爬 1 级或者 2 级，那么你有多少种方法爬到楼梯的顶部

```js
var climbStairs = function (n) {
  if (n === 1 || n === 2) {
    return n;
  }
  // 前一个值
  let pre = 2;
  // 前一个的前一个的值
  let beforePre = 1;
  // 中间变量
  let temp = null;
  for (let index = 3; index <= n; index++) {
    temp = pre;
    pre = pre + beforePre;
    beforePre = temp;
  }
  return pre;
};
```

### [编辑距离](https://leetcode-cn.com/problems/edit-distance/)

```js
var minDistance = function (word1, word2) {
  let row = word1.length;
  let col = word2.length;
  //创建dp矩阵
  const dp = [];
  //为了创建二维矩阵，所用到的辅助的矩阵
  let tmp = new Array(col + 1).fill(0);
  for (let i = 0; i < row + 1; i++) {
    dp[i] = [...tmp];
  }
  // dp矩阵的第一行
  for (let j = 1; j <= col; j++) dp[0][j] = dp[0][j - 1] + 1;
  // dp矩阵的第一列
  for (let i = 1; i <= row; i++) dp[i][0] = dp[i - 1][0] + 1;
  // dp矩阵的其它元素
  for (let i = 1; i <= row; i++) {
    for (let j = 1; j <= col; j++) {
      //当前字母相等时
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
        //如果当前字母不等
      } else {
        dp[i][j] =
          Math.min(Math.min(dp[i - 1][j - 1], dp[i][j - 1]), dp[i - 1][j]) + 1;
      }
    }
  }
  return dp[row][col];
};
```

[参考原文](https://juejin.cn/post/6844903823270477837)

### [买卖股票的最佳时机](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock/submissions/)

```js
var maxProfit = function (prices) {
  if (prices.length === 0 || prices.length === 1) {
    return 0;
  }
  // dp1数组存储第`i`天，持有股票的最大利润
  const dp1 = [];
  dp1[0] = -prices[0];
  // dp2数组存储第`i`天，不持有股票的最大利润
  const dp2 = [];
  dp2[0] = 0;

  for (let i = 1; i < prices.length; i++) {
    dp1[i] = Math.max(dp1[i - 1], -prices[i]);
    dp2[i] = Math.max(dp2[i - 1], prices[i] + dp1[i - 1]);
  }

  return dp2[dp2.length - 1];
};
```

### [买卖股票的最佳时机 II](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-ii/)

```js
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (prices) {
  if (prices.length === 0 || prices.length === 1) {
    return 0;
  }

  const dp1 = [];
  dp1[0] = -prices[0];

  const dp2 = [];
  dp2[0] = 0;

  for (let i = 1; i < prices.length; i++) {
    dp1[i] = Math.max(dp1[i - 1], dp2[i - 1] - prices[i]);
    dp2[i] = Math.max(dp2[i - 1], prices[i] + dp1[i - 1]);
  }

  return dp2[prices.length - 1];
};
```

### [买卖股票的最佳时机 III](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-iii/)

```js
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (prices) {
  if (prices.length === 0 || prices.length === 1) {
    return 0;
  }

  // 持有股票
  const dp1 = [
    [-prices[0]], // 还剩下两次交易机会
    [-prices[0]], // 还剩下一次交易机会
  ];
  // 不持有股票
  const dp2 = [
    [0], // 还剩下两次交易机会
    [0], // 还剩下一次交易机会
  ];

  for (let i = 1; i < prices.length; i++) {
    // 持有股票，还有两次交易机会
    dp1[0][i] = Math.max(dp1[0][i - 1], -prices[i]);
    // 持有股票，还有一次交易机会
    dp1[1][i] = Math.max(dp1[1][i - 1], dp2[0][i - 1] - prices[i]);
    // 不持有股票，还有两次交易机会
    dp2[0][i] = Math.max(dp2[0][i - 1], prices[i] + dp1[0][i - 1]);
    // 不持有股票，还有一次交易机会
    dp2[1][i] = Math.max(dp2[1][i - 1], prices[i] + dp1[1][i - 1]);
  }

  return dp2[1][prices.length - 1];
};
```

[参考原文](https://juejin.cn/post/6844903955030343694)

### 按格式合并两个链表
```js
// 链表类
class Node {
  addr = null
  val = null
  next = null
  constructor(map, addr, l) {
    l.val += 1;
    this.addr = addr;
    let [v, n] = map.get(addr);
    this.val = v;
    if (n !== '-1') {
      this.next = new Node(map, n, l);
    }
  }
  toString() {
    let [n, retV] = [this, []];
    while (n !== null) {
      retV.push(`${n.addr} ${n.val} ${n.next === null ? '-1' : n.next.addr}`);
      n = n.next;
    }
    return retV.join('\n');
  }
  reverse() {
    // 反转链表
    let [h, c] = [null, this];
    while (c !== null) {
      [c.next, h, c] = [h, c, c.next];
    }
    return h;
  }
}

const inputs = `
00100 01000 7
02233 2 34891
00100 6 00001
34891 3 10086
01000 1 02233
00033 5 -1
10086 4 00033
00001 7 -1
`;

const c = inputs.split('\n');
const [startAddr1, startAddr2, totalNodeNum] = c[0].split(' ');
// Map 只是为了方便构建链表数据结构
const map = new Map();
for (let i = 1; i <= parseInt(totalNodeNum); i++) {
  let [a1, v, n] = c[i].split(' ');
  map.set(a1, [v, n]);
}
//构建两个链表并且直接返回链表长度
let length1 = { val: 0 };
let length2 = { val: 0 };
var L1 = new Node(map, startAddr1, length1);
var L2 = new Node(map, startAddr2, length2);
if (length1.val < length2.val) {
  // 确保 L1 是长的链表
  [L1, L2] = [L2, L1];
}
// 反转短链表
L2 = L2.reverse();
let [cl1, cl2] = [L1, L2];
while (cl2 !== null) {
  // 长链表每隔2个结点，插一个短链表的结点。直到短链表没有剩余结点
  cl1 = cl1.next;
  [cl1.next, cl2.next, cl2, cl1] = [cl2, cl1.next, cl2.next, cl1.next];
}
console.log("" + L1);
```
[参考原文](https://gzool.com/algorithm-hard-js-merge-two-linked-list)

### [按公因数计算最大组件大小](https://leetcode.cn/problems/largest-component-size-by-common-factor/description/)
```js
var largestComponentSize = function(nums) {
    const m = Math.max(...nums);
    const uf = new UnionFind(m + 1);
    for (const num of nums) {
        for (let i = 2; i * i <= num; i++) {
            if (num % i === 0) {
                uf.union(num, i);
                uf.union(num, Math.floor(num / i));
            }
        }
    }
    const counts = new Array(m + 1).fill(0);
    let ans = 0;
    for (let num of nums) {
        const root = uf.find(num);
        counts[root]++;
        ans = Math.max(ans, counts[root]);
    }
    return ans;
};

class UnionFind {
    constructor(n) {
        this.parent = new Array(n).fill(0).map((_, i) => i);
        this.rank = new Array(n).fill(0);
    }

    union(x, y) {
        let rootx = this.find(x);
        let rooty = this.find(y);
        if (rootx !== rooty) {
            if (this.rank[rootx] > this.rank[rooty]) {
                this.parent[rooty] = rootx;
            } else if (this.rank[rootx] < this.rank[rooty]) {
                this.parent[rootx] = rooty;
            } else {
                this.parent[rooty] = rootx;
                this.rank[rootx]++;
            }
        }
    }

    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }
}
```
[参考原文](https://leetcode.cn/problems/largest-component-size-by-common-factor/solutions/1706239/an-gong-yin-shu-ji-suan-zui-da-zu-jian-d-amdx/)

### [拼接最大数](https://leetcode.cn/problems/create-maximum-number/description/)
```js
var maxNumber = function (nums1, nums2, k) {
  let max = null
  for (let i = 0; i <= k; i++) {
    if (k - i > nums2.length) continue
    if (i > nums1.length) continue
    const list1 = helper(nums1, i)
    const list2 = helper(nums2, k - i)
    const current = compose(list1, list2)
    if (max) {
      max = computMaxArray(max, current)
    } else {
      max = current
    }
  }
  return max

  function computMaxArray(ary1, ary2) {
    if (ary1.length === 0) return ary2
    if (ary2.length === 0) return ary1
    if (ary1.length > ary2.length) return ary1
    if (ary1.length < ary2.length) return ary2
    let index = 0
    while (index < ary1.length) {
      if (ary1[index] > ary2[index]) {
        return ary1
      } else if (ary1[index] < ary2[index]) {
        return ary2
      }
      index++
    }
    return ary2
  }
  // 找到数组1和2谁大
  function check(a1, index1, a2, index2) {
    while (index1 < a1.length && index2 < a2.length) {
      const diff = a1[index1] - a2[index2]
      if (diff !== 0) return diff
      index1++
      index2++
    }
    return a1.length - index1 - (a2.length - index2)
  }

  // 合并两个有序数组
  function compose(ary1, ary2) {
    const list = []
    const len1 = ary1.length
    const len2 = ary2.length
    let index1 = 0
    let index2 = 0
    for (let i = 0; i < len1 + len2; i++) {
      if (check(ary1, index1, ary2, index2) > 0) {
        list[i] = ary1[index1++]
      } else {
        list[i] = ary2[index2++]
      }
    }
    return list
  }
  function helper(array, limit) {
    if (limit === 0) return []
    if (limit >= array.length) return array
    const stack = []
    let index = 0
    const len = array.length
    while (index < len) {
      while (
        stack.length &&
        stack[stack.length - 1] < array[index] &&
        stack.length + len - index - 1 >= limit
      ) {
        stack.pop()
      }
      stack.push(array[index++])
    }
    return stack.slice(0, limit)
  }
}
```
[参考原文](https://juejin.cn/post/7071584649142599693)

### [最长递增子序列](https://leetcode.cn/problems/longest-increasing-subsequence/)
```js
// 暴力解
var lengthOfLIS = function(nums) {
    let n = nums.length;
    if(n<=1){
        return n;
    }
    let max = 1;
    let dp = new Array(n).fill(1);
    for(let i=1; i<n; i++){
        for(let j=i-1; j>=0; j--){
            if(nums[i]>nums[j]){
                dp[i] = Math.max(dp[j]+1, dp[i]);
            }
        }
        max = Math.max(dp[i], max);
    }
    return max;
};
// 二分优化
var lengthOfLIS = function (nums) {
    let n = nums.length;
    if (n <= 1) {
        return n;
    }
    let len = 1;
    let dp = [null, nums[0]];
    for (let i = 1; i < n; i++) {
        if (dp[len] < nums[i]) {
            dp[++len] = nums[i];
            continue;
        }
        // 否则去dp中二分查找，判读插入位置
        let left = 1, right = len, mid, pos = 0; 
        while (left <= right) {
            mid = (left + right) >> 1;
            if (nums[i] > dp[mid]) {
                // 元素在右边
                left = mid + 1;
                pos = mid;
            } else {
                right = mid - 1;
            }
        }
        dp[pos + 1] = nums[i];
    }
    return len;
};
```

### [二叉树中的最大路径和](https://leetcode.cn/problems/binary-tree-maximum-path-sum/description/)
```js
var maxPathSum = function(root) {
  let ans = 0;
  var oneSideMax = function(root) {
      if(root === null) return 0;
      let left = Math.max(0, oneSideMax(root.left));
      let right = Math.max(0, oneSideMax(root.right));
      ans = Math.max(ans, left + right + root.val);
      return Math.max(left, right) + root.val;
  };

  oneSideMax(root);
  return ans;
};
```
[参考原文](https://blog.csdn.net/M_Eve/article/details/112796420)

### [岛屿最大面积](https://leetcode.cn/problems/max-area-of-island/description/)
```js
/**
 * @param {number[][]} grid
 * @return {number}
 */
var maxAreaOfIsland = function(grid) {
  var max=0;
  for (var i = 0; i < grid.length; i++) {
    for (var j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === 1) {
         max = Math.max(max, island(grid, i, j));
      } 
    }
  }
  return max;
};
 
var island = function(grid, i, j) {
  if (i >= 0 && i < grid.length && j >= 0 && j < grid[0].length && grid[i][j] === 1) {
    grid[i][j] = 0;
    return 1 + island(grid, i+1, j) + island(grid, i-1, j) + island(grid, i, j+1) + island(grid, i, j-1);
  } else return 0;
}
```
[参考原文](https://blog.csdn.net/romeo12334/article/details/81410531)

### [不相交的线](https://leetcode.cn/problems/uncrossed-lines/description/)
```js
var maxUncrossedLines = function(nums1, nums2) {
    const m = nums1.length, n = nums2.length;
    const dp = new Array(m + 1).fill(0).map(() => new Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++) {
        const num1 = nums1[i - 1];
        for (let j = 1; j <= n; j++) {
            const num2 = nums2[j - 1];
            if (num1 === num2) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[m][n];
};
```
[参考原文](https://leetcode.cn/problems/uncrossed-lines/solutions/787955/bu-xiang-jiao-de-xian-by-leetcode-soluti-6tqz/)

### [解码异或后的排列](https://leetcode.cn/problems/decode-xored-permutation/description/)
```js
var decode = function(encoded) {
    const n = encoded.length + 1;
    let total = 0;
    for (let i = 1; i <= n; i++) {
        total ^= i;
    }
    let odd = 0;
    for (let i = 1; i < n - 1; i += 2) {
        odd ^= encoded[i];
    }
    const perm = new Array(n).fill(0);
    perm[0] = total ^ odd;
    for (let i = 0; i < n - 1; i++) {
        perm[i + 1] = perm[i] ^ encoded[i];
    }
    return perm;
};
```
[参考原文](https://leetcode.cn/problems/decode-xored-permutation/solutions/769140/jie-ma-yi-huo-hou-de-pai-lie-by-leetcode-9gw4/)

### [最长超赞子字符串](https://leetcode.cn/problems/find-longest-awesome-substring/description/)
```js
var longestAwesome = function(s) {
    let prefix = new Map([[0, -1]]);
    let ans = 0;
    let sequence = 0;
    for (let j = 0; j < s.length; ++j) {
        let digit = parseInt(s[j]);
        sequence ^= (1 << digit);
        if (prefix.has(sequence)) {
            ans = Math.max(ans, j - prefix.get(sequence));
        } else {
            prefix.set(sequence, j);
        }
        for (let k = 0; k < 10; ++k) {
            if (prefix.has(sequence ^ (1 << k))) {
                ans = Math.max(ans, j - prefix.get(sequence ^ (1 << k)));
            }
        }
    }
    return ans;
};
```
[参考原文](https://leetcode.cn/problems/find-longest-awesome-substring/solutions/379067/zhao-chu-zui-chang-de-chao-zan-zi-zi-fu-chuan-by-l/)

### [超级回文数](https://leetcode.cn/problems/super-palindromes/description/)
```js
var superpalindromesInRange = function(left, right) {
  let ans = []; 
  // 从 1 开始构造回文数
  // 因为最大就是20位数，所以这里构造回文数肯定不会超 100000
  for(let i = 1; i < 100000; i++) {
    let [p1, p2] = makePalindromes(i);
    let pp1 = BigInt(p1 * p1);
    let pp2 = BigInt(p2 * p2);
    if(pp1 >= left && pp1 <= right && checkPalindromes(pp1)) {
      ans.push(pp1.toString());
    }
    if(pp2 >= left && pp2 <= right && checkPalindromes(pp2)) {
      ans.push(pp2.toString());
    }
  }
  ans.sort((a, b) => a - b);
  return ans;
};

let checkPalindromes = function(num) {
  return Array.from(num.toString()).reverse().join("") === num.toString()
};

//  构造奇数、偶数回文数
let makePalindromes = function(num) {
  let numStr = num.toString();
  let revNumStr = Array.from(numStr).reverse().join("");
  return [BigInt(numStr + revNumStr), BigInt(numStr + revNumStr.slice(1))]
};
```
[参考原文](https://leetcode.cn/problems/super-palindromes/solutions/1711358/js-by-a-ba-li-9fcy/)

### [最多能完成排序的块](https://leetcode.cn/problems/max-chunks-to-make-sorted-ii/description/)
```js
var maxChunksToSorted = function(arr) {
    const stack = [];
    for (const num of arr) {
        if (stack.length === 0 || num >= stack[stack.length - 1]) {
            stack.push(num);
        } else {
            const mx = stack.pop();
            while (stack.length && stack[stack.length - 1] > num) {
                stack.pop();
            }
            stack.push(mx);
        }
    }
    return stack.length;
};
```
[参考原文](https://leetcode.cn/problems/max-chunks-to-make-sorted-ii/solutions/1741851/zui-duo-neng-wan-cheng-pai-xu-de-kuai-ii-w5c6/)

### [最长有效括号](https://leetcode.cn/problems/longest-valid-parentheses/description/)
```js
var longestValidParentheses = function(s) {
    let len = s.length;
    if(len<=1) {
        return 0;
    }
    let maxlen = 0;
    const stack = [-1];
    for(let i=0;i<len;i++) {
        if(s[i]==='(') {
            stack.push(i);
        } else {
            stack.pop();
            let stack_len = stack.length;
            if(stack_len===0) {
                stack.push(i);
            } else {
                maxlen = Math.max(maxlen, i - stack[stack_len-1]);
            }
        }
    }
    return maxlen;
};
```

### [无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/description/)
```js
var lengthOfLongestSubstring = function(s) {
    // 哈希集合，记录每个字符是否出现过
    const occ = new Set();
    const n = s.length;
    // 右指针，初始值为 -1，相当于我们在字符串的左边界的左侧，还没有开始移动
    let rk = -1, ans = 0;
    for (let i = 0; i < n; ++i) {
        if (i != 0) {
            // 左指针向右移动一格，移除一个字符
            occ.delete(s.charAt(i - 1));
        }
        while (rk + 1 < n && !occ.has(s.charAt(rk + 1))) {
            // 不断地移动右指针
            occ.add(s.charAt(rk + 1));
            ++rk;
        }
        // 第 i 到 rk 个字符是一个极长的无重复字符子串
        ans = Math.max(ans, rk - i + 1);
    }
    return ans;
};
```
[参考原文](https://leetcode.cn/problems/longest-substring-without-repeating-characters/solutions/227999/)

### [按位与为零的三元组](https://leetcode.cn/problems/triples-with-bitwise-and-equal-to-zero/description/)
```js
var countTriplets = function(nums) {
    const cnt = new Array(1 << 16).fill(0);
    for (const x of nums) {
        for (const y of nums) {
            ++cnt[x & y];
        }
    }
    let ans = 0;
    for (const x of nums) {
        for (let mask = 0; mask < (1 << 16); ++mask) {
            if ((x & mask) === 0) {
                ans += cnt[mask];
            }
        }
    }
    return ans;
};
```
[参考原文](https://leetcode.cn/problems/triples-with-bitwise-and-equal-to-zero/solutions/2144239/an-wei-yu-wei-ling-de-san-yuan-zu-by-lee-gjud/)

## 小知识

* [时间复杂度](https://www.zhihu.com/question/20196775)：用来度量算法执行时间的多少，用大 O 阶表示，即 T(n)=O(f(n))，其中 n 为问题规模，也就是问题的大小。
* [归并排序、快速排序、希尔排序、堆排序](https://juejin.cn/post/6844903895789993997)
* 常用排序算法稳定性、时间复杂度分析
![on](https://github.com/lujiajian1/study-notes/blob/main/img/on.png)
