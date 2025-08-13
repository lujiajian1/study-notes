## [微前端](https://juejin.cn/post/6844904162509979662)
一种类似于微服务的架构，它将微服务的理念应用于浏览器端，即将 Web 应用由单一的单体应用转变为多个小型前端应用聚合为一的应用。各个前端应用还可以独立运行、独立开发、独立部署。微前端不是单纯的前端框架或者工具，而是一套架构体系，
* 运维层面的改造：Nginx 路由代理，简单，但是切换会触发刷线
* iframe嵌套：实现简单，天然隔离，但是SEO不友好，兼容性有问题
* NPM方案：在设计时需要将微应用打包成独立的 NPM 包，然后在主应用中引入和使用
* 动态 Script：根据导航进行微应用的切换，切换的过程会动态加载和执行 JS 和 CSS 资源
* Web Components：属于 W3C 的标准，符合微前端技术无关的特性，每个子应用有独立的js和css，需要改造历史代码，成本高
* [single-spa](https://zh-hans.single-spa.js.org/docs/getting-started-overview)
```js
// single-spa-config.js  
// 引入 single-spa 的 NPM 库包
import { registerApplication, start } from 'single-spa';  
  
// Simple usage  
// 简单使用方式，按顺序传递四个参数
registerApplication(  
  // 参数1：微应用名称标识
  'app2',  
  // 参数2：微应用加载逻辑 / 微应用对象，必须返回 Promise
  () => import('src/app2/main.js'),  
  // 参数3：微应用的激活条件
  (location) => location.pathname.startsWith('/app2'),  
  // 参数4：传递给微应用的 props 数据
  { some: 'value' }  
);  
  
// Config with more expressive API  
// 使用对象传递参数，更加清晰，易于阅读和维护，无须记住参数的顺序
registerApplication({  
  // name 参数
  name: 'app1',  
  // app 参数，必须返回 Promise
  app: () => import('src/app1/main.js'),  
  // activeWhen 参数
  activeWhen: '/app1',  
  // customProps 参数
  customProps: {  
    some: 'value',  
  }  
});  
  
start();
```
* [qiankun](https://qiankun.umijs.org/zh)： 对 single-spa 的二次封装，在 single-spa 的基础上提供了更加简单的 API 和配置项，使得开发者能更容易的实现微前端。

## [文件上传](https://juejin.cn/post/6980142557066067982)
* 大文件上传：async-pool 这个库提供的 asyncPool 函数来实现大文件的并发上传。相信有些小伙伴已经了解大文件上传的解决方案，在上传大文件时，为了提高上传的效率，我们一般会使用 Blob.slice 方法对大文件按照指定的大小进行切割，然后通过多线程进行分块上传，等所有分块都成功上传后，再通知服务端进行分块合并。

## UI标准化建设（css标准化、通用UI组件库）组件化（组件开发、npm包、单元测试、组件文档）
项目越来越大，团队越来越多，视觉规范化变得越来越重要。前端的UI标准化建设一般就是两个方向，css标准化和通用UI组件库的搭建。

#### css 标准化建设
具体来说，就是通过编码来表示一个个通用的css rule或者css声明的值，而设计师在视觉稿中标注对应的编码值，开发者只需要设置编码值即可完成css样式的设置。

* 提供全局 sass 变量。将设计同事提供的色卡、投影样式和圆角的编码表，写入 variables.scss。将文字样式等通用样式集，写入 mixin.scss。
* export.module.scss 将变量名导出，可以以Js的形式使用sass变量。
* 将 variables.scss 和 mixin.scss 收敛到统一的入口文件 common.scss 中。gatsby 配置项目中所有.scss 文件自动 import common.scss 。业务 scss 文件使用时无需手动写 import common.scss。

#### 历史代码颜色替换变量方案

1. 通过检索将整个项目中的色值（RGB、RGBA、十六进制）收集后给到UI同事。
2. UI同事对检索收集的所有色值映射到标准化定义的变量上。
3. 将UI映射规则转化为 js map。
```js
// 项目中所有 RGB、RGBA 映射为标准色值变量的 map
let rgbMap = [
  { color: "38,42,51", token: "Text-5" },
  { color: "168,170,173", token: "Text-2" },
  { color: "56,110,231", token: "Brand-6" },
  { color: "210,224,255", token: "Link-2" },
  { color: "240,240,240", token: "Fill-2_5" },
  //.....more....
];
// 项目中所有 十六进制色值 映射为标准色值变量的 map
const hexMap = [
  { token: "Brand-7", color: "#445FE5" },
  { token: "Brand-6", color: "#4C6AFF" },
  { token: "Brand-5", color: "#7088FF" },
  { token: "Brand-4", color: "#94A6FF" },
  { token: "Brand-3", color: "#B7C3FF" },
  //....more....
];
```
4. vscode 的扩展工具【Replace Rules】可以快速高效的按照正则匹配的规则替换色值。下面的代码是依据替换map 生成 Replace Rules 工具的 replacerules。
```js
// .tsx 文件替换色值变量
let exportToken = {
  "Brand-7": "brand7",
  "Brand-6": "brand6",
  //...more....
};

// 生成 【Replace Rules】工具 需要的 setting.json
let colorRules = {
  "replacerules.rules": {},
  "replacerules.rulesets": {
    "Remove lots of stuff": {
      rules: [],
    },
  },
};

const createRgbRules = () => {
  rgbMap.forEach((i) => {
    let rules =
      colorRules["replacerules.rulesets"]["Remove lots of stuff"].rules;
    let colorArr = i.color.split(",");
    const rgbCssKey = "Remove rgb(" + i.color + ") css";
    const rgbTskey = "Remove rgb(" + i.color + ") ts";
    const rgbaCssKey = "Remove rgba(" + i.color + ") css";

    colorRules["replacerules.rules"][rgbCssKey] = {
      find:
        "rgb\\(" +
        colorArr[0] +
        ",\\s*" +
        colorArr[1] +
        ",\\s*" +
        colorArr[2] +
        "\\)",
      replace: "$" + i.token,
      flags: "i",
      languages: ["css", "scss"],
    };
    colorRules["replacerules.rules"][rgbTskey] = {
      find:
        "(\"|')rgb\\(" +
        colorArr[0] +
        ",\\s*" +
        colorArr[1] +
        ",\\s*" +
        colorArr[2] +
        "\\)(\"|')",
      replace: "`${variables." + exportToken[i.token] + "}`",
      flags: "i",
      languages: ["typescript", "typescriptreact"],
    };
    colorRules["replacerules.rules"][rgbaCssKey] = {
      find:
        "rgba\\(" +
        colorArr[0] +
        ",\\s*" +
        colorArr[1] +
        ",\\s*" +
        colorArr[2] +
        ",\\s*([0-9.]+)\\)",
      replace: "rgba($color: $" + i.token + ", $alpha: $1)",
      flags: "i",
      languages: ["css", "scss"],
    };

    colorRules["replacerules.rulesets"]["Remove lots of stuff"].rules =
      rules.concat([rgbCssKey, rgbTskey, rgbaCssKey]);
  });
};

const createHexRules = () => {
  hexMap.forEach((i) => {
    let rules =
      colorRules["replacerules.rulesets"]["Remove lots of stuff"].rules;
    const hexCssKey = "Remove " + i.color + " css";
    const hexTskey = "Remove " + i.color + " ts";

    colorRules["replacerules.rules"][hexCssKey] = {
      find: i.color,
      replace: "$" + i.token,
      flags: "i",
      languages: ["css", "scss"],
    };
    colorRules["replacerules.rules"][hexTskey] = {
      find: "(\"|')" + i.color + "(\"|')",
      replace: "`${variables." + exportToken[i.token] + "}`",
      flags: "i",
      languages: ["typescript", "typescriptreact"],
    };

    colorRules["replacerules.rulesets"]["Remove lots of stuff"].rules =
      rules.concat([hexCssKey, hexTskey]);
  });
};

// 生成 colorRules
createRgbRules();
createHexRules();
```
5. 将生成的 replacerules 写入到 vscode 的 settings.json 中。同时为了快捷执行 Replace Rules 工具的替换命令，可以将替换命令配置快捷键。
```js
// settings.json
{
    "replacerules.rules": {
        "Remove rgb(38,42,51) css": {
            "find": "rgb\\(38,\\s*42,\\s*51\\)",
            "replace": "$Text-5",
            "flags": "i",
            "languages": [
                "css",
                "scss"
            ]
        },
        "Remove rgb(38,42,51) ts": {
            "find": "(\"|')rgb\\(38,\\s*42,\\s*51\\)(\"|')",
            "replace": "`${variables.text5}`",
            "flags": "i",
            "languages": [
                "typescript",
                "typescriptreact"
            ]
        },
        "Remove rgba(38,42,51) css": {
            "find": "rgba\\(38,\\s*42,\\s*51,\\s*([0-9.]+)\\)",
            "replace": "rgba($color: $Text-5, $alpha: $1)",
            "flags": "i",
            "languages": [
                "css",
                "scss"
            ]
        },
        "Remove #445FE5 css": {
            "find": "#445FE5",
            "replace": "$Brand-7",
            "flags": "i",
            "languages": [
                "css",
                "scss"
            ]
        },
        "Remove #445FE5 ts": {
            "find": "(\"|')#445FE5(\"|')",
            "replace": "`${variables.brand7}`",
            "flags": "i",
            "languages": [
                "typescript",
                "typescriptreact"
            ]
        }
        ......
    },
    "replacerules.rulesets": {
        "Remove lots of stuff": {
            "rules": [
                "Remove rgb(38,42,51) css",
                "Remove rgb(38,42,51) ts",
                "Remove rgba(38,42,51) css",
                "Remove #445FE5 css",
                "Remove #445FE5 ts"
                ......
            ]
        }
    }
}
```
```js
// keybindings.json
[
  {
    "key": "ctrl+shift+]",
    "command": "replacerules.runRuleset",
    "when": "editorTextFocus && !editorReadonly",
    "args": {
      "rulesetName": "Remove lots of stuff"
    }
  }
]
```

#### 通用UI组件库建设
大部分组件是基于antd的UI组件库定制化样式，个别比如说新手引导 Guide、icon 是自主开发的组件。

#### 组件文档生成
提供组件的介绍说明。提供组件调用的案例 usage，以及展示演示案例的源码。提供组件的属性列表 propTypes。但是，如果要把这些内容都通过 markdown 去写，不仅耗时，并且不利于维护。为了把更多的精力投入到开发更优质的组件当中，我们需要文档生成自动化。

在解析器中 react-docgen-typescript 是一个简单、功能强大并且社区活跃的工具。所以最后选择利用  react-docgen-typescript 的能力开发自动获取组件注释和类型的脚本，生成组件属性列表的表格。
另外，对于组件使用的案例，可以自动解析展示出案例的源码。采用遍历解析 React.children 生成源码。
组件描述部分支持 Markdown 语法，使用 react-markdown 插件解析展示 Markdown 的内容。

#### 组件库独立打包
为了方便维护，更是为了其他团队使用通用UI组件库，将通用UI组件从项目中独立，通过 rollup 实现独立的打包发布。主要实现的能力有：抽离对全局样式和api层方法的依赖，自动化打包发布脚本，antd类型导出，按需加载，css隔离。

## React 性能优化

#### 背景
* 100+子模块，上万组件，参与编译的源文件4w，项目运行期间加载资源总量超过50M。
* React架构，单页面，显隐控制，层级过深，上层状态的变动，导致 React 重新渲染，行成巨大的性能消耗。
* 重复的 HTTP 请求。
* 长期快速迭代中，大量的重复资源，大量的废弃的代码。

#### 数据驱动、指标先行
* 内存：利用 Electron 能力获取内容大小，并上报到埋点系统。
* HTTP请求数：api 层接口请求前统一处理，统计系统启动后15s/路由切换5s后，发起的请求数目。指标下降，意味着网路资源占用减少，不会阻塞关键接口的返回，避免页面长时间loading，同时也可以减少页面的无效渲染。
* 长任务数：new PerformanceObserver 统计大于 50ms 的任务会被记录为长任务，并上报到埋点系统。
* LCP/FCP时间：使用 Sentry 的指标，统计页面FCP（首次渲染时间：第一个内容元素对用户可见）LCP（主要内容何时对用户可见：页面中最大的可见元素在视窗内完全渲染出来的时间点）。

#### HTTP请求治理
统计应用初始化和模块切换的HTTP请求数，分析每个请求属于哪个业务，耗时多少。
* 重复请求：比如公共服务，比如权限，账号等接口，只需要应用启动的时候请求一次即可，可以使用缓存。缓存的机制，可以根据场景进行不同处理，比如有些接口一分钟缓存，有些数据可以应用生命周期只请求一次，主要取决于时效性。
* 非必要请求：与当前业务无关，延迟到对应模块加载。
* 可聚合请求：比如有些获取详情的接口，只能传id，如果想获取idlist的详情，只能多次请求，这类型可以合并为一个请求，让服务端接口支持传idlist。

最后，应用初始化请求从105个减少到49个。

#### 组件重复渲染治理
统计业务场景关键操作路径下的渲染次数，建立关键操作路径渲染次数指标。优化后渲染次数较少了30%。
* 组件拆分：颗粒度小了，依赖变的清晰，减少不必要的依赖。
* 优化顶层组件组件的 prop/state，合理使用useMemo/useCallback

#### 模块卸载
将长久不使用的模块进行卸载，释放内存。
* 模块的按需加载懒加载：@loadable/component
* 需要保持状态的组件，动态卸载：模块切换中，有些模块是需要永久缓存的，只是通过display:none 隐藏。每个模块加载都会被注册到redux中，设置最大允许缓存模块数目，当超过数目自动清除最久的模块。

#### 重复资源清理
由于业务迭代较快，大部分功能变更较多，很多旧代码未来及清理，故会造成系统的编译/运行负担，隔一段时间组织一次清理活动，对清理多的进行奖励。

#### js拆分
一共减少了15MB的js体积
* webpack optimization splitChunks 对各个模块进行分割，并提取出相同部分代码。
* 三方库的按需加载，比如一些组件库，图标库、可视化引擎库。
* DLL 处理第三方库，提升构建速度。
* 统一第三方库的版本，其他团队有的是通过npm包整合开发的，比如antd的版本可以共用一个，不需要不同团队多次引入打包。
* 条件编译，不同版本的包只引入当前包需要的模块。

#### css 体积优化
css 现状存在的问题
* 体积小的背景图片打包编译为base64，导致相同的图片被重复编译为base64打包。
* 有一些通用的样式集，重复使用，但没有提取为公共样式。
* 有部分sass @import  使用不规范，导致无用代码重复打包。

## 多账号绑定附件重传
首先，多账号是邮箱客户端的基本能力，并且线上用户频繁反馈不能绑定个人邮箱账号的工单。另外，支持外贸通的售卖，具备支持外部邮箱能力后，外贸通可以售卖第三方邮箱客户。多账号的场景下，因为写信中上传的附件与发件人是绑定的，当切换发件人时，需要重新生成一封新写信，并对原始信件中的附件重新上传到当前发件人下。

1. **切换发件人发信的业务逻辑**
![](../img/reupdata1.jpeg)
1. **附件管理：记录用户写信中添加、取消、删除的附件**
![](../img/reupdata2.jpeg)
1. **附件重传逻辑**
![](../img/reupdata3.jpeg)

## 暗黑主题
https://juejin.cn/post/7379960023407738892

## [中英文](https://juejin.cn/post/7390339205984141366)
1. 读取 git commit 中的增量代码文件路径
```js
const getGitResult = command =>  new Promise((res, rej) => {    
    // eslint-disable-next-line consistent-return    
    exec(command, (err, stdout) => {      
        if (err) {        
            return rej(err);      
        }      
        res(stdout.trim());    
    });  
});

preHead = await getGitResult(`git rev-parse HEAD~${argv.order}`); 
const curHead = await getGitResult('git rev-parse HEAD');  
// 获取所有发生变化的文件
const diffFiles = await getGitResult(`git diff --name-only ${curHead} ${preHead}`);  
const files = diffFiles.split(/\n/);  
```
2. 文案替换
```js
const res = await jscodeshift(transformPath, filepath, options);    
```

## [fastdev](https://juejin.cn/post/7390188382212587556)
jscodeshift：jscodeshift 是一个基于 codemod 理念的 JavaScript/TypeScript 重构工具，其原理是将 JS/TS 代码解析为抽象语法树（Abstract Syntax Tree，AST），并提供一系列用于访问和修改 AST 的 API 以实现自动化的代码重构。使用 jscodeshift 可以进行一系列代码转换操作，比如替换变量名、修改函数调用、重构类定义等。它可以帮助开发人员快速而准确地进行大规模的代码修改，尤其适用于需要对遗留代码进行更新或者升级的情况。

## 快照 PageSpy
https://pagespy.huolala.cn/