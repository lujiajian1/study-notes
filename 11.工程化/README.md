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
