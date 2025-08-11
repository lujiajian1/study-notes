## [PWA](https://zhuanlan.zhihu.com/p/25459319)
Progressive Web Apps 是 Google 提出的用前沿的 Web 技术为网页提供 App 般使用体验的一系列方案。一个 PWA 应用首先是一个网页, 可以通过 Web 技术编写出一个网页应用. 随后添加上 App Manifest 和 Service Worker 来实现 PWA 的安装和离线等功能。

## [微服务](https://juejin.cn/post/6844904162509979662)
一种类似于微服务的架构，它将微服务的理念应用于浏览器端，即将 Web 应用由单一的单体应用转变为多个小型前端应用聚合为一的应用。各个前端应用还可以独立运行、独立开发、独立部署。微前端不是单纯的前端框架或者工具，而是一套架构体系，

## [文件上传](https://juejin.cn/post/6980142557066067982)

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
重复请求：比如公共服务，比如权限，账号等接口，只需要应用启动的时候请求一次即可，可以使用缓存。缓存的机制，可以根据场景进行不同处理，比如有些接口一分钟缓存，有些数据可以应用生命周期只请求一次，主要取决于时效性。
非必要请求：与当前业务无关，延迟到对应模块加载。
可聚合请求：比如有些获取详情的接口，只能传id，如果想获取idlist的详情，只能多次请求，这类型可以合并为一个请求，让服务端接口支持传idlist。

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

#### css 体积优化
css 现状存在的问题
* 体积小的背景图片打包编译为base64，导致相同的图片被重复编译为base64打包。
* 有一些通用的样式集，重复使用，但没有提取为公共样式。
* 有部分sass @import  使用不规范，导致无用代码重复打包。

## 多账号绑定附件重传（文件切片上传）

## 新手引导

## 暗黑主题

## 中英文

## fastdev

## 快照 PageSpy