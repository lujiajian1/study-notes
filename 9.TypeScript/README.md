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
* 可索引类型接口
    * 数字索引（相当于数组）[index: number]
    * 字符串索引[x: string]
* 函数类型接口：interface F{ (arg:type):type }
* 混合类型接口：interface H { (arg: type): type, prop: type, method(arg: type): type }
* 类类型接口
    * 类必须实现接口中所有属性
    * 接口只能约束类的公用成员，不能约束私有成员、受保护成员、静态成员和构造函数
* 接口继承接口
    * 抽离可重用的接口
    * 将多个接口整合成一个接口
* 接口继承类：抽象出类的公用成员、私有成员和受保护成员

### 函数
* 定义函数
    * 定义方式
        * function
        * 变量定义
        * 类型别名
        * 接口定义
    * 类型要求
        * 参数类型必须声明
        * 返回值类型一般无需声明
* 函数参数
    * 参数个数：实参和形参必须一一对应
    * 可选参数：必选参数不能位于可选参数后
    * 默认参数：在必选参数前，默认参数不可省略，在必选参数后，默认参数可以省略
    * 剩余参数
* 函数重载
    * 静态类型语言：函数的名称相同，参数的个数或类型不同
    * Typescript：预先定义一组名称相同，类型不同的函数声明，并在一个类型最宽松的版本中实现

### 类
* 基本实现
    * 类中定义的属性都是实例属性，类中定义的方法都是原型方法
    * 实例属性必须有初始值，或在构造函数中被赋值，或为可选成员
* 继承：子类的构造函数中必须包含 super 调用
* 成员修饰符
    * public：对所有人可见，所有成员默认为public
    * private：只能在被定义的类中访问，不能通过实例或子类访问，private constructor 不能被实例化，不能被继承
    * protected：只能在被定义的类和子类中访问，不能通过实例访问，protected constructor 只能被实例化，不能被继承
    * readonly：必须有初始值，或在构造函数中被赋值
    * static：只能由类名调用，不能通过实例访问，可继承
* 构造函数参数中的修饰符：将参数变为实例属性
* 抽象类
    * 不能被实例化，只能被继承
        * 抽象方法包含具体实现，子类直接复用
        * 抽象方法不包含具体实现，子类必须实现
    * 多态：多个子类对父抽象类的方法有不同实现，实现运行时绑定
* this类型
    * 实现实例方法的链式调用
    * 在继承时，具有多态性，保持父子类之间接口调用的连贯性

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
* 泛型接口
    * 定义：interface Generic\<T\>{ (arg:T):T }
    * 实现：let generic：Generic\<type\>（必须指定类型）
* 泛型类
    * 定义：class Generic\<T\>{ method(value:T){} }，泛型不能应用于类的静态成员
    * 实例化
        * let generic = new Generic\<type\>()
        * let generic = new Generic()，T可为任意类型
* 泛型约束：T extends U （T 必须具有U的属性）

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
