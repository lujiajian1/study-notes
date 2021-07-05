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
    * array
    ```ts
    let arr1: number[] = [1, 2, 3];
    let arr2: Array<number> = [1, 2, 3]; // 使用泛型的方式
    ```
    * null
    * undefined
    * object
    ```ts

    ```
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
    * void
    * never
    * any
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