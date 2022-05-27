## React 基本概念
总的来说：React 的中文含义是“反应”或“响应”，它描述了 React 这样一个前端框架的核心原理：当数据发生变化时，UI 能够自动把变化反映出来。在react之前，更新 UI 的方式是通过基于浏览器 DOM 的 API，去精细地控制 DOM 节点的创建、修改和删除，为了保证 UI 和数据的一致性，我们需要非常繁琐并且小心的处理 DOM 节点的变更。
举个例子。。。。

React核心的三个概念：组件、状态和 JSX。下面我们分别来看。

### 使用组件的方式描述 UI
在 React 中，所有的 UI 都是通过组件去描述和组织的。和 DOM 的节点定义类似，React 组件是以树状结构组织到一起的，一个 React 的应用通常只有一个根组件。可以认为，React 中所有的元素都是组件，具体而言分为两种。

1. 内置组件。内置组件其实就是映射到 HTML 节点的组件，例如 div、input、table 等等，作为一种约定，它们都是小写字母
2. 自定义组件。自定义组件其实就是自己创建的组件，使用时必须以大写字母开头，例如 TopicList、TopicDetail。

补充：自定义组件为什么需要以大写字母开头？
因为应用 JSX 进行开发的时候，其实它最终会转化成React.createElement()去创建元素。如果是小写字母命名的组件的 JSX 会解析为字符串，大写字母开头的组件会解析为变量。
```js
/*内置组件*/
function testComp() {
    return <div id="divid">test<div>
}
function testComp() {// JSX 解析后
    // 第一个参数就是string 代表内置组件 div
    return React.createElement('div', {id: 'divid'}, 'test');
}

/*自定义组件*/
function testComp1() {
    return <Book id="divid">test<Boook>
}
function testComp1() {// JSX 解析后
    // 第一个参数就是变量，代表自定义组件，找到当前组件 import 的 Book 组件
    return React.createElement(Book, {id: 'divid'}, 'test');
}
```

### 使用 state 和 props 管理状态
React 的核心机制是能够在数据发生变化的时候自动重新渲染 UI，那么势必要有一个让我们保存状态的地方，这个保存状态的机制就是 state。而props 就是类似于 Html 标记上属性的概念，是为了在父子组件之间传递状态。在函数组件中，我们可以使用 useState 这样一个 Hook 来保存状态，那么状态在发生变化时，也会让 UI 自动发生变化。
```jsx
import React from "react";

function CountLabel({ count }) {
  // 子组件用于显示颜色
  const color = count > 10 ? "red" : "blue";
  return <span style={{ color }}>{count}</span>;
}

export default function Counter() {
  // 定义了 count 这个 state
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        <CountLabel count={count} />
      </button>
    </div>
  );
}
```

### 理解 JSX 语法的本质
从本质上来说，JSX 并不是一个新的模板语言，而可以认为是一个语法糖。也就是说，不用 JSX 的写法，使用React.createElement也是能够写React 的。
React.createElement 这样一个 API，它的作用就是创建一个组件的实例。此外，这个 API 会接收一组参数：
* 第一个参数表示组件的类型；
* 第二个参数是传给组件的属性，也就是 props；
* 第三个以及后续所有的参数则是子组件。
通过 createElement 这个 API，我们可以构建出需要的组件树，而 JSX 只是让这种描述变得更加直观和高效。
```js
React.createElement(
  "div",
  null,
  React.createElement(
    "button",
    { onClick: function onClick() {
        return setCount(count + 1);
      } },
    React.createElement(CountLabel, { count: count })
  )
);
```

## React 为什么要发明 Hooks？
首先要重新思考 React 组件的本质。React 组件的模型其实很直观，就是从 Model 到 View 的映射，这里的 Model 对应到 React 中就是 state 和 props。在过去，我们需要处理当 Model 变化时，DOM 节点应该如何变化的细节问题。而现在，我们只需要通过 JSX，根据 Model 的数据用声明的方式去描述 UI 的最终展现就可以了，因为 React 会帮助你处理所有 DOM 变化的细节。而且，当 Model 中的状态发生变化时，UI 会自动变化，即所谓的数据绑定。
所以呢，我们可以把 UI 的展现看成一个函数的执行过程。其中，Model 是输入参数，函数的执行结果是 DOM 树，也就是 View。而 React 要保证的，就是每当 Model 发生变化时，函数会重新执行，并且生成新的 DOM 树，然后 React 再把新的 DOM 树以最优的方式更新到浏览器。
既然如此，使用 Class 作为组件是否真的合适呢？Class 在作为 React 组件的载体时，是否用了它所有的功能呢？如果你仔细思考，会发现使用 Class 其实是有点牵强的，主要有两方面的原因。
一方面，React 组件之间是不会互相继承的。比如说，你不会创建一个 Button 组件，然后再创建一个 DropdownButton 来继承 Button。所以说，React 中其实是没有利用到 Class 的继承特性的。另一方面，因为所有 UI 都是由状态驱动的，因此很少会在外部去调用一个类实例（即组件）的方法。要知道，组件的所有方法都是在内部调用，或者作为生命周期方法被自动调用的。
因此，通过函数去描述一个组件才是最为自然的方式。这也是为什么 React 很早就提供了函数组件的机制。只是当时有一个局限是，函数组件无法存在内部状态，必须是纯函数，而且也无法提供完整的生命周期机制。这就极大限制了函数组件的大规模使用。
所以，Class 作为 React 组件的载体，也许并不是最适合，反而函数是更适合去描述 State => View 这样的一个映射，但是函数组件又没有 State ，也没有生命周期方法。如果我们想要让函数组件更有用，目标就是给函数组件加上状态。
函数和对象不同，函数并没有一个实例的对象能够在多次执行之间保存状态，那势必需要一个函数之外的空间来保存这个状态，而且要能够检测其变化，从而能够触发函数组件的重新渲染。那我们是不是就是需要这样一个机制，能够把一个外部的数据绑定到函数的执行。当数据变化时，函数能够自动重新执行。这样的话，任何会影响 UI 展现的外部数据，都可以通过这个机制绑定到 React 的函数组件。
在 React 中，这个机制就是 Hooks。
Hook 就是“钩子”的意思。在 React 中，Hooks 就是把某个目标结果钩到某个可能会变化的数据源或者事件源上，那么当被钩到的数据或事件发生变化时，产生这个目标结果的代码会重新执行，产生更新后的结果。
通过这样的思考，你应该能够理解 Hooks 诞生的来龙去脉了。比起 Class 组件，函数组件是更适合去表达 React 组件的执行的，因为它更符合 State => View 这样的一个逻辑关系。但是因为缺少状态、生命周期等机制，让它一直功能受限。而现在有了 Hooks，函数组件的力量终于能真正发挥出来了！不过这里有一点需要特别注意，Hooks 中被钩的对象，不仅可以是某个独立的数据源，也可以是另一个 Hook 执行的结果，这就带来了 Hooks 的最大好处：逻辑的复用。
举个例子。。。
Hooks 的另一大好处：有助于关注分离。除了逻辑复用之外，Hooks 能够带来的另外一大好处就是有助于关注分离，意思是说 Hooks 能够让针对同一个业务逻辑的代码尽可能聚合在一块儿。这是过去在 Class 组件中很难做到的。因为在 Class 组件中，你不得不把同一个业务逻辑的代码分散在类组件的不同生命周期的方法中。所以通过 Hooks 的方式，把业务逻辑清晰地隔离开，能够让代码更加容易理解和维护。

## 核心 Hooks
React 提供的 Hooks 其实非常少，一共只有 10 个，比如 useState、useEffect、useCallback、useMemo、useRef、useContext 等等。

### useState：让函数组件具有维持状态的能力
state 是 React 组件的一个核心机制，那么 useState 这个 Hook 就是用来管理 state 的，它可以让函数组件具有维持状态的能力。也就是说，在一个函数组件的多次渲染之间，这个 state 是共享的。
useState 就和类组件中的 setState 非常类似。不过两者最大的区别就在于，类组件中的 state 只能有一个。所以我们一般都是把一个对象作为 一个 state，然后再通过不同的属性来表示不同的状态。而函数组件中用 useState 则可以很容易地创建多个 state，所以它更加语义化。
state 是 React 组件非常重要的一个机制，那么什么样的值应该保存在 state 中呢？这是日常开发中需要经常思考的问题。通常来说，我们要遵循的一个原则就是：state 中永远不要保存可以通过计算得到的值。
state 虽然便于维护状态，但也有自己的弊端。一旦组件有自己状态，意味着组件如果重新创建，就需要有恢复状态的过程，这通常会让组件变得更复杂。

### useEffect：执行副作用
什么是副作用呢？通常来说，副作用是指一段和当前执行结果无关的代码。比如说要修改函数外部的某个变量，要发起一个请求，等等。也就是说，在函数组件的当次执行过程中，useEffect 中代码的执行是不影响渲染出来的 UI 的。
对应到 Class 组件，那么 useEffect 就涵盖了 ComponentDidMount、componentDidUpdate 和 componentWillUnmount 三个生命周期方法。不过如果你习惯了使用 Class 组件，那千万不要按照把 useEffect 对应到某个或者某几个生命周期的方法。你只要记住，useEffect 是每次组件 render 完后判断依赖并执行就可以了。
总结一下，useEffect 让我们能够在下面四种时机去执行一个回调函数产生副作用：
1. 每次 render 后执行：不提供第二个依赖项参数。比如useEffect(() => {})。
2. 仅第一次 render 后执行：提供一个空数组作为依赖项。比如useEffect(() => {}, [])。
3. 第一次以及依赖项发生变化后执行：提供依赖项数组。比如useEffect(() => {}, [deps])。
4. 组件 unmount 后执行：返回一个回调函数。比如useEffect() => { return () => {} }, [])。





React 事件的命名采用小驼峰式（camelCase）

事件处理：回调函数作为 prop 传入子组件时，这些组件可能会进行额外的重新渲染。我们通常建议在构造器中绑定或使用 class fields 语法来避免这类性能问题。

<Contacts /> 和 <Chat /> 之类的 React 元素本质就是对象（object），所以你可以把它们当作 props，像其他数据一样传递。这种方法可能使你想起别的库中“槽”（slot）的概念，但在 React 中没有“槽”这一概念的限制，你可以将任何东西作为 props 进行传递。

Context 主要应用场景在于很多不同层级的组件需要访问同样一些的数据。请谨慎使用，因为这会使得组件的复用性变差。

如果你只是想避免层层传递一些属性，组件组合（component composition）有时候是一个比 context 更好的解决方案。


当 Provider 的 value 值发生变化时，它内部的所有消费组件都会重新渲染。Provider 及其内部 consumer 组件都不受制于 shouldComponentUpdate 函数，因此当 consumer 组件在其祖先组件退出更新的情况下也能更新。





