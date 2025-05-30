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

### webpack npm node的关系
* npm：当包引入数量很多时管理就成为了一个问题，这个就是npm为开发者行了方便之处，npm已经为你做好了依赖和版本的控制，也就是说使用npm可以让你从繁杂的依赖安装和版本冲突中解脱出来，进而关注你的业务而不是库的管理。
* Webpack：webpack是一个工具，这个工具可以帮你处理好各个包/模块之间的依赖关系（modules with dependencies），并将这些复杂依赖关系的静态文件打包成一个或很少的静态文件，提供给浏览器访问使用；除此之外，webpack因为可以提高兼容性，还可以将一些浏览器尚不支持的新特性转换为可以支持格式，进而减少由新特性带来的浏览器的兼容性问题。
* webpack将你从npm中安装的包打包成更小的浏览器可读的静态资源，这里需要注意的是，webpack只是一个前端的打包工具，打包的是静态资源，和后台没有关系，虽然webpack依赖于node环境。
* webpack 与 Node 关系：基于node创建的，支持所有Node API和语法。

### webpack [打包原理](https://juejin.cn/post/6844904038543130637)

### webpack [打包过程](https://juejin.cn/post/6844904038543130637#heading-9)

### 谈谈对[npm语义版本号](https://segmentfault.com/a/1190000018714929)的理解
有时候为了表达更加确切的版本，还会在版本号后面添加标签或者扩展，来说明是预发布版本或者测试版本等。比如 3.2.3-beta-3。


### 前端性能优化
* 优化原则：多使用内存，缓存或者其他方法，减少cpu计算量，减少网络加载耗时（空间换时间）
* 从何入手：让加载更快，让渲染更快
    * 加载更快：减少资源体积（压缩代码），减少访问次数（合并代码，SSR服务端渲染，缓存），使用更快的网络（CDN）
    * 让渲染更快：1. CSS放在head中，JS放在body最下面2. 尽早开始执行JS，用DOMContentLoaded触发3. 懒加载（图片懒加载，上滑加载更多）4. 对DOM查询进行缓存5. 频繁DOM操作，合并到一起插入DOM结构6. 节流throttle 防抖debounce （让渲染更加流畅）

### [首屏优化](https://juejin.cn/post/6844904185264095246)
* 对于第三方js库的优化，分离打包，CDN加速
* vue-router使用懒加载
* 图片资源的压缩，icon资源使用雪碧图或者使用icon-font
* 开启gizp压缩，通过减少文件体积来提高加载速度。html、js、css文件甚至json数据都可以用它压缩，可以减小60%以上的体积
* 前端页面代码层面的优化
    * 合理使用v-if和v-show
    * 合理使用watch和computed
    * 使用v-for必须添加key, 最好为唯一id, 避免使用index, 且在同一个标签上，v-for不要和v-if同时使用
    * 定时器的销毁。可以在beforeDestroy()生命周期内执行销毁事件；也可以使用$once这个事件侦听器，在定义定时器事件的位置来清除定时器

### [安全](https://juejin.cn/post/6844903502968258574)
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

### 文件切片下载上传
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

### 文件切片下载
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

### 理解邮件传输协议（SMTP、POP3、IMAP、MIME）
电子邮件协议有SMTP、POP3、IMAP4，它们都隶属于TCP/IP协议簇，默认状态下，分别通过TCP端口25、110和143建立连接。
* SMTP: SMTP（Simple Mail Transfer Protocol，简单邮件传输协议）定义了邮件客户端与SMTP服务器之间，以及两台SMTP服务器之间发送邮件的通信规则 。SMTP协议属于TCP/IP协议族，通信双方采用一问一答的命令/响应形式进行对话，且定了对话的规则和所有命令/响应的语法格式。SMTP协议中一共定了18条命令，发送一封电子邮件的过程通常只需要其中的6条命令即可完成发送邮件的功能。
* POP3: POP邮局协议负责从邮件服务器中检索电子邮件。邮件服务提供商专门为每个用户申请的电子邮箱提供了专门的邮件存储空间，SMTP服务器将接收到的电子邮件保存到相应用户的电子邮箱中。用户要从邮件服务提供商提供的电子邮箱中获取自己的电子邮件，就需要通过邮件服务提供商的POP3邮件服务器来帮助完成。POP3(Post Office Protocol 邮局协议的第三版本)协议定义了邮件客户端程序与POP3服务器进行通信的具体规则和细节。
* IMAP:  IMAP（Internet Message Access Protocol）协议是对POP3协议的一种扩展，定了邮件客户端软件与邮件服务器的通信规则。IMAP协议在RFC2060文档中定义，目前使用的是第4个版本，所以也称为IMAP4。IMAP协议相对于POP3协议而言，它定了更为强大的邮件接收功能，主要体现在以下一些方面：1.IMAP具有摘要浏览功能，可以让用户在读完所有邮件的主题、发件人、大小等信息后，再由用户做出是否下载或直接在服务器上删除的决定。2.IMAP可以让用户有选择性地下载邮件附件。例如一封邮件包含3个附件，如果用户确定其中只有2个附件对自已有用，就可只下载这2个附件，而不必下载整封邮件，从而节省了下载时间。3.IMAP可以让用户在邮件服务器上创建自己的邮件夹，分类保存各个邮件。
* MIME: 早期人们在使用电子邮件时，都是使用普通文本内容的电子邮件内容进行交流，由于互联网的迅猛发展，人们已不满足电子邮件仅仅是用来交换文本信息，而希望使用电子邮件来交换更为丰富多彩的多媒体信息，例如，在邮件中嵌入图片、声音、动画和附件等二进制数据。但在以往的邮件发送协议RFC822文档中定义，只能发送文本信息，无法发送非文本的邮件，针对这个问题，人们后来专门为此定义了MIME（Multipurpose Internet Mail Extension，多用途Internet邮件扩展）协议。
* 参考: https://www.cnblogs.com/diegodu/p/4097202.html