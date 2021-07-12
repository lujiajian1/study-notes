### 常用git命令
* git add .
* git checkout xxx
* git commit -m 'xxx'
* git push origin master
* git pull origin master
* git branch
* git checkout -b xxx / git checkout xxx
* git merge xxx

### webpack 基本配置
* 拆分配置 和 merge
```js
//将配置拆分为webpack.common.js、webpack.dev.js、webpack.prod.js

//使用smart合并
const { smart } = require('webpack-merge')
module.exports = smart(webpackCommonConf, {
    //prod 或者 dev 的配置
})
```
* 启动本地服务，接口代理
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
* 处理 ES6，使用babel-loader
```js
module.exports = {
    entry: path.join(srcPath, 'index'),
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: ['babel-loader'],
                include: srcPath,
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(srcPath, 'index.html'),
            filename: 'index.html'
        })
    ]
}
```
* 处理样式，使用'style-loader', 'css-loader', 'postcss-loader'，'less-loader'
```js
module.exports = {
    entry: path.join(srcPath, 'index'),
    module: {
        rules: [
            {
                test: /\.css$/,
                // loader 的执行顺序是：从后往前
                loader: ['style-loader', 'css-loader', 'postcss-loader'] // 加了 postcss
            },
            {
                test: /\.less$/,
                // 增加 'less-loader' ，注意顺序
                loader: ['style-loader', 'css-loader', 'less-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(srcPath, 'index.html'),
            filename: 'index.html'
        })
    ]
}

```
* 处理图片
```js
module.exports = smart(webpackCommonConf, {
    mode: 'production',
    output: {
        filename: 'bundle.[contentHash:8].js',  // 打包代码时，加上 hash 戳
        path: distPath,
    },
    module: {
        rules: [
            // 图片 - 考虑 base64 编码的情况
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
    plugins: [
        new CleanWebpackPlugin(), // 会默认清空 output.path 文件夹
        new webpack.DefinePlugin({
            ENV: JSON.stringify('production')
        })
    ]
})
```

### webpack 高级配置
* 多入口
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
* 抽离 css 文件
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
* 抽离公共代码
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
* 懒加载
```js
//正常引用
import { sum } from './sum'
//懒加载引用
import('./data.js').then(() =>{})
```
* 处理 JSX：使用 @babel/preset-react
* 处理 Vue：使用 vue-loader

### webpack 性能优化
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

### babel：babel 解析 ES6 及以上更高级的语法到 ES5 及以下，以满足浏览器的兼容性。
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

### 前端为何进行打包和构建
* 代码层面
    * 体积更小(Tree - Shaking, 压缩, 合并), 加载更快
    * 编辑高级语言或语法(TS, ES6, 模块化, less)
    * 兼容性和错误检查 (Polyfill、postcss、eslint)
* 研发流程方面
    * 统一、高效的开发环境
    * 统一的构建流程和产出标准
    * 集成公司构建规范(提测、上线等)

### module chuck bundle 的区别
* module - 各个源码文件, webpack 中一切皆模块
* chunk - 多模块合并成, 如 entry import()  splitChunk
* bundle - 最终的输出文件

### loader 和 plugin 的区别
* loader 模块转换器, 如 less  -> css
* plugin 扩展插件, 如 HtmlWepackPlugin 

### 常见 loader 和 plugin 有哪些
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

### bebel 和 webpack 的区别
* babel - js 新语法编译工具, 不关心模块化
* webpack - 打包构建工具（压缩代码、整合代码，网页加载更快）, 是多个loader plugin 的集合

### babel-polyfill 和babel- runtime 的区别
* babel-polyfill 会污染全局
* babel-runtime 不会污染全局
* 产出第三方 要用 babel-runtime

### 前端性能优化
* 优化原则：多使用内存，缓存或者其他方法，减少cpu计算量，减少网络加载耗时（空间换时间）
* 从何入手：让加载更快，让渲染更快
    * 加载更快：减少资源体积（压缩代码），减少访问次数（合并代码，SSR服务端渲染，缓存），使用更快的网络（CDN）
    * 让渲染更快：1. CSS放在head中，JS放在body最下面2. 尽早开始执行JS，用DOMContentLoaded触发3. 懒加载（图片懒加载，上滑加载更多）4. 对DOM查询进行缓存5. 频繁DOM操作，合并到一起插入DOM结构6. 节流throttle 防抖debounce （让渲染更加流畅）

### 安全
* XSS：跨站脚本攻击，是说攻击者通过注入恶意的脚本，在用户浏览网页的时候进行攻击，比如获取 cookie，或者其他用户身份信息，可以分为存储型和反射型，存储型是攻击者输入一些数据并且存储到了数据库中，其他浏览者看到的时候进行攻击，反射型的话不存储在数据库中，往往表现为将攻击代码放在 url 地址的请求参数中，防御的话为cookie 设置 httpOnly 属性，对用户的输入进行检查，进行特殊字符过滤。
* XSRF：跨站请求伪造，可以理解为攻击者盗用了用户的身份，以用户的名义发送了恶意请求，比如用户登录了一个网站后，立刻在另一个tab页面访问量攻击者用来制造攻击的网站，这个网站要求访问刚刚登陆的网站，并发送了一个恶意请求，这时候 CSRF就产生了，比如这个制造攻击的网站使用一张图片，但是这种图片的链接却是可以修改数据库的，这时候攻击者就可以以用户的名义操作这个数据库，防御方式的话：使用验证码，检查 https 头部的 refer，使用 token。

### [H5 和 native 的交互：JSBridge](https://mp.weixin.qq.com/s/lJJjbmuOZXE25I7FIz7OVg)
* 概念：在Hybrid（混合开发）模式下，H5会经常需要使用Native的功能，比如打开二维码扫描、调用原生页面、获取用户信息等，同时Native也需要向Web端发送推送、更新状态等，而JavaScript是运行在单独的JS Context中（Webview容器、JSCore等），与原生有运行环境的隔离，所以需要有一种机制实现Native端和Web端的双向通信，这就是JSBridge：以JavaScript引擎或Webview容器作为媒介，通过协定协议进行通信，实现Native端和Web端双向通信的一种机制。通过JSBridge，Web端可以调用Native端的Java接口，同样Native端也可以通过JSBridge调用Web端的JavaScript接口，实现彼此的双向调用。
* 原理：Web端和Native可以类比于Client/Server模式，Web端调用原生接口时就如同Client向Server端发送一个请求类似，JSB在此充当类似于HTTP协议的角色，实现JSBridge主要是两点：
    *  JavaScript 调用 Native
        * 拦截Webview请求的URL Schema：URL SCHEME是一种类似于url的链接，是为了方便app直接互相调用设计的，形式和普通的 url 近似，主要区别是 protocol 和 host 一般是自定义的，例如: qunarhy://hy/url?url=ymfe.tech，protocol 是 qunarhy，host 则是 hy。拦截 URL SCHEME 的主要流程是：Web 端通过某种方式（例如 iframe.src）发送 URL Scheme 请求，之后 Native 拦截到请求并根据 URL SCHEME（包括所带的参数）进行相关操作。
        * 向Webview中注入JS API：通过 WebView 提供的接口，向 JavaScript 的 Context（window）中注入对象或者方法，让 JavaScript 调用时，直接执行相应的 Native 代码逻辑，达到 JavaScript 调用 Native 的目的。
    * Native 调用 JavaScript：Native 调用 JavaScript，其实就是执行拼接 JavaScript 字符串，从外部调用 JavaScript 中的方法，因此 JavaScript 的方法必须在全局的 window 上。（闭包里的方法，JavaScript 自己都调用不了，更不用想让 Native 去调用了）。

### 移动端兼容性问题
* ios端兼容input光标高度
* ios端微信h5页面上下滑动时卡顿、页面缺失
* ios键盘唤起，键盘收起以后页面不归位
* 安卓弹出的键盘遮盖文本框
* Vue中路由使用hash模式，开发微信H5页面分享时在安卓上设置分享成功，但是ios的分享异常
* 参考：
    * https://mp.weixin.qq.com/s/4b8VzBkvf-jpYOLoCkiJEg