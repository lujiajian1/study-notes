# 虚拟DOM与fiber
React 本身只是一个 DOM 的抽象层，使用组件构建虚拟 DOM。

## 虚拟DOM（react virtual dom）
用 JavaScript 对象表示 DOM 信息和结构，当状态变更的时候，重新渲染这个 JavaScript 的对象结构。这个 JavaScript 对象称为virtual dom。
![虚拟dom](https://github.com/lujiajian1/geek-notes/blob/main/img/vdom1.png)

#### 传统dom渲染流程
DOM操作很慢，轻微的操作都可能导致页面重新排版，非常耗性能。相对于DOM对象，js对象处理起来更快，而且更简单。通过diff算法对比新旧vdom之间的差异，可以批量的、最小化的执行dom操作，从而提升用户体验。
![传统dom渲染流程](https://github.com/lujiajian1/geek-notes/blob/main/img/dom.png)

#### 为什么需要虚拟DOM
DOM操作很慢，轻微的操作都可能导致页面重新排版，非常耗性能。相对于DOM对象，js对象处理起来更快，而且更简单。通过diff算法对比新旧vdom之间的差异，可以批量的、最小化的执行dom操作，从而提升用户体验。

#### 为什么不直接 diff DOM对象
DOM对象中的属性是非常多的，而大部分的属性是我们不会操作，也不会修改的，如果直接使用DOM对象diff，是非常消耗性能的，虚拟DOM就是把我们经常使用的属性抽取出来,放在一个对象中,然后通过diff算法对比新老vdom区别从而做出最终dom操作。

#### React哪里使用了虚拟DOM
React中用JSX语法描述视图(View)，~~通过babel-loader转译后它们变为 React.createElement(...)形式，该函数将生成vdom来描述真实dom。将来如果状态变化，vdom将作出相应变化，再通过diff算法对比新老vdom区别从而做出最终dom操作。（最新的jsx已经不用React.createElement(...)了，因为和balel合作了，集成了）

#### JSX
这个有趣的标签语法既不是字符串也不是 HTML，它是 JSX，是一个 JavaScript 的语法扩展，JSX 可以生成 React “元素”。从本质上来说，JSX 并不是一个新的模板语言，而可以认为是一个语法糖。也就是说，不用 JSX 的写法，使用React.createElement也是能够写React 的。

#### 为什么需要JSX
* 为什么不使用 vue 那样的模板语言：React 认为渲染逻辑本质上与其他 UI 逻辑内在耦合，React 没有采用将标记与逻辑进行分离到不同文件这种人为地分离方式，而是通过将二者共同存放在称之为“组件”的松散耦合单元之中，来实现关注点分离。
* 开发效率：使用 JSX 编写模板简单快速。
* 执行效率：JSX编译为 JavaScript 代码后进行了优化，执行更快。
* 类型安全：在编译过程中就能发现错误。

#### 与vue的异同
* react中虚拟dom+jsx的设计一开始就有，vue则是演进过程中才出现的
* jsx本来就是js扩展，转义过程简单直接的多；vue把 template 编译为 render函数 的过程需要复杂的编译器转换字符串-ast-js函数字符串。

## diffing算法

#### [reconciliation协调](https://zh-hans.reactjs.org/docs/reconciliation.html)
在某一时间节点调用 React 的 `render()` 方法，会创建一棵由 React 元素组成的树。在下一次 state 或 props 更新时，相同的 `render()` 方法会返回一棵不同的树。React 需要基于这两棵树之间的差别来判断如何有效率的更新 UI 以保证当前 UI 与最新的树保持同步。
这个算法问题有一些通用的解决方案，即生成将一棵树转换成另一棵树的最小操作数。 然而，即使在[最前沿的算法中](http://grfia.dlsi.ua.es/ml/algorithms/references/editsurvey_bille.pdf)，该算法的复杂程度为 O(n3)，其中 n 是树中元素的数量。
如果在 React 中使用了该算法，那么展示 1000 个元素所需要执行的计算量将在十亿的量级范围。这个开销实在是太过高昂。于是 React 在以下两个假设的基础之上提出了一套 O(n) 的启发式算法，并且在实践中，我们发现以下假设在几乎所有实用的场景下都成立。
1. 两个不同类型的元素会产生出不同的树。
2. 开发者可以通过 `key` prop 来暗示哪些子元素在不同的渲染下能保持稳定。

#### diff 策略
1. 同级比较，Web UI 中 DOM 节点跨层级的移动操作特别少，可以忽略不计。
2. 拥有不同类型的两个组件将会生成不同的树形结构。例如：div->p, CompA->CompB
3. 开发者可以通过 `key` prop 来暗示哪些子元素在不同的渲染下能保持稳定。

#### diff过程
比对两个虚拟dom时会有三种操作：删除、替换和更新，vnode是现在的虚拟dom，newVnode是新虚拟dom。在实践中也证明这三个前提策略是合理且准确的，它保证了整体界面构建的性能。
* 删除：newVnode不存在时
* 替换：vnode和newVnode类型不同或key不同时
* 更新：有相同类型和key但vnode和newVnode不同时

## fiber

#### 为什么需要fiber
[React Conf 2017 Fiber介绍视频](https://www.youtube.com/watch?v=ZCuYPiUIONs)
1. 对于大型项目，组件树会很大，这个时候递归遍历的成本就会很高，会造成主线程被持续占用，结果就是主线程上的布局、动画等周期性任务就无法立即得到处理，造成视觉上的卡顿，影响用户体验。
2. 任务分解的意义，解决一次递归遍历成本过高问题。
3. 增量渲染（把渲染任务拆分成块，匀到多帧）。
4. 更新时能够暂停，终止，复用渲染任务。
5. 给不同类型的更新赋予优先级。
6. 并发方面新的基础能力
7. 更流畅

#### 什么是fiber
A Fiber is work on a Component that needs to be done or was done. There can be more than one per component.
fiber是指组件上将要完成或者已经完成的任务，每个组件可以一个或者多个。简而言之，fiber就是v16之后的虚拟DOM（结构变化的VDOM）（React在遍历的节点的时候，并不是真正的DOM，而是采用虚拟的DOM）。
![preview](https://github.com/lujiajian1/geek-notes/blob/main/img/preview.jpeg)

# fiber构建与任务执行

## 组件类型
* 文本节点
* HTML标签节点
* 函数组件
* 类组件
* 等等
```js
// 源码文件路径：src/react/packages/react-reconciler/src/ReactWorkTags.js
export const FunctionComponent = 0;
export const ClassComponent = 1;
export const IndeterminateComponent = 2; // Before we know whether it is function or class
export const HostRoot = 3; // Root of a host tree. Could be nested inside another node.
export const HostPortal = 4; // A subtree. Could be an entry point to a different renderer.
export const HostComponent = 5;
export const HostText = 6;
export const Fragment = 7;
export const Mode = 8;
export const ContextConsumer = 9;
export const ContextProvider = 10;
export const ForwardRef = 11;
export const Profiler = 12;
export const SuspenseComponent = 13;
export const MemoComponent = 14;
export const SimpleMemoComponent = 15;
export const LazyComponent = 16;
export const IncompleteClassComponent = 17;
export const DehydratedFragment = 18;
export const SuspenseListComponent = 19;
export const ScopeComponent = 21;
export const OffscreenComponent = 22;
export const LegacyHiddenComponent = 23;
export const CacheComponent = 24;
```

## fiber结构
![fiber结构](https://github.com/lujiajian1/geek-notes/blob/main/img/fiber.png)

## 生成fiber
```js
import {
  ClassComponent,
  Fragment,
  FunctionComponent,
  HostComponent,
  HostText,
} from "./ReactWorkTags";
import { isFn, isStr, isUndefined, Placement } from "./utils";

export function createFiber(vnode, returnFiber) {
  const fiber = {
    // 类型
    type: vnode.type,
    key: vnode.key,
    // 属性
    props: vnode.props,
    // 不同类型的组件， stateNode也不同
    // 原生标签 dom节点
    // class 实例
    stateNode: null,

    // 第一个子fiber
    child: null,
    // 下一个兄弟节点
    sibling: null,
    return: returnFiber,

    flags: Placement,

    // 记录节点在当前层级下的位置
    index: null,
  };

  const { type } = vnode;

  if (isStr(type)) {
    fiber.tag = HostComponent;
  } else if (isFn(type)) {
    // todo 函数以及类组件
    fiber.tag = type.prototype.isReactComponent
      ? ClassComponent
      : FunctionComponent;
  } else if (isUndefined(type)) {
    fiber.tag = HostText;
    fiber.props = { children: vnode };
  } else {
    fiber.tag = Fragment;
  }

  return fiber;
}
```

## 执行任务
```js
// 原则：深度优先遍历（王朝的故事）
let wip = null;

function performUnitOfWork() {
  const { tag } = wip;
  // todo 1. 更新当前组件
  switch (tag) {
    case HostComponent:
      updateHostComponent(wip);
      break;

    case FunctionComponent:
      updateFunctionComponent(wip);
      break;

    case ClassComponent:
      updateClassComponent(wip);
      break;
    case Fragment:
      updateFragmentComponent(wip);
      break;
    case HostText:
      updateHostTextComponent(wip);
      break;
    default:
      break;
  }
  // todo 2. 下一个更新谁 深度优先遍历 （国王的故事）
  if (wip.child) {
    wip = wip.child;
    return;
  }
  let next = wip;
  while (next) {
    if (next.sibling) {
      wip = next.sibling;
      return;
    }
    next = next.return;
  }
  wip = null;
}
```

## 工具函数
```js
// utils.js
// ! flags定义为二进制，而不是字符串或者单个数字，一方面原因是因为二进制单个数字具有唯一性、某个范围内的组合同样具有唯一性，另一方原因在于简洁方便、且速度快。
export const NoFlags = /*                      */ 0b00000000000000000000;
// 新增、插入
export const Placement = /*                    */ 0b0000000000000000000010; // 2
// 节点更新属性
export const Update = /*                       */ 0b0000000000000000000100; // 4
// 删除
export const Deletion = /*                     */ 0b0000000000000000001000; // 8
export function isStr(s) {
  return typeof s === "string";
}
export function isStringOrNumber(s) {
  return typeof s === "string" || typeof s === "number";
}
export function isFn(fn) {
  return typeof fn === "function";
}
export function isArray(arr) {
  return Array.isArray(arr);
}
export function isUndefined(s) {
  return s === undefined;
}
export function updateNode(node, nextVal) {
  Object.keys(nextVal).forEach((k) => {
    if (k === "children") {
      if (isStringOrNumber(nextVal[k])) {
        node.textContent = nextVal[k];
      }
    } else {
      node[k] = nextVal[k];
    }
  });
}
```

# React如何开始渲染

## ReactDOM.createRoot替换ReactDOM.render
React18中将会使用最新的ReactDOM.createRoot作为根渲染函数，ReactDOM.render作为兼容，依然会存在，但是会成为遗留模式，开发环境下会出现warning。
```jsx
const jsx = (
  <div className="border">
    <h1>react</h1>
    <a href="https://github.com/bubucuo/mini-react">mini react</a>
    <FunctionComponent name="函数组件" />
    <ClassComponent name="类组件" />
    <FragmentComponent />
  </div>
);

ReactDOM.createRoot(document.getElementById("root")).render(jsx);
```

## 实现ReactDOM.createRoot
```jsx
import createFiber from "./createFiber";
// work in progress; 当前正在工作中的
import {scheduleUpdateOnFiber} from "./ReactFiberWorkLoop";

function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot;
}

ReactDOMRoot.prototype.render = function(children) {
  const root = this._internalRoot;

  updateContainer(children, root);
};

function createRoot(container) {
  const root = {
    containerInfo: container,
  };

  return new ReactDOMRoot(root);
}

function updateContainer(element, container) {
  const {containerInfo} = container;
  const fiber = createFiber(element, {
    type: containerInfo.nodeName.toLowerCase(),
    stateNode: containerInfo,
  });
  scheduleUpdateOnFiber(fiber);
}

// function render(element, container) {
//   updateContainer(element, {containerInfo: container});
// }

export default {
  // render,
  createRoot,
};
```

# 初次渲染原生节点

## window.requestIdleCallback(callback[, options])
window.requestIdleCallback() 方法将在浏览器的空闲时段内调用的函数排队。这使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应。函数一般会按先进先调用的顺序执行，然而，如果回调函数指定了执行超时时间 timeout，则有可能为了在超时前执行函数而打乱执行顺序。
你可以在空闲回调函数中调用 requestIdleCallback()，以便在下一次通过事件循环之前调度另一个回调。
* callback：一个在事件循环空闲时即将被调用的函数的引用。函数会接收到一个名为 [IdleDeadline](https://developer.mozilla.org/zh-CN/docs/Web/API/IdleDeadline) 的参数，这个参数可以获取当前空闲时间以及回调是否在超时时间前已经执行的状态。
* options 可选：包括可选的配置参数。具有如下属性：
    * timeout：如果指定了 timeout 并具有一个正值，并且尚未通过超时毫秒数调用回调，那么回调会在下一次空闲时期被强制执行，尽管这样很可能会对性能造成负面影响。
Fiber 是 React 16 中新的协调引擎。它的主要目的是使 Virtual DOM 可以进行增量式渲染。一个更新过程可能被打断，所以 React Fiber 一个更新过程被分为两个阶段(Phase)：第一个阶段 Reconciliation Phase 和第二阶段 Commit Phase。

## 提交阶段
```jsx
let wip = null; // work in progress 当前正在工作中的
let wipRoot = null;
// 初次渲染和更新
export function scheduleUpdateOnFiber(fiber) {
  wip = fiber;
  wipRoot = fiber;
}

function performUnitOfWork() {
  const { tag } = wip;

  // todo 1. 更新当前组件
  switch (tag) {
    case HostComponent:
      updateHostComponent(wip);
      break;

    case FunctionComponent:
      updateFunctionComponent(wip);
      break;

    case ClassComponent:
      updateClassComponent(wip);
      break;
    case Fragment:
      updateFragmentComponent(wip);
      break;
    case HostText:
      updateHostTextComponent(wip);
      break;
    default:
      break;
  }

  // todo 2. 下一个更新谁 深度优先遍历 （国王的故事）
  if (wip.child) {
    wip = wip.child;
    return;
  }

  let next = wip;

  while (next) {
    if (next.sibling) {
      wip = next.sibling;
      return;
    }
    next = next.return;
  }

  wip = null;
}

function workLoop(IdleDeadline) {
  while (wip && IdleDeadline.timeRemaining() > 0) {
    performUnitOfWork();
  }

  if (!wip && wipRoot) {
    commitRoot();
  }
}

requestIdleCallback(workLoop);

function commitRoot() {
  commitWorker(wipRoot);
  wipRoot = null;
}

function commitWorker(wip) {
  if (!wip) {
    return;
  }
  // 1. 更新自己
  const parentNode = getParentNode(wip.return); /// wip.return.stateNode;
  const { flags, stateNode } = wip;
  if (flags & Placement && stateNode) {
    parentNode.appendChild(stateNode);
  }
  // 2. 更新子节点
  commitWorker(wip.child);
  // 2. 更新兄弟节点
  commitWorker(wip.sibling);
}

function getParentNode(wip) {
  let tem = wip;
  while (tem) {
    if (tem.stateNode) {
      return tem.stateNode;
    }
    tem = tem.return;
  }
}
```

## 更新属性
```jsx
export function updateNode(node, nextVal) {
  Object.keys(nextVal).forEach((k) => {
    if (k === "children") {
      if (isStringOrNumber(nextVal[k])) {
        node.textContent = nextVal[k] + "";
      }
    } else {
      node[k] = nextVal[k];
    }
  });
}
```

## 遍历子节点
```jsx
import createFiber from "./ReactFiber";
import { isArray, isStringOrNumber, updateNode } from "./utils";

// 原生标签函数
export function updateHostComponent(wip) {
  if (!wip.stateNode) {
    wip.stateNode = document.createElement(wip.type);
    // 属性
    updateNode(wip.stateNode, wip.props);
  }
  // 子节点
  reconcileChildren(wip, wip.props.children);
}

function reconcileChildren(wip, children) {
  if (isStringOrNumber(children)) {
    return;
  }

  const newChildren = isArray(children) ? children : [children];
  let previousNewFiber = null;
  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i];
    if (newChild == null) {
      continue;
    }
    const newFiber = createFiber(newChild, wip);

    if (previousNewFiber === null) {
      // head node
      wip.child = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }

    previousNewFiber = newFiber;
  }
}
```

# 初次渲染函数组件、类组件、文本节点与Fragment节点

## 标记fiber类型的属性tag
```js
// 所有的tag：src/react/packages/react-reconciler/src/ReactWorkTags.js
export const FunctionComponent = 0;
export const ClassComponent = 1;
export const IndeterminateComponent = 2; // Before we know whether it is function or class
export const HostRoot = 3; // Root of a host tree. Could be nested inside another node.
export const HostPortal = 4; // A subtree. Could be an entry point to a different renderer.
export const HostComponent = 5;
export const HostText = 6;
export const Fragment = 7;
export const Mode = 8;
export const ContextConsumer = 9;
export const ContextProvider = 10;
export const ForwardRef = 11;
export const Profiler = 12;
export const SuspenseComponent = 13;
export const MemoComponent = 14;
export const SimpleMemoComponent = 15;
export const LazyComponent = 16;
export const IncompleteClassComponent = 17;
export const DehydratedFragment = 18;
export const SuspenseListComponent = 19;
export const ScopeComponent = 21;
export const OffscreenComponent = 22;
export const LegacyHiddenComponent = 23;
export const CacheComponent = 24;
```
```js
// 标记到fiber上
import { Fragment } from "react";
import {
  HostComponent,
  ClassComponent,
  FunctionComponent,
  HostText,
} from "./ReactWorkTags";
import { isFn, isStr, isUndefined, Placement } from "./utils";

export function createFiber(vnode, returnFiber) {
  const fiber = {
    type: vnode.type,
    key: vnode.key,
    props: vnode.props,
    // 原生标签 DOM
    // class组件 实例
    stateNode: null,

    // 第一个子fiber
    child: null,
    // 下一个兄弟fiber
    sibling: null,
    return: returnFiber,

    // 标记fiber任务类型，节点插入、更新、删除
    flags: Placement,

    index: null,
  };

  // 定义tag，标记节点类型
  const { type } = vnode;

  if (isStr(type)) {
    fiber.tag = HostComponent;
  } else if (isFn(type)) {
    fiber.tag = type.prototype.isReactComponent
      ? ClassComponent
      : FunctionComponent;
  } else if (isUndefined(type)) {
    fiber.tag = HostText;
    fiber.props = { children: vnode };
  } else {
    fiber.tag = Fragment;
  }

  return fiber;
}
```

### 判断组件类型执行任务
```js
// 根据fiber.tag判断任务类型
function performUnitOfWork() {
  const { tag } = wip;
  switch (tag) {
    // 原生标签
    case HostComponent:
      updateHostComponent(wip);
      break;
    // 文本
    case HostText:
      updateTextComponent(wip);
      break;
    // 函数组件
    case FunctionComponent:
      updateFunctionComponent(wip);
      break;
    // 类组件
    case ClassComponent:
      updateClassComponent(wip);
      break;
    case Fragment:
      updateFragmentComponent(wip);
      break;
  }

  // 深度优先遍历(国王的故事)
  if (wip.child) {
    wip = wip.child;
    return;
  }

  let next = wip;

  while (next) {
    if (next.sibling) {
      wip = next.sibling;
      return;
    }
    next = next.return;
  }
  wip = null;
}
```

## 函数组件
该函数是一个有效的 React 组件，因为它接收唯一带有数据的 “props”（代表属性）对象与并返回一个 React 元素。这类组件被称为“函数组件”，因为它本质上就是 JavaScript 函数。
```jsx
function FunctionComponent(props) {
  return (
    <div className="border">
      <p>{props.name}</p>
    </div>
  );
}
```
函数组件的任务执行函数：
```js
// 协调（diff）
function reconcileChildren(wip, children) {
  if (isStringOrNumber(children)) {
    return;
  }

  const newChildren = isArray(children) ? children : [children];
  let previousNewFiber = null;
  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i];
    if (newChild == null) {
      continue;
    }
    const newFiber = createFiber(newChild, wip);

    if (previousNewFiber === null) {
      // head node
      wip.child = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }

    previousNewFiber = newFiber;
  }
}

function updateFunctionComponent(wip) {
  const { type, props } = wip;

  const children = type(props);
  reconcileChildren(wip, children);
}
```

## 类组件
React 的组件可以定义为 class 或函数的形式。如需定义 class 组件，需要继承 React.Component 或者 React.PureComponent：
```jsx
class ClassComponent extends Component {
  render() {
    return (
      <div>
        <h3>{this.props.name}</h3>
      </div>
    );
  }
}
```
类组件的任务执行函数：
```js
function updateClassComponent(wip) {
  const { type, props } = wip;
  const instance = new type(props);
  const children = instance.render();

  reconcileChildren(wip, children);
}
```

## 类组件源码
![类组件源码](https://github.com/lujiajian1/geek-notes/blob/main/img/classComponent.png)

## 文本节点
当原生标签只有一个文本的时候，这个文本可以当做属性，通过textContent加到dom节点上。当原生标签有别的组件和文本的时候，此时的文本我们通过document.createTextNode生成dom节点。
```jsx
class ClassComponent extends Component {
  render() {
    return (
      <div className="border">
        <h3>{this.props.name}</h3>
        我是文本
      </div>
    );
  }
}
```
文本节点的任务执行函数：
```js
// 文本
export function updateTextComponent(wip) {
  wip.stateNode = document.createTextNode(wip.props.children);
}
```
## Fagment
React 中的一个常见模式是一个组件返回多个元素。Fragments 允许你将子列表分组，而无需向 DOM 添加额外节点。
```jsx
function FragmentComponent() {
  return (
    <ul>
      <React.Fragment>
        <li>part1</li>
        <li>part2</li>
      </React.Fragment>
    </ul>
  );
}
```
也可以使用一种新的，且更简短的语法来声明 Fragments，它看起来像空标签，除了它不支持 key 或属性。key 是唯一可以传递给 Fragment 的属性。未来可能会添加对其他属性的支持，例如事件。
```jsx
function FragmentComponent() {
  return (
    <ul>
      <>
        <li>part1</li>
        <li>part2</li>
      </>
    </ul>
  );
}
```
Fragment节点我们也只有子节点可以更新了，当然你也可以通过document.createDocumentFragment添加dom片段，只是没必要~
```js
export function updateFragmentComponent(wip) {
  const { type, props } = wip;
  reconcileChildren(wip, wip.props.children);
}
```

# React任务调度与最小堆
[三分钟带你彻底读懂React任务调度以及背后的算法](https://juejin.cn/post/7051878454433677319)

# 任务调度

## [Performance.now()](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance/now)
和JavaScript中其他可用的时间类函数（比如 Date.now ）不同的是，window.performance.now() 返回的时间戳没有被限制在一毫秒的精确度内，相反，它们以浮点数的形式表示时间，精度最高可达微秒级。
另外一个不同点是， window.performance.now() 是以一个恒定的速率慢慢增加的，它不会受到系统时间的影响（系统时钟可能会被手动调整或被NTP等软件篡改）。另外，performance.timing.navigationStart + performance.now() 约等于 Date.now()。

## [MessageChannel](https://developer.mozilla.org/zh-CN/docs/Web/API/MessageChannel)
![messageChannel](https://github.com/lujiajian1/geek-notes/blob/main/img/messageChannel.png)
```js
const channel = new MessageChannel();
const {port1, port2} = channel;
port1.onmessage = function(msgEvent) {
  console.log("port1 收到消息：" + msgEvent.data); //sy-log
  port1.postMessage("port2 请相应");
};

port2.onmessage = function(msgEvent) {
  console.log("port2 收到消息：", msgEvent.data); //sy-log
};

port2.postMessage("port1 请相应");
```



## 调度
React下有个包叫scheduler，它用于处理浏览器环境中的任务调度，现在只用于了React内部，但是据计划是要做成通用库的。现在开放的公共API还没有完成，还处于开发阶段。
```js
// 实现最小堆
// 返回最小堆堆顶元素
export function peek(heap) {
  return heap.length === 0 ? null : heap[0];
}

// 往最小堆中插入元素
// 1. 把node插入数组尾部
// 2.  往上调整最小堆（比较子节点和父节点谁最小，如果父节点不是最小，则交换位置，并继续往上调整）
export function push(heap, node) {
  let index = heap.length;
  heap.push(node);
  siftUp(heap, node, index);
}

function siftUp(heap, node, i) {
  let index = i;

  while (index > 0) {
    const parentIndex = (index - 1) >> 1;
    const parent = heap[parentIndex];
    if (compare(parent, node) > 0) {
      // parent>node， 不符合最小堆条件
      heap[parentIndex] = node;
      heap[index] = parent;
      index = parentIndex;
    } else {
      return;
    }
  }
}

// 删除堆顶元素
// 1. 最后一个元素覆盖堆顶
// 2. 向下调整
export function pop(heap) {
  if (heap.length === 0) {
    return null;
  }
  const fisrt = heap[0];
  const last = heap.pop();

  if (fisrt !== last) {
    heap[0] = last;
    siftDown(heap, last, 0);
  }

  return fisrt;
}

function siftDown(heap, node, i) {
  let index = i;
  const len = heap.length;
  const halfLen = len >> 1;
  while (index < halfLen) {
    const leftIndex = (index + 1) * 2 - 1;
    const rightIndex = leftIndex + 1;
    const left = heap[leftIndex];
    const right = heap[rightIndex];

    if (compare(left, node) < 0) {
      // left < node,
      // ? left、right
      if (rightIndex < len && compare(right, left) < 0) {
        // right 最小， 交换right和parent
        heap[index] = right;
        heap[rightIndex] = node;
        index = rightIndex;
      } else {
        // 没有right或者left<right
        // 交换left和parent
        heap[index] = left;
        heap[leftIndex] = node;
        index = leftIndex;
      }
    } else if (rightIndex < len && compare(right, node) < 0) {
      // right 最小， 交换right和parent
      heap[index] = right;
      heap[rightIndex] = node;
      index = rightIndex;
    } else {
      // parent最小
      return;
    }
  }
}

function compare(a, b) {
  //   return a - b;
  const diff = a.sortIndex - b.sortIndex;
  return diff !== 0 ? diff : a.id - b.id;
}
```

# 精通Hooks

## Hook精讲
[Hook的what、why、how、where](https://www.bilibili.com/video/BV1rK411F7x3?p=7)

## Hook简介
Hook 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。
```jsx
import React, { useState } from 'react';

function Example() {
  // 声明一个新的叫做 “count” 的 state 变量
  const [count, setCount] = useState(0);  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me {a}
      </button>
    </div>
  );
}
```

## 视频介绍
在 React Conf 2018 上，Sophie Alpert 和 Dan Abramov 介绍了 Hook，紧接着 Ryan Florence 演示了如何使用 Hook 重构应用。你可以在这里看到这个视频： **https://www.youtube.com/embed/dpw9EHDh2bM**

## 没有破坏性改动
在我们继续之前，请记住 Hook 是：
* 完全可选的：你无需重写任何已有代码就可以在一些组件中尝试 Hook。但是如果你不想，你不必现在就去学习或使用 Hook。
* 100% 向后兼容的：** Hook 不包含任何破坏性改动。
* 现在可用：Hook 已发布于 v16.8.0。
* 没有计划从 React 中移除 class。
* Hook 不会影响你对 React 概念的理解。** 恰恰相反，Hook 为已知的 React 概念提供了更直接的 API：props， state，context，refs 以及生命周期。稍后我们将看到，Hook 还提供了一种更强大的方式来组合他们。

## Hook解决了什么问题
Hook 解决了我们那些年来编写和维护成千上万的组件时遇到的各种各样看起来不相关的问题。无论你正在学习 React，或每天使用，或者更愿尝试另一个和 React 有相似组件模型的框架，你都可能对这些问题似曾相识。

#### 在组件之间复用状态逻辑很难
React 没有提供将可复用性行为“附加”到组件的途径（例如，把组件连接到 store）。如果你使用过 React 一段时间，你也许会熟悉一些解决此类问题的方案，比如 [render props](https://zh-hans.reactjs.org/docs/render-props.html) 和 [高阶组件](https://zh-hans.reactjs.org/docs/higher-order-components.html)。但是这类方案需要重新组织你的组件结构，这可能会很麻烦，使你的代码难以理解。如果你在 React DevTools 中观察过 React 应用，你会发现由 providers，consumers，高阶组件，render props 等其他抽象层组成的组件会形成“嵌套地狱”。尽管我们可以[在 DevTools 过滤掉它们](https://github.com/facebook/react-devtools/pull/503)，但这说明了一个更深层次的问题：React 需要为共享状态逻辑提供更好的原生途径。
你可以使用 Hook 从组件中提取状态逻辑，使得这些逻辑可以单独测试并复用。**Hook 使你在无需修改组件结构的情况下复用状态逻辑。** 这使得在组件间或社区内共享 Hook 变得更便捷。
具体将在[自定义 Hook](https://zh-hans.reactjs.org/docs/hooks-custom.html) 中对此展开更多讨论。

#### 复杂组件变得难以理解
我们经常维护一些组件，组件起初很简单，但是逐渐会被状态逻辑和副作用充斥。每个生命周期常常包含一些不相关的逻辑。例如，组件常常在 componentDidMount 和 componentDidUpdate 中获取数据。但是，同一个 componentDidMount 中可能也包含很多其它的逻辑，如设置事件监听，而之后需在 componentWillUnmount 中清除。相互关联且需要对照修改的代码被进行了拆分，而完全不相关的代码却在同一个方法中组合在一起。如此很容易产生 bug，并且导致逻辑不一致。
在多数情况下，不可能将组件拆分为更小的粒度，因为状态逻辑无处不在。这也给测试带来了一定挑战。同时，这也是很多人将 React 与状态管理库结合使用的原因之一。但是，这往往会引入了很多抽象概念，需要你在不同的文件之间来回切换，使得复用变得更加困难。
为了解决这个问题，**Hook 将组件中相互关联的部分拆分成更小的函数（比如设置订阅或请求数据）**，而并非强制按照生命周期划分。你还可以使用 reducer 来管理组件的内部状态，使其更加可预测。
我们将在[使用 Effect Hook](https://zh-hans.reactjs.org/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns) 中对此展开更多讨论。

#### 难以理解的 class
除了代码复用和代码管理会遇到困难外，我们还发现 class 是学习 React 的一大屏障。你必须去理解 JavaScript 中 **this** 的工作方式，这与其他语言存在巨大差异。还不能忘记绑定事件处理器。没有稳定的[语法提案](https://babeljs.io/docs/en/babel-plugin-transform-class-properties/)，这些代码非常冗余。大家可以很好地理解 props，state 和自顶向下的数据流，但对 class 却一筹莫展。即便在有经验的 React 开发者之间，对于函数组件与 class 组件的差异也存在分歧，甚至还要区分两种组件的使用场景。
另外，React 已经发布五年了，我们希望它能在下一个五年也与时俱进。就像 [Svelte](https://svelte.dev/)，[Angular](https://angular.io/)，[Glimmer](https://glimmerjs.com/)等其它的库展示的那样，组件[预编译](https://en.wikipedia.org/wiki/Ahead-of-time_compilation)会带来巨大的潜力。尤其是在它不局限于模板的时候。最近，我们一直在使用 [Prepack](https://prepack.io/) 来试验 [component folding](https://github.com/facebook/react/issues/7323)，也取得了初步成效。但是我们发现使用 class 组件会无意中鼓励开发者使用一些让优化措施无效的方案。class 也给目前的工具带来了一些问题。例如，class 不能很好的压缩，并且会使热重载出现不稳定的情况。因此，我们想提供一个使代码更易于优化的 API。
为了解决这些问题，**Hook 使你在非 class 的情况下可以使用更多的 React 特性。** 从概念上讲，React 组件一直更像是函数。而 Hook 则拥抱了函数，同时也没有牺牲 React 的精神原则。Hook 提供了问题的解决方案，无需学习复杂的函数式或响应式编程技术。

## Hook API（17.0.2）
* 基础 Hook
  * [useState](https://zh-hans.reactjs.org/docs/hooks-reference.html#usestate)
  * [useEffect](https://zh-hans.reactjs.org/docs/hooks-reference.html#useeffect)
  * [useContext](https://zh-hans.reactjs.org/docs/hooks-reference.html#usecontext)
* 额外的 Hook
  * [useReducer](https://zh-hans.reactjs.org/docs/hooks-reference.html#usereducer)
  * [useCallback](https://zh-hans.reactjs.org/docs/hooks-reference.html#usecallback)
  * [useMemo](https://zh-hans.reactjs.org/docs/hooks-reference.html#usememo)
  * [useRef](https://zh-hans.reactjs.org/docs/hooks-reference.html#useref)
  * [useImperativeHandle](https://zh-hans.reactjs.org/docs/hooks-reference.html#useimperativehandle)
  * [useLayoutEffect](https://zh-hans.reactjs.org/docs/hooks-reference.html#uselayouteffect)

## Hook原理
```jsx
fiber.memorizedState(hook0)-> next(hook1)-> next(hook2)->next(hook3)(workInProgressHook) // 所以hook是不能放到条件语句中，必须放在最外层
//let workInProgressHook = null
//hook3
hook = {
  memorizedState: null, // state
  next: null // 下一个hook
}
function FunctionalComponent () {
  const [state1, setState1] = useState(1)
  const [state2, setState2] = useState(2)
  const [state3, setState3] = useState(3)

  return ...
}
hook1 => Fiber.memoizedState
state1 === hook1.memoizedState
hook1.next => hook2
state2 === hook2.memoizedState
hook2.next => hook3
state3 === hook2.memoizedState
```

# 实现useReducer

## useReducer
[useState](https://zh-hans.reactjs.org/docs/hooks-reference.html#usestate) 的替代方案。它接收一个形如 (state, action) => newState 的 reducer，并返回当前的 state 以及与其配套的 dispatch 方法。（如果你熟悉 Redux 的话，就已经知道它如何工作了。）
在某些场景下，useReducer 会比 useState 更适用，例如 state 逻辑较复杂且包含多个子值，或者下一个 state 依赖于之前的 state 等。并且，使用 useReducer 还能给那些会触发深更新的组件做性能优化，因为[你可以向子组件传递 dispatch 而不是回调函数](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down) 。
```jsx
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

## 实现useReducer
```jsx
import {scheduleUpdateOnFiber} from "./ReactFiberWorkLoop";
let workInProgressHook = null;
// 当前正在工作的fiber
let currentlyRenderingFiber = null;

export function renderHooks(wip) {
  currentlyRenderingFiber = wip;
  currentlyRenderingFiber.memoizedState = null;
  workInProgressHook = null;
}

// fiber(memoizedState)->hook0(next)->hook1(next)->hook2(next)->null
// workInProgressHook=hook2 当前的hook
function updateWorkInProgressHook() {
  let hook;
  // todo
  const current = currentlyRenderingFiber.alternate;
  if (current) {
    // 不是初次渲染，是更新，意味着可以在老hook基础上更新
    currentlyRenderingFiber.memoizedState = current.memoizedState;
    if (workInProgressHook) {
      // 不是第一个hook
      hook = workInProgressHook = workInProgressHook.next;
    } else {
      // 是第一个hook
      hook = workInProgressHook = current.memoizedState;
    }
  } else {
    // 是初次渲染，需要初始化hook
    hook = {
      memoizedState: null, //状态值
      next: null, // 指向下一个hook或者null
    };
    if (workInProgressHook) {
      // 不是第一个hook
      workInProgressHook = workInProgressHook.next = hook;
    } else {
      // 是第一个hook
      workInProgressHook = currentlyRenderingFiber.memoizedState = hook;
    }
  }

  return hook;
}

export function useReducer(reducer, initialState) {
  /**
   * memoizedState 状态值
   * next 指向下一个hook
   */
  const hook = updateWorkInProgressHook();

  if (!currentlyRenderingFiber.alternate) {
    // 组件初次渲染
    hook.memoizedState = initialState;
  }

  const dispatch = (action) => {
    hook.memoizedState = reducer(hook.memoizedState, action);
    scheduleUpdateOnFiber(currentlyRenderingFiber);
  };

  return [hook.memoizedState, dispatch];
}
```

## 更新属性
```js
export function updateNode(node, prevVal, nextVal) {
  Object.keys(prevVal)
    // .filter(k => k !== "children")
    .forEach((k) => {
      if (k === "children") {
        // 有可能是文本
        if (isStringOrNumber(prevVal[k])) {
          node.textContent = "";
        }
      } else if (k.slice(0, 2) === "on") {
        const eventName = k.slice(2).toLocaleLowerCase();
        node.removeEventListener(eventName, prevVal[k]);
      } else {
        if (!(k in nextVal)) {
          node[k] = "";
        }
      }
    });

  Object.keys(nextVal)
    // .filter(k => k !== "children")
    .forEach((k) => {
      if (k === "children") {
        // 有可能是文本
        if (isStringOrNumber(nextVal[k])) {
          node.textContent = nextVal[k] + "";
        }
      } else if (k.slice(0, 2) === "on") {
        const eventName = k.slice(2).toLocaleLowerCase();
        node.addEventListener(eventName, nextVal[k]);
      } else {
        node[k] = nextVal[k];
      }
    });
}
```
# 实现useState

## useState
返回一个 state，以及更新 state 的函数。在初始渲染期间，返回的状态 (`state`) 与传入的第一个参数 (`initialState`) 值相同。
```jsx
const [state, setState] = useState(initialState);
```

## 实现useState
```jsx
function dispatchReducerAction(fiber, hook, reducer, action) {
  hook.memorizedState = reducer ? reducer(hook.memorizedState) : action;
  fiber.alternate = { ...fiber };
  fiber.sibling = null;
  scheduleUpdateOnFiber(fiber);
}

export function useState(initalState) {
  return useReducer(null, initalState);
}
```

# 实现useEffect

## useEffect
```js
useEffect(didUpdate);
```
该 Hook 接收一个包含命令式、且可能有副作用代码的函数。 
在函数组件主体内（这里指在 React 渲染阶段）改变 DOM、添加订阅、设置定时器、记录日 志以及执行其他包含副作用的操作都是不被允许的，因为这可能会产生莫名其妙的 bug 并破坏 UI 的一致性。 
使用 useEffect 完成副作用操作。赋值给 useEffect 的函数会在组件渲染到屏幕之后延迟执行。你可以把 effect 看作从 React 的纯函数式世界通往命令式世界的逃生通道。
默认情况下，effect 将在每轮渲染结束后执行，但你可以选择让它在只有某些值改变的时候才执行。

## 实现useEffect
```js
export const HookPassive = /*   */ 0b100;
export function areHookInputsEqual(nextDeps, prevDeps) {
  if (prevDeps == null) {
    return false;
  }

  for (let i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
    if (Object.is(nextDeps[i], prevDeps[i])) {
      continue;
    }
    return false;
  }

  return true;
}
function updateWorkInProgressHook() {
  let hook;

  const current = currentlyRenderingFiber.alternate;
  if (current) {
    // 组件更新
    currentlyRenderingFiber.memorizedState = current.memorizedState;
    if (workInProgressHook) {
      workInProgressHook = hook = workInProgressHook.next;
      currentHook = currentHook.next;
    } else {
      // hook0
      workInProgressHook = hook = currentlyRenderingFiber.memorizedState;
      currentHook = current.memorizedState;
    }
  } else {
    // 组件初次渲染
    currentHook = null;

    hook = {
      memorizedState: null, // state effect
      next: null, // 下一个hook
    };
    if (workInProgressHook) {
      workInProgressHook = workInProgressHook.next = hook;
    } else {
      // hook0
      workInProgressHook = currentlyRenderingFiber.memorizedState = hook;
    }
  }

  return hook;
}
function updateEffectImp(hooksFlags, create, deps) {
  const hook = updateWorkInProgressHook();

  if (currentHook) {
    const prevEffect = currentHook.memorizedState;
    if (deps) {
      const prevDeps = prevEffect.deps;
      if (areHookInputsEqual(deps, prevDeps)) {
        return;
      }
    }
  }

  const effect = {hooksFlags, create, deps};

  hook.memorizedState = effect;

  if (hooksFlags & HookPassive) {
    currentlyRenderingFiber.updateQueueOfEffect.push(effect);
  } else if (hooksFlags & HookLayout) {
    currentlyRenderingFiber.updateQueueOfLayout.push(effect);
  }
}
export function useEffect(create, deps) {
  return updateEffectImp(HookPassive, create, deps);
}
```

# 实现useLayoutEffect

## useLayoutEffect
其函数签名与 useEffect 相同，但它会在所有的 DOM 变更之后同步调用 effect。可以使用它 来读取 DOM 布局并同步触发重渲染。在浏览器执行绘制之前， useLayoutEffect 内部的更新计 划将被同步刷新。
尽可能使用标准的 useEffect 以避免阻塞视觉更新。

## 实现useLayoutEffect
```js
export const HookLayout = /*    */ 0b010;
export function useLayoutEffect(create, deps) {
  return updateEffectImp(HookLayout, create, deps);
}
```

# 节点的删除与更新
如遇到下面的情况，需要精确考虑下节点的删除与更新。
```jsx
function FunctionComponent(props) {
  const [count, setCount] = useReducer((x) => x + 1, 0);
  const [count2, setCount2] = useState(0);

  return (
    <div className="border">
      <p>{props.name}</p>
      <button onClick={() => setCount()}>{count}</button>
      <button onClick={() => setCount2(count2 + 1)}>{count2}</button>
      {count % 2 ? <div>omg</div> : <span>ooo</span>}
    </div>
  );
}
```

## 删除节点
```jsx
// 删除单个节点
function deleteChild(returnFiber, childToDelete) {
  // returnFiber.deletoins = [...]
  const deletions = returnFiber.deletions;
  if (deletions) {
    returnFiber.deletions.push(childToDelete);
  } else {
    returnFiber.deletions = [childToDelete];
  }
}

function reconcileChildren(wip, children) {
  if (isStringOrNumber(children)) {
    return;
  }

  const newChildren = isArray(children) ? children : [children];
  let previousNewFiber = null; //记录上一次的fiber
  let oldFiber = wip.alternate?.child;
  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i];
    const newFiber = createFiber(newChild, wip);

    const same = sameNode(newFiber, oldFiber);

    if (same) {
      Object.assign(newFiber, {
        stateNode: oldFiber.stateNode,
        alternate: oldFiber,
        flags: Update,
      });
    }
    if (!same && oldFiber) {
      // 删除节点
      deleteChild(wip, oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (i === 0) {
      wip.child = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }

    previousNewFiber = newFiber;
  }
}
```

## 节点的更新
```js
function commitWorker(wip) {
  if (!wip) {
    return;
  }
  // 1. 更新自己
  const { flags, stateNode } = wip;
  // 父dom节点
  let parentNode = getParentNode(wip.return); // wip.return.stateNode;
  if (flags & Placement && stateNode) {
    parentNode.appendChild(stateNode);
  }
  if (flags & Update && stateNode) {
    updateNode(stateNode, wip.alternate.props, wip.props);
  }
  if (wip.deletions) {
    commitDeletion(wip.deletions, stateNode || parentNode);
  }
  // 2. 更新子节点
  commitWorker(wip.child);
  // 2. 更新兄弟节点
  commitWorker(wip.sibling);
}

function getParentNode(wip) {
  let tem = wip;
  while (tem) {
    if (tem.stateNode) {
      return tem.stateNode;
    }
    tem = tem.return;
  }
}

// deletions: fiber
function commitDeletion(deletions, parentNode) {
  for (let i = 0; i < deletions.length; i++) {
    const deletion = deletions[i];
    parentNode.removeChild(getStateNode(deletion));
  }
}

function getStateNode(fiber) {
  let tem = fiber;
  while (!tem.stateNode) {
    tem = tem.child;
  }
  return tem.stateNode;
}
```

## 删除多个老节点
```js
// old 0 1 2 3 4
// new 0 1 2
function FunctionComponent(props) {
    const [count, setCount] = useReducer((x) => x + 1, 0); 
    const [count2, setCount2] = useState(4); 
    return ( 
        <div className="border"> 
            <p>{props.name}</p> 
            <button onClick={() => setCount()}>{count}</button> 
            <button onClick={() => { if (count2 === 0) { setCount2(4); } else { setCount2(count2 - 2); } }} > 
                {count2} 
            </button> 
            {count % 2 ? <div>omg</div> : <span>123</span>} 
            <ul>
                {[0, 1, 2, 3, 4].map((item) => { return count2 >= item ? <li key={item}>{item}</li> : null; })} 
            </ul> 
        </div> 
    ); 
}

// 此时需要多节点删除：
function deleteRemainingChildren(returnFiber, currentFirstChild) {
  let childToDelete = currentFirstChild;

  while (childToDelete) {
    deleteChild(returnFiber, childToDelete);
    childToDelete = childToDelete.sibling;
  }
}

export function reconcileChildren(returnFiber, children) {
  if (isStringOrNumber(children)) {
    return;
  }

  const newChildren = isArray(children) ? children : [children];
  // oldfiber的头结点
  let oldFiber = returnFiber.alternate?.child;
  let previousNewFiber = null;
  let newIndex = 0;

  // *1. 从左边往右遍历，比较新老节点，如果节点可以复用，继续往右，否则就停止
    for (oldFiber = 0; newIndex < newChildren.length; newIndex++) {
        const newChild = newChildren[newIndex];
        if (newChild == null) {
            continue;
        }
        const newFiber = createFiber(newChild, returnFiber);
        const same = sameNode(newChild, oldFiber);
        if (same) { 
            Object.assign(newFiber, { 
                stateNode: oldFiber.stateNode, 
                alternate: oldFiber, 
                flags: Update, 
            }); 
        }
        if (!same && oldFiber) { 
            deleteChild(returnFiber, oldFiber);
        }
        if (oldFiber) {
            oldFiber = oldFiber.sibling; 
        }
        if (previousNewFiber == null) {
            returnFiber.child = newFiber;
        } else {
            previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
    }

    if (newIndex === newChildren.length) { 
        deleteRemainingChildren(returnFiber, oldFiber);
        return; 
    } 
}
```

# 真正的React VDOM DIFF

## 资源
[带你彻底读懂React VDOM DIFF](https://mp.weixin.qq.com/s/TwY0RJT9e9_85RIwGXoG3w)
[React VDOM DIFF](https://www.processon.com/view/link/61b20cab1e08534ca6ddc6f8)
![reactdiff](https://github.com/lujiajian1/geek-notes/blob/main/img/reactdiff.png)

## 实现
```tsx
// 测试代码
// old 0 1 2 3 4
// new 0 1 3 4
function FunctionComponent(props) {
    const [count, setCount] = useReducer((x) => x + 1, 0); 
    const [count2, setCount2] = useState(4); 
    return ( 
        <div className="border"> 
            <p>{props.name}</p> 
            <button onClick={() => setCount()}>{count}</button> 
            <button onClick={() => setCount2(count2 + 1) } > 
                {count2} 
            </button> 
            {count % 2 ? <div>omg</div> : <span>123</span>} 
            <ul>
                {
                    count2 === 2
                        ? [2, 1, 3, 4].map((item) => {return <li key={item}>{item}</li>})
                        :  [0, 1, 2, 3, 4].map((item) => {return <li key={item}>{item}</li>})
                }
            </ul> 
        </div> 
    ); 
}
```
```js
// 实现-ReactChildFiber.js
import { createFiber } from "./ReactFiber";
import { isArray, isStringOrNumber, Placement, Update } from "./utils";

// returnFiber.deletions = [a,b,c]
function deleteChild(returnFiber, childToDelete) {
  const deletions = returnFiber.deletions;
  if (deletions) {
    returnFiber.deletions.push(childToDelete);
  } else {
    returnFiber.deletions = [childToDelete];
  }
}

function deleteRemainingChildren(returnFiber, currentFirstChild) {
  let childToDelete = currentFirstChild;

  while (childToDelete) {
    deleteChild(returnFiber, childToDelete);
    childToDelete = childToDelete.sibling;
  }
}

// 初次渲染，只是记录下标
// 更新，检查节点是否移动
function placeChild(
  newFiber,
  lastPlacedIndex,
  newIndex,
  shouldTrackSideEffects
) {
  newFiber.index = newIndex;
  if (!shouldTrackSideEffects) {
    // 父节点初次渲染
    return lastPlacedIndex;
  }
  // 父节点更新
  // 子节点是初次渲染还是更新呢
  const current = newFiber.alternate;
  if (current) {
    const oldIndex = current.index;
    // 子节点是更新
    // lastPlacedIndex 记录了上次dom节点的相对更新节点的最远位置
    // old 0 1 2 3 4
    // new 2 1 3 4
    // 2 1(6) 3 4
    if (oldIndex < lastPlacedIndex) {
      // move
      newFiber.flags |= Placement;
      return lastPlacedIndex;
    } else {
      return oldIndex;
    }
  } else {
    // 子节点是初次渲染
    newFiber.flags |= Placement;
    return lastPlacedIndex;
  }
}

function mapRemainingChildren(currentFirstChild) {
  const existingChildren = new Map();

  let existingChild = currentFirstChild;
  while (existingChild) {
    // key: value
    // key||index: fiber
    existingChildren.set(
      existingChild.key || existingChild.index,
      existingChild
    );
    existingChild = existingChild.sibling;
  }

  return existingChildren;
}

// 协调（diff）
// abc
// bc
export function reconcileChildren(returnFiber, children) {
  if (isStringOrNumber(children)) {
    return;
  }

  const newChildren = isArray(children) ? children : [children];
  // oldfiber的头结点
  let oldFiber = returnFiber.alternate?.child;
  // 下一个oldFiber | 暂时缓存下一个oldFiber
  let nextOldFiber = null;
  // 用于判断是returnFiber初次渲染还是更新
  let shouldTrackSideEffects = !!returnFiber.alternate;
  let previousNewFiber = null;
  let newIndex = 0;
  // 上一次dom节点插入的最远位置
  // old 0 1 2 3 4
  // new 2 1 3 4
  let lastPlacedIndex = 0;

  // *1. 从左边往右遍历，比较新老节点，如果节点可以复用，继续往右，否则就停止
  for (; oldFiber && newIndex < newChildren.length; newIndex++) {
    const newChild = newChildren[newIndex];
    if (newChild == null) {
      continue;
    }

    if (oldFiber.index > newIndex) {
      nextOldFiber = oldFiber;
      oldFiber = null;
    } else {
      nextOldFiber = oldFiber.sibling;
    }

    const same = sameNode(newChild, oldFiber);
    if (!same) {
      if (oldFiber == null) {
        oldFiber = nextOldFiber;
      }
      break;
    }
    const newFiber = createFiber(newChild, returnFiber);

    Object.assign(newFiber, {
      stateNode: oldFiber.stateNode,
      alternate: oldFiber,
      flags: Update,
    });

    // 节点更新
    lastPlacedIndex = placeChild(
      newFiber,
      lastPlacedIndex,
      newIndex,
      shouldTrackSideEffects
    );

    if (previousNewFiber == null) {
      returnFiber.child = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }

    previousNewFiber = newFiber;
    oldFiber = nextOldFiber;
  }

  // *2. 新节点没了，老节点还有
  // 0 1 2
  // 0
  if (newIndex === newChildren.length) {
    deleteRemainingChildren(returnFiber, oldFiber);
    return;
  }

  // *3. 初次渲染
  // 1）初次渲染
  // 2）老节点没了，新节点还有
  if (!oldFiber) {
    for (; newIndex < newChildren.length; newIndex++) {
      const newChild = newChildren[newIndex];
      if (newChild == null) {
        continue;
      }
      const newFiber = createFiber(newChild, returnFiber);

      lastPlacedIndex = placeChild(
        newFiber,
        lastPlacedIndex,
        newIndex,
        shouldTrackSideEffects
      );

      if (previousNewFiber === null) {
        // head node
        returnFiber.child = newFiber;
      } else {
        previousNewFiber.sibling = newFiber;
      }

      previousNewFiber = newFiber;
    }
  }

  // *4 新老节点都还有
  // 小而乱
  // old 0 1 [2 3 4]
  // new 0 1 [3 4]
  // !4.1 把剩下的old单链表构建哈希表
  const existingChildren = mapRemainingChildren(oldFiber);

  // !4.2 遍历新节点，通过新节点的key去哈希表中查找节点，找到就复用节点，并且删除哈希表中对应的节点
  for (; newIndex < newChildren.length; newIndex++) {
    const newChild = newChildren[newIndex];
    if (newChild == null) {
      continue;
    }
    const newFiber = createFiber(newChild, returnFiber);

    // oldFiber
    const matchedFiber = existingChildren.get(newFiber.key || newFiber.index);
    if (matchedFiber) {
      // 节点复用
      Object.assign(newFiber, {
        stateNode: matchedFiber.stateNode,
        alternate: matchedFiber,
        flags: Update,
      });

      existingChildren.delete(newFiber.key || newFiber.index);
    }

    lastPlacedIndex = placeChild(
      newFiber,
      lastPlacedIndex,
      newIndex,
      shouldTrackSideEffects
    );

    if (previousNewFiber == null) {
      returnFiber.child = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }
    previousNewFiber = newFiber;
  }

  // *5 old的哈希表中还有值，遍历哈希表删除所有old
  if (shouldTrackSideEffects) {
    existingChildren.forEach((child) => deleteChild(returnFiber, child));
  }
}

// 节点复用的条件：1. 同一层级下 2. 类型相同 3. key相同
function sameNode(a, b) {
  return a && b && a.type === b.type && a.key === b.key;
}
```
```js
// 实现-ReactFiberWorkLoop.js
import {
  updateClassComponent,
  updateFragmentComponent,
  updateFunctionComponent,
  updateHostComponent,
  updateHostTextComponent,
} from "./ReactFiberReconciler";
import {
  ClassComponent,
  Fragment,
  FunctionComponent,
  HostComponent,
  HostText,
} from "./ReactWorkTags";
import { scheduleCallback } from "./scheduler";
import { Placement, Update, updateNode } from "./utils";

let wip = null; // work in progress 当前正在工作中的
let wipRoot = null;

// 初次渲染和更新
export function scheduleUpdateOnFiber(fiber) {
  wip = fiber;
  wipRoot = fiber;

  scheduleCallback(workLoop);
}

//
function performUnitOfWork() {
  const { tag } = wip;

  // todo 1. 更新当前组件
  switch (tag) {
    case HostComponent:
      updateHostComponent(wip);
      break;

    case FunctionComponent:
      updateFunctionComponent(wip);
      break;

    case ClassComponent:
      updateClassComponent(wip);
      break;
    case Fragment:
      updateFragmentComponent(wip);
      break;
    case HostText:
      updateHostTextComponent(wip);
      break;
    default:
      break;
  }

  // todo 2. 下一个更新谁 深度优先遍历 （国王的故事）
  if (wip.child) {
    wip = wip.child;
    return;
  }

  let next = wip;

  while (next) {
    if (next.sibling) {
      wip = next.sibling;
      return;
    }
    next = next.return;
  }

  wip = null;
}

function workLoop() {
  while (wip) {
    performUnitOfWork();
  }

  if (!wip && wipRoot) {
    commitRoot();
  }
}

// requestIdleCallback(workLoop);

// 提交
function commitRoot() {
  commitWorker(wipRoot);
  wipRoot = null;
}

function commitWorker(wip) {
  if (!wip) {
    return;
  }

  // 1. 提交自己
  // parentNode是父DOM节点

  const parentNode = getParentNode(wip.return); /// wip.return.stateNode;
  const { flags, stateNode } = wip;
  if (flags & Placement && stateNode) {
    // 1
    // 0 1 2 3 4
    // 2 1 3 4
    const before = getHostSibling(wip.sibling);
    insertOrAppendPlacementNode(stateNode, before, parentNode);
    // parentNode.appendChild(stateNode);
  }

  if (flags & Update && stateNode) {
    // 更新属性
    updateNode(stateNode, wip.alternate.props, wip.props);
  }

  if (wip.deletions) {
    // 删除wip的子节点
    commitDeletions(wip.deletions, stateNode || parentNode);
  }

  if (wip.tag === FunctionComponent) {
    invokeHooks(wip);
  }

  // 2. 提交子节点
  commitWorker(wip.child);
  // 3. 提交兄弟
  commitWorker(wip.sibling);
}

function getParentNode(wip) {
  let tem = wip;
  while (tem) {
    if (tem.stateNode) {
      return tem.stateNode;
    }
    tem = tem.return;
  }
}

function commitDeletions(deletions, parentNode) {
  for (let i = 0; i < deletions.length; i++) {
    parentNode.removeChild(getStateNode(deletions[i]));
  }
}

// 不是每个fiber都有dom节点
function getStateNode(fiber) {
  let tem = fiber;

  while (!tem.stateNode) {
    tem = tem.child;
  }

  return tem.stateNode;
}

function getHostSibling(sibling) {
  while (sibling) {
    if (sibling.stateNode && !(sibling.flags & Placement)) {
      return sibling.stateNode;
    }
    sibling = sibling.sibling;
  }
  return null;
}

function insertOrAppendPlacementNode(stateNode, before, parentNode) {
  if (before) {
    parentNode.insertBefore(stateNode, before);
  } else {
    parentNode.appendChild(stateNode);
  }
}

function invokeHooks(wip) {
  const { updateQueueOfEffect, updateQueueOfLayout } = wip;

  for (let i = 0; i < updateQueueOfLayout.length; i++) {
    const effect = updateQueueOfLayout[i];
    effect.create();
  }

  for (let i = 0; i < updateQueueOfEffect.length; i++) {
    const effect = updateQueueOfEffect[i];

    scheduleCallback(() => {
      effect.create();
    });
  }
}
```

# 对比React 与Vue的 VDOM DIFF
![reactdiff](https://github.com/lujiajian1/geek-notes/blob/main/img/reactdiff.png)
![vuediff](https://github.com/lujiajian1/geek-notes/blob/main/img/vuediff.png)

# 链接
1. [React官方文档](https://react.docschina.org/)
2. [React github](https://github.com/facebook/react/)
3. [React18新特性尝试](https://github.com/bubucuo/react18-ice)
4. [React18新特性免费视频教程](https://www.bilibili.com/video/BV1rK4y137D3/)
5. [究竟什么是Shadow DOM？](https://zhuanlan.zhihu.com/p/559759502)