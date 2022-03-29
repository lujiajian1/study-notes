# JavaScript的三座大山：原型（prototype）及原型链（prototype chain）

### 原型
每一个函数，包括构造函数，都会自动创建一个prototype属性，prototype属性指向当前函数的原型对象，原型对象自动创建constructor属性，constructor属性指针指向当前原型对象的构造函数。想要理解原型，首先要理解js创建的对象的方式，了解js创建对象是如何发展到原型模式的，从原型模式了解原型。

##### 创建对象的方式
* 使用原生构造函数创建对象
```js
var o = new Object(); // 创建 Object 的一个新的实例
o.name = '张三'; // 添加属性或者方法
```
* 使用对象字面量
```js
var o = {
    name: '张三'
}
```
* 工厂模式：使用构造函数或对象字面量创建对象，创建具有同样接口的多个对象需要重复编写很多代码，所以产生了工厂模式。
```js
function people(name){
    var o = new Object();
    o.name = name；
    return o;
}
var newp = people('张三');
var newp = people('李四');
```
* 构造函数：解决工厂模式创建的对象无法识别问题
```js
function People(name){
    this.name = name；
}
var newp = new People('张三');

newp.constructor == People; // 以确保实例被标识为特定类型，相比于工厂模式，这是一个很大的好处
```
* 原型模式: 每个函数都会创建一个 prototype 属性，这个属性是一个对象，包含所有实例共享的属性和方法。实际上，这个对象就是通过调用构造函数创建的对象的原型。使用原型对象的好处是，在它上面定义的属性和方法可以被对象实例共享。构造函数模式中在构造函数中直接赋给对象实例的值，可以直接赋值给它们的原型。
```js
function People(){
}
People.prototype.name = '张三'；
People.prototype.sayName = function() { console.log(this.name)};
var newp = new People();
newp.sayName(); // "张三"
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

#### 补充：new操作符具体干了什么
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
```
##### 原型关系

* 每个函数（构造函数、class） 都有显示原型 prototype
* 每个实例都有隐式原型 \_\_proto\_\_ 
* 实例的 \_\_proto\_\_ 指向对应函数（构造函数、class）的 prototype
![原型关系](https://github.com/lujiajian1/study-notes/blob/main/img/prototype.png)

#### 基于原型的执行规则
先在实例自身属性和方法中寻找，如果找不到则自动去 \_\_proto\_\_ 中查找

### 原型链
原型对象等于另一个类型的实例，就形成原型链。
```js
function People(){}
People.prototype.eat = function(){}

function Student(){}
Student.prototype = new People();
Student.prototype.sayHi = function(){}

var xialuo = new Student()
xialuo.eat();
```
![原型链](https://github.com/lujiajian1/study-notes/blob/main/img/prototype-line.jpg)

### js实现继承的方法

* 原型链继承：将父类的实例作为子类的原型
```js
function Cat(){ 
}
Cat.prototype = new Animal();
Cat.prototype.name = 'cat';
```
* class 继承
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
    constructor(number){
        super(name);
        this.number = number;
    }
    sayHi(){
        console.log(`姓名：${this.name} 学号：${this.Number}`)
    }
}
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

##### ES6 与 ES5 继承的[区别](https://juejin.cn/post/6844903924015120397)

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