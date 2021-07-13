### 基本类型
* 原始类型
```ts
let bool: boolean = true; // boolean
let num: number = 123; //number
let str: string = 'abc'; //string
```
* 数组
```ts
let arr1: number[] = [1, 2, 3]; //第一种方式，类型名称+[]
let arr2: Array<number> = [1, 2, 3]; //Array是ts预定义的泛型接口 interface Array<T>
let arr3: Array<number | string> = [1, 2, '3']; //想为数组的成员定义不同的类型，需要用到联合类型
```
* 元组：限定了数组的类型和个数
```ts
let tuple: [number, string] = [0, '1'];
//元组的越界问题，使用数组的push方法，可以为元组新增成员
tuple.push('2'); //success
tuple[2] //但是访问会报错
```
* 函数
```ts
let add = (x: number, y: number): number => x + y;
let add1 = (x: number, y: number) => x + y;//利用ts的类型推断功能，返回值的类型的定义可以省略

let compute: (x: number, y: number) => number; //1.使用 : 定义函数类型
compute = (a, b) => a + b;//2.定义函数
```
* 对象
```ts
//错误的方式
let obj: object = {x: 1, y: 2};//直接定义object是没有用的，相当于定义了 obj:{}

//正确的方式
let obj: {x: number, y: number} = {x: 1, y: 2};
```
* symbol
```ts
let s1: symbol = Symble();
let s2 = Symbol();
```
* undefined, null
```ts
let un: undefined = undefined;
let nu: null = null;
un = 1; //报错，undefined只能赋值undefined，赋值其他类型会报错
num = undefined;//可以，因为undefined和null是其他类型的子类型，但是需要tsconfig设置
num  = null;//可以，因为undefined和null是其他类型的子类型，但是需要tsconfig设置
```
* void：表示没有任何返回值的类型
```ts
let noReturn = () => {};
```
* any：任何类型，非特殊情况，不建议使用any
```ts
let any: any = 1;
any = 'test'; //正确
any = true; //正确
```
* never： 永远没有返回值的类型
```ts
//函数抛异常
let error = () => {
    throw new Error('error');
}
//死循环
let endless = () => {
    while(true) {}
}
```

### 枚举类型：一组具有名字的常量集合，解决代码可读性差，可维护性差的问题
* 数字枚举：枚举成员值默认从0递增
```ts
enum Role {
    Reporter = 1,
    Developer,
    Maintainer,
    Owner,
    Guest
}
console.log(Role)
console.log(1) //Reporter
console.log(Role.Reporter)//1
```
* 字符串枚举：不支持反向映射
```ts
enum Message {
    Success = "恭喜你，成功了"，
    Fail = "抱歉，失败了"
}
```
* 异构枚举（数字和字符串混用），容易引起混淆，不建议使用
```ts
enum Answer {
    N,
    Y = 'Yes'
}
```
* 常量枚举：const声明的枚举，当我们不要一个对象，但是需要一个对象的值的时候，就可以用常量枚举
    * 编译后被移除
    * 成员只能为 const member
```ts
const enum Month {
    Jan,
    Feb,
    Mar
}
let month = [Month.Jan, Month.Feb, Month.Mar];
```
* 枚举成员
    * 拥有只读属性，不能修改
    * const member（常量成员，在编译阶段被计算结果）
        * 无初始值
        * 对常量成员的引用
        * 常量表达式
    * computed member（需要被计算的枚举成员，表达式保留的程序的执行阶段）非常量表达式
```ts
Role.Reporter = 2 //报错，枚举成员为只读类型，不能修改
enum Char {
    //常量成员
    a,
    b = Char.a,
    c = 1 + 2,

    //需要被计算的枚举成员
    d = Math.random(),
    e = '123'.length,
}
```
* 枚举/枚举成员作为类型
    * 无初始值
    * 枚举成员均为数字
    * 枚举成员均为字符串
```ts
enum E { a, b }
enum F { a = 0, b = 1 }
enum G { a = 'apple', b = 'banana' }

let e: E = 3
let f: F = 3
console.log(e === f) //两种不同成员的枚举不可比较，编辑器会提示报错

let e1: E.a = 3
let e2: E.b = 3
let e3: E.a = 3
console.log(e1 === e2) //不同枚举成员，不能比较
console.log(e1 === e3) //相同的枚举成员可以比较

let g1: G = G.a //字符串类型，只能取G.a或者G.b
let g2: G.a = G.a //只能取G.a
```

### 接口
* 对象类型接口
    * 检查原则：鸭式辨型法
    * 绕过对象字面量检查
        * 将对象字面量赋值给变量
        * 使用类型断言
        * 使用字符串索引签名
    * 对象的属性
        * 可选属性
        * 只读属性
```ts
interface List {
    readonly id: number; //只读
    name: string;
    // [x: string]: any;
    age?: number; //可选
}
interface Result {
    data: List[]
}
function render(result: Result) {
    result.data.forEach((value) => {
        console.log(value.id, value.name)
        if (value.age) {
            console.log(value.age)
        }
        // value.id++ //报错，只读属性不允许修改
    })
}
let result = {
    data: [
        {id: 1, name: 'A', sex: 'male'},//虽然sex没有定义，但是ts不会报错，因为鸭式辨型法，只要满足接口的必要条件即可
        {id: 2, name: 'B', age: 10}
    ]
}
render(result)

// 如果按照下面的方式直接传入对象字面量的话，会报错
// 绕过对象字面量检查的方法
// 1.将对象字面量赋值给变量 render(result)
// 2.使用类型断言 render({...} as Result)
// 3.使用字符串索引签名 [x: string]: any
render({
    data: [
        {id: 1, name: 'A', sex: 'male'},//报错，直接传入对象字面量的话，就会额外检查，sex没有定义，产生报错
        {id: 2, name: 'B', age: 10}
    ]
})
```
* 可索引类型接口
    * 数字索引（相当于数组）[index: number]
    * 字符串索引[x: string]
```ts
interface StringArray {
    [index: number]: string
}
let chars: StringArray = ['a', 'b']

interface Names {
    [x: string]: any;
    [z: number]: number; //数字索引类型必须是字符串索引类型的子类型， 因为JavaScript会进行类型转化，将索引number转为string
}
```
* 函数类型接口：interface F{ (arg:type):type }
```ts
//方法一：用一个变量来定义函数类型
let add: (x: number, y: number) => number
//方法二：接口
interface Add {
    (x: number, y: number): number
}
//方法三：类型别名
type Add = (x: number, y: number) => number

let add: Add = (a: number, b: number) => a + b
```
* 混合类型接口：interface H { (arg: type): type, prop: type, method(arg: type): type }
```ts
interface Lib {
    (): void;
    version: string;
    doSomething(): void;
}

function getLib() {
    let lib = (() => {}) as Lib
    lib.version = '1.0.0'
    lib.doSomething = () => {}
    return lib;
}
let lib1 = getLib()
lib1()
let lib2 = getLib()
lib2.doSomething()
```
* 类类型接口
    * 类必须实现接口中所有属性
    * 接口只能约束类的公用成员，不能约束私有成员、受保护成员、静态成员和构造函数
```ts
interface Human {
    name: string;
    eat(): void;
}

class Asian implements Human {
    constructor(name: string) {
        this.name = name;
    }
    name: string
    eat() {}
    age: number = 0
    sleep() {}
}
```
* 接口继承接口
    * 抽离可重用的接口
    * 将多个接口整合成一个接口
```ts
interface Man extends Human {
    run(): void
}

interface Child {
    cry(): void
}

interface Boy extends Man, Child {}

let boy: Boy = {
    name: '',
    run() {},
    eat() {},
    cry() {}
}
```
* 接口继承类：抽象出类的公用成员、私有成员和受保护成员
```ts
class Auto {
    state = 1
    // private state2 = 1
}
interface AutoInterface extends Auto {

}
class C implements AutoInterface {
    state1 = 1
}
class Bus extends Auto implements AutoInterface {

}
```
![接口和类](https://github.com/lujiajian1/study-notes/blob/main/img/interface.png)

### type和interface的[区别](https://juejin.cn/post/6844903749501059085)
* 相同点
    * 都可以描述一个对象或者函数
    ```ts
    //interface
    interface User {
        name: string
        age: number
    }
    interface SetUser {
        (name: string, age: number): void;
    }
    //type
    type User = {
        name: string
        age: number
    };
    type SetUser = (name: string, age: number)=> void;
    ```
    * 都允许拓展（extends）：interface 和 type 都可以拓展，并且两者并不是相互独立的，也就是说 interface 可以 extends type, type 也可以 extends interface 。 虽然效果差不多，但是两者语法不同。
    ```ts
    //interface extends interface
    interface Name { 
        name: string; 
    }
    interface User extends Name { 
        age: number; 
    }
    //type extends type
    type Name = { 
        name: string; 
    }
    type User = Name & { age: number  };
    //interface extends type
    type Name = { 
        name: string; 
    }
    interface User extends Name { 
        age: number; 
    }
    //type extends interface
    interface Name { 
        name: string; 
    }
    type User = Name & { 
        age: number; 
    }
    ```
* 不同点
    * type 可以声明基本类型别名，联合类型，元组等类型
    ```ts
    // 基本类型别名
    type Name = string
    // 联合类型
    interface Dog {
        wong();
    }
    interface Cat {
        miao();
    }
    type Pet = Dog | Cat
    // 具体定义数组每个位置的类型
    type PetList = [Dog, Pet]
    ```
    * type 语句中还可以使用 typeof 获取实例的 类型进行赋值
    ```ts
    // 当你想获取一个变量的类型时，使用 typeof
    let div = document.createElement('div');
    type B = typeof div
    ```
    * interface 能够声明合并
    ```ts
    interface User {
        name: string
        age: number
    }

    interface User {
        sex: string
    }

    /*
    User 接口为 {
        name: string
        age: number
        sex: string 
    }
    */
    ````

### 函数
* 定义函数
    * 定义方式
        * function
        * 变量定义
        * 类型别名
        * 接口定义
    ```ts
    function add1(x: number, y: number) {
        return x + y
    }

    let add2: (x: number, y: number) => number

    type add3 = (x: number, y: number) => number

    interface add4 {
        (x: number, y: number): number
    }
    ```
    * 类型要求
        * 参数类型必须声明
        * 返回值类型一般无需声明
* 函数参数
    * 参数个数：实参和形参必须一一对应
    * 可选参数：必选参数不能位于可选参数后
    * 默认参数：在必选参数前，默认参数不可省略，在必选参数后，默认参数可以省略
    * 剩余参数，剩余参数类型为数组
```ts
//可选参数
function add5(x: number, y?: number) {
    return y ? x + y : x
}
add5(1)

//默认参数
function add6(x: number, y = 0, z: number, q = 1) {
    return x + y + z + q
}
add6(1, undefined, 3)

//剩余参数
function add7(x: number, ...rest: number[]) {
    return x + rest.reduce((pre, cur) => pre + cur);
}
add7(1, 2, 3, 4, 5)
```
* 函数重载
    * 静态类型语言：函数的名称相同，参数的个数或类型不同
    * Typescript：预先定义一组名称相同，类型不同的函数声明，并在一个类型最宽松的版本中实现
```ts
function add8(...rest: number[]): number;
function add8(...rest: string[]): string;
function add8(...rest: any[]) {
    let first = rest[0];
    if (typeof first === 'number') {
        return rest.reduce((pre, cur) => pre + cur);
    }
    if (typeof first === 'string') {
        return rest.join('');
    }
}
console.log(add8(1, 2))
console.log(add8('a', 'b', 'c'))
```

### 类
* 基本实现
    * 类中定义的属性都是实例属性，类中定义的方法都是原型方法
    * 实例属性必须有初始值，或在构造函数中被赋值，或为可选成员
```ts
class Dog {
    constructor(name: string) {
        this.name = name
    }
    name: string
    run() {}
}
console.log(Dog.prototype)
let dog = new Dog('wangwang')
console.log(dog)
```
* 继承：子类的构造函数中必须包含 super 调用
* 成员修饰符
    * public：对所有人可见，所有成员默认为public
    * private：只能在被定义的类中访问，不能通过实例或子类访问，private constructor 不能被实例化，不能被继承
    * protected：只能在被定义的类和子类中访问，不能通过实例访问，protected constructor 只能被实例化，不能被继承
    * readonly：必须有初始值，或在构造函数中被赋值
    * static：只能由类名调用，不能通过实例访问，可继承
```ts
abstract class Animal {
    eat() {
        console.log('eat')
    }
    abstract sleep(): void
}

class Dog extends Animal {
    constructor(name: string) {
        super()
        this.name = name
        this.pri()
    }
    public name: string = 'dog'
    run() {}
    private pri() {}
    protected pro() {}
    readonly legs: number = 4
    static food: string = 'bones'
    sleep() {
        console.log('Dog sleep')
    }
}
// console.log(Dog.prototype)
let dog = new Dog('wangwang')
// console.log(dog)
// dog.pri()
// dog.pro()
console.log(Dog.food)
dog.eat()

class Husky extends Dog {
    constructor(name: string, public color: string) { //构造函数参数添加修饰符，可以省略在类中的定义
        super(name)
        this.color = color
        // this.pri()
        this.pro()
    }
    // color: string
}
console.log(Husky.food)
```
* 构造函数参数中的修饰符：将参数变为实例属性
* 抽象类：使用 abstract 关键字
    * 不能被实例化，只能被继承
        * 抽象方法包含具体实现，子类直接复用
        * 抽象方法不包含具体实现，子类必须实现
    * 多态：多个子类对父抽象类的方法有不同实现，实现运行时绑定
```ts
abstract class Animal {
    eat() {
        console.log('eat')
    }
    abstract sleep(): void //抽象方法
}
// let animal = new Animal() //报错，不能被实例化，只能被继承

class Dog extends Animal {
    constructor(name: string) {
        super()
        this.name = name
    }
    name: string
    run() {}
    sleep() {
        console.log('Dog sleep')
    }
}

class Cat extends Animal {
    sleep() {
        console.log('Cat sleep')
    }
}
let cat = new Cat()

let animals: Animal[] = [dog, cat]
animals.forEach(i => {
    i.sleep() //多态
})
```
* this类型
    * 实现实例方法的链式调用
    * 在继承时，具有多态性，保持父子类之间接口调用的连贯性
```ts
class Workflow {
    step1() {
        return this
    }
    step2() {
        return this
    }
}
new Workflow().step1().step2()

class MyFlow extends Workflow {
    next() {
        return this
    }
}
new MyFlow().next().step1().next().step2()
```

### 泛型
* 支持多种类型的方法
    * 函数重载
    * 联合类型
    * any 类型：丢失类型约束
    * 泛型：不预先确定的类型，使用时才确定
* 泛型函数
    * 定义：function generic\<T\>(arg:T):T
    * 调用
        * generic\<type\>(arg)
        * generic(arg)
    * 泛型函数类型：type Generic=\<T\>(arg:T)=>T
```ts
function log<T>(value: T): T {
    console.log(value);
    return value;
}
log<string[]>(['a', ',b', 'c'])
log(['a', ',b', 'c']) //利用ts类型推断，省略参数类型

type Log = <T>(value: T) => T //泛型函数类型
let myLog: Log = log
```
* 泛型接口
    * 定义：interface Generic\<T\>{ (arg:T):T }
    * 实现：let generic：Generic\<type\>（必须指定类型）
```ts
interface Log<T> {
    (value: T): T
}
let myLog: Log<number> = log
myLog(1)
```
* 泛型类
    * 定义：class Generic\<T\>{ method(value:T){} }，泛型不能应用于类的静态成员
    * 实例化
        * let generic = new Generic\<type\>()
        * let generic = new Generic()，T可为任意类型
```ts
class Log<T> {
    run(value: T) {
        console.log(value)
        return value
    }
}
let log1 = new Log<number>()
log1.run(1)
let log2 = new Log()
log2.run({ a: 1 })
```
* 泛型约束：T extends U （T 必须具有U的属性）
```ts
interface Length {
    length: number
}
function logAdvance<T extends Length>(value: T): T {
    console.log(value, value.length);
    return value;
}
logAdvance([1])
logAdvance('123')
logAdvance({ length: 3 })
```
* 泛型的好处
    * 函数和类可以轻松的支持多种类型，增强程序扩展性
    * 不必写多条函数重载，冗长的联合类型声明，增强代码可读性
    * 灵活控制类型之间的约束

### 类型检查机制
* 类型推断：根据某些规则自动地为变量推断出类型
    1. 基础类型推断
        1. 初始化变量
        2. 设置函数默认参数
        3. 确定函数返回值
    2. 最佳通用类型推断：推断出一个可以兼容当前所有类型的通用类型
    3. 上下文推断：根据事件绑定推断出事件类型
```ts
let a = 1;
let b = [1, null, 'a']
let c = {x: 1, y: 'a'}

let d = (x = 1) => x + 1

window.onkeydown = (event) => {
    // console.log(event.button)
}
```
* 类型断言：用自己声明的类型覆盖类型推断
    * 方式：表达式 as type 或者 \<type\>表达式
    * 弊端：没有按照接口的约定赋值，不会报错，避免滥用
```ts
interface Foo {
    bar: number
}
let foo = {} as Foo
let foo = <Foo>{}
```
* 类型兼容性：如果X（目标类型）= Y（源类型），则X兼容Y
    * 接口兼容性：成员少的兼容成员多的（鸭式辨型法）
    ```ts
    interface X {
        a: any;
        b: any;
    }
    interface Y {
        a: any;
        b: any;
        c: any;
    }
    let x: X = {a: 1, b: 2}
    let y: Y = {a: 1, b: 2, c: 3}
    x = y
    // y = x //报错
    ```
    * 函数兼容性
        * 参数个数：目标函数多于源函数
        * 可选参数和剩余参数，遵循原则
            * 固定参数兼容可选参数和剩余参数
            * 可选参数不兼容固定参数和剩余参数（严格模式）
            * 剩余参数兼容固定参数和可选参数
        * 参数类型：必须匹配
        * 参数为对象
            * 严格模式，成员多的兼容成员少的
            * 非严格模式，相互兼容（函数参数双向协变）
        * 返回值类型：目标函数必须与源函数相同，或为其子类型
    ```ts
    type Handler = (a: number, b: number) => void
    function hof(handler: Handler) {
        return handler
    }

    // 1)参数个数
    let handler1 = (a: number) => {}
    hof(handler1)
    let handler2 = (a: number, b: number, c: number) => {}
    // hof(handler2) //报错

    // 可选参数和剩余参数
    let a = (p1: number, p2: number) => {}
    let b = (p1?: number, p2?: number) => {}
    let c = (...args: number[]) => {}
    a = b
    a = c
    // b = a //报错
    // b = c //报错
    c = a
    c = b

    // 2)参数类型
    let handler3 = (a: string) => {}
    // hof(handler3) //报错

    interface Point3D {
        x: number;
        y: number;
        z: number;
    }
    interface Point2D {
        x: number;
        y: number;
    }
    let p3d = (point: Point3D) => {}
    let p2d = (point: Point2D) => {}
    p3d = p2d
    // p2d = p3d //报错

    // 3) 返回值类型
    let f = () => ({name: 'Alice'})
    let g = () => ({name: 'Alice', location: 'Beijing'})
    f = g
    // g = f //报错

    // 函数重载
    function overload(a: number, b: number): number
    function overload(a: string, b: string): string
    function overload(a: any, b: any): any {}
    // function overload(a: any): any {}
    // function overload(a: any, b: any, c: any): any {}
    // function overload(a: any, b: any) {}
    ```
    * 枚举兼容性
        * 枚举类型和数字类型相互兼容
        * 枚举类型之间不兼容
    ```ts
    enum Fruit { Apple, Banana }
    enum Color { Red, Yellow }
    let fruit: Fruit.Apple = 1
    let no: number = Fruit.Apple
    // let color: Color.Red = Fruit.Apple //报错
    ```
    * 类兼容性
        * 静态成员和构造函数不在比较范围
        * 两个类具有相同的实例成员，它们的实例相互兼容
        * 类中包含私有成员或受保护成员，只有父类和子类的实例相互兼容
    ```ts
    class A {
        constructor(p: number, q: number) {}
        id: number = 1
        private name: string = ''
    }
    class B {
        static s = 1
        constructor(p: number) {}
        id: number = 2
        private name: string = ''
    }
    class C extends A {}
    let aa = new A(1, 2)
    let bb = new B(1)
    // aa = bb //报错，因为有私有成员，如果没有 private name: string = '' 则不报错
    // bb = aa
    let cc = new C(1, 2)
    aa = cc
    cc = aa
    ```
    * 泛型兼容性
        * 泛型接口：只有类型参数T被接口成员使用时，才会影响兼容性
        * 泛型函数：定义相同，没有指定类型参数时就兼容
    ```ts
    interface Empty<T> {
    // value: T //定义value，则不兼容
    }
    let obj1: Empty<number> = {};
    let obj2: Empty<string> = {};
    obj1 = obj2

    let log1 = <T>(x: T): T => {
        console.log('x')
        return x
    }
    let log2 = <U>(y: U): U => {
        console.log('y')
        return y
    }
    log1 = log2
    ```
    * 口诀：1.结构之间兼容：成员少的兼容成员多的 2.函数之间兼容：参数多的兼容参数少的
* 类型保护
    * 含义：在特定的区块中保证变量属于某种确定的类型
    * 创建区块的方法
        * instanceof
        * typeof
        * in
        * 类型保护函数，特殊的返回值：arg is type（类型谓词）
```ts
enum Type { Strong, Week }

class Java {
    helloJava() {
        console.log('Hello Java')
    }
    java: any
}

class JavaScript {
    helloJavaScript() {
        console.log('Hello JavaScript')
    }
    js: any
}

function isJava(lang: Java | JavaScript): lang is Java {
    return (lang as Java).helloJava !== undefined
}

function getLanguage(type: Type, x: string | number) {
    let lang = type === Type.Strong ? new Java() : new JavaScript();
    
    if (isJava(lang)) {
        lang.helloJava();
    } else {
        lang.helloJavaScript();
    }

    //每一个都写类型断言，显然过于麻烦
    if ((lang as Java).helloJava) {
        (lang as Java).helloJava();
    } else {
        (lang as JavaScript).helloJavaScript();
    }

    // instanceof
    if (lang instanceof Java) {
        lang.helloJava()
        // lang.helloJavaScript()
    } else {
        lang.helloJavaScript()
    }

    // in
    if ('java' in lang) {
        lang.helloJava()
    } else {
        lang.helloJavaScript()
    }

    // typeof
    if (typeof x === 'string') {
        console.log(x.length)
    } else {
        console.log(x.toFixed(2))
    }

    return lang;
}

getLanguage(Type.Week, 1)
```

### 高级类型
* 交叉类型（类型并集）
    * 含义：将多个类型合并为一个类型，新的类型将具有所有类型的特性
    * 应用场景：混入
```ts
interface DogInterface {
    run(): void
}
interface CatInterface {
    jump(): void
}
let pet: DogInterface & CatInterface = {
    run() {},
    jump() {}
}
```
* 联合类型（类型交集）
    * 含义：类型并不确定，可能为多个类型中的一个
    * 应用场景：多类型支持
    * 可区分的联合类型：结合联合类型和字面量类型的类型保护方法
```ts
let a: number | string = 1
let b: 'a' | 'b' | 'c'
let c: 1 | 2 | 3

class Dog implements DogInterface {
    run() {}
    eat() {}
}
class Cat  implements CatInterface {
    jump() {}
    eat() {}
}
enum Master { Boy, Girl }
function getPet(master: Master) {
    let pet = master === Master.Boy ? new Dog() : new Cat();
    // pet.run()
    // pet.jump()
    pet.eat()
    return pet
}

//可区分的联合类型
interface Square {
    kind: "square";
    size: number;
}
interface Rectangle {
    kind: "rectangle";
    width: number;
    height: number;
}
interface Circle {
    kind: "circle";
    radius: number;
}
type Shape = Square | Rectangle | Circle
function area(s: Shape) {
    switch (s.kind) {
        case "square":
            return s.size * s.size;
        case "rectangle":
            return s.height * s.width;
        case 'circle':
            return Math.PI * s.radius ** 2
        default:
            return ((e: never) => {throw new Error(e)})(s)
    }
}
console.log(area({kind: 'circle', radius: 1}))
```
* 字面量类型
    * 字符串字面量
    * 数字字面量
    * 应用场景：限定变量取值范围
```ts
type names = '小飞侠' | '水星仔';  
let a:names = '小飞侠';
let b:names = '水星仔';
```
* 索引类型
    * 要点
        * keyof T（索引查询操作符）：类型T公共属性名的字面量联合类型
        * T[K]（索引访问操作符）：对象T的属性K所代表的类型
        * 泛型约束
    * 应用场景：从一个对象中选取某些属性的值
```ts
let obj = {
    a: 1,
    b: 2,
    c: 3
}

function getValues(obj: any, keys: string[]) {
    return keys.map(key => obj[key])
}
console.log(getValues(obj, ['d', 'e'])) //没有报错

//使用索引类型，解决对象选取值类型校验
function getValues<T, K extends keyof T>(obj: T, keys: K[]): T[K][] {
    return keys.map(key => obj[key])
}
console.log(getValues(obj, ['a', 'b']))
```
* 映射类型
    * 含义：从旧类型创建出新类型
    * 应用场景
        * 同态：只作用于 T 的属性
            * Readonly\<T\>：将T的所有属性变为只读
            * Partial\<T\>：将T的所有属性变为可选
            * Pick\<T,K\>：选取以K为属性的对象T的子集
        * Record\<K,T\>：创新属性为K的新对象，属性值的类型为T
```ts
interface Obj {
    a: string;
    b: number;
}
type ReadonlyObj = Readonly<Obj>

type PartialObj = Partial<Obj>

type PickObj = Pick<Obj, 'a' | 'b'>

type RecordObj = Record<'x' | 'y', Obj>
```
* 条件类型
    * 含义：T extends U ? X : Y（如果类型T可以赋值给类型U，那么结果类型就是X，否则就是Y）
    * 应用场景：官方预置的条件类型
        * Exclude\<T,U\>：从T中过滤掉可以赋值给U的类型
        * Extract\<T,U\>：从T中抽取出可以赋值给U的类型
        * NonNullable\<T\>：从T中除去 undefined 和 null
        * ReturnType\<T\>：获取函数的返回值类型
```ts
// T extends U ? X : Y

type TypeName<T> =
    T extends string ? "string" :
    T extends number ? "number" :
    T extends boolean ? "boolean" :
    T extends undefined ? "undefined" :
    T extends Function ? "function" :
    "object";
type T1 = TypeName<string> //string
type T2 = TypeName<string[]> //object

// (A | B) extends U ? X : Y
// (A extends U ? X : Y) | (B extends U ? X : Y)
type T3 = TypeName<string | string[]> //string | object

type Diff<T, U> = T extends U ? never : T
type T4 = Diff<"a" | "b" | "c", "a" | "e">
// 拆解为：
// Diff<"a", "a" | "e"> | Diff<"b", "a" | "e"> | Diff<"c", "a" | "e">
// 结果：
// never | "b" | "c"
// "b" | "c" //never和其他类型的联合类型，never可以省略

type NotNull<T> = Diff<T, null | undefined>
type T5 = NotNull<string | number | undefined | null>

// Exclude<T, U>
// NonNullable<T>

// Extract<T, U>
type T6 = Extract<"a" | "b" | "c", "a" | "e">

// ReturnType<T>
type T8 = ReturnType<() => string>
```

### 为什么要使用 TypeScript
* 类型推演和类型匹配
* 开发编译时报错
* 极大程度的避免了低级错误
* 支持Javascript的最新特性（包括ES6\7\8）

### vue2 + typescript
* vue-class-component： Vue 官方推出的一个支持使用 class 方式来开发 vue 单文件组件的库
    * methods 可以直接声明为类的成员方法
    * 计算属性可以被声明为类的属性访问器
    * 初始化的 data 可以被声明为类属性
    * data、render 以及所有的 Vue 生命周期钩子可以直接作为类的成员方法
    * 所有其他属性，需要放在装饰器中
* vue-property-decorator：vue-class-component基础上增加了装饰器相关的功能，因此它也同时拥有 vue-class-component 的功能
    * @Prop
    * @PropSync
    * @Model
    * @Watch
    * @Provide
    * @Inject
    * @ProvideReactive
    * @InjectReactive
    * @Emit
    * @Ref
    * @Component (由 vue-class-component 提供)
    * Mixins (由 vue-class-component 提供)
