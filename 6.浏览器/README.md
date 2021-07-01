### Http的状态码

* 1xx：服务端收到请求
* 2xx：请求成功，200（成功）
* 3xx：重定向，301（永久重定向，配合location，浏览器自动处理）301（临时重定向）304（资源未被修改）
* 4xx：客服端错误，404（资源没有找到）403（没有权限）
* 5xx：服务端错误，500（服务器错误）504（网关超时）

### http常见header
* Request header
    * Accept 浏览器可接受的数据格式
    * Accept-Encoding 浏览器可接受的压缩算法，如gzip
    * Accept-Language 浏览器可接受的语言，如zh-CN
    * Connection:keep-alive 一次TCP链接重复使用
    * cookie
    * Host
    * User-Agent（简称UA）浏览器信息
    * Content-type 发送数据格式，如application/json
* Response header
    * Content-type 返回数据的格式，如application/json
    * Content-length 返回数据的大小，多少字节
    * Content-Encoding 返回数据的压缩算法，如gzip
* 缓存相关
    * Cache-Control: max-age/no-cache/no-store/private/public（Expires也是控制缓存过期，现被cache-control取代）
    * Last-Modified If-modified-Since
    * Etag If-None-Match

### http请求中的8种请求方法

* GET：获取数据
* POST：新建数据
* PUT：更新数据
* HEAD：
* DELETE：删除数据
* OPTIONS：
* TRACE：
* CONNECT：

### Restful API

### HTTPS和HTTP

### 浏览器多个标签页之间的通信

* websocket通讯
* 定时器（setInterval）+ cookie
* 使用localstorage
* html5浏览器的新特性SharedWorker

### 缓存

* DNS缓存
* CDN缓存
* 浏览器缓存
* 服务器缓存

### 浏览器缓存

#### 什么是缓存
保存资源副本并在下次请求时直接使用该副本的技术。当Web缓存发现请求的资源已经被存储，它会拦截请求，返回该资源的拷贝，而不会去源服务器重新下载。
#### 为什么需要缓存
* 减少不必要的网络请求,使得页面加载更快;
* 网络请求是不稳定,加大了页面加载的不稳定性;
* 网络请求的加载相比于cpu加载 & 页面渲染都要慢

#### 哪些资源可以被缓存

静态资源 js css img容易被缓存，因为静态资源加上hash名打包后是一般是不会修改的。

#### 强制缓存（初次请求后，不再请求服务器，直接读取本地缓存）

Response Headers中控制强制缓存的逻辑，例如cache-Control:max-age=315336000
![强制缓存](https://github.com/lujiajian1/study-notes/blob/main/img/qiangzhi.png)

#### 协商缓存（对比缓存）

服务器端缓存策略，服务器判断客户端资源是否和服务器端一致，一致返回304，否则返回200和最新的资源。在response header中有两种资源标识，Last-modified（资源最后修改事件）和Etag（资源唯一标识，一个字符串，类似人的指纹），优先使用Etag，因为Last-Modified只能精确到秒级，另外如果资源被重复生成，但是内容不变，Etag也不会改变，依然可以返回304。
![协商缓存](https://github.com/lujiajian1/study-notes/blob/main/img/xieshang.png)

#### 刷新页面对http缓存的影响

* 正常操作：地址栏输入url，跳转链接，前进后退，强制缓存有效，协商缓存有效
* 手动刷新：F5，点击刷新按钮，点击菜单刷新，强制缓存失效，协商缓存有效
* 强制刷新：ctrl+F5，强制缓存失效，协商缓存失效

#### 强制缓存和协商缓存
![缓存](https://github.com/lujiajian1/study-notes/blob/main/img/huancun.png)

### 跨域解决方案

* JSONP
```html
<script>
    window.abc = function (data) {
        console.log(data)
    }
</script>
<script src="http://localhost:8002/jsonp.js?username=xxx&callback=abc"></script>
```
* CORS（需服务端设置http-header）
![cors](https://github.com/lujiajian1/study-notes/blob/main/img/cors.png)
* web服务nginx代理