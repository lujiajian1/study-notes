### 使用Node.js写一个简单的api接口
```js
// 导入http模块:
var http = require('http');
// 创建http server，并传入回调函数:
var server = http.createServer(function (request, response) {
    // 回调函数接收request和response对象,
    // 获得HTTP请求的method和url:
    console.log(request.method + ': ' + request.url);
    var url = request.url;
    if(url === '/'){
        //路由
        fs.readFile('./index.html', function(err, data){
          if(!err){
            // 将HTTP响应200写入response, 同时设置Content-Type: text/html:
            response.writeHead(200, {"Content-Type": "text/html;charset=UTF-8"});
            // 将HTTP响应的HTML内容写入response:
            response.end(data)
          }else{
              throw err;
          }
        });
    } else if(url === '/data'){ //接口
        fs.readFile('./data.json', function(err, data){
            if(!err){
                response.writeHead(200, {"Content-Type": "application/json"});
                response.end(data);
            }else{
                throw err;
            }
        })
    } else {
        console.log("错误");
    }
});

// 让服务器监听8080端口:
server.listen(8080);
console.log('Server is running at http://127.0.0.1:8080/');
```

### Node.js框架之express与koa对比分析
* Express诞生已有时日，是一个简洁而灵活的web开发框架，使用简单而功能强大。Koa相对更为年轻，是Express框架原班人马基于ES6新特性重新开发的敏捷开发框架，
* Express和koa都是服务端的开发框架，服务端开发的重点是对HTTP Request和HTTP Response两个对象的封装和处理，应用的生命周期维护以及视图的处理等。
* [区别](https://developer.aliyun.com/article/3062)


### 对BFF有什么理解？
BFF，即 Backend For Frontend（服务于前端的后端），也就是服务器设计 API 时会考虑前端的使用，并在服务端直接进行业务逻辑的处理，又称为用户体验适配器。BFF 只是一种逻辑分层，而非一种技术。

### Node为什么支持[高并发](https://juejin.cn/post/6942037239064952869)？
Nodejs之所以单线程可以处理高并发的原因，得益于libuv层的事件循环机制，和底层线程池实现。
1. 前提：I/O密集型任务，如果是CPU密集型，也会产生阻塞。
2. 单线程的解释：主线程一个，底层工作线程多个。
3. 件机制的底层依赖库：libuv、libeio、libev。

### [node多线程](https://juejin.cn/post/6844903808330366989)
