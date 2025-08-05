### HTML5新特性
* [拖拽释放(Drag and drop) API（源对象和目标对象）](https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_Drag_and_Drop_API)
    * ondragstart:源对象开始被拖动
    * ondrag:源对象被拖动的过程中
    * ondragend:源对象被拖动结束
    * ondragenter:目标对象被源对象拖动进入
    * ondragover:目标对象被源对象悬浮在上面
    * ondragleave:源对象拖动着离开了目标对象
    * ondrop:源对象拖动着在目标对象上方松手
* 语义化更好的内容标签（header, nav, footer, aside, article, section）;
* 音频、视频API(audio, video);
* 画布[Canvas](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API) API;
    * 示例
    ```js
    var c = document.getElementById("mycanvas"); // 方法获取HTML <canvas> 元素的引用
    var ctx = c.getContext("2d"); //2d context
    var gl = getContext('webgl'); //3d
    ctx.fillStyle = "#ff0000"; // 将长方形变成红色
    ctx.fillRect(0,0,150,75); // 左上角放在(0, 0)，把它的大小设置成宽150高75，画一个长方形
    ```
    * [Canvas和SVG](https://www.w3school.com.cn/html/html5_canvas_vs_svg.asp)
        * SVG 是一种使用 XML 描述 2D 图形的语言
        * SVG 基于 XML，这意味着 SVG DOM 中的每个元素都是可用的。您可以为某个元素附加 JavaScript 事件处理器。
        * 在 SVG 中，每个被绘制的图形均被视为对象。如果 SVG 对象的属性发生变化，那么浏览器能够自动重现图形。
        * Canvas 通过 JavaScript 来绘制 2D 图形。
        * Canvas 是逐像素进行渲染的。
        * 在 canvas 中，一旦图形被绘制完成，它就不会继续得到浏览器的关注。如果其位置发生变化，那么整个场景也需要重新绘制，包括任何或许已被图形覆盖的对象。
* 地理([Geolocation](https://developer.mozilla.org/zh-CN/docs/Web/API/Geolocation)) API;
* 本地离线存储 [localStorage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage) 长期存储数据，浏览器关闭后数据不丢失；
* [sessionStorage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/sessionStorage) 的数据在浏览器关闭后自动删除;
* 表单控件:calendar、date、time、email、url、search ;
* 新的技术[webworker](https://developer.mozilla.org/zh-CN/docs/Web/API/Worker), [websocket](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)等；
* 支持[离线应用](https://mp.weixin.qq.com/s/Q-Z8kYWSUJpkpAkTBv1Igw)
    1. 首次访问页面，浏览器加载页面和所需资源
    2. 解析到html元素的manifest文件，加载CACHE以及FALLBACK对应的资源到缓存中
    3. 从现在起你将完全使用浏览器缓存中的文件，即使强制刷新也不会生效。随后浏览器会尝试检查manifest文件是否更新（联机状态才会检查）。若manifest文件更新，浏览器会下载所有资源并更新缓存。
    4. 离线状态下访问已缓存的资源时，浏览器会从缓存中读取，而相应的，访NETWORK中的资源则会对应读取FALLBACK。
    5. 注意点：只有manifest文件更新，浏览器才会重新下载新资源，意味着仅仅更改资源文件内容是不会触发更新的。这一问题可以通过在manifest中添加版本注释来解决。且更新缓存并不会立即生效，需下次访问生效！可通过浏览器API监听相应的事件，提醒用户刷新浏览器。
```html
<html lang="en" manifest="index.manifest">   
```
### HTML5移除元素

* \<basefont\> 默认字体，不设置字体，以此渲染；
* \<font\> 字体标签；
* \<center\> 水平居中；
* \<u\> 下划线；
* \<big\>字体；
* \<strike\>中横字；
* \<tt\>文本等宽；
* 对可用性产生负面影响的元素：\<frameset\>,\<noframes\>和\<frame\>

### [webSocket](https://juejin.cn/post/6844903544978407431)：HTML5开始提供的一种浏览器与服务器进行全双工通讯的网络技术，属于应用层协议。它基于TCP传输协议，并复用HTTP的握手通道
* https://juejin.cn/post/7020964728386093093
* https://juejin.cn/post/6844903698498322439
* https://juejin.cn/post/6844903696560553991
* https://juejin.cn/post/6844903606211215373
```js
var ws = new WebSocket('ws://localhost:8080');
ws.onopen = function () {
    console.log('ws onopen');
    ws.send('from client: hello');
};
ws.onmessage = function (e) {
    console.log('ws onmessage');
    console.log('from server: ' + e.data);
};
```
### 有了http1.1的keeplive长连接后为什么还需要websocket
* 开销：http长连接的每次请求仍然需要发送头信息；而websocket仅需要在发起请求时发送头信息。
* 真正意义的长连接：http长连接仅仅是为了复用tcp连接，只是一种口头约定，服务端可以不遵守；而websocket是完全意义上的长连接。
* 是否平等：http长连接依旧无法摆脱一个request对应一个response的模式，且仅允许客户端往服务端发送request，所以对于实时通信的实现依旧只能是轮询；而websocket双方是对等的，可以相互发送消息，可以实现真正意义的实时通信。

### [webworker](https://juejin.cn/post/7139718200177983524)：Web Worker 是 HTML5 标准的一部分，这一规范定义了一套 API，允许我们在 js 主线程之外开辟新的 Worker 线程，并将一段 js 脚本运行其中，它赋予了开发者利用 js 操作多线程的能力
```js
//主线程
const worker = new Worker('https://~.js');
//主线程与 worker 线程通信
worker.postMessage({
  hello: ['hello', 'world']
});
//监听 worker 线程返回的信息
worker.onmessage = function (e) {
    console.log('父进程接收的数据：', e.data);
    // doSomething();
}
worker.terminate(); // 主线程关闭worker线程

// worker进程
// 监听主线程传过来的信息：
self.onmessage = e => {
    console.log('主线程传来的信息：', e.data);
    // do something
    
    //发送信息给主线程
    self.postMessage({
        hello: [ '这条信息', '来自worker线程' ]
    });
};
```

### [SEO优化技巧](https://juejin.cn/post/6844904097263386638)
* 合理的title、description、keywords：搜索对着三项的权重逐个减小，title值强调重点即可，重要关键词出现不要超过2次，而且要靠前，不同页面title要有所不同；description把页面内容高度概括，长度合适，不可过分堆砌关键词，不同页面description有所不同；keywords列举出重要关键词即可
* 语义化的HTML代码，符合W3C规范：语义化代码让搜索引擎容易理解网页
* 重要内容HTML代码放在最前：搜索引擎抓取HTML顺序是从上到下，有的搜索引擎对抓取长度有限制，保证重要内容一定会被抓取
* 重要内容不要用js输出：爬虫不会执行js获取内容
* 少用iframe：搜索引擎不会抓取iframe中的内容
* 非装饰性图片必须加alt
* 提高网站速度：网站速度是搜索引擎排序的一个重要指标

### HTML引用外链样式表的方式
HTML文件引用扩展名为.css的HTML文件引用扩展名为.css的样式表，有两种方式：链接式、导入式，有两种方式：链接式、导入式。
``` html
// 链接式 link 会同时被加载，link 方式样式的权重高于@import 的
<link type="text/css" rel="styleSheet"  href="CSS文件路径" />
// 链接式 @import 引用的 css 会等到页面加载结束后加载
<style type="text/css">
  @import url("css文件路径");
</style>
```

### head配置及其含义
``` html
<head>
    <!-- <base> 标签为页面上的所有链接规定默认地址或默认目标。通常情况下，浏览器会从当前文档的 URL 中提取相应的元素来填写相对 URL 中的空白。使用 <base> 标签可以改变这一点。浏览器随后将不再使用当前文档的 URL，而使用指定的基本 URL 来解析所有的相对 URL。这其中包括 <a>、<img>、<link>、<form> 标签中的 URL -->
    <base href="http://www.w3school.com.cn/i/" />
    <base target="_blank" />
    <!-- <meta>元素可提供有关页面的元信息（meta-information），比如针对搜索引擎和更新频度的描述和关键词 -->
    <meta name="description" content="免费在线教程"><!-- web页面描述 -->  <!--  -->
    <meta name="keywords" content="HTML,CSS,XML,JavaScript"><!-- 定义文档关键词 -->
    <meta name="author" content="runoob"><!-- 页面作者 -->
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" /><!-- 不能进行缩放 -->
    <meta name="robots" content="index,follow"/><!-- 搜索引擎抓取 -->
    <meta name="format-detection" content="telephone=no"><!-- 电话号码不显示为拨号的超链接 -->
    <meta charset="UTF-8"><!-- 字符编码 -->
    <meta http-equiv="refresh" content="30"><!-- 每30秒刷新页面 -->
    <meta http-equiv="Cache-Control" name="no-store" /><!-- 禁止浏览器从本地计算机的缓存中访问页面内容(仅html，不包括外联资源) -->
    <meta name="’viewport’" content="”width=device-width," initial-scale="1." maximum-scale="1,user-scalable=no”"/><!-- 为移动设备添加 viewport -->
    <!-- <title> 元素可定义文档的标题 -->
    <title>文档的标题</title>
    <!-- <link> 标签定义文档与外部资源的关系，最常见的用途是链接样式表 -->
    <link rel="stylesheet" type="text/css" href="theme.css" />
    <!-- <script> 标签用于定义客户端脚本，比如 JavaScript -->
    <script type="text/javascript">
        document.write("Hello World!")
    </script>
    <script src="./test.txt"></script>
    <!-- <style> 标签用于为 HTML 文档定义样式信息 -->
    <style type="text/css">
        h1 {color:red}
        p {color:blue}
    </style>
</head>
```

### 如何理解HTML语义化

* 让人更容易读懂（增加代码可读性）
* 让搜索引擎更容易读懂（SEO）

### 块级元素 和 内联元素
* display为block/table；如 div p h1 h2.., table ul ol等
* dispay为inline/inline-block；如 span img input button等

### [页面可见性（Page Visibility）API 可以有哪些用途：在页面被切换到其他后台进程的时候，自动暂停音乐或视频的播放。](https://juejin.cn/post/6844904104834121736)
* document.hidden：表示页面是否隐藏的布尔值，页面隐藏，包括：页面在后台标签中或者最小化。
* document.visibilityState：4个可能状态的值
    * 页面在后台标签中或最小化
    * 页面在前台标签中
    * 实际的页面已经隐藏，但用户可看到页面的预览（win7系统的应该有体会，鼠标放在任务栏，无需打开就可看到小窗页面）
    * 页面在浏览器外预渲染
* visibilityChange：这是一个事件，当文档的可见性发生变化时触发。

### preload、prefetch、preconnect 和 dns-prefetch
* preload：提升了资源加载的优先级，使得它提前开始加载（预加载），但是资源加载完成后并不会执行。将加载和执行分离开，可不阻塞渲染和 document 的 onload 事件，提前加载指定资源，不再出现依赖的 font 字体隔了一段时间才刷出。
```html
<script src="https://cdn.bootcss.com/jquery/2.1.4/jquery.min.js"></script>
<script rel="preload" src="./main.js"></script><!--优先加载-->
```
* prefetch：用于加载未来（比如下一个页面）会用到的资源，并且告诉浏览器在空闲的时候去下载，它会将下载资源的优先级降到最低。
* 当浏览器向服务器请求一个资源的时候，需要建立连接，而建立一个安全的连接需要经历以下 3 个步骤：1.查询域名并将其解析成 IP 地址（DNS Lookup）；2.建立和服务器的连接（Initial connection）；3.加密连接以确保安全（SSL）；以上 3 个步骤浏览器都需要和服务器进行通信，而这一来一往的请求和响应势必会耗费不少时间。而就基于这点上，可以使用 preconnect 或者 dns-prefetch 进行优化。
* preconnect：提前建立连接
```js
<link rel="preconnect" href="https://b.com">
```
* dns-prefetch：浏览器使用 DNS 来将站点转成 IP 地址，这个是建立连接的第一步，而这一步骤通常需要花费的时间大概是 20ms ~ 120ms。因此，可以通过 dns-prefetch 来节省这一步骤的时间。居然能通过 preconnect 来减少整个建立连接的时间，那为什么还需要 dns-prefetch 来减少建立连接中第一步 DNS 查找解析的时间呢？假如页面引入了许多第三方域下的资源，而如果它们都通过 preconnect 来预建立连接，其实这样的优化效果反而不好，甚至可能变差，所以这个时候就有另外一个方案，那就是对于最关键的连接使用 preconnect，而其他的则可以用 dns-prefetch。另外由于 preconnect 的浏览器兼容稍微比 dns-prefetch 低。
```js
<link rel="dns-prefetch" href="https://cdn.bootcss.com">
```
* https://juejin.cn/post/6915204591730556935#heading-3

### 对WEB标准以及W3C的理解与认识
#### 什么是WEB标准
Web 标准也称网页标准，它由一系列标准组成，这些标准大部分由 W3C 负责制订，也有一些标准由其他标准组织制定的，如 ECMA 的 ECMAScript 标准等。狭义的 Web 标准是指网页设计的 DIV+CSS 化，广义的 Web 标准是指网页设计要符合 W3C 和 ECMA 规范。在符合标准的网页设计中，CSS 与 HTML、JavaScript 并列称为网页前端设计的 3 种基本语言，其中：HTML 负责构建网页的基本结构；CSS 负责设计网页的表现效果；JavaScript 负责开发网页的交互效果。
#### 为什么使用WEB标准
由于存在不同的浏览器版本，web 开发者常常需要为耗时的多版本开发而艰苦工作。当新的硬件（比如移动电话）和软件（比如微浏览器）开始浏览 web 时，这种情况开始会变得更加严重。为了 web 更好地发展，对于开发人员和最终用户而言非常重要的事情是，在开发新的应用程序时，浏览器开发商和站点开发商共同遵守标准。web 的不断壮大，使得越来越有必要依靠标准实现其全部潜力。web 标准可确保每个人都有权利访问相同的信息。如果没有 web 标准，那么未来的 web 应用，包括我们所梦想的应用程序，都是不可能实现的。同时，Web 标准也可以使站点开发更快捷，更令人愉快。为了缩短开发和维护时间，未来的网站将不得不根据标准来进行编码。开发人员不必为了得到相同的结果，而挣扎于多版本的开发。
另外，一旦 web 开发人员遵守了 web 标准，由于开发人员可以更容易地理解彼此的编码，web 开发的团队协作将得到简化。同时，标准的 web 文档更易被搜索引擎访问，也更易被准确地索引。标准的 web 文档更易被转换为其他格式。标准的 web 文档更易被程序代码访问（比如 JavaScript 和 DOM）。
#### 什么是W3C
W3C，这个建立于 1994 年的组织，其宗旨是通过促进通用协议的发展并确保其通用型，以激发 web 世界的全部潜能。W3C 最重要的工作是发展 Web 规范（称为推荐，Recommendations），这些规范描述了 Web 的通信协议（比如 HTML 和 XHTML）和其他的构建模块。每项 W3C 推荐的发展是通过由会员和受邀专家组成的工作组来完成的。工作组的经费来自公司和其他组织，并会创建一个工作草案，最后是一份提议推荐。一般来说，为了获得正式的批准，推荐都会被提交给 W3C 会员和主任。W3C 标准只是推荐标准（Recommendation），并没有强制执行的效力。不过，鉴于 W3C 在 Web 标准领域的影响力和强大号召力，W3C 发布的推荐标准，通常浏览器厂商们都很重视，并积极支持。

### 使用http-server开启一个本地服务器，方便本地调试

![命令行](https://github.com/lujiajian1/study-notes/blob/main/img/http-server.jpg)