### HTML5新特性

* 拖拽释放(Drag and drop) API；
* 语义化更好的内容标签（header, nav, footer, aside, article, section）;
* 音频、视频API(audio, video);
* 画布(Canvas) API;
* 地理(Geolocation) API;
* 本地离线存储 localStorage 长期存储数据，浏览器关闭后数据不丢失；
* sessionStorage 的数据在浏览器关闭后自动删除;
* 表单控件:calendar、date、time、email、url、search ;
* 新的技术webworker, websocket等；
* 支持离线应用

### HTML5移除元素

* \<basefont\> 默认字体，不设置字体，以此渲染；
* \<font\> 字体标签；
* \<center\> 水平居中；
* \<u\> 下划线；
* \<big\>字体；
* \<strike\>中横字；
* \<tt\>文本等宽；
* 对可用性产生负面影响的元素：\<frameset\>,\<noframes\>和\<frame\>

### Canvas

[HTML5 绘图技术 「Canvas」](https://www.jianshu.com/p/7bb4896be61c)

### Canvas和SVG

[文档](https://www.w3school.com.cn/html/html5_canvas_vs_svg.asp)

### [webSocket](https://juejin.cn/post/6844903544978407431)
* https://juejin.cn/post/6844903698498322439
* https://juejin.cn/post/6844903696560553991
* https://juejin.cn/post/6844903606211215373

### [webworker](https://juejin.cn/post/6844903725249593352)

### [HTML5离线应用](https://mp.weixin.qq.com/s/Q-Z8kYWSUJpkpAkTBv1Igw)

### [SEO优化技巧](https://juejin.cn/post/6844904097263386638)

### [不同页面通信与跨域](https://juejin.cn/post/6844903613030989832)

### [iframe](https://segmentfault.com/a/1190000004502619)

### [2021年浏览器内核现状](https://juejin.cn/post/6926729677088227342)

### [页面可见性（Page Visibility）API 可以有哪些用途：在页面被切换到其他后台进程的时候，自动暂停音乐或视频的播放。](https://juejin.cn/post/6844904104834121736)

### HTML引用外链样式表的方式

HTML文件引用扩展名为.css的HTML文件引用扩展名为.css的样式表，有两种方式：链接式、导入式，有两种方式：链接式、导入式。
``` html
// 链接式
<link type="text/css" rel="styleSheet"  href="CSS文件路径" />
// 链接式
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
    <meta http-equiv="Cache-Control" name="no-store" /><!-- 禁止浏览器从本地计算机的缓存中访问页面内容 -->
    <meta name="viewport" content="initial-scale=1.0, maximum-scale=1, user-scalable=no"><!-- 为移动设备添加 viewport -->
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