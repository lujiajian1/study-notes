# 为什么说 ES6 Class 是语法糖？

ES6 的class可以看作只是一个语法糖，它的绝大部分功能，ES5 都可以做到，本质上，ES6 的类只是 ES5 的构造函数的一层包装，新的 class 写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。

* constructor 方法是类的构造函数，是一个默认方法，通过 new 命令创建对象实例时，自动调用该方法。一个类必须有 constructor 方法，如果没有显式定义，一个默认的 consructor 方法会被默认添加。constructor()方法默认返回实例对象（即this）。
```js
function Point(x, y) {
  this.x = x;
  this.y = y;
}
var p1 = new Point(1, 2);
var p2 = new Point(3, 4);
p1.__proto__ === p2.__proto__ //true

// 上面构造函数的方式等同于下面 class 的方式

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
var p1 = new Point(1, 2);
var p2 = new Point(3, 4);
p1.__proto__ === p2.__proto__ // true 与 ES5 一样，类的所有实例共享一个原型对象
```
* 定义类中的方法。如：定义了一个toString()方法， 不需要 function 关键字，类的所有方法都定义在类的 prototype 属性上面，所以在类的实例上面调用方法，其实就是调用原型上的方法。
```js
function Point(x, y) {
  this.x = x;
  this.y = y;
}
Point.prototype.toString = function() {
  return '(' + this.x + ',' + this.y + ')';
}
var p = new Point(1, 2);
//每一个函数，包括构造函数，都会自动创建一个prototype属性，prototype属性指向当前函数的原型对象，原型对象自动创建constructor属性，constructor属性指针指向当前原型对象的构造函数
Point.prototype.constructor = Point;

// 上面构造函数的方式等同于下面 class 的方式

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() { // 函数在 Point.prototype 中
    return '(' + this.x + ',' + this.y + ')';
  }
}
var p = new Point(1, 2);
// 类本身就指向构造函数 
// prototype对象的constructor()属性，直接指向“类”的本身
Point === Point.prototype.constructor // true

// 另外
typeof Point // "function" 数据类型就是函数
p.constructor === Point.prototype.constructor; // true 类的实例上面调用方法，其实就是调用原型上的方法
```
* 取值函数（getter）和存值函数（setter）
```js
var person = {
  firstName: "夏",
  lastName : "洛",
  get name() {
    return this.firstName + '·' + this.lastName;
  },
  set name(value) {
    const nameArr = value.split('·');
    this.firstName = nameArr[0];
    this.lastName = nameArr[1];
  }
};

// 使用 getter 显示来自对象的数据：
console.log(person.name);
// 使用 setter 设置对象属性：
person.name = "马·冬梅";
console.log(person.name);

// 注意：构造函数不能设置 getter 和 setter

// 上面方式等同于下面 class 的方式

class Person {
  constructor() {
    this.firstName = "夏";
    this.lastName = "洛";
  }
  get name() {
    return this.firstName + '·' + this.lastName;
  }
  set name(value) {
    const nameArr = value.split('·');
    this.firstName = nameArr[0];
    this.lastName = nameArr[1];
  }
}

let p = new Person();
console.log(p.name);
p.name = "马·冬梅";
console.log(p.name);
```
* Class 可以通过 extends 关键字实现继承，让子类继承父类的属性和方法
* super当作函数使用相当于 A.prototype.constructor.call(this, props) 执行父类构造函数 A.prototype.constructor 绑定 this 为子类 B。ES6 规定，子类必须在constructor()方法中调用super()，否则就会报错。这是因为子类自己的this对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，添加子类自己的实例属性和方法。如果不调用super()方法，子类就得不到自己的this对象。
```js
// super当作函数使用
class A {
  constructor() {
    console.log(new.target.name); // new.target 指向当前正在执行的函数，通过 log 打印证明绑定 this 为子类 B
  }
}
class B extends A {
  constructor() {
    super();
  }
}
new A(); // A
new B(); // B
```
* super当做对象使用，指向父类的原型对象。
```js
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
    console.log(super.c()); // 2 // 当作对象 super === A.prototype
  }
}

let b = new B();
```
