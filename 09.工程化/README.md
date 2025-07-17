## 前端工程化概述
随着⽤户对⽤户体验要求的不断提升。传统的前端编写⽅式已经⽆法满⾜前端的要求。将⼯程⽅法系统化地应⽤到前端开发中，以系统、严谨、可量化的⽅法开发、运营、维护前端应⽤程序，⽬的是控制风险，降本提效。
![前端工程化概述](https://github.com/lujiajian1/study-notes/blob/main/img/system.png)

## Npm 包管理器
包管理器⼜称软件包管理系统，它是在电脑中⾃动安装、配制、卸载和升级软件包的⼯具组合，在各种系统软件和应⽤软件的安装管理中均有⼴泛应⽤。

## [Monorepo + pnpm](https://juejin.cn/post/7098609682519949325)
monorepo 是一种项目代码管理方式，就是把多个工程放到一个 git 仓库中进行管理，因此他们可以共享同一套构建流程、代码规范也可以做到统一，特别是如果存在模块间的相互引用的情况，查看代码、修改bug、调试等会更加方便。可以实现 monorepo 的技术方案有很多，最简单最初级的方案就是利用 pnpm 的 workspace 功能实现。
pnpm 是新一代的包管理工具，号称是最先进的包管理器。按照官网说法，可以实现节约磁盘空间并提升安装速度和创建非扁平化的 node_modules 文件夹两大目标。pnpm 提出了workspace 的概念，内置了对 monorepo 的支持。

## 脚手架与 CLI
脚⼿架是为保证各施⼯过程顺利进⾏⽽搭设的⼯作平台。在软件开发上的脚⼿架指的是：有⼈帮你把这个开发过程中要⽤到的⼯具、环境都配置好了，你就可以⽅便地直接开始做开发，专注你的业务，⽽不⽤再花时间去配置这个开发环境。
“CLI(command-line interface,命令⾏界⾯)是指可在⽤户提示符下键⼊可执⾏指令的界⾯,它通常不⽀持⿏标,⽤户通过键盘输⼊指令,计算机接收到指令后,予以执⾏。”
通常前端脚⼿架都会和 CLI ⼯具配合出现，以⾄于很多⼈认为脚⼿架就是 CLI ⼯具。

## 模块化
软件⼯程中谈到的模块是指整个程序中⼀些相对对独⽴的程序单元，每个程序单元完成和实现⼀个相对独⽴的软件功能。通俗点就是⼀些功能独⽴的程序段。

### 使⽤⽴即执⾏函数 IIFE（Immediately-Invoked Function Expression
IIFE 会创建⼀个只使⽤⼀次的函数，然后⽴即执⾏；IIFE 可以创建闭包进⾏作⽤域隔离，从⽽保护私有变量。
```js
const util = (function() {
  const spliter = '#'
  const format = str => spliter + str + spliter
  return {
    format
  }
})
```

### CommonJS
CommonJS 主要运行于服务器端，该规范指出，一个单独的文件就是一个模块，其内部定义的变量是属于这个模块的，不会对外暴露，也就是说不会污染全局变量。 Node.js为主要实践者，它有四个重要的环境变量为模块化的实现提供支持：module、exports、require、global。
CommonJS的核心思想就是通过 require 方法来同步加载所要依赖的其他模块，然后通过 exports 或者 module.exports 来导出需要暴露的接口。
* 特点
  * 所有代码都运行在模块作用域，不会污染全局作用域。
  * 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存。
  * 模块加载的顺序，按照其在代码中出现的顺序。
* 优点：CommonJS规范在服务器端率先完成了JavaScript的模块化，解决了依赖、全局变量污染的问题，这也是js运行在服务器端的必要条件。
* 缺点：由于 CommonJS 是同步加载模块的，在服务器端，文件都是保存在硬盘上，所以同步加载没有问题，但是对于浏览器端，需要将文件从服务器端请求过来，那么同步加载就不适用了，所以，CommonJS是不适用于浏览器端的。
  
#### Module对象
Node内部提供一个Module构建函数。所有模块都是Module的实例。每个模块内部，都有一个module对象，代表当前模块。它有以下属性。
* module.id 模块的识别符，通常是带有绝对路径的模块文件名。
* module.filename 模块的文件名，带有绝对路径。
* module.loaded 返回一个布尔值，表示模块是否已经完成加载。
* module.parent 返回一个对象，表示调用该模块的模块。
* module.children 返回一个数组，表示该模块要用到的其他模块。
* module.exports 表示模块对外输出的值。

#### module.exports属性
module.exports属性表示当前模块对外输出的接口，其他文件加载该模块，实际上就是读取module.exports变量。
```js
// a.js
var x = 5;
var addX = function (value) {
  return value + x;
};
module.exports.x = x;
module.exports.addX = addX;

// index.js
var a = require('./a.js');
console.log(a.x); // 5
console.log(a.addX(1)); // 6
```

#### exports变量
为了方便，Node为每个模块提供一个exports变量，指向module.exports。这等同在每个模块头部，有一行这样的命令。
```js
var exports = module.exports;
```
因此，在对外输出模块接口时，可以向exports对象添加方法。
```js
exports.x = 5;
exports.addX = function (value) {
  return value + x;
};
```
注意，因为exports持有的是module.exports的引用，所以，不能直接将exports变量指向一个值，因为这样等于切断了exports与module.exports的联系。
```js
exports = function(x) {console.log(x)};
```
上面这样的写法是无效的，因为exports不再指向module.exports了。
下面的写法也是无效的。因为也切段了exports对module.exports的引用。
```js
exports.hello = function() {
  return 'hello';
};
module.exports = 'Hello world';
```
上面代码中，hello函数是无法对外输出的，因为module.exports被重新赋值了。
如果一个模块的对外接口，就是一个单一的值，不能使用exports输出，只能使用module.exports输出。
```js
module.exports = function (x){ console.log(x);};
```

#### 加载模式
CommonJS规范加载模块是同步的，在输入时是先加载整个模块，生成一个对象，然后再从这个对象上面读取方法，这种加载称为“运行时加载”。也就是说，只有加载完成，才能执行后面的操作。由于Node.js主要用于服务器编程，模块文件一般都已经存在于本地硬盘，读取非常快，所以这样做不会有问题。

#### 加载机制
CommonJS模块的加载机制是，输入的是被输出的值的拷贝。也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。
```js
// a.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
};

// index.js
var counter = require('./lib').counter;
var incCounter = require('./lib').incCounter;

console.log(counter);  // 3
incCounter();
console.log(counter); // 3
```

### AMD(require.js)
AMD是"Asynchronous Module Definition"的缩写，意思就是"异步模块定义"。它采用异步方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。
模块功能主要的几个命令：define、require、return和define.amd。define是全局函数，用来定义模块,define(id?, dependencies?, factory)。require命令用于输入其他模块提供的功能，return命令用于规范模块的对外接口，define.amd属性是一个对象，此属性的存在来表明函数遵循AMD规范。
* 优点：适合在浏览器环境中异步加载模块。可以并行加载多个模块。
* 缺点：提高了开发成本，并且不能按需加载，而是必须提前加载所有的依赖。

#### define(id?, dependencies?, factory)
* id：指定义中模块的名字（可选）。如果没有提供该参数，模块的名字应该默认为模块加载器请求的指定脚本的名字。如果提供了该参数，模块名必须是“顶级”的和绝对的（不允许相对名字）。
* dependencies：当前模块依赖的，已被模块定义的模块标识的数组字面量（可选）。
* factory：一个需要进行实例化的函数或者一个对象。
```js
define('testModule', ["a", "b", "c", "d", "e", "f"], function(a, b, c, d, e, f) { 
    // 等于在最前面声明并初始化了要用到的所有模块
    if (false) {
      // 即便没用到某个模块 b，但 b 还是提前执行了。**这就CMD要优化的地方**
      b.foo()
    } 
});
```
AMD 规范允许输出模块兼容 CommonJS 规范，这时 define 方法如下：
```js
define(function (require, exports, module) {
    var reqModule = require("./someModule");
    requModule.test();
      
    exports.asplode = function () {
        //someing
    }
});
```

### CMD(sea.js)
AMD的实现者require.js在申明依赖的模块时，会在第一时间加载并执行模块内的代码：
```js
define(["a", "b", "c", "d", "e", "f"], function(a, b, c, d, e, f) { 
    // 等于在最前面声明并初始化了要用到的所有模块
    if (false) {
      // 即便没用到某个模块 b，但 b 还是提前执行了。**这就CMD要优化的地方**
      b.foo()
    } 
});
```
CMD通过按需加载的方式，而不是必须在模块开始就加载所有的依赖。CMD推崇依赖就近、延迟执行。
```js
define(function (require, exports, module){
  var someModule = require("someModule");
  var anotherModule = require("anotherModule");

  someModule.doTehAwesome();
  anotherModule.doMoarAwesome();

  exports.asplode = function (){
    someModule.doTehAwesome();
    anotherModule.doMoarAwesome();
  };
});
```
* 优点：同样实现了浏览器端的模块化加载。可以按需加载，依赖就近。
```js
// CMD
define(function (require, exports, module) {
    var a = require('./a') 
    a.doSomething()
    // 此处略去 100 行   
    var b = require('./b') // 依赖可以就近书写   
    b.doSomething()
    // ... 
})
// AMD 默认推荐的是
define(['./a', './b'], function (a, b) {
    // 依赖必须一开始就写好   
    a.doSomething()
    // 此处略去 100 行    
    b.doSomething()
    //...
})
```
* 缺点：依赖SPM打包，模块的加载逻辑偏重。

### UMD
umd是一种思想，就是一种兼容 commonjs,AMD,CMD 的兼容写法，define.amd / define.cmd / module 等判断当前支持什么方式，UMD先判断支持Node.js的模块（exports）是否存在，存在则使用Node.js模块模式。再判断是否支持AMD（define是否存在），存在则使用AMD方式加载模块。都不行就挂载到 window 全局对象上面去。
```js
(function (root, factory) {
  if (typeof define === "function" && (define.amd || define.cmd)) {
    //AMD,CMD
    define(["b"], function (b) {
      return (root.returnExportsGlobal = factory(b));
    });
  } else if (typeof module === "object" && module.exports) {
    //Node, CommonJS之类的
    module.exports = factory(require("b"));
  } else {
    //公开暴露给全局对象
    root.returnExports = factory(root.b);
  }
})(this, function (b) {
  return {};
});
```

### ESM
ES modules（ESM）是 JavaScript 官方的标准化模块系统。在ES6中，我们可以使用 import 关键字引入模块，通过 export 关键字导出模块，但是由于ES6目前无法在浏览器中执行，所以，我们只能通过babel将不被支持的import编译为当前受到广泛支持的 require。
```js
/** 定义模块 math.js **/
var basicNum = 0;
var add = function (a, b) {
    return a + b;
};
export { basicNum, add };

/** 引用模块 **/
import { basicNum, add } from './math';
function test(ele) {
    ele.textContent = add(99 + basicNum);
}
```

#### 加载机制
ES6 模块的运行机制与 CommonJS 不一样。ES6 模块不是对象，而是通过 export 命令显式指定输出的代码，import时采用静态命令的形式。JS 引擎对脚本静态分析的时候，遇到模块加载命令import，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。模块内部引用的变化，会反应在外部。
在import时可以指定加载某个输出值，而不是加载整个模块，这种加载称为“编译时加载”。在编译时就引入模块代码，而不是在代码运行时加载，所以无法实现条件加载。也正因为这个，使得静态分析成为可能。

### 总结
1. AMD/CMD/CommonJs 是js模块化开发的规范，对应的实现是require.js/sea.js/Node.js
2. CommonJs 主要针对服务端，AMD/CMD/ES Module主要针对浏览器端(服务端一般采用同步加载的方式，浏览器端需要异步加载)
3. AMD/CMD区别，虽然都是并行加载js文件，但还是有所区别，AMD是预加载，在并行加载js文件同时，还会解析执行该模块（因为还需要执行，所以在加载某个模块前，这个模块的依赖模块需要先加载完成）；而CMD是懒加载，虽然会一开始就并行加载js文件，但是不会执行，而是在需要的时候才执行。
4. CommonJs和ES Module的区别：
  * CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
  * CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
  * CommonJS 模块的require()是同步加载模块，ES6 模块的import命令是异步加载，有一个独立的模块依赖的解析阶段。
![模块化](https://github.com/lujiajian1/study-notes/blob/main/img/module.png)

## Babel语法编译器
Babel 是⼀个⼯具链，主要⽤于将采⽤ ECMAScript 2015+ 语法编写的代码转换为向后兼容的 JavaScript 语法，以便能够运⾏在当前和旧版本的浏览器或其他环境中。下⾯列出的是 Babel 能为你做的事情：
* 语法转换
* 通过 Polyfill ⽅式在⽬标环境中添加缺失的特性 （通过引⼊第三⽅ polyfill 模块，例如 core-js）
* 源码转换（codemods）

## Jest单元测试
Jest 是 Facebook 开源的⼀套 JavaScript 测试框架， 它集成了断⾔、JSDom、覆盖率报告等开发者所需要的所有测试⼯具。
```js
// add.js
const add = (a, b) => a + b;
module.exports = add;

// add.test.js
const add = require("../add");

describe("测试Add函数", () => {
  test("add(1,2) === 3", () => {
    expect(add(1, 2)).toBe(3);
  });

  test("add(1,1) === 2", () => {
    expect(add(1, 1)).toBe(2);
  });
});
```
* 断言函数: 测试即运⾏结果是否与我们预期结果⼀致 断⾔函数⽤来验证结果是否正确。
```js
expect(运行结果).toBe(期望的结果);
//常见断言方法
expect({a:1}).toBe({a:1})//判断两个对象是否相等
expect(1).not.toBe(2)//判断不等
expect({ a: 1, foo: { b: 2 } }).toEqual({ a: 1, foo: { b: 2 } })
expect(n).toBeNull(); //判断是否为null
expect(n).toBeUndefined(); //判断是否为undefined
expect(n).toBeDefined(); //判断结果与toBeUndefined相反
expect(n).toBeTruthy(); //判断结果为true
expect(n).toBeFalsy(); //判断结果为false
expect(value).toBeGreaterThan(3); //大于3
expect(value).toBeGreaterThanOrEqual(3.5); //大于等于3.5
expect(value).toBeLessThan(5); //小于5
expect(value).toBeLessThanOrEqual(4.5); //小于等于4.5
expect(value).toBeCloseTo(0.3); // 浮点数判断相等
expect('Christoph').toMatch(/stop/); //正则表达式判断
expect(['one','two']).toContain('one'); //不解释
```
* 分组函数
```js
describe("关于每个功能或某个组件的单元测试",()=>{
  // 不同用例的单元测试
})
```
* 异步测试: 异步测试脚本执⾏完，单元测试就结束了，如果需要延时才能断⾔的结果，单元测试函数需要设置 done 形参，在定时回调函数中调⽤，显示的通过单元测试已完成。
```js
// delay.js
module.exports = fn => {
  setTimeout(() => fn(), 1000)
}

// delay.test.js
const delay = require('../delay')
it('异步测试', (done) => {
  delay(() => {
    done()
  })
})
```
* 异步测试的快进功能: 基于 jest 提供的两个⽅法 jest.useFakeTimers 和 jest.runAllTimers 可以更优雅的对延时功能的测试。
```js
const delay = require("../delay");
it("异步测试", (done) => {
  // 开启定时函数模拟
  jest.useFakeTimers();
  delay(() => {
    done();
  });
  //快进，使所有定时器回调
  jest.runAllTimers();
});
```
* Mock 测试: mock 测试就是在 中，对于某些不容易构造或者不容易获取的对象，⽤⼀个虚拟的对象来创建以便测试的测试⽅法。
```js
const { getData } = require("../fetch");
const axios = require("axios");
jest.mock("axios");
it("fetch", async () => {
  // 模拟第一次接收到的数据
  axios.get.mockResolvedValueOnce("123");
  // 模拟每一次接收到的数据
  axios.get.mockResolvedValue("456");
  const data1 = await getData();
  const data2 = await getData();
  expect(data1).toBe("123");
  expect(data2).toBe("456");
});
```
* Dom 测试: 所谓 Dom 测试是为了验证前端程序对 Dom 的操作是否正确。为了测试⽅便，⼜不希望在浏览器环境中进⾏这时就可以在 Node 环境中进⾏，但是 Node 中并没有  Dom 模型。解决办法就是使⽤ jsdom 进⾏ Dom 的仿真。
```js
// jsdom-config.js
const jsdom = require('jsdom') // eslint-disable-line
const { JSDOM } = jsdom
const dom = new JSDOM('<!DOCTYPE html><head/><body></body>', {
  url: 'http://localhost/',
  referrer: 'https://example.com/',
  contentType: 'text/html',
  userAgent: 'Mellblomenator/9000',
  includeNodeLocations: true,
  storageQuota: 10000000,
})
global.window = dom.window
global.document = window.document
global.navigator = window.navigator

// dom.js
exports.generateDiv = () => {
  const div = document.createElement("div");
  div.className = "c1";
  document.body.appendChild(div);
};

// dom.test.js
const { generateDiv } = require('../dom')
require('../jsdom-config')
describe('Dom测试', () => {
  test('测试dom操作', () => {
    generateDiv()
    expect(document.getElementsByClassName('c1').length).toBe(1)
  })
})
```
* 快照测试: 快照测试其实就是将对象实例序列化并进⾏持久化保存。等到然后进⾏代码⽐对。就⽐如说在前端测试中，可以 Dom 对象做成快照。每当你想要确保你的 UI 不会有意外的改变，快照测试是⾮常有⽤的⼯具。典型的做法是在渲染了 UI 组件之后，保存⼀个快照⽂件， 检测他是否与保存在单元测试旁的快照⽂件相匹配。 若两个快照不匹配，测试失败：有可能做了意外的更改，或者 UI 组件已经更新到了新版本。
```js
const { generateDiv } = require('../dom')
require('../jsdom-config')
it("Dom的快照测试", () => {
  generateDiv()
  expect(document.getElementsByClassName('c1')).toMatchSnapshot()
})
```
* 常见命令
```js
{
  "nocache": "jest --no-cache", //清除缓存
  "watch": "jest --watchAll", //实时监听
  "coverage": "jest --coverage", //生成覆盖测试文档
  "verbose": "npx jest --verbose" //显示测试描述
} 
```

## AST
抽象语法树（abstract syntax tree，AST） 是源代码的抽象语法结构的树状表示，树上的每个节点都表示源代码中的⼀种结构，这所以说是抽象的，是因为抽象语法树并不会表示出真实语法出现的每⼀个细节，⽐如说，嵌套括号被隐含在树的结构中，并没有以节点的形式呈现。 抽象语法树并不依赖于源语⾔的语法，也就是说语法分析阶段所采⽤的上下⽂⽆⽂⽂法，因为在写⽂法时，经常会对⽂法进⾏等价的转换（消除左递归，回溯，⼆义性等），这样会给⽂法分析引⼊⼀些多余的成分，对后续阶段造成不利影响，甚⾄会使合个阶段变得混乱。因些，很多编译器经常要独⽴地构造语法分析树，为前端，后端建⽴⼀个清晰的接⼝。 抽象语法树在很多领域有⼴泛的应⽤，⽐如浏览器，智能编辑器，编译器。
![AST](https://github.com/lujiajian1/study-notes/blob/main/img/ast.png)

## [webpack](https://juejin.cn/post/6844904038543130637) 基础

### 核心概念
* entry: ⼊⼝，webpack 构建第⼀步;
* output: 输出;
* loader: 模块转换器，⽤于将模块的原内容按照需求转换成新内容;
* plugin: 扩展插件,在 webpack 构建过程的特定时机注⼊扩展逻辑，⽤来改变或优化构建结果;
* mode: 控制打包环境 通过选择 development, production 或 none 之中的⼀个，来设置 mode 参数，你可以启⽤ webpack 内置在相应环境下的优化。其默认值为 production 环境;
devserver: 是⼀个⼩型的 node.js Express 服务器，使⽤ webpack-dev-middleware 中间件来为通过 webpack 打包⽣成的资源⽂件提供 web 服务。

### entry point(⼊⼝起点)
⼊⼝起点(entry point) 指示 webpack 应该使⽤哪个模块，来作为构建其内部 依赖图(dependency graph) 的开始。进⼊⼊⼝起点后，webpack 会找出有哪些模块和库是⼊⼝起点（直接和间接）依赖的。
```js
// index.js
import { add } from "./add";
console.log(add(3, 3));

// add.js
export const add = (a,b) => a + b

// webpack.config.js
module.exports = {
  entry: "./src/index.js"
};
```

### output (输出)
output 属性告诉 webpack 在哪⾥输出它所创建的 bundle，以及如何命名这些⽂件。主要输出⽂件的默认值是 ./dist/main.js，其他⽣成⽂件默认放置在 ./dist ⽂件夹中。
```js
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.bundle.js",
  },
};
```

### Loader 加载器
loader ⽤于对模块的源代码进⾏转换。loader 可以使你在 import 或 "load(加载)" 模块时预处理⽂件。
* 默认只能处理 json 与 js
* 其他⽂件需要通过专⻔的加载器处理
```js
module: {
    rules: [
      // 处理 ES6，使用babel-loader
      {
        test: /\.js$/,
        loader: ['babel-loader'],
        include: srcPath,
        exclude: /node_modules/
      },
      // 处理样式，使用'style-loader', 'css-loader', 'postcss-loader'，'less-loader'
      {
        test: /\.css$/,
        // loader 的执行顺序是：从后往前
        loader: ['style-loader', 'css-loader', 'postcss-loader'] // 加了 postcss
      },
      {
        test: /\.less$/,
        // 增加 'less-loader' ，注意顺序
        loader: ['style-loader', 'css-loader', 'less-loader']
      },
      // 处理图片 - 考虑 base64 编码的情况
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            // 小于 5kb 的图片用 base64 格式产出
            // 否则，依然延用 file-loader 的形式，产出 url 格式
            limit: 5 * 1024,

            // 打包到 img 目录下
            outputPath: '/img1/',

            // 设置图片的 cdn 地址（也可以统一在外面的 output 中设置，那将作用于所有静态资源）
            // publicPath: 'http://cdn.abc.com'
          }
        }
      },
    ]
},
```

### plugin 插件
扩展插件，在 webpack 构建过程的特定时机注⼊扩展逻辑，⽤来改变或优化构建结果；
```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
};
```

### DevServer 开发服务器
提供了⼀个基本的 web server，并且具有 live reloading(实时重新加载) 功能。
* 静态服务⽐如:图⽚
* live reloading(实时重新加载)
* 反向代理接⼝
```js
devServer: {
    port: 8080,
    progress: true,  // 显示打包的进度条
    contentBase: distPath,  // 根目录
    open: true,  // 自动打开浏览器
    compress: true,  // 启动 gzip 压缩

    // 设置代理
    proxy: {
        // 将本地 /api/xxx 代理到 localhost:3000/api/xxx
        '/api': 'http://localhost:3000',

        // 将本地 /api2/xxx 代理到 localhost:3000/xxx
        '/api2': {
            target: 'http://localhost:3000',
            pathRewrite: {
                '/api2': ''
            }
        }
    }
}
```

## webpack 高级配置

### 多入口
```js
module.exports = {
    entry: {
        index: path.join(srcPath, 'index.js'),
        other: path.join(srcPath, 'other.js')
    },
    module: {
        rules: []
    },
    plugins: [
        // new HtmlWebpackPlugin({
        //     template: path.join(srcPath, 'index.html'),
        //     filename: 'index.html'
        // })

        // 多入口 - 生成 index.html
        new HtmlWebpackPlugin({
            template: path.join(srcPath, 'index.html'),
            filename: 'index.html',
            // chunks 表示该页面要引用哪些 chunk （即上面的 index 和 other），默认全部引用
            chunks: ['index']  // 只引用 index.js
        }),
        // 多入口 - 生成 other.html
        new HtmlWebpackPlugin({
            template: path.join(srcPath, 'other.html'),
            filename: 'other.html',
            chunks: ['other']  // 只引用 other.js
        })
    ]
}
```

### 抽离 css 文件
```js
module.exports = smart(webpackCommonConf, {
    mode: 'production',
    output: {
        filename: '[name].[contentHash:8].js', // name 即多入口时 entry 的 key
        path: distPath,
    },
    module: {
        rules: [
            // 抽离 css
            {
                test: /\.css$/,
                loader: [
                    MiniCssExtractPlugin.loader,  // 注意，这里不再用 style-loader
                    'css-loader',
                    'postcss-loader'
                ]
            },
            // 抽离 less --> css
            {
                test: /\.less$/,
                loader: [
                    MiniCssExtractPlugin.loader,  // 注意，这里不再用 style-loader
                    'css-loader',
                    'less-loader',
                    'postcss-loader'
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(), // 会默认清空 output.path 文件夹
        new webpack.DefinePlugin({
            ENV: JSON.stringify('production')
        }),

        // 抽离 css 文件
        new MiniCssExtractPlugin({
            filename: 'css/main.[contentHash:8].css'
        })
    ],

    optimization: {
        // 压缩 css
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    }
})
```

### 抽离公共代码
```js
module.exports = smart(webpackCommonConf, {
    mode: 'production',
    output: {
        filename: '[name].[contentHash:8].js', // name 即多入口时 entry 的 key
        path: distPath,
    },
    module: {
        rules: [
            //......
        ]
    },
    plugins: [
        new CleanWebpackPlugin(), // 会默认清空 output.path 文件夹
        new webpack.DefinePlugin({
            ENV: JSON.stringify('production')
        })
    ],

    optimization: {
        // 分割代码块
        splitChunks: {
            chunks: 'all',
            /**
             * initial 入口 chunk，对于异步导入的文件不处理
                async 异步 chunk，只对异步导入的文件处理
                all 全部 chunk
             */

            // 缓存分组
            cacheGroups: {
                // 第三方模块
                vendor: {
                    name: 'vendor', // chunk 名称
                    priority: 1, // 权限更高，优先抽离，重要！！！
                    test: /node_modules/,
                    minSize: 0,  // 大小限制
                    minChunks: 1  // 最少复用过几次
                },

                // 公共的模块
                common: {
                    name: 'common', // chunk 名称
                    priority: 0, // 优先级
                    minSize: 0,  // 公共模块的大小限制
                    minChunks: 2  // 公共模块最少复用过几次
                }
            }
        }
    }
})
```

### 懒加载
```js
//正常引用
import { sum } from './sum'
//懒加载引用
import('./data.js').then(() =>{})
```

### 处理 JSX：使用 @babel/preset-react

### 处理 Vue：使用 vue-loader

## Rollup 基础
rollup 是⼀款⼩巧的 javascript 模块打包⼯具，更适合于库应⽤的构建⼯具;可以将⼩块代码编译成⼤块复杂的代码，基于 ES6 modules,它可以让你的 bundle 最⼩化，有效减少⽂件请求⼤⼩,vue在开发的时候⽤的是 webpack,但是最后将⽂件打包在⼀起的时候⽤的是 rollup.js。

### 打包格式
* amd – 异步模块定义，⽤于像 RequireJS 这样的模块加载器
* cjs – CommonJS，适⽤于 Node 和 Browserify/Webpack
* es – 将软件包保存为 ES 模块⽂件
* iife – ⼀个⾃动执⾏的功能，适合作为 script 标签。（如果要为应⽤程序创建⼀个捆绑包，您可能想要使⽤它，因为它会使⽂件⼤⼩变⼩。）
* umd – 通⽤模块定义，以 amd，cjs 和 iife 为⼀体

### 插件的使用
为了更好的⽀持复杂的应⽤场景，可以通过插件进⾏扩展。
* rollup-plugin-babel ⽤于转换 es6 语法。
* rollup-plugin-commonjs rollup 默认是不⽀持 CommonJS 模块的，⾃⼰写的时候可以尽量避免使⽤ CommonJS 模块的语法，但有些外部库的是 cjs 或者 umd（由 webpack 打包的），所以使⽤这些外部库就需要⽀持 CommonJS 模块。
* rollup-plugin-postcss 处理 css 需要⽤到的插件是 rollup-plugin-postcss 。它⽀持 css ⽂件的加载、css 加前缀、css 压缩、对 scss/less 的⽀持等等。
* rollup-plugin-vue
* rollup-plugin-terser 在⽣产环境中，代码压缩是必不可少的。我们使⽤ rollup-plugin-terser 进⾏代码压缩。
* rollup-plugin-serve ⽤于启动⼀个服务器。
* rollup-plugin-livereload ⽤于⽂件变化时，实时刷新⻚⾯。
```js
// rollup.config.js
import { terser } from "rollup-plugin-terser";
export default {
  input: "./src/index.js",
  plugins: [terser()],
  output: [
    {
      file: "./dist/es.min.js",
      format: "es",
    },
  ],
};
```

## Vite 基础
Vite(读⾳类似于[weɪt]，法语，快的意思) 是⼀个由原⽣ ES Module 驱动的 Web 开发构建⼯具。在开发环境下基于浏览器原⽣ ES imports 开发，在⽣产环境下基于 Rollup 打包。

### Vite 的特点
* Lightning fast cold server start - 闪电般的冷启动速度
* Instant hot module replacement (HMR) - 即时热模块更换（热更新）
* True on-demand compilation - 真正的按需编译

### 要求
* Vite 要求项⽬完全由 ES Module 模块组成
* common.js 模块不能直接在 Vite 上使⽤
* 打包上依旧还是使⽤ rollup 等传统打包⼯具

### Vite2 主要变化
* 配置选项变化： vue特有选项 、创建选项、css 选项、jsx 选项等、别名⾏为变化：不再要求/开头或结尾
* Vue ⽀持：通过 @vitejs/plugin-vue 插件⽀持
* React ⽀持
* HMR API 变化
* 清单格式变化
* 插件 API 重新设计

## Git版本控制
版本控制最主要的功能就是追踪⽂件的变更。它将什么时候、什么⼈更改了⽂件的什么内容等信息忠实地了记录下来。每⼀次⽂件的改变，⽂件的版本号都将增加。除了记录版本变更外，版本控制的另⼀个重要功能是并⾏开发。软件开发往往是多⼈协同作业，版本控制可以有效地解决版本的同步以及不同开发者之间的开发通信问题，提⾼协同开发的效率。并⾏开发中最常⻅的不同版本软件的错误(Bug)修正问题也可以通过版本控制中分⽀与合并的⽅法有效地解决。

### 必要性
* 单⼈单功能开发 -- ⾄少你需要在开发在发现思路错误时快速退回到上⼀个正确的还原点
* 单⼈多功能并⾏ + Bug fix -- 需要灵活的在多个功能点分⽀和 Bug 解决分⽀间切换
* 多⼈多功能点 -- 需要多⼈间同步最新⼯作成果
* 多⼈多功能点多版本多基线 -- 需要使⽤不同分⽀和 Tag 标识开发版本和⾥程碑，并且通过配置管理员将新的 Feather 和 Bug Fix 配置到不同的版本

### 常用git命令
* git add .
* git checkout xxx
* git commit -m 'xxx'
* git push origin master
* git pull origin master
* git branch
* git checkout -b xxx / git checkout xxx
* git merge xxx

### 分⽀管理
如果你每次只开发⼀个功能点或者修改⼀个 Bug。不需要并⾏开发的可能你不需要分⽀。不过现实情况是很有可能你正在开发⼀个⻓达⼏天的新特性时你⼜不得不去修改⼀些紧急的 bug，⼜或是有个⼩伙伴急着让你帮助他解决他所遇到的问题。这就有点像你需要不断的从不同进度点开始玩游戏。这个时候分⽀就可以帮我们解决这个问题。git 的分⽀管理在所有的版本控制⼯具中出类拔萃分⼚推荐⼤家使⽤分⽀功能。
* 创建分支开发
```bash
# 分支A
# 创建分支并切换分支到funA
git checkout -b 'funA'
# 完成功能
echo 'FunA XXXXXXX' >> README.md
# 提交功能
git commit -am 'funA add'
# 检出master分支
git checkout master
# 合并将开发分支合并到主分支
git merge funA
# 可以利用-d合并的同时删除分支
git merge -d funA
```
* 分⽀的查看、删除
```bash
# 查看
git branch
# 查看 - a 包括远程分支
git branch -a
# 删除
git branch -D <分支名称>
```
* 标签管理
```bash
# 将最新提交打标签
git tag v1.0
# 将指定commit打标签
git tag v0.9 4ab025
# 查看打标签
git tag
# 查看与某标签之间的差距
git show v0.9
```
* 添加远程分⽀
```bash
# 添加远程分支
git remote add origin git@github.com:su37josephxia/hello-git.git
# 查看远程分支
git remote -v
# 推送分支到远程
# git push -u origin master 将本地的 master 分支推送到远程仓库的 origin 仓库，并且设置该分支与远程仓库的 master 分支进行关联，-u 参数表示设置 upstream，即默认推送到远程仓库的 master 分支。
git push -u origin master
# git push 将本地的所有分支推送到远程仓库，默认情况下会将所有分支推送到与本地分支同名的远程分支。
git push
```

## ESLint
ESLint 最初是由 Nicholas C. Zakas于 2013 年 6 ⽉创建的开源项⽬。它的⽬标是提供⼀个插件化的 javascript 代码检测⼯具。Eslint 是国外的前端⼤⽜ Nicholas C. Zakas 在 2013 年发起的⼀个开源项⽬，有⼀本书被誉为前端界的"圣经"，叫《JavaScript ⾼级程序设计》(即红宝书)，他正是这本书的作者。
* ESLint 使⽤ Espree 解析 JavaScript。
* ESLint 使⽤ AST 去分析代码中的模式
* ESLint 是完全插件化的。每⼀个规则都是⼀个插件并且你可以在运⾏时添加更多的规则。
(补充：ESLint 主要解决的是代码质量问题。另外一类代码风格问题并没有完完全全做完，因为这些问题"没那么重要"，代码质量出问题意味着程序有潜在 Bug，而风格问题充其量也只是看着不爽。而 Prettier 是一个支持很多语言的代码格式化工具， 对应的是各种 Linters 的 Formatting rules 这一类规则。而且你用了 Prettier 之后，就不会再违反这类规则了！不需要你自己手动修改代码。)

### 初始化 - lint
```bash
# 通过 eslint cli 初始化配置
npx eslint --init
```
* JavaScript - 使⽤ .eslintrc.js 然后输出⼀个配置对象。
* YAML - 使⽤ .eslintrc.yaml 或 .eslintrc.yml 去定义配置的结构。
* JSON - 使⽤ .eslintrc.json 去定义配置的结构，ESLint 的 JSON ⽂件允许 JavaScript ⻛格的注释。
* (弃⽤) - 使⽤ .eslintrc ，可以使 JSON 也可以是 YAML。
* package.json - 在 package.json ⾥创建⼀个 eslintConfig 属性，在那⾥定义你的配置。
如果同⼀个⽬录下有多个配置⽂件，ESLint 只会使⽤⼀个。优先级顺序如下：
1. .eslintrc.js
2. .eslintrc.yaml
3. .eslintrc.yml
4. .eslintrc.json
5. .eslintrc
6. package.json

### 解析配置 - parserOptions
* ecmaVersion 默认设置为 3，5（默认）， 你可以使⽤ 6、7、8、9 你也可以⽤使⽤年份命名的版本号指定为 2015（同 6），2016（同 7），或 2017（同 8）或 2018（同 9）或 2019 (same as 10)
* sourceType 设置为 "script" (默认) 或 "module" （如果你的代码是ECMAScript 模块）
* ecmaFeatures - 这是个对象，表示你想使⽤的额外的语⾔特性:
 * globalReturn - 允许在全局作⽤域下使⽤ return 语句
 * impliedStrict - 启⽤全局 strict mode (如果 ecmaVersion 是 5 或更⾼)
 * jsx - 启⽤ JSX
 * experimentalObjectRestSpread - 启⽤实验性的object rest/spread properties ⽀持。(重要：这是⼀个实验性的功能,在未来可能会有明显改变。建议你写的规则 不要 依赖该功能，除⾮当它发⽣改变时你愿意承担维护成本。)
```json
// .eslintrc.cjs
"parserOptions": {
  "ecmaVersion": 2015,
},
```

### 解析器设置 - parser
```js
{
  parser: '@typescript-eslint/parser', // TS
  parser: 'vue-eslint-parser', // Vue
}
```

### env 开发环境与 globals 全局变量
```js
env: {
  browser: true,
  es2020: true,
  node: true,
  jest: true
},
globals: {
  ga: true,
  chrome: true,
  __DEV__: true
},
```

###  定义规则 - rule
```js
rules: {
  'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',`
}
```

## 持续集成CI/CD
通过⼀系列⾃动化的脚本执⾏，实现开发过程中的代码的交付和部署，能够快速交付，提⾼团队开发的效率。
* CI 持续集成（Continuous Integration）：代码合并，构建，部署，测试都在⼀起，不断地执⾏这个过程，并对结果反馈。避免微⼩的错误。保证在不断迭代开发。
* CD 持续交付（Continuous Delivery）：系统可以⾃动为将代码更改发布到⽣产环境做好准备。
* CD 持续部署（Continuous Deployment）

### 前端的 CI/CD
* 持续集成 - CI：代码静态检查 Eslint、编译与构建 (webpack 或 rollup)、回归单元测试 - 覆盖率报告、BVT 测试 - 集成测试 - 端到端测试
* 持续交付 - CD：部署到应⽤服务器 (Nginx)、部署到软件包管理器 (Npm)、Webhook 消息推送 - email /钉钉

### ⼏种 CI/CD ⼯具
* Jenkins：Jenkins 是⼀款诞⽣⽐较早的⽼牌的开源 CI/CD ⼯具，可以⾃动化执⾏各种任务，包括构建、测试和部署软件。可以通过配置和编写脚本⾃动化执⾏ CI/CD 流程，代替⼿动CD/CD 流程，从⽽节省开发时间，减少错误率，并且会将每⼀次构建结果记录下来。
* CircleCI：CircleCI 是基于云的 CI/CD ⼯具，可⾃动执⾏软件构建和交付过程。它提供快速的配置和维护，没有任何复杂性。由于它是基于云的 CI/CD ⼯具，因此消除了专⽤服务器的困扰，并降低了维护本地服务器的成本。此外，基于云的服务器是可扩展的，健壮的，并有助于更快地部署应⽤程序。
* Github Action：Github Action 是 github 官⽅提供的 CI/CD 服务。那么什么是 Github Action 中的Action 呢？在 CI/CD 中，⽐如抓取代码、运⾏测试、发布第三⽅服务等，这⼀个个操作点就是⼀个个的 Action。
* Gitlab CI：和 Github CI 类似，Gitlab CI 是 Gitlab 提供的 CI/CD 服务。你只需要在你项⽬中的根⽬录下加上 .gitlab-ci.yml 包含构建、测试和部署的脚本即可。GitLab 如果检测到仓库中有该⽂件，就会使⽤ Gitlab Runner ⼯具按照顺序运⾏你设置的构建、测试和部署的脚本。

## Polyfill垫⽚与浏览器兼容
Polyfill 可以翻译为腻⼦（前端万年坑， 浏览器裂缝多）。我们可以把旧的浏览器想象为⼀⾯带有裂缝的墙， 需要使⽤ polyfill 进⾏抹平。得到⼀个光滑的的墙壁。为了兼容低版本浏览器的对语法兼容的不⾜，⽐如不兼容 h5 的某种特性。通常都会使⽤垫⽚进⾏抹平。
Babel 是⼀个通⽤型的 JS 编译器，通过 Babel 我们可以把最新标准编写的 JS 代码向下编译成兼容各种浏览器或 Node 的通⽤版本。你可以通过安装预设（presets，⼀系列同类插件组合） 或 插件（plugins） 告诉 Babel 应该如何进⾏代码转译，例如：@babel/preset-env （转译 ES6 ~ ES9 的语法）、 @babel/preset-react（转译 React）。

## E2E 端到端测试
简单来说，就是模拟真实⽤户使⽤场景进⾏测试，预期应⽤能够正常响应⽤户的操作，其关键点在于模拟⽤户使⽤环境，模拟⽤户操作。那对于 Web 应⽤来说，⽤户环境就是浏览器，⽤户操作主要是移动、点击，这些就是我们需要模拟的部分，下⾯就直接进⼊环境和实践部分。

### 什么是 Cypress？
Cypress 是基于 JavaScript 语⾔的前端⾃动化测试⼯具，⽆需借助外部⼯具，⾃集成了⼀套完整的端到端测试⽅法，可以对浏览器中运⾏的所有内容进⾏快速、简单、可靠的测试，并且可以进⾏接⼝测试。

### Cypress 的⼯作原理
Cypress 是在测试开始并⾸次加载 Cypress 时，Cypress Web 内部应⽤程序先把⾃⼰托管到本地的⼀个随机端⼝上，然后使⽤ webpack 将测试代码中的所有模块绑定到同⼀个 JavaScript ⽂件中，启动指定的浏览器，并将测试代码注⼊到空⽩⻚⾯⾥，同时运⾏测试代码。当识别出测试脚本中发出的第⼀个 cy.visit()命令后，Cypress 将会更改其本地的 URL 以匹配远端应⽤程序的地址，使得测试代码和应⽤程序可以在⼀个⽣命周期中运⾏。

### Cypress 的缺点
* 只⽀持 JS 框架去编写测试⽤例
* 不⽀持远程执⾏
* 不⽀持多个浏览器 tab
* 默认不同时⽀持多个浏览器

## webpack 性能优化
* webpack 性能优化 - 构建速度
    * 可用于生产环境
        * 优化 babel-loader：1.开启缓存 2.明确范围
        ```js
        {
            test: /\.js$/,
            loader: ['babel-loader?cacheDirectory'], //开启缓存
            include: srcPath, //明确范围
        }
        ```
        * IgnorePlugin：忽略无用模块，直接就不打包
        ```js
        plugins: [
            // 忽略 moment 下的 /locale 目录
            new webpack.IgnorePlugin(/\.\/locale/, /moment/),
        ],
        ```
        * noParse：避免重复打包，引用但不打包
        ```js
        module.exports = {
            module: {
                //直接使用 react.min.js
                //忽略对 react.min.js 文件的递归解析处理
                noPares: [/react\.min\.js$/]
            }
        }
        ```
        * happyPack：多进程打包
        * ParalleUglifyPlugin：多进程代码压缩
    * 不用于生产环境
        * 自动刷新
        * 热更新
        * DllPlugin：第三方或者其他比较大的库事先打包好，作为引用，不用每次重新打包
* webpack 性能优化 - 产出代码（体积更小，合理分包不重复加载，速度更快，内存使用更少）
    * 小图片 base64 编码
    * bundle 加 hash
    * 懒加载 import('')
    * 提取公共代码
    * IgnorePlugin：忽略文件不引入打包
    * 用cdn加速
    * 使用 production：使用 production 即在生产环境中使用 mode:'production'
        * 自动开启代码压缩
        * 自动开启 Tree-Shaking（没有用到的代码，在生产打包的时候删掉就是 tree-shaking）
        * Vue React 等会自动删掉调试代码
    * Scope Hosting：模块打包结果生成的 function 合并
        * 代码体积更小
        * 创建函数作用域更少
        * 代码可读性更好 

## babel：babel 解析 ES6 及以上更高级的语法到 ES5 及以下，以满足浏览器的兼容性。
* 环境搭建
```json
{
  "devDependencies": {
    "@babel/cli": "^7.7.5",
    "@babel/core": "^7.7.5",
    "@babel/plugin-transform-runtime": "^7.7.5",
    "@babel/preset-env": "^7.7.5"
  },
  "dependencies": {
    "@babel/polyfill": "^7.7.0",
    "@babel/runtime": "^7.7.5"
  }
}
```
* 基本配置
```js
//.babelrc
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "useBuiltIns": "usage",
                "corejs": 3
            }
        ]
    ],
    "plugins": [
        [
            "@babel/plugin-transform-runtime",
            {
                "absoluteRuntime": false,
                "corejs": 3,
                "helpers": true,
                "regenerator": true,
                "useESModules": false
            }
        ]
    ]
}
```
* presets 和 plugins
* babel-polyfill
    * 概念：polyfill 指的是“用于实现浏览器不支持原生功能的代码”，core.js 和 regenerator 提供了这些 polyfill，babel-polyfill 就是这两个库的整合。
    * 缺点：1.babel-polyfill 可能会增加很多根本没有用到的 polyfill；2.全局污染
* babel-runtime：来做隔离，防止全局污染

## 前端为何进行打包和构建
* 代码层面
    * 体积更小(Tree - Shaking, 压缩, 合并), 加载更快
    * 编辑高级语言或语法(TS, ES6, 模块化, less)
    * 兼容性和错误检查 (Polyfill、postcss、eslint)
* 研发流程方面
    * 统一、高效的开发环境
    * 统一的构建流程和产出标准
    * 集成公司构建规范(提测、上线等)

## module chuck bundle 的区别
* module - 各个源码文件, webpack 中一切皆模块
* chunk - 多模块合并成, 如 entry import()  splitChunk
* bundle - 最终的输出文件

## loader 和 plugin 的区别
* loader 模块转换器, 如 less  -> css
* plugin 扩展插件, 如 HtmlWepackPlugin 

## 常见 loader 和 plugin 有哪些
* [loader](https://www.webpackjs.com/loaders/)：webpack 可以使用 loader 来预处理文件
    * babel-loader：处理 ES6
    * postcss-loader：解决css兼容性，增加浏览器前缀
    * css-loader：解析css文件，因为css文件是使用 import './index.css' 引入的，webpack是一切皆模块
    * style-loader：将css代码插入到页面中
    * less-loader：解析less语法
    * url-loaders：以base64编码的URL加载文件
    * file-loader：在 JavaScript 代码里 import/require 一个文件时，会将该文件生成到输出目录，并且在 JavaScript 代码里返回该文件的地址。
* [plugin](https://www.webpackjs.com/plugins/)
    * HtmlWebpackPlugin：简单创建 HTML 文件，用于服务器访问
    * DefinePlugin：允许在编译时(compile time)配置的全局常量
    * MinChunkSizePlugin：通过合并小于 minChunkSize 大小的 chunk，将 chunk 体积保持在指定大小限制以上。
    * IgnorePlugin：从 bundle 中排除某些模块

## bebel 和 webpack 的区别
* babel - js 新语法编译工具, 不关心模块化
* webpack - 打包构建工具（压缩代码、整合代码，网页加载更快）, 是多个loader plugin 的集合

## babel-polyfill 和babel- runtime 的区别
* babel-polyfill 会污染全局
* babel-runtime 不会污染全局
* 产出第三方 要用 babel-runtime

## webpack npm node的关系
* npm：当包引入数量很多时管理就成为了一个问题，这个就是npm为开发者行了方便之处，npm已经为你做好了依赖和版本的控制，也就是说使用npm可以让你从繁杂的依赖安装和版本冲突中解脱出来，进而关注你的业务而不是库的管理。
* Webpack：webpack是一个工具，这个工具可以帮你处理好各个包/模块之间的依赖关系（modules with dependencies），并将这些复杂依赖关系的静态文件打包成一个或很少的静态文件，提供给浏览器访问使用；除此之外，webpack因为可以提高兼容性，还可以将一些浏览器尚不支持的新特性转换为可以支持格式，进而减少由新特性带来的浏览器的兼容性问题。
* webpack将你从npm中安装的包打包成更小的浏览器可读的静态资源，这里需要注意的是，webpack只是一个前端的打包工具，打包的是静态资源，和后台没有关系，虽然webpack依赖于node环境。
* webpack 与 Node 关系：基于node创建的，支持所有Node API和语法。

## webpack [打包原理](https://juejin.cn/post/6844904038543130637)

## webpack [打包过程](https://juejin.cn/post/6844904038543130637#heading-9)

## 谈谈对[npm语义版本号](https://segmentfault.com/a/1190000018714929)的理解
有时候为了表达更加确切的版本，还会在版本号后面添加标签或者扩展，来说明是预发布版本或者测试版本等。比如 3.2.3-beta-3。

## 前端性能优化
* 优化原则：多使用内存，缓存或者其他方法，减少cpu计算量，减少网络加载耗时（空间换时间）
* 从何入手：让加载更快，让渲染更快
    * 加载更快：减少资源体积（压缩代码），减少访问次数（合并代码，SSR服务端渲染，缓存），使用更快的网络（CDN）
    * 让渲染更快：1. CSS放在head中，JS放在body最下面2. 尽早开始执行JS，用DOMContentLoaded触发3. 懒加载（图片懒加载，上滑加载更多）4. 对DOM查询进行缓存5. 频繁DOM操作，合并到一起插入DOM结构6. 节流throttle 防抖debounce （让渲染更加流畅）

## [首屏优化](https://juejin.cn/post/6844904185264095246)
* 对于第三方js库的优化，分离打包，CDN加速
* vue-router使用懒加载
* 图片资源的压缩，icon资源使用雪碧图或者使用icon-font
* 开启gizp压缩，通过减少文件体积来提高加载速度。html、js、css文件甚至json数据都可以用它压缩，可以减小60%以上的体积
* 前端页面代码层面的优化
    * 合理使用v-if和v-show
    * 合理使用watch和computed
    * 使用v-for必须添加key, 最好为唯一id, 避免使用index, 且在同一个标签上，v-for不要和v-if同时使用
    * 定时器的销毁。可以在beforeDestroy()生命周期内执行销毁事件；也可以使用$once这个事件侦听器，在定义定时器事件的位置来清除定时器

## [安全](https://juejin.cn/post/6844903502968258574)
* XSS：跨站脚本攻击，是说攻击者通过注入恶意的脚本，在用户浏览网页的时候进行攻击，比如获取 cookie，或者其他用户身份信息，可以分为存储型和反射型，存储型是攻击者输入一些数据并且存储到了数据库中，其他浏览者看到的时候进行攻击，反射型的话不存储在数据库中，往往表现为将攻击代码放在 url 地址的请求参数中，防御的话为cookie 设置 httpOnly 属性，对用户的输入进行检查，进行特殊字符过滤。
* XSRF：跨站请求伪造，可以理解为攻击者盗用了用户的身份，以用户的名义发送了恶意请求，比如用户登录了一个网站后，立刻在另一个tab页面访问量攻击者用来制造攻击的网站，这个网站要求访问刚刚登陆的网站，并发送了一个恶意请求，这时候 CSRF就产生了，比如这个制造攻击的网站使用一张图片，但是这种图片的链接却是可以修改数据库的，这时候攻击者就可以以用户的名义操作这个数据库，防御方式的话：使用验证码，检查 https 头部的 refer，使用 token。

## [H5 和 native 的交互：JSBridge](https://mp.weixin.qq.com/s/lJJjbmuOZXE25I7FIz7OVg)
* 概念：在Hybrid（混合开发）模式下，H5会经常需要使用Native的功能，比如打开二维码扫描、调用原生页面、获取用户信息等，同时Native也需要向Web端发送推送、更新状态等，而JavaScript是运行在单独的JS Context中（Webview容器、JSCore等），与原生有运行环境的隔离，所以需要有一种机制实现Native端和Web端的双向通信，这就是JSBridge：以JavaScript引擎或Webview容器作为媒介，通过协定协议进行通信，实现Native端和Web端双向通信的一种机制。通过JSBridge，Web端可以调用Native端的Java接口，同样Native端也可以通过JSBridge调用Web端的JavaScript接口，实现彼此的双向调用。
* 原理：Web端和Native可以类比于Client/Server模式，Web端调用原生接口时就如同Client向Server端发送一个请求类似，JSB在此充当类似于HTTP协议的角色，实现JSBridge主要是两点：
    *  JavaScript 调用 Native
        * 拦截Webview请求的URL Schema：URL SCHEME是一种类似于url的链接，是为了方便app直接互相调用设计的，形式和普通的 url 近似，主要区别是 protocol 和 host 一般是自定义的，例如: qunarhy://hy/url?url=ymfe.tech，protocol 是 qunarhy，host 则是 hy。拦截 URL SCHEME 的主要流程是：Web 端通过某种方式（例如 iframe.src）发送 URL Scheme 请求，之后 Native 拦截到请求并根据 URL SCHEME（包括所带的参数）进行相关操作。
        * 向Webview中注入JS API：通过 WebView 提供的接口，向 JavaScript 的 Context（window）中注入对象或者方法，让 JavaScript 调用时，直接执行相应的 Native 代码逻辑，达到 JavaScript 调用 Native 的目的。
    * Native 调用 JavaScript：Native 调用 JavaScript，其实就是执行拼接 JavaScript 字符串，从外部调用 JavaScript 中的方法，因此 JavaScript 的方法必须在全局的 window 上。（闭包里的方法，JavaScript 自己都调用不了，更不用想让 Native 去调用了）。

## 移动端兼容性问题
* ios端兼容input光标高度
* ios端微信h5页面上下滑动时卡顿、页面缺失
* ios键盘唤起，键盘收起以后页面不归位
* 安卓弹出的键盘遮盖文本框
* Vue中路由使用hash模式，开发微信H5页面分享时在安卓上设置分享成功，但是ios的分享异常
* 参考：
    * https://mp.weixin.qq.com/s/4b8VzBkvf-jpYOLoCkiJEg

## 文件切片下载上传
核心思路：利用 Blob.prototype.slice 方法，和数组的 slice 方法相似，文件的 slice 方法可以返回原文件的某个切片。预先定义好单个切片大小，将文件切分为一个个切片，然后借助 http 的可并发性，同时上传多个切片。这样从原本传一个大文件，变成了并发传多个小的文件切片，可以大大减少上传时间。另外由于是并发，传输到服务端的顺序可能会发生变化，因此我们还需要给每个切片记录顺序。服务端负责接受前端传输的切片，并在接收到所有切片后合并所有切片。
* 伪代码：
```js
handleUpload(e) {
    const [file] = e.target.files;
    if (!file) return;
    const size = 10 * 1024 * 1024; 
    const fileChunkList = [];
    let cur = 0;
    while (cur < file.size) {
        fileChunkList.push({ file: file.slice(cur, cur + size) });
        cur += size;
    }
    let data = fileChunkList.map(({ _file }, index) => ({
        chunk: _file,
        // 文件名 + 数组下标
        hash: file.name + "-" + index
    }));


    const requestList = data.map(({ chunk，hash }) => {
       const formData = new FormData();
       formData.append("chunk", chunk);
       formData.append("hash", hash);
       formData.append("filename", this.container.file.name);
       return { formData };
     }).map(({ formData }) =>
       this.request({
         url: "http://localhost:3000",
         data: formData
       })
     );
    await Promise.all(requestList);// 并发上传
    await this.mergeRequest(); // 发送合并请求
}
```
* 服务端何时合并切片：前端在每个切片中都携带切片最大数量的信息，当服务端接受到这个数量的切片时自动合并。或者也可以额外发一个请求，主动通知服务端进行切片的合并。
* 显示上传进度：XMLHttpRequest 原生支持上传进度的监听，xhr.upload.onprogress = onProgress;
* 断点续传：服务端保存已上传的切片 hash，前端每次上传前向服务端获取已上传的切片，所以必须有一个唯一的hash。spark-md5 库，它可以根据文件内容计算出文件的 hash 值。另外考虑到如果上传一个超大文件，读取文件内容计算 hash 是非常耗费时间的，并且会引起 UI 的阻塞，导致页面假死状态，所以我们使用 web-worker 在 worker 线程计算 hash，这样用户仍可以在主界面正常的交互。
* 参考: https://juejin.cn/post/7255189826226602045

## 文件切片下载
传统的文件下载方式对于大文件来说存在性能问题。当用户请求下载一个大文件时，服务器需要将整个文件发送给客户端。这会导致以下几个问题：
* 较长的等待时间：大文件需要较长的时间来传输到客户端，用户需要等待很长时间才能开始使用文件。
* 网络阻塞：由于下载过程中占用了网络带宽，其他用户可能会遇到下载速度慢的问题。
* 断点续传困难：如果下载过程中出现网络故障或者用户中断下载，需要重新下载整个文件，无法继续之前的下载进度。
实现客户端切片下载的基本方案如下：
* 服务器端将大文件切割成多个切片，并为每个切片生成唯一的标识符。
* 客户端发送请求获取切片列表，同时开始下载第一个切片。
* 客户端在下载过程中，根据切片列表发起并发请求下载其他切片，并逐渐拼接合并下载的数据。
* 当所有切片都下载完成后，客户端将下载的数据合并为完整的文件。
```js
function downloadFile() {
  // 发起文件下载请求
  fetch('/download', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => {
      const totalSize = data.totalSize;
      const totalChunks = data.totalChunks;

      let downloadedChunks = 0;
      let chunks = [];

      // 下载每个切片
      for (let chunkNumber = 0; chunkNumber < totalChunks; chunkNumber++) {
        fetch(`/download/${chunkNumber}`, {
          method: 'GET',
        })
          .then(response => response.blob())
          .then(chunk => {
            downloadedChunks++;
            chunks.push(chunk);

            // 当所有切片都下载完成时
            if (downloadedChunks === totalChunks) {
              // 合并切片
              const mergedBlob = new Blob(chunks);

              // 创建对象 URL，生成下载链接
              const downloadUrl = window.URL.createObjectURL(mergedBlob);

              // 创建 <a> 元素并设置属性
              const link = document.createElement('a');
              link.href = downloadUrl;
              link.setAttribute('download', 'file.txt');

              // 模拟点击下载
              link.click();

              // 释放资源
              window.URL.revokeObjectURL(downloadUrl);
            }
          });
      }
    })
    .catch(error => {
      console.error('文件下载失败:', error);
    });
}
```

## 理解邮件传输协议（SMTP、POP3、IMAP、MIME）
电子邮件协议有SMTP、POP3、IMAP4，它们都隶属于TCP/IP协议簇，默认状态下，分别通过TCP端口25、110和143建立连接。
* SMTP: SMTP（Simple Mail Transfer Protocol，简单邮件传输协议）定义了邮件客户端与SMTP服务器之间，以及两台SMTP服务器之间发送邮件的通信规则 。SMTP协议属于TCP/IP协议族，通信双方采用一问一答的命令/响应形式进行对话，且定了对话的规则和所有命令/响应的语法格式。SMTP协议中一共定了18条命令，发送一封电子邮件的过程通常只需要其中的6条命令即可完成发送邮件的功能。
* POP3: POP邮局协议负责从邮件服务器中检索电子邮件。邮件服务提供商专门为每个用户申请的电子邮箱提供了专门的邮件存储空间，SMTP服务器将接收到的电子邮件保存到相应用户的电子邮箱中。用户要从邮件服务提供商提供的电子邮箱中获取自己的电子邮件，就需要通过邮件服务提供商的POP3邮件服务器来帮助完成。POP3(Post Office Protocol 邮局协议的第三版本)协议定义了邮件客户端程序与POP3服务器进行通信的具体规则和细节。
* IMAP:  IMAP（Internet Message Access Protocol）协议是对POP3协议的一种扩展，定了邮件客户端软件与邮件服务器的通信规则。IMAP协议在RFC2060文档中定义，目前使用的是第4个版本，所以也称为IMAP4。IMAP协议相对于POP3协议而言，它定了更为强大的邮件接收功能，主要体现在以下一些方面：1.IMAP具有摘要浏览功能，可以让用户在读完所有邮件的主题、发件人、大小等信息后，再由用户做出是否下载或直接在服务器上删除的决定。2.IMAP可以让用户有选择性地下载邮件附件。例如一封邮件包含3个附件，如果用户确定其中只有2个附件对自已有用，就可只下载这2个附件，而不必下载整封邮件，从而节省了下载时间。3.IMAP可以让用户在邮件服务器上创建自己的邮件夹，分类保存各个邮件。
* MIME: 早期人们在使用电子邮件时，都是使用普通文本内容的电子邮件内容进行交流，由于互联网的迅猛发展，人们已不满足电子邮件仅仅是用来交换文本信息，而希望使用电子邮件来交换更为丰富多彩的多媒体信息，例如，在邮件中嵌入图片、声音、动画和附件等二进制数据。但在以往的邮件发送协议RFC822文档中定义，只能发送文本信息，无法发送非文本的邮件，针对这个问题，人们后来专门为此定义了MIME（Multipurpose Internet Mail Extension，多用途Internet邮件扩展）协议。
* 参考: https://www.cnblogs.com/diegodu/p/4097202.html

## Vite为什么更快？

Vite 相比传统构建工具（如 Webpack）更快🚀，主要得益于以下几个核心特性：

- 基于原生 ES 模块（ESM）：Vite 利用浏览器原生的 ES 模块，在开发模式下`按需加载`模块，避免了整体打包，从而减少了启动时间。它通过只编译实际修改的文件，提升了开发过程中的反馈速度。
- 高效的热模块替换（HMR）：Vite 在开发模式下利用原生 ES 模块实现模块级的热更新。当文件发生变化时，Vite 只会重新加载发生变化的模块，而不是重新打包整个应用，极大提高了热更新的速度。
- 使用 esbuild 进行快速编译：Vite 默认使用 esbuild 作为编译工具，相比传统的 JavaScript 编译工具（如 Babel、Terser），esbuild 提供显著的性能提升，能够快速完成代码转换和压缩，从而加速开发和构建过程。
- 现代 JavaScript 特性支持：Vite 在生产环境中使用 Rollup 构建，支持优秀的树摇和代码拆分，有效减小构建体积。同时，Vite 利用现代浏览器特性（如动态导入、ES2015+ 模块），减少了 polyfill 的使用，提升了加载速度。
- 预构建和缓存：Vite 在开发时会预构建常用依赖（如 Vue、React），并将其转换为浏览器可执行的格式，避免每次启动时重新编译。同时，Vite 会缓存这些预构建的依赖，并在启动时复用缓存，从而加快启动速度。

## vite中如何使用环境变量？

根据当前的代码环境变化的变量就叫做**环境变量**。比如，在生产环境和开发环境将BASE_URL设置成不同的值，用来请求不同的环境的接口。

Vite内置了 `dotenv` 这个第三方库， dotenv会自动读取 `.env` 文件， dotenv 从你的 `环境目录` 中的下列文件加载额外的环境变量：

> .env # 所有情况下都会加载
> .env.[mode] # 只在指定模式下加载

默认情况下

- `npm run dev` 会加载 `.env` 和 `.env.development` 内的配置
- `npm run build` 会加载 `.env` 和 `.env.production` 内的配置
- `mode` 可以通过命令行 `--mode` 选项来重写。
  环境变量需以 VITE\_ 前缀定义，且通过 `import.meta.env` 访问。

示例：
.env.development：

```js
VITE_API_URL = 'http://localhost:3000'
```

在代码中使用：

```js
console.log(import.meta.env.VITE_API_URL) // http://localhost:3000
```

> 参考博文：[vite中环境变量的使用与配置](https://juejin.cn/post/7172012247852515335)

## vite如何实现根据不同环境(qa、dev、prod)加载不同的配置文件？

在 Vite 中，根据不同环境设置不同配置的方式，类似于 Webpack 时代的配置方法，但更加简化。Vite 使用 `defineConfig` 函数，通过判断 `command` 和 `mode` 来加载不同的配置。

- **通过 `defineConfig` 动态配置：**

Vite 提供的 `defineConfig` 函数可以根据 `command` 来区分开发环境（ `serve` ）和生产环境（ `build` ），并返回不同的配置。

```javascript
import { defineConfig } from 'vite'
import viteBaseConfig from './vite.base.config'
import viteDevConfig from './vite.dev.config'
import viteProdConfig from './vite.prod.config'

export default defineConfig(({ command, mode, ssrBuild }) => {
  if (command === 'serve') {
    // 开发环境独有配置
    return {
      ...viteBaseConfig,
      ...viteDevConfig,
    }
  } else {
    // 生产环境独有配置
    return {
      ...viteBaseConfig,
      ...viteProdConfig,
    }
  }
})
```

- **创建不同的配置文件**

`vite.base.config.ts` ：基础配置，适用于所有环境。

```javascript
import {
    defineConfig
} from "vite";
export default defineConfig({
    // 基础配置->使用所有场景
    return {
        plugins: [
            vue()
        ],
    }
});
```

`vite.dev.config.ts` ：开发环境配置。

```javascript
import { defineConfig } from 'vite'
export default defineConfig({
  // 开发环境专有配置
})
```

`vite.prod.config.ts` ：生产环境配置。

```javascript
import { defineConfig } from 'vite'
export default defineConfig({
  // 生产环境专有配置
})
```

> 参考博文：[vite指定配置文件及其在多环境下的配置集成方案](https://juejin.cn/post/7172009616967942175)

## 简述Vite的依赖预加载机制。

Vite 的依赖预构建机制通过在开发模式下提前处理常用依赖（如 Vue、React 等），将这些依赖转换为浏览器可以直接执行的格式。这避免了每次启动时重新编译这些依赖，显著提升了启动速度。预构建的依赖被缓存，并在后续启动时复用缓存，进一步加速了开发过程中的构建和启动时间。

具体来说，它的工作原理如下：

- **依赖识别和路径补全**： Vite 会首先识别项目中需要的依赖，并对非绝对路径或相对路径的引用进行路径补全。比如，`Vue` 的加载路径会变为 `node_modules/.vite/deps/Vue.js?v=1484ebe8`，这一路径显示了 Vite 在 `node_modules/.vite/deps` 文件夹下存放了经过预处理的依赖文件。
- **转换成 ES 模块**： 一些第三方包（特别是遵循 CommonJS 规范的包）在浏览器中无法直接使用。为了应对这种情况，Vite 会使用 **esbuild** 工具将这些依赖转换为符合 ES 模块规范的代码。转换后的代码会被存放在 `node_modules/.vite/deps` 文件夹下，这样浏览器就能直接识别并加载这些依赖。
- **统一集成 ES 模块**： Vite 会对每个包的不同模块进行统一集成，将各个分散的模块（如不同的 ES 函数或组件）合并成一个或几个文件。这不仅减少了浏览器发起多个请求的次数，还能够加快页面加载速度。

> 参考博文：[vite的基础使用及其依赖预加载机制](https://juejin.cn/post/7172007612379054093#heading-3)、[手写vite让你深刻了解Vite的文件加载原理](https://juejin.cn/post/7178803290820804667)

## vite中如何加载、处理静态资源？

**静态资源目录（public 目录）**：

- 静态资源可以放在 `public` 目录下，这些文件不会经过构建处理，直接按原样复制到输出目录。在开发时可以通过 `/` 路径直接访问，如 `/icon.png`。
- `public` 目录可通过 `vite.config.js` 中的 `publicDir` 配置项修改。

**资源引入**：

- **图片、字体、视频**：通过 `import` 引入，Vite 会自动将其处理为 URL 并生成带哈希值的文件名。在开发时，引用会是根路径（如 `/img.png`），在生产构建后会是如 `/assets/img.2d8efhg.png` 的路径。
- **CSS、JS**：CSS 会被自动注入到页面中，JS 按模块处理。

**强制作为 URL 引入**：通过 `?url` 后缀可以显式强制将某些资源作为 URL 引入。

```js
import imgUrl from './img.png?url'
```

**强制作为原始内容引入**：通过 `?raw` 后缀将文件内容作为字符串引入。

`new URL()` ：通过 `import.meta.url` 可以动态构建资源的 URL，这对于一些动态路径很有用。

```js
const imgUrl = new URL('./img.png', import.meta.url).href
document.getElementById('hero-img').src = imgUrl
```

> 参考博文：[vite中静态资源（css、img、svg等）的加载机制及其相关配](https://juejin.cn/post/7173467405522305055)

## 如何在Vite项目中引入CSS预处理器?

在 Vite 中使用 CSS 预处理器（如 Sass、Less）是非常简单的，Vite 默认支持这些预处理器，我们只需要安装相应的依赖即可。

安装依赖：

```js
npm install sass--save - dev
```

在 Vue 组件中使用：

```vue
<style lang="scss">
$primary-color: #42b983;
body {
  background-color: $primary-color;
}
</style>
```

此外，我们可以通过在vite的 `preprocessorOptions` 中进行配置，使用CSS 预处理器的一些强大功能。

对于 Less，假如我们需要在项目中全局使用某些变量，我们可以在 `vite.config.js` 中配置 `globalVars` ，使得变量在所有文件中无需单独引入：

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      less: {
        globalVars: {
          blue: '#1CC0FF', // 定义全局变量
        },
      },
    },
  },
})
```

一旦配置了全局变量，我们就可以在任何 Vue 组件中直接使用它，无需再次引入：

```vue
<style scoped lang="less">
.wrap {
  background: red;
  color: @blue; // 使用全局变量
}
</style>
```

> 参考博文：[vite中如何更优雅的使用css](https://juejin.cn/post/7175366648659411000)、[Vite中预处理器(如less)的配置](https://juejin.cn/post/7177549666291515447)、[使用postcss完善vite项目中的css配置](https://juejin.cn/post/7178454300572516409)

## vite中可做的项目优化有哪些？

1. 启用 Gzip/Brotli 压缩

使用 `vite-plugin-compression` 插件开启 Gzip 或 Brotli 压缩，可以有效减小传输的文件体积，提升加载速度。

安装依赖：

```javascript
npm install vite - plugin - compression--save - dev
```

配置示例：

```javascript
import compression from 'vite-plugin-compression'
export default defineConfig({
  plugins: [
    compression({
      algorithm: 'gzip', // 或 'brotli' 压缩
      threshold: 10240, // 文件大于 10KB 时启用压缩
    }),
  ],
})
```

> 参考博文：[vite打包优化vite-plugin-compression的使用](https://juejin.cn/post/7222901994840244279)

2. 代码分割

   - 路由分割

使用动态导入实现按需加载，减小初始包的体积，提高页面加载速度。

```javascript
const module = import('./module.js') // 动态导入
```

或者在路由中使用懒加载：

```javascript
const MyComponent = () => import('./MyComponent.vue')
```

   - 手动控制分包

在 Vite 中，你可以通过配置 Rollup 的 `manualChunks` 选项来手动控制如何分割代码。这个策略适用于想要将特定的依赖或模块提取成单独的 chunk 文件。

```javascript
import { defineConfig } from 'vite'
export default defineConfig({
  build: {
    minify: false,
    // 在这里配置打包时的rollup配置
    rollupOptions: {
      manualChunks: (id) => {
        if (id.includes('node_modules')) {
          return 'vendor'
        }
      },
    },
  },
})
```

> 参考博文：[Vite性能优化之分包策略](https://juejin.cn/post/7177982374259949624)

3. 图片优化

使用 `vite-plugin-imagemin` 插件对项目中的图片进行压缩，减少图片体积，提升加载速度。

```javascript
npm install vite - plugin - imagemin--save - dev
```

```javascript
export default defineConfig({
  plugins: [
    ViteImagemin({
      gifsicle: {
        optimizationLevel: 3,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 85,
      },
      pngquant: {
        quality: [0.65, 0.9],
      },
    }),
  ],
})
```

4. 依赖优化

配置 Vite 的 `optimizeDeps` 选项，提前预构建常用依赖，减少开发环境下的启动时间。

```javascript
export default defineConfig({
  optimizeDeps: {
    include: ['lodash', 'vue', 'react'], // 预构建依赖
  },
})
```

> 参考博文：[vite的基础使用及其依赖预加载机制](https://juejin.cn/post/7172007612379054093#heading-3)

## 简述vite插件开发流程？

Vite 插件开发基于 Rollup 插件系统，因此其生命周期和钩子与 Rollup 插件非常相似。以下是开发流程和关键步骤：

1. **理解插件生命周期**
Vite 插件有一系列生命周期钩子，每个钩子对应不同的功能需求，主要钩子包括：

- **config**：用于修改 Vite 配置，通常在构建或开发过程中使用。
- **configureServer**：用于修改开发服务器的行为，如自定义请求处理。
- **transform**：对文件内容进行转换，适用于文件类型转换或代码处理。
- **buildStart** 和 **buildEnd**：在构建过程开始和结束时触发，适用于日志记录或优化操作。

插件开发的核心是根据具体需求，在合适的生命周期钩子中实现业务逻辑。

2. **插件基本结构**

Vite 插件的基本结构如下：

```javascript
export default function myVitePlugin() {
  return {
    name: 'vite-plugin-example', // 插件名称
    config(config) {
      // 修改 Vite 配置
    },
    configureServer(server) {
      // 修改开发服务器行为
    },
    transform(src, id) {
      // 对文件内容进行转换
    },
  }
}
```

插件对象必须包含一个 `name` 属性，用于标识插件，还可以根据需求实现其他钩子。

3. **插件开发**

在插件开发过程中，根据需求实现不同的钩子逻辑。例如，假设我们需要创建一个插件来处理自定义文件类型并将其转换为 JavaScript：

```javascript
const fileRegex = /\.(my-file-ext)$/

export default function transformFilePlugin() {
  return {
    name: 'vite-plugin-transform-file',
    transform(src, id) {
      if (fileRegex.test(id)) {
        return {
          code: compileFileToJS(src), // 将文件内容转换为 JavaScript
          map: null, // 可以返回 source map
        }
      }
    },
  }
}
```

- **transform**：此钩子对符合 `fileRegex` 正则表达式的文件（`.my-file-ext`）进行转换，并返回转换后的 JavaScript 代码。

4. **插件使用**

插件开发完成后，可以在 Vite 配置中使用：

```javascript
import transformFilePlugin from 'vite-plugin-transform-file'

export default {
  plugins: [transformFilePlugin()],
}
```

5. **发布插件**

开发完成后，插件可以通过 npm 发布，或者将其托管在 GitHub 上，方便团队或社区使用。

> 参考博文：[https://juejin.cn/post/7270528132167417915](https://juejin.cn/post/7270528132167417915)


## 如何在Vite中配置代理？

在 Vite 中配置代理可以通过 `server.proxy` 选项来实现。以下是一个示例配置：

```javascript
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      // 代理 /api 请求到目标服务器
      '/api': {
        target: 'http://localhost:5000', // 目标服务器地址
        changeOrigin: true, // 修改请求头中的 Origin 字段为目标服务器的 origin
        secure: false, // 是否允许 HTTPS 请求
        rewrite: (path) => path.replace(/^\/api/, ''), // 重写请求路径，将 /api 替换为空
      },

      // 代理某些静态资源请求
      '/assets': {
        target: 'http://cdn-server.com', // 目标是静态资源服务器
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/assets/, '/static'), // 将 /assets 路径重写为 /static
      },
    },
  },
})
```

## Vite如何集成TypeScript？如何配置？

Vite 对 TypeScript 提供了开箱即用的支持，无需额外安装插件。

我们创建一个 `index.html` 文件并引入 `main.ts` 文件：

```javascript
<script src="./main.ts" type="module">
  {' '}
</script>
```

在 `main.ts` 中，可以写入一些 TypeScript 代码：

```javascript
let tip: string = "这是一个vite项目，使用了ts语法";
console.log('tip: ', tip);
```

运行 `vite` 后，可以看到控制台输出内容，表明 Vite 天生支持 TypeScript。

在 Vite 项目中，虽然默认支持 TypeScript，但 Vite 本身不会阻止编译时出现 TypeScript 错误。为了更严格的类型检查和错误提示，我们需要配置 TypeScript。

- 添加 TypeScript 配置（如果没有）

通过以下命令生成 `tsconfig.json` 配置文件

```plain
npx tsc --init
```

创建好 `tsconfig.json` 后，Vite 会根据该配置文件来编译 TypeScript。

- 强化 TypeScript 错误提示

Vite 默认不会阻止编译时的 TypeScript 错误。如果我们想要在开发时严格检查 TypeScript 错误并阻止编译，可以使用 `vite-plugin-checker` 插件。

```javascript
npm i vite - plugin - checker--save - dev
```

然后在 `vite.config.ts` 中引入并配置该插件：

```typescript
// vite.config.ts
import checker from 'vite-plugin-checker'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [checker({ typescript: true })],
})
```

这样，任何 TypeScript 语法错误都会在控制台显示，并阻止编译。

- 打包时进行 TypeScript 检查

虽然 Vite 只会执行 `.ts` 文件的转译，而不会执行类型检查，但我们可以通过以下方式确保在打包时进行 TypeScript 类型检查。

修改 `package.json` 配置

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build"
  }
}
```

`tsc --noEmit` 会执行类型检查，但不会生成编译后的文件。如果存在类型错误，打包过程会被阻止。

- TypeScript 智能提示

Vite 默认为 `import.meta.env` 提供了类型定义，但是对于自定义的 `.env` 文件，TypeScript 的智能提示默认不生效。为了实现智能提示，可以在 `src` 目录下创建一个 `env.d.ts` 文件：

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_HAHA: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

> 参考博文:https://juejin.cn/post/7177210200330829885

## 什么是 Webpack？它的作用是什么？

Webpack 是一个开源的 **前端静态模块打包工具**，主要用于将现代 JavaScript 应用中的各种资源（代码、样式、图片等）转换为优化的静态文件。它是现代前端开发的核心工具之一，尤其在复杂项目中扮演着关键角色。

**Webpack 的核心作用**

1. **模块化支持**

   - **解决问题**：将代码拆分为多个模块（文件），管理依赖关系。
   - **支持语法**：

     - ES Modules ( `import/export` )
     - CommonJS ( `require/module.exports` )
     - AMD 等模块化方案。

```javascript
// 模块化开发
import Header from './components/Header.js'
import styles from './styles/main.css'
```

2. **资源整合**
   - **处理非 JS 文件**：将 CSS、图片、字体、JSON 等资源视为模块，统一管理。

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg)$/,
        type: 'asset/resource',
      },
    ],
  },
}
```

3. **代码优化**

   - **功能**：

     - **Tree Shaking**：删除未使用的代码。
     - **代码分割（Code Splitting）**：按需加载代码，减少首屏体积。
     - **压缩**：减小文件体积，提升加载速度。

```javascript
// 动态导入实现按需加载
button.addEventListener('click', () => {
  import('./module.js').then((module) => module.run())
})
```

4. **开发工具集成**

   - **功能**：

     - **热更新（HMR）**：实时预览代码修改效果。
     - **Source Map**：调试时映射压缩代码到源代码。
     - **本地服务器**：快速启动开发环境。

```javascript
devServer: {
        hot: true, // 启用热更新
        open: true, // 自动打开浏览器
    },
    devtool: 'source-map', // 生成 Source Map
```

5. **生态扩展**
   - **Loader**：处理特定类型文件（如 `.scss` → `.css` ）。
   - **Plugin**：优化构建流程（如生成 HTML、压缩代码）。

```javascript
plugins: [
    new HtmlWebpackPlugin({
        template: './src/index.html'
    }),
    new MiniCssExtractPlugin(),
],
```

**Webpack 的工作流程**

1. **入口（Entry）**：从指定文件（如 `index.js`）开始分析依赖。
2. **依赖图（Dependency Graph）**：递归构建模块间的依赖关系。
3. **加载器（Loaders）**：转换非 JS 资源（如编译 Sass、处理图片）。
4. **插件（Plugins）**：在构建生命周期中执行优化任务。
5. **输出（Output）**：生成优化后的静态文件（如 `bundle.js`）。

**与其他工具对比**
| **工具** | **定位** | **与 Webpack 的区别** |
|----------------|-----------------------------|-------------------------------------------|
| Gulp/Grunt | 任务运行器（Task Runner） | 处理文件流，但无模块化支持 |
| Rollup | 库打包工具 | 更适合库开发，Tree Shaking 更激进 |
| Vite | 新一代构建工具 | 基于原生 ESM，开发环境更快，生产依赖 Rollup |

**适用场景**

- **单页应用（SPA）**：如 React、Vue、Angular 项目。
- **复杂前端工程**：多页面、微前端架构。
- **静态网站生成**：结合 Markdown、模板引擎使用。

Webpack 通过 **模块化整合**、**代码优化** 和 **开发效率提升**，解决了前端工程中资源管理混乱、性能瓶颈和开发体验差的问题。它不仅是打包工具，更是现代前端工程化的基础设施。

## 如何使用 Webpack 配置多环境的不同构建配置？

在 Webpack 中配置多环境（如开发环境、测试环境、生产环境）的构建配置，可以通过 **环境变量注入** 和 **配置合并** 的方式实现。

**步骤 1：安装依赖工具**

```bash
npm install webpack-merge cross-env --save-dev
```

- **webpack-merge**：用于合并基础配置和环境专属配置。
- **cross-env**：跨平台设置环境变量（兼容 Windows 和 macOS/Linux）。

**步骤 2：创建配置文件结构**

```
project/
├── config/
│   ├── webpack.common.js    # 公共配置
│   ├── webpack.dev.js       # 开发环境配置
│   └── webpack.prod.js      # 生产环境配置
├── src/
│   └── ...                  # 项目源码
└── package.json
```

**步骤 3：编写公共配置 ( `webpack.common.js` )**

```javascript
// config/webpack.common.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}
```

**步骤 4：编写环境专属配置**

开发环境 ( `webpack.dev.js` )

```javascript
// config/webpack.dev.js
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const webpack = require('webpack')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    hot: true,
    open: true,
    port: 3000,
  },
  plugins: [
    // 注入环境变量（可在代码中通过 process.env.API_URL 访问）
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify('https://dev.api.com'),
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
})
```

生产环境 ( `webpack.prod.js` )

```javascript
// config/webpack.prod.js
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const webpack = require('webpack')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimizer: [
      '...', // 保留默认的 JS 压缩配置
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify('https://prod.api.com'),
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
})
```

**步骤 5：配置 `package.json` 脚本**

```json
{
  "scripts": {
    "start": "cross-env NODE_ENV=development webpack serve --config config/webpack.dev.js",
    "build:dev": "cross-env NODE_ENV=development webpack --config config/webpack.dev.js",
    "build:prod": "cross-env NODE_ENV=production webpack --config config/webpack.prod.js"
  }
}
```

**步骤 6：在代码中使用环境变量**

```javascript
// src/index.js
console.log('当前环境:', process.env.NODE_ENV)
console.log('API 地址:', process.env.API_URL)

// 根据不同环境执行不同逻辑
if (process.env.NODE_ENV === 'development') {
  console.log('这是开发环境')
} else {
  console.log('这是生产环境')
}
```

**步骤 7：运行命令**

```bash
# 启动开发服务器（热更新）
npm run start

# 构建开发环境产物
npm run build:dev

# 构建生产环境产物
npm run build:prod
```

**扩展：支持更多环境（如测试环境）**

1. 创建 `webpack.stage.js`

```javascript
// config/webpack.stage.js
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const webpack = require('webpack')

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify('https://stage.api.com'),
      'process.env.NODE_ENV': JSON.stringify('staging'),
    }),
  ],
})
```

2. 添加 `package.json` 脚本

```json
{
  "scripts": {
    "build:stage": "cross-env NODE_ENV=staging webpack --config config/webpack.stage.js"
  }
}
```

| **配置项**   | **开发环境**          | **生产环境**           | **测试环境**            |
| ------------ | --------------------- | ---------------------- | ----------------------- |
| `mode`       | `development`         | `production`           | `production`            |
| `devtool`    | `eval-source-map`     | `source-map`           | `source-map`            |
| `devServer`  | ✅ 启用               | ❌ 不启用              | ❌ 不启用               |
| **代码压缩** | ❌ 不压缩             | ✅ CSS/JS 压缩         | ✅ CSS/JS 压缩          |
| **环境变量** | `API_URL=dev.api.com` | `API_URL=prod.api.com` | `API_URL=stage.api.com` |

## Webpack 的核心概念有哪些？

Webpack 的核心概念是理解其工作原理和配置的基础，以下是它们的简要解释：

**1. 入口（Entry）**

- **作用**：定义 Webpack **构建依赖图的起点**，通常为项目的主文件（如 `index.js`）。

```javascript
entry: './src/index.js', // 单入口
    entry: {
        app: './src/app.js',
        admin: './src/admin.js'
    }, // 多入口
```

**2. 出口（Output）**

- **作用**：指定打包后的资源**输出位置和命名规则**。

```javascript
output: {
    filename: '[name].bundle.js', // 输出文件名（[name] 为入口名称）
    path: path.resolve(__dirname, 'dist'), // 输出目录（绝对路径）
    clean: true, // 自动清理旧文件（Webpack 5+）
}
```

**3. 加载器（Loaders）**

- **作用**：让 Webpack **处理非 JavaScript 文件**（如 CSS、图片、字体等），将其转换为有效模块。

```javascript
module: {
    rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }, // 处理 CSS
        {
            test: /\.(png|svg)$/,
            type: 'asset/resource'
        }, // 处理图片（Webpack 5+）
    ],
}
```

**4. 插件（Plugins）**

- **作用**：扩展 Webpack 功能，干预**整个构建流程**（如生成 HTML、压缩代码、提取 CSS）。

```javascript
plugins: [
  new HtmlWebpackPlugin({
    template: './src/index.html',
  }), // 生成 HTML
  new MiniCssExtractPlugin(), // 提取 CSS 为独立文件
]
```

**5. 模式（Mode）**

- **作用**：预设优化策略，区分**开发环境**（`development`）和**生产环境**（`production`）。

```javascript
mode: 'production', // 启用代码压缩、Tree Shaking 等优化
```

**6. 模块（Modules）**

- **作用**：Webpack 将每个文件视为**模块**（如 JS、CSS、图片），通过依赖关系构建依赖图。
- **特点**：支持 ESM、CommonJS、AMD 等模块化语法。

**7. 代码分割（Code Splitting）**

- **作用**：将代码拆分为多个文件（chunks），实现**按需加载**或**并行加载**，优化性能。
- **实现方式**：
  - 动态导入（`import()`）
  - 配置 `optimization.splitChunks`

**8. Tree Shaking**

- **作用**：通过静态分析**移除未使用的代码**，减小打包体积。
- **前提**：使用 ES Module（`import/export`），并启用生产模式（`mode: 'production'`）。

## 如何在 Webpack 中实现 CSS 和 Sass 的处理？

在 Webpack 中处理 CSS 和 Sass（SCSS）需要配置相应的加载器（loaders）和插件（plugins）。

**1. 安装所需依赖**

```bash
npm install --save-dev \
  style-loader \
  css-loader \
  sass-loader \
  sass \
  postcss-loader \
  autoprefixer \
  mini-css-extract-plugin \
  css-minimizer-webpack-plugin
```

- **核心依赖**：
  - `style-loader`：将 CSS 注入 DOM。
  - `css-loader`：解析 CSS 文件中的 `@import` 和 `url()`。
  - `sass-loader`：将 Sass/SCSS 编译为 CSS。
  - `sass`：Sass 编译器（Dart Sass 实现）。
- **可选工具**：
  - `postcss-loader` 和 `autoprefixer`：自动添加浏览器前缀。
  - `mini-css-extract-plugin`：提取 CSS 为独立文件（生产环境推荐）。
  - `css-minimizer-webpack-plugin`：压缩 CSS（生产环境推荐）。

**2. 基础 Webpack 配置**
在 `webpack.config.js` 中添加以下规则和插件：

**配置 CSS 和 SCSS 处理**

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

module.exports = {
  module: {
    rules: [
      // 处理 CSS 文件
      {
        test: /\.css$/,
        use: [
          // 开发环境用 style-loader，生产环境用 MiniCssExtractPlugin.loader
          process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader', // 可选：添加浏览器前缀
        ],
      },
      // 处理 SCSS/Sass 文件
      {
        test: /\.(scss|sass)$/,
        use: [
          process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader', // 可选：添加浏览器前缀
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    // 提取 CSS 为独立文件（生产环境）
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],
  optimization: {
    minimizer: [
      // 压缩 CSS（生产环境）
      new CssMinimizerPlugin(),
    ],
  },
}
```

**3. 配置 PostCSS（可选）**
创建 `postcss.config.js` 文件以启用 `autoprefixer` ：

```javascript
module.exports = {
  plugins: [
    require('autoprefixer')({
      // 指定浏览器兼容范围
      overrideBrowserslist: ['last 2 versions', '>1%', 'not dead'],
    }),
  ],
}
```

通过配置 `css-loader` 、 `sass-loader` 和 `MiniCssExtractPlugin` ，Webpack 可以高效处理 CSS 和 Sass。关键点包括：

1. 加载器顺序：从右到左（如 `[sass-loader, css-loader, style-loader]`）。
2. 生产环境提取 CSS：使用 `MiniCssExtractPlugin`。
3. 浏览器兼容性：通过 `postcss-loader` 和 `autoprefixer` 自动处理。

## Webpack 中的入口和出口是什么？

在 Webpack 中，**入口（Entry）** 和 **出口（Output）** 是配置文件中的核心概念，决定了打包的起点和终点。它们共同定义了 Webpack 如何处理代码以及最终生成的资源。

1. **入口（Entry）**
   入口是 Webpack 构建依赖图的起点，它告诉 Webpack：**“从哪个文件开始分析代码的依赖关系？”**

**作用**

- 指定应用程序的起始文件。
- 根据入口文件递归构建依赖关系树。
- 支持单入口（单页面应用）或多入口（多页面应用）。

**配置方式**
在 `webpack.config.js` 中通过 `entry` 属性配置：

```javascript
module.exports = {
  entry: './src/index.js', // 单入口（默认配置）

  // 多入口（多页面应用）
  entry: {
    home: './src/home.js',
    about: './src/about.js',
  },
}
```

**默认行为**

- 如果未手动配置 `entry`，Webpack 默认使用 `./src/index.js` 作为入口。

2. **出口（Output）**
   出口是 Webpack 打包后的资源输出位置，它告诉 Webpack：**“打包后的文件放在哪里？如何命名？”**

**作用**

- 定义打包文件的输出目录和命名规则。
- 处理静态资源的路径（如 CSS、图片等）。

**配置方式**
在 `webpack.config.js` 中通过 `output` 属性配置：

```javascript
const path = require('path')

module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出目录（必须为绝对路径）
    filename: 'bundle.js', // 单入口输出文件名

    // 多入口时，使用占位符确保唯一性
    filename: '[name].[contenthash].js',
    clean: true, // 自动清理旧文件（Webpack 5+）
  },
}
```

**常用占位符**
| 占位符 | 说明 |
|---------------------|-------------------------------|
| `[name]` | 入口名称（如多入口的 `home` ） |
| `[hash]` | 根据构建生成的唯一哈希值 |
| `[contenthash]` | 根据文件内容生成的哈希值 |
| `[chunkhash]` | 根据代码块生成的哈希值 |

## Webpack 中的 Loaders 和 Plugins 有什么区别

在 Webpack 中，**Loaders（加载器）** 和 **Plugins（插件）** 是构建流程中的两大核心概念，它们的作用和职责有明显区别。

**1. 核心区别总结**
| **特性** | **Loaders** | **Plugins** |
|----------------|---------------------------------|------------------------------------|
| **主要作用** | **转换文件内容**（如转译、预处理） | **扩展构建流程**（优化、资源管理、注入环境变量等） |
| **执行时机** | 在模块加载时（文件转换为模块时） | 在整个构建生命周期（从初始化到输出）的各个阶段 |
| **配置方式** | 通过 `module.rules` 数组配置 | 通过 `plugins` 数组配置（需要 `new` 实例化） |
| **典型场景** | 处理 JS/CSS/图片等文件转译 | 生成 HTML、压缩代码、提取 CSS 等全局操作 |
| **依赖关系** | 针对特定文件类型（如 `.scss` ） | 不依赖文件类型，可干预整个构建流程 |

**2. Loaders 的作用与使用**
**核心功能**

- 将非 JavaScript 文件（如 CSS、图片、字体等）**转换为 Webpack 能处理的模块**。
- 对代码进行预处理（如 Babel 转译、Sass 编译）。

**配置示例**

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      // 处理 CSS 文件
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      // 处理 TypeScript 文件
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
      // 处理图片文件
      {
        test: /\.(png|jpg|gif)$/,
        type: 'asset/resource', // Webpack 5 内置方式（替代 file-loader）
      },
    ],
  },
}
```

**常见 Loaders**

- `babel-loader`: 将 ES6+ 代码转译为 ES5。
- `css-loader`: 解析 CSS 中的 `@import` 和 `url()`。
- `sass-loader`: 将 Sass/SCSS 编译为 CSS。
- `file-loader`: 处理文件（如图片）的导入路径。

**3. Plugins 的作用与使用**
**核心功能**

- 扩展 Webpack 的能力，干预构建流程的**任意阶段**。
- 执行更复杂的任务，如代码压缩、资源优化、环境变量注入等。

**配置示例**

```javascript
// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  plugins: [
    // 自动生成 HTML 文件，并注入打包后的资源
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    // 提取 CSS 为独立文件
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],
}
```

**常见 Plugins**

- `HtmlWebpackPlugin`: 生成 HTML 文件并自动引入打包后的资源。
- `MiniCssExtractPlugin`: 将 CSS 提取为独立文件（替代 `style-loader`）。
- `CleanWebpackPlugin`: 清理构建目录（Webpack 5 中可用 `output.clean: true` 替代）。
- `DefinePlugin`: 注入全局常量（如 `process.env.NODE_ENV`）。

**4. 执行流程对比**
**Loaders 的执行流程**

```plaintext
文件资源 (如 .scss) → 匹配 Loader 规则 → 按顺序应用 Loaders → 转换为 JS 模块
```

- **顺序关键**：Loaders 从右到左（或从下到上）执行。
  例如： `use: ['style-loader', 'css-loader', 'sass-loader']` 的执行顺序为：
  `sass-loader` → `css-loader` → `style-loader` 。

**Plugins 的执行流程**

```plaintext
初始化 → 读取配置 → 创建 Compiler → 挂载 Plugins → 编译模块 → 优化 → 输出
```

- **生命周期钩子**：Plugins 通过监听 Webpack 的[生命周期钩子](https://webpack.js.org/api/compiler-hooks/)（如 `emit`、`done`）干预构建流程。

**5. 协作示例**
一个同时使用 Loaders 和 Plugins 的典型场景：

```javascript
// webpack.config.js
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        // Loaders 处理链：sass → css → MiniCssExtractPlugin
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    // Plugin：提取 CSS 为文件
    new MiniCssExtractPlugin(),
    // Plugin：生成 HTML
    new HtmlWebpackPlugin(),
  ],
}
```

## Webpack中, 如何实现按需加载？

在 Webpack 中实现按需加载（代码分割/懒加载）的核心思路是 **将代码拆分为独立 chunk，在需要时动态加载**。

**一、基础方法：动态导入（Dynamic Import）**
通过 `import()` 语法实现按需加载，Webpack 会自动将其拆分为独立 chunk。

**1. 代码中使用动态导入**

```javascript
// 示例：点击按钮后加载模块
document.getElementById('btn').addEventListener('click', async () => {
  const module = await import('./module.js')
  module.doSomething()
})
```

**2. 配置 Webpack**
确保 `webpack.config.js` 的 `output` 配置中包含 `chunkFilename` ：

```javascript
module.exports = {
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].[contenthash].chunk.js', // 动态导入的 chunk 命名规则
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/', // 确保 chunk 的公共路径正确
  },
}
```

**二、框架集成：React/Vue 路由级按需加载**
结合前端框架的路由系统实现组件级懒加载。

**React 示例**

```javascript
import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

const Home = lazy(() => import('./routes/Home'))
const About = lazy(() => import('./routes/About'))

function App() {
  return (
    <Router>
      <Suspense fallback={<div> Loading... </div>}>
        {' '}
        <Switch>
          <Route exact path="/" component={Home} />{' '}
          <Route
            path="/about
        "
            component={About}
          />{' '}
        </Switch>{' '}
      </Suspense>{' '}
    </Router>
  )
}
```

**Vue 示例**

```javascript
const routes = [
  {
    path: '/',
    component: () => import('./views/Home.vue'),
  },
  {
    path: '/about',
    component: () => import('./views/About.vue'),
  },
]
```

**三、优化配置：代码分割策略**
通过 `SplitChunksPlugin` 优化公共代码提取。

**Webpack 配置**

```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all', // 对所有模块进行分割（包括异步和非异步）
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors', // 提取 node_modules 代码为 vendors 块
          priority: 10, // 优先级
          reuseExistingChunk: true,
        },
        common: {
          minChunks: 2, // 被至少两个 chunk 引用的代码
          name: 'common',
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },
  },
}
```

**四、Babel 配置（如需支持旧浏览器）**
安装 Babel 插件解析动态导入语法：

```bash
npm install @babel/plugin-syntax-dynamic-import --save-dev
```

在 `.babelrc` 或 `babel.config.json` 中添加插件：

```json
{
  "plugins": ["@babel/plugin-syntax-dynamic-import"]
}
```

**五、预加载与预取（可选优化）**
通过注释提示浏览器提前加载资源（需结合框架使用）。

**React 示例**

```javascript
const About = lazy(
  () =>
    import(
      /* webpackPrefetch: true */ // 预取（空闲时加载）
      /* webpackPreload: true */ // 预加载（与父 chunk 并行加载）
      './routes/About'
    )
)
```

**六、验证效果**

1. **构建产物分析**：

   - 运行 `npx webpack --profile --json=stats.json` 生成构建报告。
   - 使用 [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) 可视化分析 chunk 分布。

2. **网络请求验证**：
   - 打开浏览器开发者工具，观察触发动态导入时是否加载新 chunk。

## 什么是 Tree Shaking？如何在 Webpack 中启用它？

**Tree Shaking（摇树优化）** 是一种在打包过程中 **移除 JavaScript 项目中未使用代码（Dead Code）** 的优化技术。它的名字形象地比喻为“摇动树以掉落枯叶”，即通过静态代码分析，识别并删除未被引用的模块或函数，从而减小最终打包体积。

**Tree Shaking 的工作原理**

1. **基于 ES Module（ESM）的静态结构**
   ESM 的 `import/export` 是静态声明（代码执行前可确定依赖关系），而 CommonJS 的 `require` 是动态的。只有 ESM 能被 Tree Shaking 分析。
2. **标记未使用的导出**
   打包工具（如 Webpack）通过分析代码，标记未被任何模块导入的导出。
3. **压缩阶段删除**
   结合代码压缩工具（如 Terser）删除这些标记的未使用代码。

**在 Webpack 中启用 Tree Shaking 的步骤**
**1. 使用 ES Module 语法**
确保项目代码使用 `import/export` ，而非 CommonJS 的 `require` 。

```javascript
// ✅ 正确：ESM 导出
export function add(a, b) {
  return a + b
}
export function subtract(a, b) {
  return a - b
}

// ✅ 正确：ESM 导入
import { add } from './math'

// ❌ 错误：CommonJS 导出
module.exports = {
  add,
  subtract,
}
```

**2. 配置 Webpack 的 `mode` 为 `production` **
在 `webpack.config.js` 中设置 `mode: 'production'` ，这会自动启用 Tree Shaking 和代码压缩。

```javascript
module.exports = {
  mode: 'production', // 启用生产模式优化
  // ...
}
```

**3. 禁用模块转换（Babel 配置）**
确保 Babel 不会将 ESM 转换为 CommonJS。在 `.babelrc` 或 `babel.config.json` 中设置：

```json
{
  "presets": [
    ["@babel/preset-env", { "modules": false }] // 保留 ESM 语法
  ]
}
```

**4. 标记副作用文件（可选）**
在 `package.json` 中声明哪些文件有副作用（如全局 CSS、Polyfill），避免被错误删除：

```json
{
  "sideEffects": [
    "**/*.css", // CSS 文件有副作用（影响样式）
    "src/polyfill.js" // Polyfill 有副作用
  ]
}
```

若项目无副作用文件，直接设为 `false` ：

```json
{
  "sideEffects": false
}
```

**5. 显式配置 `optimization.usedExports` **
在 `webpack.config.js` 中启用 `usedExports` ，让 Webpack 标记未使用的导出：

```javascript
module.exports = {
  optimization: {
    usedExports: true, // 标记未使用的导出
    minimize: true, // 启用压缩（删除未使用代码）
  },
}
```

**验证 Tree Shaking 是否生效**
**方法 1：检查打包后的代码**
若未使用的函数（如 `subtract` ）被删除，说明 Tree Shaking 生效：

```javascript
// 打包前 math.js
export function add(a, b) {
  return a + b
}
export function subtract(a, b) {
  return a - b
}

// 打包后（仅保留 add）
function add(a, b) {
  return a + b
}
```

**方法 2：使用分析工具**
通过 [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) 可视化分析打包结果：

```bash
npm install --save-dev webpack-bundle-analyzer
```

配置 `webpack.config.js` ：

```javascript
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  plugins: [new BundleAnalyzerPlugin()],
}
```

运行构建后，浏览器将自动打开分析页面，检查未使用的模块是否被移除。

| **步骤**             | **关键配置**                         | **作用**                     |
| -------------------- | ------------------------------------ | ---------------------------- |
| 使用 ESM 语法        | `import/export`                      | 提供静态分析基础             |
| 设置生产模式         | `mode: 'production'`                 | 自动启用 Tree Shaking 和压缩 |
| 配置 Babel           | `"modules": false`                   | 保留 ESM 结构                |
| 标记副作用文件       | `package.json` 的 `sideEffects` 字段 | 防止误删有副作用的文件       |
| 显式启用 usedExports | `optimization.usedExports: true`     | 标记未使用的导出             |
