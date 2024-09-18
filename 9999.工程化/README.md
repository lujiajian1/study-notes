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
* 使⽤⽴即执⾏函数 IIFE（Immediately-Invoked Function Expression） 的写法。IIFE 会创建⼀个只使⽤⼀次的函数，然后⽴即执⾏；IIFE 可以创建闭包进⾏作⽤域
隔离，从⽽保护私有变量。
```js
const util = (function() {
  const spliter = '#'
  const format = str => spliter + str + spliter
  return {
    format
  }
})
```
* CommonJS 规范: CommonJS 是随着 JS 在服务端的发展⽽发展起来的，Node.js 中的模块系统就是参照 CommonJS 规范实现的。
```js
// a.js
export.a = 'a';

// index.js
const moduleA = require('./a.js');
console.log(moduleA); // {a: 'a'}

```
* AMD: CommonJS 的思想是同步加载，如果在服务器端使⽤模块放在硬盘中性能不会有太⼤影响。但是在浏览器中，模块的加载需要异步加载保证性能。这也就是 AMD （Asynchronous Module Definition） requireJS 是 amd 的⼀种实现。
* CMD: CMD(Common Module Definition) 规范是在 SeaJs 推⼴过程中对模块定义的规范⽽产⽣的，也是⼀种在浏览器环境使⽤的异步模块化规范。CMD 更贴近于 CommonJS Modules/1.1 和 Node Modules 规范。
* EMS: ESM 是 JavaScript 官⽅突出的标准化模块系统。在 ES 2015（ES6）中，直接在语⾔标准层⾯上实现了模块的功能。并且是浏览器和服务端都⽀持的模块化解决⽅案。
![模块化](https://github.com/lujiajian1/study-notes/blob/main/img/module.png)

## 打包格式
* amd – 异步模块定义，⽤于像 RequireJS 这样的模块加载器
* cjs – CommonJS，适⽤于 Node 和 Browserify/Webpack
* es – 将软件包保存为 ES 模块⽂件
* iife – ⼀个⾃动执⾏的功能，适合作为 script 标签。（如果要为应⽤程序创建⼀个捆绑包，您可能想要使⽤它，因为它会使⽂件⼤⼩变⼩。）
* umd – 通⽤模块定义，以 amd，cjs 和 iife 为⼀体

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