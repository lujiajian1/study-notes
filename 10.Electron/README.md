## 桌面端 相对于 Web 开发的一些优势
* 无兼容性问题：不需要考虑不同浏览器兼容性问题
* 轻松绕过跨域问题：由于可以自由地访问本地文件系统和系统资源，也可以通过 Node.js 模块实现对底层操作系统的访问。这种能力使得 Electron 应用可以绕过浏览器的跨域限制，可以在本地环境中自由通信和交互，而无需担心同源策略带来的限制。
* 更快捷的入口
* 离线可用
* 调用系统能力（通知、硬件…）
* 安全需求

## 桌面端技术选型
| 框架 | 开发技术 | 生态系统	| 适用场景 | 安全性	| 安装包体积 |
|——|——|—–|—–|—–|—–|
| Electron | HTML、CSS、JavaScript、Chromium、Node.js | 比较老牌，有强大的社区支持	    | 功能丰富、跨平台的桌面应用，特别是网络相关的应用	      | 因为使用Chromium，需要注意安全漏洞。需谨慎处理外部内容 | 安装包较大，因为集成了Chromium，可能较大         |
| Tauri    | Rust、任何编程语言	                       | 快速成长的社区，灵活性高	       | 需要高性能、小体积的应用，对Rust有兴趣的开发者	        | 使用Rust语言提供更高的安全性，可以减少安全风险        | 相对较小的安装包，因为可以更精准地控制应用所需的依赖 |
| NW.js	   | HTML、CSS、JavaScript	                 | 用户群体相对较小	              | 类似的跨平台桌面应用，可能需要更多自行处理配置方面的工作 | 与Electron类似，需注意Chromium的安全问题            | 安装包体积较大，因为集成了Chromium              |
| Flutter	 | Dart语言、自有渲染引擎	                    | 迅速崛起的生态系统，Google支持 | 移动应用开发、同时可用于桌面和Web应用                 | Google支持和活跃的社区有助于安全性的维护             | 安装包体积较小，Flutter的渲染引擎可提供较小的包    |

Electron 优势，Electron 有着其强大的跨端能力、社区生态，更重要的是可以直接使用 HTML + JS + CSS 来开发桌面端应用程序，这对前端来说无疑是非常容易上手的，也有着无与伦比的开发效率和平滑的学习曲线。但是 Electron 也有着天然的短板，比如：Electron 相比其他 Native 来说，包体积和 CPU 资源占用较高；我们还需要额外解决一些安全性问题和性能体验问题。

## Electron 是什么？
Electron 是由 Github 开发的开源框架，它允许开发者使用 Web 技术构建跨平台桌面应用。
Electron 由 Node.js + Chromium + Native API 构成。你可以理解成，它是一个得到了 Node.js 和基于不同平台的 Native API 加强的 Chromium 浏览器。
![Electron](https://github.com/lujiajian1/study-notes/blob/main/img/electron.png)
![Electron-app](https://github.com/lujiajian1/study-notes/blob/main/img/electronapp.png)
![chromium](https://github.com/lujiajian1/study-notes/blob/main/img/chromium.png)
![electronipc](https://github.com/lujiajian1/study-notes/blob/main/img/electronipc.png)

## 主进程（main） 和 渲染进程（renderer）
Electron 继承了来自 Chromium 的多进程架构，Chromium 始于其主进程。从主进程可以派生出渲染进程。渲染进程与浏览器窗口是一个意思。主进程保存着对渲染进程的引用，并且可以根据需要创建/删除渲染器进程。
每个 Electron 的应用程序都有一个主入口文件，它所在的进程被称为 主进程（Main Process）。而主进程中创建的窗体都有自己运行的进程，称为 渲染进程（ Renderer Process）。每个 Electron 的应用程序有且仅有一个主进程，但可以有多个渲染进程。简单理解下，主进程就相当于浏览器，而渲染进程就相当于在浏览器上打开的一个个网页
![ipc](https://github.com/lujiajian1/study-notes/blob/main/img/ipc.png)

## 主进程
主进程是 Electron 应用程序的核心，通常由一个主要的 JavaScript 文件（如 main.js ）定义，你可以在 package.json 中指定它：
```json
// package.json
{  
    "name": "my-electron-app",  
    "version": "1.0.0",
    "description": "Hello World!",  
    // 主进程入口文件
    "main": "main.js",   
    "author": "lujiajian",  
    "devDependencies": {  
       // ...
    }  
}
```
它是应用程序的入口点，负责管理整个应用的生命周期、创建窗口、原生 API 调用等。主进程可以访问底层的系统资源，如文件系统、操作系统 API 等，这些功能通常是通过 Node.js 提供的模块实现的。它是 Electron 应用的主要控制中心。
![main](https://github.com/lujiajian1/study-notes/blob/main/img/main.png)

#### 管理应用程序生命周期
在 Electron 的主进程中，你可以使用 [app](https://www.electronjs.org/zh/docs/latest/api/app) 模块来管理应用程序的生命周期，该模块提供了一整套的事件和方法，可以让你用来添加自定义的应用程序行为。
```js
const { app } = require('electron')
// 当 Electron 完成初始化时触发
app.on('ready', () => {  
  app.quit()  
})
```
app 的常用生命周期钩子如下：
* will-finish-launching 在应用完成基本启动进程之后触发。
* ready 当 electron 完成初始化后触发。
* window-all-closed 所有窗口都关闭的时候触发，在 windows 和 linux 里，所有窗口都退出的时候通常是应用退出的时候。
* before-quit 退出应用之前的时候触发。
* will-quit 即将退出应用的时候触发。
* quit 应用退出的时候触发。
而我们通常会在 ready 的时候执行创建应用窗口、创建应用菜单、创建应用快捷键等初始化操作。而在 will-quit 或者 quit 的时候执行一些清空操作，比如解绑应用快捷键。
特别的，在非 macOS 的系统下，通常一个应用的所有窗口都退出的时候，也是这个应用退出之时。所以，可以配合 window-all-closed 这个钩子来实现：
```js
app.on('window-all-closed', () => {
  // 当操作系统不是darwin（macOS）的话
  if (process.platform !== 'darwin') { 
    // 退出应用
    app.quit()
  }
})
```

#### 创建窗口
主进程的主要目的之一是使用 [BrowserWindow](https://www.electronjs.org/zh/docs/latest/api/browser-window) 模块创建和管理应用程序窗口。窗口管理是指创建、控制和管理应用程序中的窗口。
```js
const { BrowserWindow } = require('electron')  

// 创建窗口
const win = new BrowserWindow({ width: 800, height: 1500 })  
win.loadURL('https://juejin.cn')  
  
// 窗口事件管理
win.on('closed', () => {
  win = undefined;
});

win.once('ready-to-show', () => {
  win.show();
});

// 窗口的尺寸控制
win.minimize();
win.setSize({width: xxx, height: xxx});
```
![BrowserWindow](https://github.com/lujiajian1/study-notes/blob/main/img/browserWindow.png)
跟app模块一样，BrowserWindow也有很多常用的事件钩子，比如：
* closed 当窗口被关闭的时候。
* focus 当窗口被激活的时候。
* show 当窗口展示的时候。
* hide 当窗口被隐藏的时候。
* maxmize 当窗口最大化时。
* minimize 当窗口最小化时。

#### 调用原生 API
为了使 Electron 的功能不仅仅限于对网页内容的封装，主进程也添加了自定义的 API 来与用户的操作系统进行交互。比如，和 客户端 GUI 相关的 右键菜单、窗⼝定制、系统托盘、Dock……，和 桌⾯环境集成 相关的系统通知、剪切板、系统快捷键、⽂件拖放……，和 设备 相关的电源监视、内存、CPU、屏幕 等等。
```js
const { clipboard, globalShortcut, Menu } = require('electron')  

// 向剪切板中写入文本
clipboard.writeText('hello world', 'selection')  
console.log(clipboard.readText('selection'))

// 注册全局快捷键
globalShortcut.register('CommandOrControl+X', () => {  
  console.log('CommandOrControl+X is pressed')  
})

// Dock
const dockMenu = Menu.buildFromTemplate([  
  {  
    label: '菜单一',  
    click () { console.log('菜单一') }  
  }, {  
    label: '菜单二',  
    submenu: [  
      { label: '子菜单' },  
    ]  
  },  
  { label: '菜单三' }  
])
```

## 渲染进程
渲染进程是 Electron 应用程序中负责展示用户界面的部分。每个渲染进程对应一个窗口（BrowserWindow）或者一个网页。通常由 HTML、CSS 和 JavaScript 构建用户界面。
渲染进程与主进程是分开的，它们之间通过 IPC（进程间通信）来进行通信。渲染进程可以通过一些特定的 Electron API 来与主进程进行交互，以实现诸如向主进程发送消息、接收主进程的指令等功能。
其实在 Electron 中，因为安全性等问题的考量，提供给 Renderer 可用的 API 是比较少的，我们可以简单看一下主进程和渲染进程可使用的 API 图：
![renderer](https://github.com/lujiajian1/study-notes/blob/main/img/renderer.png)
可以看到，能够在渲染进程中使用的 API 一共有 7 个。那么如果需要在渲染进程中使用主进程的 API 要怎么操作呢？Electron 本身额外提供了一个库 [@electron/remote](https://www.npmjs.com/package/@electron/remote)，使用这个库可以用来调用主进程的一些 API 能力：
```js
// 渲染进程
const { BrowserWindow } = require('@electron/remote')
let win = new BrowserWindow({ width: 800, height: 600 })
win.loadURL('https://juejin.cn')

// 主进程
require('@electron/remote/main').initialize()
```

## 预加载脚本 preload.js
预加载（preload）脚本包含了那些执行于渲染器进程中，且先于网页内容开始加载的代码。 在 preload.js 中，我们不仅可以使用 Node API，还可以直接使用 Electron 渲染进程的 API 以及 DOM API，另外可以通过 IPC 和主进程进行通信达成调用主进程模块的目的。preload.js 脚本虽运行于渲染器的环境中，却因此而拥有了更多的权限。
![preload](https://github.com/lujiajian1/study-notes/blob/main/img/preload.png)
预加载脚本可以在 BrowserWindow 构造方法中的 webPreferences 选项里被附加到主进程。
参考文档：[contextBridge](https://www.electronjs.org/zh/docs/latest/api/context-bridge)
```js
const { BrowserWindow } = require('electron')  
// ...  
const win = new BrowserWindow({  
  webPreferences: {  
    preload: 'preload.js'  
  }  
})  
// ...
// preload.js
const { contextBridge } = require('electron')  
const fs = require('fs')
  
contextBridge.exposeInMainWorld('myAPI', {  
  exists: fs.exists  
})
// renderer.js
console.log(window.myAPI)  
```
## 进程间通信（IPC）
进程间通信（IPC）并非仅限于 Electron，而是源自甚至早于 Unix 诞生的概念。

## ipcMain 和 ipcRenderer
与 Chromium 相同，Electron 使用进程间通信（IPC）来在进程之间进行通信，在介绍 Electron 进程间通信前，我们必须先认识一下 Electron 的 2 个模块。
* [ipcMain](https://www.electronjs.org/zh/docs/latest/api/ipc-main) 是一个仅在主进程中以异步方式工作的模块，用于与渲染进程交换消息。
* [ipcRenderer](https://www.electronjs.org/zh/docs/latest/api/ipc-renderer) 是一个仅在渲染进程中以异步方式工作的模块，用于与主进程交换消息。
ipcMain 和 ipcRenderer 是 Electron 中负责通信的两个主要模块。它们继承自 NodeJS 的 [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter) 模块。在 EventEmitter 中允许我们向指定 channel 发送消息。channel 是一个字符串，在 Electron 中 ipcMain 和 ipcRenderer 使用它来发出和接收事件/数据。
```js
// 接受消息
// EventEmitter: ipcMain / ipcRenderer
EventEmitter.on("string", function callback(event, messsage) {});

// 发送消息
// EventEmitter: win.webContents / ipcRenderer
EventEmitter.send("string", "mydata");
```

## 渲染进程 -> 主进程
大多数情况下的通信都是从渲染进程到主进程，渲染进程依赖 ipcRenderer 模块给主进程发送消息，官方提供了三个方法：
（注：channel 表示的就是事件名(消息名称)， args 是参数。需要注意的是参数将使用结构化克隆算法进行序列化，就像浏览器的 window.postMessage 一样，因此不会包含原型链。发送函数、Promise、Symbol、WeakMap 或 WeakSet 将会抛出异常。）
1. ipcRenderer.send(channel, ...args) 这个方法是异步的，用于从渲染进程向主进程发送消息。它发送消息后不会等待主进程的响应，而是立即返回，适合在不需要等待主进程响应的情况下发送消息。
渲染进程通过 ipcRenderer.send 发送消息：
```js
// render.js
import { ipcRenderer } from 'electron';

function sendMessageToMain() {
  ipcRenderer.send('my_channel', 'my_data');
}
```
主进程通过 ipcMain.on 来接收消息：
```js
// main.js
import { ipcMain } from 'electron';

ipcMain.on('my_channel', (event, message) => {
  console.log(`receive message from render: ${message}`) 
})
```
请注意，如果使用 send 来发送数据，如果你的主进程需要回复消息，那么需要使用 event.replay 来进行回复：
```js
// main.js
import { ipcMain } from 'electron';

ipcMain.on('my_channel', (event, message) => {
  console.log(`receive message from render: ${message}`)
  event.reply('reply', 'main_data')
})
```
同时，渲染进程需要进行额外的监听：
```js
// renderer.js
ipcRenderer.on('reply', (event, message) => { 
  console.log('replyMessage', message);
})
```
2. ipcRenderer.invoke(channel, ...args) 这个方法也是用于从渲染进程向主进程发送消息，但是它是一个异步的方法，可以方便地在渲染进程中等待主进程返回 Promise 结果。相对于 send 和 sendSync，它更适合处理异步操作，例如主进程返回 Promise 的情况。
渲染进程通过 ipcRenderer.invoke 发送消息：
```js
// render.js
import { ipcRenderer } from 'electron';

async function invokeMessageToMain() {
  const replyMessage = await ipcRenderer.invoke('my_channel', 'my_data');
  console.log('replyMessage', replyMessage);
}
```
主进程通过 ipcMain.handle 来接收消息：
```js
// main.js
import { ipcMain } from 'electron';
ipcMain.handle('my_channel', async (event, message) => {
  console.log(`receive message from render: ${message}`);
  return 'replay';
});
```
注意，渲染进程通过 ipcRenderer.invoke 发送消息后，invoke 的返回值是一个 Promise<pending> 。主进程回复消息需要通过 return 的方式进行回复，而 ipcRenderer 只需要等到 Promise resolve 即可获取到返回的值。
3. ipcRenderer.sendSync(channel, ...args) 与 ipcRenderer.send 不同，这个方法是同步的，也是用于从渲染进程向主进程发送消息，但是它会等待主进程返回响应。它会阻塞当前进程，直到收到主进程的返回值或者超时。
渲染进程通过 ipcRender.sendSync 来发送消息：
```js
// render.js
import { ipcRenderer } from 'electron';

async function sendSyncMessageToMain() {
  const replyMessage = await ipcRenderer.sendSync('my_channel', 'my_data');
  console.log('replyMessage', replyMessage);
}
```
主进程通过 ipcMain.on 来接收消息：
```js
// main.js
import { ipcMain } from 'electron';
ipcMain.on('my_channel', async (event, message) => {
  console.log(`receive message from render: ${message}`);
  event.returnValue = 'replay';
});
```
注意，渲染进程通过 ipcRenderer.sendSync 发送消息后，主进程回复消息需要通过 e.returnValue 的方式进行回复，如果 event.returnValue 不为 undefined 的话，渲染进程会等待 sendSync 的返回值才执行后面的代码。
发送同步消息将阻止整个渲染过程直到收到回复。这样使用此方法只能作为最后手段。使用异步版本更好 invoke()。

## 主进程 -> 渲染进程
主进程向渲染进程发送消息一种方式是当渲染进程通过 ipcRenderer.send、ipcRenderer.sendSync、ipcRenderer.invoke 向主进程发送消息时，主进程通过 event.replay、event.returnValue、return ... 的方式进行发送。这种方式是被动的，需要等待渲染进程先建立消息推送机制，主进程才能进行回复。
其实除了上面说的几种被动接收消息的模式进行推送外，还可以通过 webContents 模块进行消息通信。

1. ipcMain 和 webContents
主进程使用 ipcMain 模块来监听来自渲染进程的事件，通过 event.sender.send() 方法向渲染进程发送消息。
```js
// 主进程
import { ipcMain, BrowserWindow } from 'electron';

ipcMain.on('messageFromMain', (event, arg) => {
  event.sender.send('messageToRenderer', 'Hello from Main!');
});
```
2. BrowserWindow.webContents.send
BrowserWindow.webContents.send 可以在主进程中直接使用 BrowserWindow 对象的 webContents.send() 方法向渲染进程发送消息。
```js
// 主进程
import { BrowserWindow } from 'electron';

const mainWindow = new BrowserWindow();
mainWindow.loadFile('index.html');

// 在某个事件或条件下发送消息
mainWindow.webContents.send('messageToRenderer', 'Hello from Main!');
```
不管是通过 event.sender.send() 还是 BrowserWindow.webContents.send 的方式，如果你只是单窗口的数据通信，那么本质上是没什么差异的。
但是如果你想要发送一些数据到特定的窗口，那么你可以直接使用 BrowserWindow.webContents.send 这种方式。

## 渲染进程 -> 渲染进程
默认情况下，渲染进程和渲染进程之间是无法直接进行通信的，既然说的是无法直接通信，那么肯定还有一些“曲线救国”的方式。
![renderertorenderer](https://github.com/lujiajian1/study-notes/blob/main/img/renderertorenderer.png)

1. 利用主进程作为中间人
首先，需要在主进程注册一个事件监听程序，监听来自渲染进程的事件：
```js
// main.js

// window 1
function createWindow1 () {
  window1 = new BrowserWindow({width: 800,height: 600})
  window1.loadURL('window1.html')
  window1.on('closed', function () {
     window1 = null
  })
  return window1
}

// window 2
function createWindow2 () {
  window2 = new BrowserWindow({width: 800, height: 600})
  window2.loadURL('window2.html')
  window2.on('closed', function () {
    window2 = null
  })
  return window2
}

app.on('ready', () => {
  createWindow1();
  createWindow2();
  ipcMain.on('win1-msg', (event, arg) => {
    // 这条消息来自 window 1
    console.log("name inside main process is: ", arg); 
    // 发送给 window 2 的消息.
    window2.webContents.send( 'forWin2', arg );
  });
})
```
然后在 window2 窗口建立一个监听事件：
```js
ipcRenderer.on('forWin2', function (event, arg){
  console.log(arg);
});
```
这样，window1 发送的 win1-msg 事件，就可以传输到 window2：
```js
ipcRenderer.send('win1-msg', 'msg from win1');
```
2. 使用 MessagePort
上面的传输方式虽然可以实现渲染进程之间的通信，但是非常依赖主进程，写起来也比较麻烦，那有什么不依赖于主进程的方式嘛？那当然也是有的，那就是 MessagePort。
MessagePort 并不是 Electron 提供的能力，而是基于 MDN 的 Web 标准 API，这意味着它可以在渲染进程直接创建。同时 Electron 提供了 node.js 侧的实现，所以它也能在主进程创建。
接下来，我们将通过一个示例来描述如何通过 MessagePort 来实现渲染进程之间的通信。
主进程中创建 MessagePort
```js
import { BrowserWindow, app, MessageChannelMain } from 'electron';

app.whenReady().then(async () => {
  // 创建窗口
  const mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      contextIsolation: false,
      preload: 'preloadMain.js'
    }
  })

  const secondaryWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      contextIsolation: false,
      preload: 'preloadSecondary.js'
    }
  })

  // 建立通道
  const { port1, port2 } = new MessageChannelMain()

  // webContents准备就绪后，使用postMessage向每个webContents发送一个端口。
  mainWindow.once('ready-to-show', () => {
    mainWindow.webContents.postMessage('port', null, [port1])
  })

  secondaryWindow.once('ready-to-show', () => {
    secondaryWindow.webContents.postMessage('port', null, [port2])
  })
})
```
实例化 MessageChannel 类之后，就产生了两个 port： port1 和 port2。接下来只要让 渲染进程1 拿到 port1、渲染进程2 拿到 port2，那么现在这两个进程就可以通过 port.onmessage 和 port.postMessage 来收发彼此间的消息了。如下：
```js
// mainWindow
port1.onmessage = (event) => {
  console.log('received result:', event.data)
};
port1.postMessage('我是渲染进程一发送的消息');

// secondaryWindow
port2.onmessage = (event) => {
  console.log('received result:', event.data)
};
port2.postMessage('我是渲染进程二发送的消息');
```
有了上面的知识，我们最重要的任务就是需要获取主进程中创建的 port 对象，要做的是在你的预加载脚本（preload.js）中通过 IPC 接收 port，并设置相应的监听器。
```js
// preloadMain.js
// preloadSecondary.js
const { ipcRenderer } = require('electron')

ipcRenderer.on('port', e => {
  // 接收到端口，使其全局可用。
  window.electronMessagePort = e.ports[0]

  window.electronMessagePort.onmessage = messageEvent => {
    // 处理消息
  }
})
```
通过上面的一些操作后，就可以在应用程序的任何地方调用 postMessage 方法向另一个渲染进程发送消息。
```js
// mainWindow renderer.js
// 在 renderer 的任何地方都可以调用 postMessage 向另一个进程发送消息
window.electronMessagePort.postMessage('ping')
```

## 原生能力
![native](https://github.com/lujiajian1/study-notes/blob/main/img/native.png)
![nativeapp](https://github.com/lujiajian1/study-notes/blob/main/img/nativeapp.png)

## Electron 与 React 框架结合

## Electron 应用打包

## Electron 应用更新

## Electron 崩溃监控关键步骤