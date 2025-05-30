### 从URL到 返回 HTTP 报文
1. 建立连接阶段
    1. DNS 域名解析，获取ip地址（应用层）
    2. 通过 IP 协议 寻址找到目标服务器（网络层）
    3. 建立 TCP（传输层通信协议） 连接（传输层）
        * 第一次握手：客户端向服务器端发送一个 SYN 报文，表示开始建立连接。
        * 第二次握手：服务器端回发一个 ACK 报文，表示确认收到第一次握手，同时发送自己的SYN 报文。
            * 客户端确认自己发出的数据能够被服务器端收到。
        * 第三次握手：客户端收到 SYN+ACK 报文之后，会回应一个 ACK 报文。
            * 服务器端确认自己发出的数据能够被客户端收到。
        ![tcp](https://github.com/lujiajian1/study-notes/blob/main/img/tcp.png)
2. 发送数据阶段
    1. 建立 SSL 安全连接 HTTPS（传输层）
        * 先使用非对称加密，进行秘钥协商，让通信双方拿到相同的钥匙。
        * 然后使用对称加密，进行加密传输。
    2. 发送 HTTP 请求（应用层）
3. 服务器处理请求并返回 HTTP 报文
4. 断开连接：TCP 四次分手
    1. 第一次挥手：客户端发送一个 FIN 报文。
    2. 第二次挥手：服务端收到 FIN 之后，会发送 ACK 报文，表明已经收到客户端的报文了。
    3. 第三次挥手：如果服务端也想断开连接了，和客户端的第一次挥手一样，发给 FIN 报文。
    4. 第四次挥手：客户端收到 FIN 之后，一样发送一个 ACK 报文作为应答。
    ![tcp](https://github.com/lujiajian1/study-notes/blob/main/img/tcpend.png)
* 参考：
    * https://mp.weixin.qq.com/s/1FSYt2NR14s_zx_CJl7miA
    * https://juejin.cn/post/6935232082482298911#heading-32

### Http的状态码

* 1xx：服务端收到请求
* 2xx：请求成功，200（成功）
* 3xx：重定向，301（永久重定向，配合location，浏览器自动处理）302（临时重定向）304（资源未被修改）
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
    * Keep-Alive:timeout=20 长连接超时时间
* 缓存相关
    * Cache-Control: max-age/no-cache/no-store/private/public（Expires也是控制缓存过期，现被cache-control取代）
    * Last-Modified If-modified-Since
    * Etag If-None-Match

### http请求中的8种请求方法
* 简单请求
    * HEAD：类似于 get 请求，只不过返回的响应中没有具体的内容，用户获取报头
    * GET：获取数据
    * POST：新建数据
* 复杂请求
    * PUT：更新数据
    * DELETE：删除数据
    * OPTIONS：允许客户端查看服务器的性能，比如说服务器支持的请求方式，或者当前是否允许跨域等

### HTTP和HTTPS的[区别](https://mp.weixin.qq.com/s/UE7Zw0aSbxLuFFSraSUIOQ)
* HTTP：是互联网上应用最为广泛的一种网络协议，是一个客户端和服务器端请求和应答的标准（TCP），用于从WWW服务器传输超文本到本地浏览器的传输协议，它可以使浏览器更加高效，使网络传输减少。
* HTTPS：是以安全为目标的HTTP通道，简单讲是HTTP的安全版，即HTTP下加入SSL层，HTTPS的安全基础是SSL，因此加密的详细内容就需要SSL。
* HTTPS协议的主要作用可以分为两种：一种是建立一个信息安全通道，来保证数据传输的安全；另一种就是确认网站的真实性。 
* 区别
    * https协议需要到ca申请证书，一般免费证书较少，因而需要一定费用。
    * http是超文本传输协议，信息是明文传输，https则是具有安全性的ssl加密传输协议。
    * http和https使用的是完全不同的连接方式，用的端口也不一样，前者是80，后者是443。
    * http的连接很简单，是无状态的；HTTPS协议是由SSL+HTTP协议构建的可进行加密传输、身份认证的网络协议，比http协议安全。

### [HTTP1、HTTP2、HTTP3](https://juejin.cn/post/6855470356657307662)
* HTTP1.1
    * 持久连接：keep-alive
    * 提供虚拟主机的支持：在HTTP/1.0中，每个域名绑定了一个唯一的IP地址，因此一个服务器只能支持一个域名。但是随着虚拟主机技术的发展，需要实现在一台物理主机上绑定多个虚拟主机，每个虚拟主机都有自己的单独的域名，这些单独的域名都公用同一个IP地址。 因此，HTTP/1.1的请求头中增加了Host字段，用来表示当前的域名地址，这样服务器就可以根据不同的Host值做不同的处理。
    * 客戶端Cookie
* HTTP2
    * 多路复用：通过在协议栈中添加二进制分帧层来实现的，有了二进制分帧层还能够实现请求的优先级、服务器推送、头部压缩等特性，从而大大提升了文件传输效率。
* HTTP3
    * 基于QUIC协议：解决TCP的队头阻塞、建立TCP连接的延时、TCP协议 僵化等问题


###  GET 和 POST 的区别
* get 参数通过 url 传递，post 放在 request body 中。
* get 请求在 url 中传递的参数是有长度限制的，而 post 没有。
* get 比 post 更不安全，因为参数直接暴露在 url 中，所以不能用来传递敏感信息。
* get 请求只能进行 url 编码，而 post 支持多种编码方式
* get 请求会浏览器主动 cache，而 post 支持多种编码方式。
* get 请求参数会被完整保留在浏览历史记录里，而 post 中的参数不会被保留。
* GET 和 POST 本质上就是 TCP 链接，并无差别。但是由于 HTTP 的规定和浏览器/服务器的限制，导致他们在应用过程中体现出一些不同。
* GET 产生一个 TCP 数据包；POST 产生两个 TCP 数据包。

### [TCP和UDP](https://juejin.cn/post/6972027657047244837#heading-12)
UDP（User Datagram Protocol，用户数据报协议）

- 无连接协议：UDP 是一种无连接协议，发送数据前不需要建立连接。
- 不提供错误恢复：UDP 不提供错误恢复机制，如果数据包丢失，不会进行重传。
- 传输速度快：由于没有错误检查和连接建立的过程，UDP 传输速度更快，延迟更低。
- 应用场景：适用于对速度要求高且允许偶尔数据丢失的应用，如直播流媒体、在线游戏和语音通话（VoIP）。

TCP（Transmission Control Protocol，传输控制协议）

- 面向连接协议：TCP 在发送数据前需要建立连接，确保通信的可靠性。
- 提供错误恢复：TCP 提供错误检查，确保数据按顺序且无误地传输。
- 传输速度较慢：由于需要建立连接和进行错误检查，TCP 的传输速度相对较慢。
- 应用场景：适用于对数据完整性和顺序有严格要求的应用，如网页浏览、电子邮件和文件传输。

总结：

* TCP向上层提供面向连接的可靠服务 ，UDP向上层提供无连接不可靠服务。
* 虽然 UDP 并没有 TCP 传输来的准确，但是也能在很多实时性要求高的地方有所作为
* 对数据准确性要求高，速度可以相对较慢的，可以选用TCP
![udp](https://github.com/lujiajian1/study-notes/blob/main/img/udp.png)

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
![强制缓存](https://github.com/lujiajian1/study-notes/blob/main/img/qangzhi.png)

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
* [document.domain](https://blog.csdn.net/zhuchunyan_aijia/article/details/51426220)

