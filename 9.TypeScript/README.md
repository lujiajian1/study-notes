### 为什么要使用 TypeScript
* 类型推演和类型匹配
* 开发编译时报错
* 极大程度的避免了低级错误
* 支持Javascript的最新特性（包括ES6\7\8）

### TypeScript类型
* 基础类型
    * boolean
    * string
    * number
    * null
    * undefined
    * void
    * symbol
    * never
    * any
    * array
    ```ts
    let arr1: number[] = [1, 2, 3];
    let arr2: Array<number> = [1, 2, 3]; // 使用泛型的方式
    ```
    * object
    * tuple：元组，固定长度固定类型的数组
    ```ts
    let list: [number, string] = [1, 'lujiajian']
    ```
    * enum：枚举
    ```ts
    enum Color {
        red,
        green,
        blue
    }

    let color = Color.blue;
    console.log(color); //2

    enum Color1 {
        red = 5,
        green,
        blue
    }

    let color1 = Color1.blue;
    console.log(color1); //7

    enum Color2 {
        red = 5,
        green = 'lujiajian',
        blue = 10
    }

    let color2 = Color2.green;
    console.log(color2); //lujiajian
    ```
* 高级类型
    * union：联合类型
    ```ts
    let union: number | string = 1;
    ```
    * Nullable：可空类型
    * Literal：预定义类型（字面量类型），可以理解为枚举类型的变种
    ```ts
    let lit: 0 | 1 | 2 //只能取0，1，2
    ```
### 类型断言
```ts
let message:any;
message = 'abc';

// 第一种方法
let dd = (<string>message).endsWith("c"); //将message的any转化为string

// 第二种方法
let aa = (message as string).endsWith("c");
```

### Interface：接口
```ts
let drawPoint = (point: Point) => {
    console.log(point.x, point.y);
}

interface Point {
    x: number;
    y: number;
}
```

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
