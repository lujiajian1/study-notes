### 常用git命令
* git add .
* git checkout xxx
* git commit -m 'xxx'
* git push origin master
* git pull origin master
* git branch
* git checkout -b xxx / git checkout xxx
* git merge xxx

### webpack 和 babel
* ES6模块化，浏览器暂不支持
* ES6语法，浏览器并不完全支持
* 压缩代码、整合代码，网页加载更快

### 前端性能优化
* 优化原则：多使用内存，缓存或者其他方法，减少cpu计算量，减少网络加载耗时（空间换时间）
* 从何入手：让加载更快，让渲染更快
    * 加载更快：减少资源体积（压缩代码），减少访问次数（合并代码，SSR服务端渲染，缓存），使用更快的网络（CDN）
    * 让渲染更快：1. CSS放在head中，JS放在body最下面2. 尽早开始执行JS，用DOMContentLoaded触发3. 懒加载（图片懒加载，上滑加载更多）4. 对DOM查询进行缓存5. 频繁DOM操作，合并到一起插入DOM结构6. 节流throttle 防抖debounce （让渲染更加流畅）

### 安全
* XSS：跨站脚本攻击，是说攻击者通过注入恶意的脚本，在用户浏览网页的时候进行攻击，比如获取 cookie，或者其他用户身份信息，可以分为存储型和反射型，存储型是攻击者输入一些数据并且存储到了数据库中，其他浏览者看到的时候进行攻击，反射型的话不存储在数据库中，往往表现为将攻击代码放在 url 地址的请求参数中，防御的话为cookie 设置 httpOnly 属性，对用户的输入进行检查，进行特殊字符过滤。
* XSRF：跨站请求伪造，可以理解为攻击者盗用了用户的身份，以用户的名义发送了恶意请求，比如用户登录了一个网站后，立刻在另一个tab页面访问量攻击者用来制造攻击的网站，这个网站要求访问刚刚登陆的网站，并发送了一个恶意请求，这时候 CSRF就产生了，比如这个制造攻击的网站使用一张图片，但是这种图片的链接却是可以修改数据库的，这时候攻击者就可以以用户的名义操作这个数据库，防御方式的话：使用验证码，检查 https 头部的 refer，使用 token。

### [H5 和 native 的交互：JSBridge](https://mp.weixin.qq.com/s/lJJjbmuOZXE25I7FIz7OVg)
* 一种 webview 侧和 native 侧进行通信的手段，webview 可以通过 jsb 调用 native 的能力，native 也可以通过 jsb 在 webview 上执行一些逻辑。

### 移动端兼容性问题

* ios端兼容input光标高度
* ios端微信h5页面上下滑动时卡顿、页面缺失
* ios键盘唤起，键盘收起以后页面不归位
* 安卓弹出的键盘遮盖文本框
* Vue中路由使用hash模式，开发微信H5页面分享时在安卓上设置分享成功，但是ios的分享异常
* 参考：
    * https://mp.weixin.qq.com/s/4b8VzBkvf-jpYOLoCkiJEg