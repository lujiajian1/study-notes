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

* XSS跨站请求攻击
* XSRF跨站请求伪造