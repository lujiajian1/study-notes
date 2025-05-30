## React 基本概念
总的来说：React 的中文含义是“反应”或“响应”，它描述了 React 这样一个前端框架的核心原理：当数据发生变化时，UI 能够自动把变化反映出来。在react之前，更新 UI 的方式是通过基于浏览器 DOM 的 API，去精细地控制 DOM 节点的创建、修改和删除，为了保证 UI 和数据的一致性，我们需要非常繁琐并且小心的处理 DOM 节点的变更。

React核心的三个概念：组件、状态和 JSX。下面我们分别来看。
## JSX 简介
### 什么是JSX
这个有趣的标签语法既不是字符串也不是 HTML，它是 JSX，是一个 JavaScript 的语法扩展，JSX 可以生成 React “元素”
```jsx
const element = <h1>Hello, world!!</h1>;
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
### 为什么使用 JSX
1. React 认为渲染逻辑本质上与其他 UI 逻辑内在耦合
2. React 没有采用将标记与逻辑进行分离到不同文件这种人为地分离方式，而是通过将二者共同存放在称之为“组件”的松散耦合单元之中，来实现关注点分离

### JSX 中嵌入表达式
在JSX中可以使用大括号{}嵌入表达式
```jsx
const name = 'Josh Perez';
const element = <h1>Hello, {name}!</h1>;
```

### JSX 也是一个表达式
1. 在编译之后，JSX 表达式会被转为普通 JavaScript 函数调用，并且对其取值后得到 JavaScript 对象
2. 也就是说，你可以在 if 语句和 for 循环的代码块中使用 JSX，将 JSX 赋值给变量，把 JSX 当作参数传入，以及从函数中返回 JSX

### JSX 特定属性
1. 可以通过使用引号，来将属性值指定为字符串字面量
```jsx
const element = <div id="divid"></div>
```
2. 也可以使用大括号，来在属性值中插入一个 JavaScript 表达式
```jsx
const ahref = 'https://www.baidu.com'
const element = <a href={ahref} />
```
3. 注意：对于同一属性不能同时使用{}和引号，只能两种符号中选一个，JSX 语法上更接近 JavaScript 而不是 HTML，所以 React DOM 使用 camelCase（小驼峰命名）来定义属性的名称，而不使用 HTML 属性名称的命名约定

### 使用 JSX 指定子元素
1. 假如一个标签里面没有内容，你可以使用 /> 来闭合标签
```jsx
const ahref = 'https://www.baidu.com'
const element = <a href={ahref} />
```
2. JSX 标签里能够包含很多子元素
```jsx
const element = <div>
  <p><span></span></p>
<div>
```

### JSX 防止注入攻击
1. 可以安全地在 JSX 当中插入用户输入内容
```jsx
const title = '<script>alert 122</script>';
const element = <h1>{title}</h1>;
```
2. React DOM 在渲染所有输入内容之前，默认会进行转义。它可以确保在你的应用中，永远不会注入那些并非自己明确编写的内容

### JSX 表示对象
1. Babel 会把 JSX 转译成一个名为 React.createElement() 函数调用
2. 这些对象被称为 “React 元素”。它们描述了你希望在屏幕上看到的内容。React 通过读取这些对象，然后使用它们来构建 DOM 以及保持随时更新

## 元素渲染
### 简介
1. 元素是构成 React 应用的最小砖块，它描述了你在屏幕上想看到的内容
2. 与浏览器的 DOM 元素不同，React 元素是创建开销极小的普通对象。React DOM 会负责更新 DOM 来与 React 元素保持一致
### 将一个元素渲染为 DOM
1. 假设你的 HTML 文件某处有一个 div
```jsx
<div id="root"></div>
```
2. 我们将其称为“根” DOM 节点，因为该节点内的所有内容都将由 React DOM 管理
3. 仅使用 React 构建的应用通常只有单一的根 DOM 节点。如果你在将 React 集成进一个已有应用，那么你可以在应用中包含任意多的独立根 DOM 节点
4. 想要将一个 React 元素渲染到根 DOM 节点中，只需把它们一起传入 ReactDOM.render()
```jsx
const element = <h1>Hello, world</h1>;
ReactDOM.render(element, document.getElementById('root'));
```
### 更新已渲染的元素
1. React 元素是不可变对象，一旦被创建，你就无法更改它的子元素或者属性。一个元素就像电影的单帧：它代表了某个特定时刻的 UI
2. 根据我们已有的知识，更新 UI 唯一的方式是创建一个全新的元素，并将其传入 ReactDOM.render()
3. 将这些代码封装到有状态组件中
### React 只更新它需要更新的部分
React DOM 会将元素和它的子元素与它们之前的状态进行比较，并只会进行必要的更新来使 DOM 达到预期的状态

## 组件 & Props
### 介绍
1. 组件允许你将 UI 拆分为独立可复用的代码片段，并对每个片段进行独立构思
2. 组件，从概念上类似于 JavaScript 函数。它接受任意的入参（即 “props”），并返回用于描述页面展示内容的 React 元素
### 函数组件与class组件
1. 定义组件最简单的方式就是编写 JavaScript 函数
```jsx
function Welcome(props) {  
  return <h1>Hello, {props.name}</h1>; 
}
```
2. 该函数是一个有效的 React 组件，因为它接收唯一带有数据的 “props”（代表属性）对象与并返回一个 React 元素。这类组件被称为“函数组件”，因为它本质上就是 JavaScript 函数
3. 同时还可以使用 ES6 的 class 来定义组件
```jsx
class Welcome extends React.Component {  
  render() {    
    return <h1>Hello, {props.name}</h1>;
  }  
}
```
### 渲染组件
1. React 元素可以是DOM 标签，也可以是用户自定义的组件
```jsx
const element = <Welcome name="king"></Welcome>
```
2. 当 React 元素为用户自定义组件时，它会将 JSX 所接收的属性（attributes）以及子组件转换为单个对象传递给组件，这个对象被称之为 “props”
3. 注意： 组件名称必须以大写字母开头，React 会将以小写字母开头的组件视为原生 DOM 标签
### 组合组件
1. 组件可以在其输出中引用其他组件。这就可以让我们用同一组件来抽象出任意层次的细节。按钮，表单，对话框，甚至整个屏幕的内容：在 React 应用程序中，这些通常都会以组件的形式表示
2. 通常来说，每个新的 React 应用程序的顶层组件都是 App 组件。但是，如果你将 React 集成到现有的应用程序中，你可能需要使用像 Button 这样的小组件，并自下而上地将这类组件逐步应用到视图层的每一处
### 提取组件
1. 提取组件可能是一件繁重的工作，但是，在大型应用中，构建可复用组件库是完全值得的
2. 根据经验来看，如果 UI 中有一部分被多次使用（Button，Panel，Avatar），或者组件本身就足够复杂（App，FeedStory，Comment），那么它就是一个可复用组件的候选项
### Props 的只读性
1. 组件无论是使用函数声明还是通过 class 声明，都决不能修改自身的 props
2. React 非常灵活，但它也有一个严格的规则：所有 React 组件都必须像纯函数一样保护它们的 props 不被更改
3. 当然，应用程序的 UI 是动态的，并会伴随着时间的推移而变化。在下一章节中，我们将介绍一种新的概念，称之为 “state”。在不违反上述规则的情况下，state 允许 React 组件随用户操作、网络响应或者其他变化而动态更改输出内容
### 使用组件的方式描述 UI
在 React 中，所有的 UI 都是通过组件去描述和组织的。和 DOM 的节点定义类似，React 组件是以树状结构组织到一起的，一个 React 的应用通常只有一个根组件。可以认为，React 中所有的元素都是组件，具体而言分为两种。
1. 内置组件。内置组件其实就是映射到 HTML 节点的组件，例如 div、input、table 等等，作为一种约定，它们都是小写字母
2. 自定义组件。自定义组件其实就是自己创建的组件，使用时必须以大写字母开头，例如 TopicList、TopicDetail。
### 自定义组件为什么需要以大写字母开头？
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

## State & 生命周期
### State介绍
State 与 props 类似，但是 state 是私有的，并且完全受控于当前组件。组件中的 state 包含了随时可能发生变化的数据。
### 生命周期
1. 挂载。当组件实例被创建并插入 DOM 中时，其生命周期调用顺序如下：
* [constructor()](https://zh-hans.reactjs.org/docs/react-component.html#constructor)
* [static getDerivedStateFromProps()](https://zh-hans.reactjs.org/docs/react-component.html#static-getderivedstatefromprops)
* [render()](https://zh-hans.reactjs.org/docs/react-component.html#render)
* [componentDidMount()](https://zh-hans.reactjs.org/docs/react-component.html#componentdidmount)
2. 更新。当组件的 props 或 state 发生变化时会触发更新。组件更新的生命周期调用顺序如下：
* [static getDerivedStateFromProps()](https://zh-hans.reactjs.org/docs/react-component.html#static-getderivedstatefromprops)
* [shouldComponentUpdate()](https://zh-hans.reactjs.org/docs/react-component.html#shouldcomponentupdate)
* [render()](https://zh-hans.reactjs.org/docs/react-component.html#render)
* [getSnapshotBeforeUpdate()](https://zh-hans.reactjs.org/docs/react-component.html#getsnapshotbeforeupdate)
* [componentDidUpdate()](https://zh-hans.reactjs.org/docs/react-component.html#componentdidupdate)
3. 卸载。当组件从 DOM 中移除时会调用如下方法：
* [componentWillUnmount()](https://zh-hans.reactjs.org/docs/react-component.html#componentwillunmount)
4. 错误处理。当渲染过程，生命周期，或子组件的构造函数中抛出错误时，会调用如下方法：
* [static getDerivedStateFromError()](https://zh-hans.reactjs.org/docs/react-component.html#static-getderivedstatefromerror)
* [componentDidCatch()](https://zh-hans.reactjs.org/docs/react-component.html#componentdidcatch)

![lifecycles](https://github.com/lujiajian1/study-notes/blob/main/img/lifecycles.png)
### 正确使用State
1. 不要直接修改 State，而是应该使用 setState()，另外构造函数是唯一可以给 this.state 赋值的地方
2. State 的更新可能是异步的。出于性能考虑，React 可能会把多个 setState() 调用合并成一个调用。因为 this.props 和 this.state 可能会异步更新，所以你不要依赖他们的值来更新下一个状态。要解决这个问题，可以让 setState() 接收一个函数。这个函数用上一个 state 作为第一个参数，将此次更新被应用时的props 做为第二个参数。
```jsx
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));
```
3. State 的更新会被合并。当你调用 setState() 的时候，React 会把你提供的对象合并到当前的 state。这里的合并是浅合并。
```jsx
// state 包含几个独立的变量
constructor(props) {
  super(props);
  this.state = {
    posts: [],
    comments: []
  };
}
// 然后你可以分别调用 setState() 来单独地更新它们：
componentDidMount() {
  fetchPosts().then(response => {
    this.setState({
      posts: response.posts
    });
  });

  fetchComments().then(response => {
    this.setState({
      comments: response.comments
    });
  });
}
// this.setState({comments}) 完整保留了 this.state.posts， 但是完全替换了 this.state.comments。
```
### 数据是向下流动的
1. 不管是父组件或是子组件都无法知道某个组件是有状态的还是无状态的，并且它们也并不关心它是函数组件还是 class 组件。这就是为什么称 state 为局部的或是封装的的原因。除了拥有并设置了它的组件，其他组件都无法访问。
2. 组件可以选择把它的 state 作为 props 向下传递到它的子组件中
3. 但是组件本身无法知道它是来自于谁的 state，或是谁的 props，还是手动输入的
4. 这通常会被叫做“自上而下”或是“单向”的数据流。任何的 state 总是所属于特定的组件，而且从该 state 派生的任何数据或 UI 只能影响树中“低于”它们的组件
5. 如果把一个以组件构成的树想象成一个 props 的数据瀑布的话，那么每一个组件的 state 就像是在任意一点上给瀑布增加额外的水源，但是它只能向下流动
6. 在 React 应用中，组件是有状态组件还是无状态组件属于组件实现的细节，它可能会随着时间的推移而改变。你可以在有状态的组件中使用无状态的组件，反之亦然
## 事件处理
### 语法
1. React 元素的事件处理和 DOM 元素的很相似，但是有一点语法上的不同
2. React 事件的命名采用小驼峰式（camelCase），而不是纯小写
3. 使用 JSX 语法时你需要传入一个函数作为事件处理函数，而不是一个字符串
```jsx
<button onClick={activateLasers}>
  Activate Lasers
</button>
```
### 阻止默认行为
在 React 中另一个不同点是你不能通过返回 false 的方式阻止默认行为。你必须显式的使用 preventDefault
```jsx
function Form() {
  function handleSubmit(e) {
    e.preventDefault();
    console.log('You clicked submit.');
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Submit</button>
    </form>
  );
}
```
### this问题
1. 你必须谨慎对待 JSX 回调函数中的 this，在 JavaScript 中，class 的方法默认不会绑定 this。如果你忘记绑定 this.handleClick 并把它传入了 onClick，当你调用这个函数的时候 this 的值为 undefined
2. 这并不是 React 特有的行为；这其实与 JavaScript 函数工作原理有关。通常情况下，如果你没有在方法后面添加 ()，例如 onClick={this.handleClick}，你应该为这个方法绑定 this
3. 如果觉得使用 bind 很麻烦，这里有两种方式可以解决。如果你正在使用实验性的 [public class fields](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes/Public_class_fields) 语法，你可以使用 class fields 正确的绑定回调函数。Create React App 默认启用此语法
```jsx
class LoggingButton extends React.Component {
  // This syntax ensures `this` is bound within handleClick.
  handleClick = () => {
    console.log('this is:', this);
  };
  render() {
    return (
      <button onClick={this.handleClick}>
        Click me
      </button>
    );
  }
}
```
4. 如果你没有使用 class fields 语法，你可以在回调中使用箭头函数
```jsx
class LoggingButton extends React.Component {
  handleClick() {
    console.log('this is:', this);
  }

  render() {
    // 此语法确保 `handleClick` 内的 `this` 已被绑定。
    return (
      <button onClick={() => this.handleClick()}>
        Click me
      </button>
    );
  }
}
```
### 传参
1. 在循环中，通常我们会为事件处理函数传递额外的参数
```jsx
// 例如，若 id 是你要删除那一行的 ID，以下两种方式都可以向事件处理函数传递参数
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
// 上述两种方式是等价的，分别通过箭头函数和 Function.prototype.bind 来实现
```
2. 在这两种情况下，React 的事件对象 e 会被作为第二个参数传递。如果通过箭头函数的方式，事件对象必须显式的进行传递，而通过 bind 的方式，事件对象以及更多的参数将会被隐式的进行传递

## 条件渲染
### 介绍
1. 在 React 中，你可以创建不同的组件来封装各种你需要的行为。然后，依据应用的不同状态，你可以只渲染对应状态下的部分内容
2. React 中的条件渲染和 JavaScript 中的一样，使用 JavaScript 运算符 if 或者条件运算符去创建元素来表现当前的状态，然后让 React 根据它们来更新 UI
```jsx
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}

const root = ReactDOM.createRoot(document.getElementById('root')); 
// Try changing to isLoggedIn={true}:
root.render(<Greeting isLoggedIn={false} />);
```
### 元素变量
可以使用变量来储存元素。 它可以帮助你有条件地渲染组件的一部分，而其他的渲染部分并不会因此而改变
```jsx
function LoginButton(props) {
  return (
    <button onClick={props.onClick}>
      Login
    </button>
  );
}

function LogoutButton(props) {
  return (
    <button onClick={props.onClick}>
      Logout
    </button>
  );
}

class LoginControl extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {isLoggedIn: false};
  }

  handleLoginClick() {
    this.setState({isLoggedIn: true});
  }

  handleLogoutClick() {
    this.setState({isLoggedIn: false});
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    let button; // 储存元素
    // 声明一个变量并使用 if 语句进行条件渲染是不错的方式
    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }

    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} />
        {button}
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render(<LoginControl />);
```
### 与运算符 &&
通过花括号包裹代码，你可以在 JSX 中嵌入表达式。这也包括 JavaScript 中的逻辑与 (&&) 运算符。
```jsx
// 之所以能这样做，是因为在 JavaScript 中，true && expression 总是会返回 expression, 而 false && expression 总是会返回 false。因此，如果条件是 true，&& 右侧的元素就会被渲染，如果是 false，React 会忽略并跳过它。
function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 &&
        <h2>
          You have {unreadMessages.length} unread messages.
        </h2>
      }
    </div>
  );
}

const messages = ['React', 'Re: React', 'Re:Re: React'];

const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render(<Mailbox unreadMessages={messages} />);
```
请注意，[falsy](https://developer.mozilla.org/zh-CN/docs/Glossary/Falsy) 表达式 会使 && 后面的元素被跳过，但会返回 falsy 表达式的值。在下面示例中，render 方法的返回值是 div 0 div。
```jsx
render() {
  const count = 0;
  return (
    <div>
      {count && <h1>Messages: {count}</h1>}
    </div>
  );
}
```
### 三目运算符
另一种内联条件渲染的方法是使用 JavaScript 中的三目运算符 condition ? true : false。
```jsx
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      {isLoggedIn
        ? <LogoutButton onClick={this.handleLogoutClick} />
        : <LoginButton onClick={this.handleLoginClick} />
      }
    </div>
  );
}
```
### 阻止组件渲染
在极少数情况下，你可能希望能隐藏组件，即使它已经被其他组件渲染。若要完成此操作，你可以让 render 方法直接返回 null，而不进行任何渲染。
```jsx
function WarningBanner(props) {
  if (!props.warn) {
    return null;
  }

  return (
    <div className="warning">
      Warning!
    </div>
  );
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showWarning: true};
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    this.setState(state => ({
      showWarning: !state.showWarning
    }));
  }

  render() {
    return (
      <div>
        <WarningBanner warn={this.state.showWarning} />
        <button onClick={this.handleToggleClick}>
          {this.state.showWarning ? 'Hide' : 'Show'}
        </button>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render(<Page />);
```

## 列表 & Key
### 渲染多个组件
使用 Javascript 中的 map() 方法来遍历 numbers 数组。将数组中的每个元素变成 <li> 标签，最后我们将得到的数组赋值给 listItems
```jsx
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li>{number}</li>
);
<ul>{listItems}</ul>
```
### key
key 帮助 React 识别哪些元素改变了，比如被添加或删除。因此你应当给数组中的每一个元素赋予一个确定的标识。key 值在兄弟节点之间必须唯一。一个元素的 key 最好是这个元素在列表中拥有的一个独一无二的字符串。通常，我们使用数据中的 id 来作为元素的 key。当元素没有确定 id 的时候，万不得已你可以使用元素索引 index 作为 key。如果列表项目的顺序可能会变化，我们不建议使用索引来用作 key 值，因为这样做会导致性能变差，还可能引起组件状态的问题。

[深度解析使用索引作为 key 的负面影响](https://robinpokorny.medium.com/index-as-a-key-is-an-anti-pattern-e0349aece318)
[深入解析为什么 key 是必须的](https://zh-hans.reactjs.org/docs/reconciliation.html#recursing-on-children)
```jsx
function NumberList(props) {
  const numbers = props.numbers;
  return (
    <ul>
      {numbers.map((number) =>
        <ListItem key={number.toString()} value={number} />
      )}
    </ul>
  );
}
<NumberList numbers={[1, 2, 3, 4, 5]} />
```

## 表单
在 React 里，HTML 表单元素的工作方式和其他的 DOM 元素有些不同，这是因为表单元素通常会保持一些内部的 state。使用 JavaScript 函数可以很方便的处理表单的提交， 同时还可以访问用户填写的表单数据。实现这种效果的标准方式是使用“受控组件”。
### 受控组件
在 HTML 中，表单元素（如&lt;input&gt;、 &lt;textarea&gt; 和 &lt;select&gt;）通常自己维护 state，并根据用户输入进行更新。而在 React 中，可变状态（mutable state）通常保存在组件的 state 属性中，并且只能通过使用 setState()来更新。我们可以把两者结合起来，使 React 的 state 成为“唯一数据源”。渲染表单的 React 组件还控制着用户输入过程中表单发生的操作。被 React 以这种方式控制取值的表单输入元素就叫做“受控组件”。对于受控组件来说，输入的值始终由 React 的 state 驱动。你也可以将 value 传递给其他 UI 元素，或者通过其他事件处理函数重置，但这意味着你需要编写更多的代码。
```jsx
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('提交的名字: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          名字:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="提交" />
      </form>
    );
  }
}
```

## 状态提升
多个组件需要反映相同的变化数据，这时我们建议将共享状态提升到最近的共同父组件中去。在 React 应用中，任何可变数据应当只有一个相对应的唯一“数据源”。通常，state 都是首先添加到需要渲染数据的组件中去。然后，如果其他组件也需要这个 state，那么你可以将它提升至这些组件的最近共同父组件中。你应当依靠自上而下的数据流，而不是尝试在不同组件间同步 state。虽然提升 state 方式比双向绑定方式需要编写更多的“样板”代码，但带来的好处是，排查和隔离 bug 所需的工作量将会变少。由于“存在”于组件中的任何 state，仅有组件自己能够修改它，因此 bug 的排查范围被大大缩减了。此外，你也可以使用自定义逻辑来拒绝或转换用户的输入。

## 组合 vs 继承
React 有十分强大的组合模式。我们推荐使用组合而非继承来实现组件间的代码重用。
### 包含关系
有些组件无法提前知晓它们子组件的具体内容。在 Sidebar（侧边栏）和 Dialog（对话框）等展现通用容器（box）的组件中特别容易遇到这种情况。我们建议这些组件使用一个特殊的 children prop 来将他们的子组件传递到渲染结果中。 React 元素本质就是对象（object），所以你可以把它们当作 props，像其他数据一样传递。这种方法可能使你想起别的库中“槽”（slot）的概念，但在 React 中没有“槽”这一概念的限制，你可以将任何东西作为 props 进行传递。
```jsx
function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  );
}
function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Welcome
      </h1>
      <p className="Dialog-message">
        Thank you for visiting our spacecraft!
      </p>
    </FancyBorder>
  );
}
```
```jsx
function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        {props.left}
      </div>
      <div className="SplitPane-right">
        {props.right}
      </div>
    </div>
  );
}

function App() {
  return (
    <SplitPane
      left={
        <Contacts />
      }
      right={
        <Chat />
      } />
  );
}
```
### 特例关系
有些时候，我们会把一些组件看作是其他组件的特殊实例，比如 WelcomeDialog 可以说是 Dialog 的特殊实例。在 React 中，我们也可以通过组合来实现这一点。“特殊”组件可以通过 props 定制并渲染“一般”组件。
```jsx
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
    </FancyBorder>
  );
}

function WelcomeDialog() {
  return (
    <Dialog
      title="Welcome"
      message="Thank you for visiting our spacecraft!" />
  );
}
```
### 那么继承呢？
在 Facebook，我们在成百上千个组件中使用 React。我们并没有发现需要使用继承来构建组件层次的情况。Props 和组合为你提供了清晰而安全地定制组件外观和行为的灵活方式。注意：组件可以接受任意 props，包括基本数据类型，React 元素以及函数。如果你想要在组件间复用非 UI 的功能，我们建议将其提取为一个单独的 JavaScript 模块，如函数、对象或者类。组件可以直接引入（import）而无需通过 extend 继承它们。

## 代码分割
对你的应用进行代码分割能够帮助你“懒加载”当前用户所需要的内容，能够显著地提高你的应用性能。尽管并没有减少应用整体的代码体积，但你可以避免加载用户永远不需要的代码，并在初始加载的时候减少所需加载的代码量。
### import()
```jsx
import("./math").then(math => {
  console.log(math.add(16, 26));
});
```
### React.lazy
```jsx
const OtherComponent = React.lazy(() => import('./OtherComponent'));
```
### 基于路由的代码分割
```jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Suspense>
  </Router>
);
```

## Context
Context 提供了一个无需为每层组件手动添加 props，就能在组件树间进行数据传递的方法。Context 主要应用场景在于很多不同层级的组件需要访问同样一些的数据。请谨慎使用，因为这会使得组件的复用性变差。
```jsx
// theme-context.js
export const themes = {
  light: {
    foreground: '#000000',
    background: '#eeeeee',
  },
  dark: {
    foreground: '#ffffff',
    background: '#222222',
  },
};
export const ThemeContext = React.createContext(
  themes.dark // 默认值
);
```
```jsx
// themed-button.js
import {ThemeContext} from './theme-context';
class ThemedButton extends React.Component {
  render() {
    let props = this.props;
    let theme = this.context;
    return (
      <button
        {...props}
        style={{backgroundColor: theme.background}}
      />
    );
  }
}
ThemedButton.contextType = ThemeContext;
export default ThemedButton;
```

## 错误边界（Error Boundaries）
错误边界是一种 React 组件，这种组件可以捕获发生在其子组件树任何位置的 JavaScript 错误，并打印这些错误，同时展示降级 UI，而并不会渲染那些发生崩溃的子组件树。错误边界可以捕获发生在整个子组件树的渲染期间、生命周期方法以及构造函数中的错误。
```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给服务器
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}

<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```
### 错误边界应该放置在哪？
错误边界的粒度由你来决定，可以将其包装在最顶层的路由组件并为用户展示一个 “Something went wrong” 的错误信息，就像服务端框架经常处理崩溃一样。你也可以将单独的部件包装在错误边界以保护应用其他部分不崩溃。

### 关于事件处理器
错误边界无法捕获事件处理器内部的错误。React 不需要错误边界来捕获事件处理器中的错误。与 render 方法和生命周期方法不同，事件处理器不会在渲染期间触发。因此，如果它们抛出异常，React 仍然能够知道需要在屏幕上显示什么。如果你需要在事件处理器内部捕获错误，使用普通的 JavaScript try / catch 语句。
```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    try {
      // 执行操作，如有错误则会抛出
    } catch (error) {
      this.setState({ error });
    }
  }

  render() {
    if (this.state.error) {
      return <h1>Caught an error.</h1>
    }
    return <button onClick={this.handleClick}>Click Me</button>
  }
}
```

## Refs and the DOM
Refs 提供了一种方式，允许我们访问 DOM 节点或在 render 方法中创建的 React 元素。

在典型的 React 数据流中，props 是父组件与子组件交互的唯一方式。要修改一个子组件，你需要使用新的 props 来重新渲染它。但是，在某些情况下，你需要在典型数据流之外强制修改子组件。被修改的子组件可能是一个 React 组件的实例，也可能是一个 DOM 元素。
### 何时使用 Refs
* 管理焦点，文本选择或媒体播放。
* 触发强制动画。
* 集成第三方 DOM 库。
### 勿过度使用 Refs
你可能首先会想到使用 refs 在你的 app 中“让事情发生”。如果是这种情况，请花一点时间，认真再考虑一下 state 属性应该被安排在哪个组件层中。通常你会想明白，让更高的组件层级拥有这个 state，是更恰当的。
```jsx
// 创建 Refs
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef} />;
  }
}
// 访问 Refs
const node = this.myRef.current;
```

### 将 DOM Refs 暴露给父组件
在极少数情况下，你可能希望在父组件中引用子节点的 DOM 节点。通常不建议这样做，因为它会打破组件的封装，但它偶尔可用于触发焦点或测量子 DOM 节点的大小或位置。如果你使用 16.3 或更高版本的 React, 这种情况下我们推荐使用 ref 转发。Ref 转发使组件可以像暴露自己的 ref 一样暴露子组件的 ref。

### Refs 转发
Ref 转发是一项将 ref 自动地通过组件传递到其一子组件的技巧。对于大多数应用中的组件来说，这通常不是必需的。但其对某些组件，尤其是可重用的组件库是很有用的。
```jsx
// 我们通过调用 React.createRef 创建了一个 React ref 并将其赋值给 ref 变量。
// 我们通过指定 ref 为 JSX 属性，将其向下传递给 <FancyButton ref={ref}>。
// React 传递 ref 给 forwardRef 内函数 (props, ref) => ...，作为其第二个参数。
// 我们向下转发该 ref 参数到 <button ref={ref}>，将其指定为 JSX 属性。
// 当 ref 挂载完成，ref.current 将指向 <button> DOM 节点。
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// 你可以直接获取 DOM button 的 ref：
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

## 高阶组件（HOC）
高阶组件是参数为组件，返回值为新组件的函数。HOC 不会修改传入的组件，也不会使用继承来复制其行为。相反，HOC 通过将组件包装在容器组件中来组成新组件。HOC 是纯函数，没有副作用。被包装组件接收来自容器组件的所有 prop，同时也接收一个新的用于 render 的 data prop。HOC 不需要关心数据的使用方式或原因，而被包装组件也不需要关心数据是怎么来的。
```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

## Portals
Portal 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的优秀的方案。一个 portal 的典型用例是当父组件有 overflow: hidden 或 z-index 样式时，但你需要子组件能够在视觉上“跳出”其容器。例如，对话框、悬浮卡以及提示框。
```js
// 第一个参数（child）是任何可渲染的 React 子元素，例如一个元素，字符串或 fragment。第二个参数（container）是一个 DOM 元素。
ReactDOM.createPortal(child, container)

// 示例
render() {
  // React 并*没有*创建一个新的 div。它只是把子元素渲染到 `domNode` 中。
  // `domNode` 是一个可以在任何位置的有效 DOM 节点。
  return ReactDOM.createPortal(
    this.props.children,
    domNode
  );
}
```

### 通过 Portal 进行事件冒泡
尽管 portal 可以被放置在 DOM 树中的任何地方，但在任何其他方面，其行为和普通的 React 子节点行为一致。由于 portal 仍存在于 React 树， 且与 DOM 树 中的位置无关，那么无论其子节点是否是 portal，像 context 这样的功能特性都是不变的。

这包含事件冒泡。一个从 portal 内部触发的事件会一直冒泡至包含 React 树的祖先，即便这些元素并不是 DOM 树 中的祖先。假设存在如下 HTML 结构：
```jsx
<html>
  <body>
    <div id="app-root"></div>
    <div id="modal-root"></div>
  </body>
</html>

// 在 #app-root 里的 Parent 组件能够捕获到未被捕获的从兄弟节点 #modal-root 冒泡上来的事件。

// 在 DOM 中有两个容器是兄弟级 （siblings）
const appRoot = document.getElementById('app-root');
const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    // 在 Modal 的所有子元素被挂载后，
    // 这个 portal 元素会被嵌入到 DOM 树中，
    // 这意味着子元素将被挂载到一个分离的 DOM 节点中。
    // 如果要求子组件在挂载时可以立刻接入 DOM 树，
    // 例如衡量一个 DOM 节点，
    // 或者在后代节点中使用 ‘autoFocus’，
    // 则需添加 state 到 Modal 中，
    // 仅当 Modal 被插入 DOM 树中才能渲染子元素。
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el
    );
  }
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {clicks: 0};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // 当子元素里的按钮被点击时，
    // 这个将会被触发更新父元素的 state，
    // 即使这个按钮在 DOM 中不是直接关联的后代
    this.setState(state => ({
      clicks: state.clicks + 1
    }));
  }

  render() {
    return (
      <div onClick={this.handleClick}>
        <p>Number of clicks: {this.state.clicks}</p>
        <p>
          Open up the browser DevTools
          to observe that the button
          is not a child of the div
          with the onClick handler.
        </p>
        <Modal>
          <Child />
        </Modal>
      </div>
    );
  }
}

function Child() {
  // 这个按钮的点击事件会冒泡到父元素
  // 因为这里没有定义 'onClick' 属性
  return (
    <div className="modal">
      <button>Click</button>
    </div>
  );
}

ReactDOM.render(<Parent />, appRoot);
```

## Profiler API
Profiler 测量渲染一个 React 应用多久渲染一次以及渲染一次的“代价”。 它的目的是识别出应用中渲染较慢的部分。Profiling 增加了额外的开支，所以它在生产构建中会被禁用。

### 用法
Profiler 能添加在 React 树中的任何地方来测量树中这部分渲染所带来的开销。 它需要两个 prop ：一个是 id(string)，一个是当组件树中的组件“提交”更新的时候被React调用的回调函数 onRender(function)。
```jsx
// 分析 Navigation 组件和它的子代
render(
  <App>
    <Profiler id="Navigation" onRender={callback}>
      <Navigation {...props} />
    </Profiler>
    <Main {...props} />
  </App>
);
```

### onRender 回调
Profiler 需要一个 onRender 函数作为参数。 React 会在 profile 包含的组件树中任何组件 “提交” 一个更新的时候调用这个函数。 它的参数描述了渲染了什么和花费了多久。
```js
function onRenderCallback(
  id, // 发生提交的 Profiler 树的 “id”
  phase, // "mount" （如果组件树刚加载） 或者 "update" （如果它重渲染了）之一
  actualDuration, // 本次更新 committed 花费的渲染时间
  baseDuration, // 估计不使用 memoization 的情况下渲染整颗子树需要的时间
  startTime, // 本次更新中 React 开始渲染的时间
  commitTime, // 本次更新中 React committed 的时间
  interactions // 属于本次更新的 interactions 的集合
) {
  // 合计或记录渲染时间。。。
}
```

## React 的 “diffing” 算法
### 设计动力
在某一时间节点调用 React 的 render() 方法，会创建一棵由 React 元素组成的树。在下一次 state 或 props 更新时，相同的 render() 方法会返回一棵不同的树。React 需要基于这两棵树之间的差别来判断如何有效率的更新 UI 以保证当前 UI 与最新的树保持同步。

这个算法问题有一些通用的解决方案，即生成将一棵树转换成另一棵树的最小操作数。 然而，即使在[最前沿的算法](https://grfia.dlsi.ua.es/ml/algorithms/references/editsurvey_bille.pdf)中，该算法的复杂程度为 O(n 3 )，其中 n 是树中元素的数量。

如果在 React 中使用了该算法，那么展示 1000 个元素所需要执行的计算量将在十亿的量级范围。这个开销实在是太过高昂。于是 React 在以下两个假设的基础之上提出了一套 O(n) 的启发式算法：
1. 两个不同类型的元素会产生出不同的树；
2. 开发者可以通过 key prop 来暗示哪些子元素在不同的渲染下能保持稳定；

在实践中，我们发现以上假设在几乎所有实用的场景下都成立。
### Diffing 算法
当对比两颗树时，React 首先比较两棵树的根节点。不同类型的根节点元素会有不同的形态。
1. 比对不同类型的元素
当根节点为不同类型的元素时，React 会拆卸原有的树并且建立起新的树。举个例子，当一个元素从 <a> 变成 <img>，从 <Article> 变成 <Comment>，或从 <Button> 变成 <div> 都会触发一个完整的重建流程。

当拆卸一棵树时，对应的 DOM 节点也会被销毁。组件实例将执行 componentWillUnmount() 方法。当建立一棵新的树时，对应的 DOM 节点会被创建以及插入到 DOM 中。组件实例将执行 componentWillMount() 方法，紧接着 componentDidMount() 方法。所有跟之前的树所关联的 state 也会被销毁。
2. 比对同一类型的元素
当比对两个相同类型的 React 元素时，React 会保留 DOM 节点，仅比对及更新有改变的属性。
```jsx
// 通过比对这两个元素，React 知道只需要修改 DOM 元素上的 className 属性。
<div className="before" title="stuff" />
<div className="after" title="stuff" />
```
3. 比对同类型的组件元素
当一个组件更新时，组件实例保持不变，这样 state 在跨越不同的渲染时保持一致。React 将更新该组件实例的 props 以跟最新的元素保持一致，并且调用该实例的 componentWillReceiveProps() 和 componentWillUpdate() 方法。

下一步，调用 render() 方法，diff 算法将在之前的结果以及新的结果中进行递归。

4. 对子节点进行递归
在默认条件下，当递归 DOM 节点的子元素时，React 会同时遍历两个子元素的列表；当产生差异时，生成一个 mutation。

在子元素列表末尾新增元素时，更变开销比较小。

如果简单实现的话，那么在列表头部插入会很影响性能，那么更变开销会比较大。

5. Keys
为了解决列表头部插入会很影响性能的问题，React 支持 key 属性。当子元素拥有 key 时，React 使用 key 来匹配原有树上的子元素以及最新树上的子元素。

## Render Props
术语 “render prop” 是指一种在 React 组件之间使用一个值为函数的 prop 共享代码的简单技术

具有 render prop 的组件接受一个函数，该函数返回一个 React 元素并调用它而不是实现自己的渲染逻辑。

使用 Props 而非 render，重要的是要记住，render prop 是因为模式才被称为 render prop ，你不一定要用名为 render 的 prop 来使用这种模式。事实上， 任何被用于告知组件需要渲染什么内容的函数 prop 在技术上都可以被称为 “render prop”。
```jsx
<DataProvider render={data => (
  <h1>Hello {data.target}</h1>
)}/>
```

## 非受控组件
在大多数情况下，我们推荐使用 受控组件 来处理表单数据。在一个受控组件中，表单数据是由 React 组件来管理的。另一种替代方案是使用非受控组件，这时表单数据将交由 DOM 节点来处理。

要编写一个非受控组件，而不是为每个状态更新都编写数据处理函数，你可以 使用 ref 来从 DOM 节点中获取表单数据。
```jsx
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.input = React.createRef();
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.input.current.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" ref={this.input} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

## React 为什么要发明 Hooks？
首先要重新思考 React 组件的本质。React 组件的模型其实很直观，就是从 Model 到 View 的映射，这里的 Model 对应到 React 中就是 state 和 props。在过去，我们需要处理当 Model 变化时，DOM 节点应该如何变化的细节问题。而现在，我们只需要通过 JSX，根据 Model 的数据用声明的方式去描述 UI 的最终展现就可以了，因为 React 会帮助你处理所有 DOM 变化的细节。而且，当 Model 中的状态发生变化时，UI 会自动变化，即所谓的数据绑定。

所以呢，我们可以把 UI 的展现看成一个函数的执行过程。其中，Model 是输入参数，函数的执行结果是 DOM 树，也就是 View。而 React 要保证的，就是每当 Model 发生变化时，函数会重新执行，并且生成新的 DOM 树，然后 React 再把新的 DOM 树以最优的方式更新到浏览器。

既然如此，使用 Class 作为组件是否真的合适呢？Class 在作为 React 组件的载体时，是否用了它所有的功能呢？如果你仔细思考，会发现使用 Class 其实是有点牵强的，主要有两方面的原因。

一方面，React 组件之间是不会互相继承的。比如说，你不会创建一个 Button 组件，然后再创建一个 DropdownButton 来继承 Button。所以说，React 中其实是没有利用到 Class 的继承特性的。另一方面，因为所有 UI 都是由状态驱动的，因此很少会在外部去调用一个类实例（即组件）的方法。要知道，组件的所有方法都是在内部调用，或者作为生命周期方法被自动调用的。

因此，通过函数去描述一个组件才是最为自然的方式。这也是为什么 React 很早就提供了函数组件的机制。只是当时有一个局限是，函数组件无法存在内部状态，必须是纯函数，而且也无法提供完整的生命周期机制。这就极大限制了函数组件的大规模用。

所以，Class 作为 React 组件的载体，也许并不是最适合，反而函数是更适合去描述 State => View 这样的一个映射，但是函数组件又没有 State ，也没有生命周期方法。如果我们想要让函数组件更有用，目标就是给函数组件加上状态。

函数和对象不同，函数并没有一个实例的对象能够在多次执行之间保存状态，那势必需要一个函数之外的空间来保存这个状态，而且要能够检测其变化，从而能够触发函数组件的重新渲染。那我们是不是就是需要这样一个机制，能够把一个外部的数据绑定到函数的执行。当数据变化时，函数能够自动重新执行。这样的话，任何会影响 UI 展现的外部数据，都可以通过这个机制绑定到 React 的函数组件。

在 React 中，这个机制就是 Hooks。

Hook 就是“钩子”的意思。在 React 中，Hooks 就是把某个目标结果钩到某个可能会变化的数据源或者事件源上，那么当被钩到的数据或事件发生变化时，产生这个目标结果的代码会重新执行，产生更新后的结果。

通过这样的思考，你应该能够理解 Hooks 诞生的来龙去脉了。比起 Class 组件，函数组件是更适合去表达 React 组件的执行的，因为它更符合 State => View 这样的一个逻辑关系。但是因为缺少状态、生命周期等机制，让它一直功能受限。而现在有了 Hooks，函数组件的力量终于能真正发挥出来了！不过这里有一点需要特别注意，Hooks 中被钩的对象，不仅可以是某个独立的数据源，也可以是另一个 Hook 执行的结果，这就带来了 Hooks 的最大好处：逻辑的复用。

Hooks 的另一大好处：有助于关注分离。除了逻辑复用之外，Hooks 能够带来的另外一大好处就是有助于关注分离，意思是说 Hooks 能够让针对同一个业务逻辑的代码尽可能聚合在一块儿。这是过去在 Class 组件中很难做到的。因为在 Class 组件中，你不得不把同一个业务逻辑的代码分散在类组件的不同生命周期的方法中。所以通过 Hooks 的方式，把业务逻辑清晰地隔离开，能够让代码更加容易理解和维护。

## 核心 Hooks
React 提供的 Hooks 其实非常少，一共只有 10 个，比如 useState、useEffect、useCallback、useMemo、useRef、useContext 等等。

### useState：让函数组件具有维持状态的能力
state 是 React 组件的一个核心机制，那么 useState 这个 Hook 就是用来管理 state 的，它可以让函数组件具有维持状态的能力。也就是说，在一个函数组件的多次渲染之间，这个 state 是共享的。

useState 就和类组件中的 setState 非常类似。不过两者最大的区别就在于，类组件中的 state 只能有一个。所以我们一般都是把一个对象作为 一个 state，然后再通过不同的属性来表示不同的状态。而函数组件中用 useState 则可以很容易地创建多个 state，所以它更加语义化。

state 是 React 组件非常重要的一个机制，那么什么样的值应该保存在 state 中呢？这是日常开发中需要经常思考的问题。通常来说，我们要遵循的一个原则就是：state 中永远不要保存可以通过计算得到的值。

state 虽然便于维护状态，但也有自己的弊端。一旦组件有自己状态，意味着组件如果重新创建，就需要有恢复状态的过程，这通常会让组件变得更复杂。
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

### useEffect：执行副作用
什么是副作用呢？通常来说，副作用是指一段和当前执行结果无关的代码。比如说要修改函数外部的某个变量，要发起一个请求，等等。也就是说，在函数组件的当次执行过程中，useEffect 中代码的执行是不影响渲染出来的 UI 的。

对应到 Class 组件，那么 useEffect 就涵盖了 ComponentDidMount、componentDidUpdate 和 componentWillUnmount 三个生命周期方法。不过如果你习惯了使用 Class 组件，那千万不要按照把 useEffect 对应到某个或者某几个生命周期的方法。你只要记住，useEffect 是每次组件 render 完后判断依赖并执行就可以了。

总结一下，useEffect 让我们能够在下面四种时机去执行一个回调函数产生副作用：
1. 每次 render 后执行：不提供第二个依赖项参数。比如useEffect(() => {})。
2. 仅第一次 render 后执行：提供一个空数组作为依赖项。比如useEffect(() => {}, [])。
3. 第一次以及依赖项发生变化后执行：提供依赖项数组。比如useEffect(() => {}, [deps])。
4. 组件 unmount 后执行：返回一个回调函数。比如useEffect() => { return () => {} }, [])。
### 理解 Hooks 的依赖
依赖项时，我们需要注意以下三点：
1. 依赖项中定义的变量一定是会在回调函数中用到的，否则声明依赖项其实是没有意义的。
2. 依赖项一般是一个常量数组，而不是一个变量。因为一般在创建 callback 的时候，你其实非常清楚其中要用到哪些依赖项了。
3. React 会使用浅比较来对比依赖项是否发生了变化，所以要特别注意数组或者对象类型。如果你是每次创建一个新对象，即使和之前的值是等价的，也会被认为是依赖项发生了变化。这是一个刚开始使用 Hooks 时很容易导致 Bug 的地方。
### 掌握 Hooks 的使用规则
Hooks 本身作为纯粹的 JavaScript 函数，不是通过某个特殊的 API 去创建的，而是直接定义一个函数。它需要在降低学习和使用成本的同时，还需要遵循一定的规则才能正常工作。

因而 Hooks 的使用规则包括以下两个：
1. 只能在函数组件的顶级作用域使用：第一，所有 Hook 必须要被执行到。第二，必须按顺序执行。
2. 只能在函数组件或者其他 Hooks 中使用：如果一定要在 Class 组件中使用，那应该如何做呢？其实有一个通用的机制，那就是利用高阶组件的模式，将 Hooks 封装成高阶组件，从而让类组件使用。
```jsx
// 第一步：转换为高阶组件
import React from 'react';
import { useWindowSize } from '../hooks/useWindowSize';

export const withWindowSize = (Comp) => {
  return props => {
    const windowSize = useWindowSize();
    return <Comp windowSize={windowSize} {...props} />;
  };
};
// 第二步：使用高阶组价

import React from 'react';
import { withWindowSize } from './withWindowSize';

class MyComp {
  render() {
    const { windowSize } = this.props;
    // ...
  }
}

// 通过 withWindowSize 高阶组件给 MyComp 添加 windowSize 属性
export default withWindowSize(MyComp);
```
### useCallback：缓存回调函数
在 React 函数组件中，每一次 UI 的变化，都是通过重新执行整个函数来完成的，这和传统的 Class 组件有很大区别：函数组件中并没有一个直接的方式在多次渲染之间维持一个状态。

这也意味着，即使与当前函数有关状态没有发生变化，但是函数组件因为其它状态发生变化而重新渲染时，这种写法也会每次创建一个新的函数。创建一个新的处理函数，虽然不影响结果的正确性，但其实是没必要的。因为这样做不仅增加了系统的开销，更重要的是：每次创建新函数的方式会让接收事件处理函数的组件，需要重新渲染。
```jsx
// API：fn 是定义的回调函数，deps 是依赖的变量数组
useCallback(fn, deps)

// 示例
import React, { useState, useCallback } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const handleIncrement = useCallback(
    () => setCount(count + 1),
    [count], // 只有当 count 发生变化时，才会重新创建回调函数
  );
  // ...
  return <button onClick={handleIncrement}>+</button>
}
```
### useMemo：缓存计算的结果
useCallback 缓存的是一个函数，而 useMemo 缓存的是计算的结果。

通过 useMemo 这个 Hook，可以避免在用到的数据没发生变化时进行的重复计算。

除了避免重复计算之外，useMemo 还有一个很重要的好处：避免子组件的重复渲染。

使用场景：如果某个数据是通过其它数据计算得到的，那么只有当用到的数据，也就是依赖的数据发生变化的时候，才应该需要重新计算。
```jsx
// API：fn 是产生所需数据的一个计算函数，deps 是依赖的变量数组
useMemo(fn, deps);
```
结合 useMemo 和 useCallback 这两个 Hooks 一起看，会发现一个有趣的特性，那就是 useCallback 的功能其实是可以用 useMemo 来实现的。
```jsx
const myEventHandler = useMemo(() => {
  // 返回一个函数作为缓存结果
  return () => {
    // 在这里进行事件处理
  }
}, [dep1, dep2]);
```
### useRef：在多次渲染之间共享数据
函数组件虽然非常直观，简化了思考 UI 实现的逻辑，但是比起 Class 组件，还缺少了一个很重要的能力：在多次渲染之间共享数据。

在类组件中，我们可以定义类的成员变量，以便能在对象上通过成员属性去保存一些数据。但是在函数组件中，是没有这样一个空间去保存数据的。因此，React 让 useRef 这样一个 Hook 来提供这样的功能。

我们可以把 useRef 看作是在函数组件之外创建的一个容器空间。在这个容器上，我们可以通过唯一的 current 属设置一个值，从而在函数组件的多次渲染之间共享这个值。

使用 useRef 保存的数据一般是和 UI 的渲染无关的，因此当 ref 的值发生变化时，是不会触发组件的重新渲染的，这也是 useRef 区别于 useState 的地方。

除了存储跨渲染的数据之外，useRef 还有一个重要的功能，就是保存某个 DOM 节点的引用。我们知道，在 React 中，几乎不需要关心真实的 DOM 节点是如何渲染和修改的。但是在某些场景中，我们必须要获得真实 DOM 节点的引用，所以结合 React 的 ref 属性和 useRef 这个 Hook，我们就可以获得真实的 DOM 节点，并对这个节点进行操作。
```jsx
// API
const myRefContainer = useRef(initialValue);
```
### useContext：定义全局状态
React 提供了 Context 这样一个机制，能够让所有在某个组件开始的组件树上创建一个 Context。这样这个组件树上的所有组件，就都能访问和修改这个 Context 了。那么在函数组件里，我们就可以使用 useContext 这样一个 Hook 来管理 Context。

Context 看上去就是一个全局的数据，为什么要设计这样一个复杂的机制，而不是直接用一个全局的变量去保存数据呢？答案其实很简单，就是为了能够进行数据的绑定。当这个 Context 的数据发生变化时，使用这个数据的组件就能够自动刷新。但如果没有 Context，而是使用一个简单的全局变量，就很难去实现了。

Context 提供了一个方便在多个组件之间共享数据的机制。不过需要注意的是，它的灵活性也是一柄双刃剑。你或许已经发现，Context 相当于提供了一个定义 React 世界中全局变量的机制，而全局变量则意味着两点：
1. 会让调试变得困难，因为你很难跟踪某个 Context 的变化究竟是如何产生的。
2. 让组件的复用变得困难，因为一个组件如果使用了某个 Context，它就必须确保被用到的地方一定有这个 Context 的 Provider 在其父组件的路径上。
所以在 React 的开发中，除了像 Theme、Language 等一目了然的需要全局设置的变量外，我们很少会使用 Context 来做太多数据的共享。需要再三强调的是，Context 更多的是提供了一个强大的机制，让 React 应用具备定义全局的响应式数据的能力。
```jsx
// 创建
const MyContext = React.createContext(initialValue);
// 使用
const value = useContext(MyContext);
```
```jsx
// 示例
const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee"
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222"
  }
};

// 创建一个 Theme 的 Context
const ThemeContext = React.createContext(themes.light);

function App() {
  // 使用 state 来保存 theme 从而可以动态修改
  const [theme, setTheme] = useState("light");

  // 切换 theme 的回调函数
  const toggleTheme = useCallback(() => {
    setTheme((theme) => (theme === "light" ? "dark" : "light"));
  }, []);

  return (
    // 使用 theme state 作为当前 Context
    <ThemeContext.Provider value={themes[theme]}>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

// 在 Toolbar 组件中使用一个会使用 Theme 的 Button
function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

// 在 Theme Button 中使用 useContext 来获取当前的主题
function ThemedButton() {
  const theme = useContext(ThemeContext);
  return (
    <button style={{
      background: theme.background,
      color: theme.foreground
    }}>
      I am styled by theme context!
    </button>
  );
}
```

## Hooks ：如何正确理解函数组件的生命周期？
React 的本质：从 Model 到 View 的映射。假设状态永远不变，那么实际上函数组件就相当于是一个模板引擎，只执行一次。但是 React 本身正是为动态的状态变化而设计的，而可能引起状态变化的原因基本只有两个：
1. 用户操作产生的事件，比如点击了某个按钮。
2. 副作用产生的事件，比如发起某个请求正确返回了。
这两种事件本身并不会导致组件的重新渲染，但我们在这两种事件处理函数中，一定是因为改变了某个状态，这个状态可能是 State 或者 Context，从而导致了 UI 的重新渲染。

对于第一种情况，其实函数组件和 Class 组件的思路几乎完全一样：通过事件处理函数来改变某个状态；对于第二种情况，在函数组件中是通过 useEffect 这个 Hook 更加直观和语义化的方式来描述。对应到 Class 组件，则是通过手动判断 Props 或者 State 的变化来执行的。

在函数组件中你要思考的方式永远是：当某个状态发生变化时，我要做什么，而不再是在 Class 组件中的某个生命周期方法中我要做什么。
### 构造函数
在类组件中有一个专门的方法叫 constructor，也就是构造函数，在里面我们会做一些初始化的事情，比如设置 State 的初始状态，或者定义一些类的实例的成员。

而现在，函数组件只是一个函数，没有所谓的对象，或者说类的实例这样的概念，那自然也就没有构造函数的说法了。

那么在函数组件中，我们应该如何去做一些初始化的事情呢？答案是：函数组件基本上没有统一的初始化需要，因为 Hooks 自己会负责自己的初始化。比如 useState 这个 Hook，接收的参数就是定义的 State 初始值。而在过去的类组件中，你通常需要在构造函数中直接设置 this.state ，也就是设置某个值来完成初始化。

但是要注意了，我提到的“基本上没有初始化需要”，也就是并不是完全没有。严格来说，虽然需求不多，但类组件中构造函数能做的不只是初始化 State，还可能有其它的逻辑。那么如果一定要在函数组件中实现构造函数应该怎么做呢？

这时候我们不妨思考下构造函数的本质，其实就是：在所以其它代码执行之前的一次性初始化工作。在函数组件中，因为没有生命周期的机制，那么转换一下思路，其实我们要实现的是：一次性的代码执行。

利用 useRef 这个 Hook，我们可以实现一个 useSingleton 这样的一次性执行某段代码的自定义 Hook，代码如下：
```jsx
import { useRef } from 'react';

// 创建一个自定义 Hook 用于执行一次性代码
function useSingleton(callback) {
  // 用一个 called ref 标记 callback 是否执行过
  const called = useRef(false);
  // 如果已经执行过，则直接返回
  if (called.current) return;
  // 第一次调用时直接执行
  callBack();
  // 设置标记为已执行过
  called.current = true;
}
```
```jsx
import useSingleton from './useSingleton';

const MyComp = () => {
  // 使用自定义 Hook
  useSingleton(() => {
    console.log('这段代码只执行一次');
  });

  return (
    <div>My Component</div>
  );
};
```
### 三种常用的生命周期方法
在类组件中，componentDidMount，componentWillUnmount，和 componentDidUpdate 这三个生命周期方法可以说是日常开发最常用的。业务逻辑通常要分散到不同的生命周期方法中，比如说在上面的 Blog 文章的例子中，你需要同时在 componentDidMount 和 componentDidUpdate 中去获取数据。

而在函数组件中，这几个生命周期方法可以统一到 useEffect 这个 Hook，正如 useEffect 的字面含义，它的作用就是触发一个副作用，即在组件每次 render 之后去执行。
```jsx
useEffect(() => {
  // componentDidMount + componentDidUpdate
  console.log('这里基本等价于 componentDidMount + componentDidUpdate');
  return () => {
    // componentWillUnmount
    console.log('这里基本等价于 componentWillUnmount');
  }
}, [deps])
```

## 创建自定义 Hooks
声明一个名字以 use 开头的函数，比如 useCounter。这个函数在形式上和普通的 JavaScript 函数没有任何区别，你可以传递任意参数给这个 Hook，也可以返回任何值。但是要注意，Hooks 和普通函数在语义上是有区别的，就在于函数中有没有用到其它 Hooks。

我们可以看到自定义 Hooks 的两个特点：
1. 名字一定是以 use 开头的函数，这样 React 才能够知道这个函数是一个 Hook；
2. 函数内部一定调用了其它的 Hooks，可以是内置的 Hooks，也可以是其它自定义 Hooks。这样才能够让组件刷新，或者去产生副作用。

典型的四个使用场景：
1. 抽取业务逻辑
```jsx
// 例如抽取计时器业务逻辑
import { useState, useCallback }from 'react';
 
function useCounter() {
  // 定义 count 这个 state 用于保存当前数值
  const [count, setCount] = useState(0);
  // 实现加 1 的操作
  const increment = useCallback(() => setCount(count + 1), [count]);
  // 实现减 1 的操作
  const decrement = useCallback(() => setCount(count - 1), [count]);
  // 重置计数器
  const reset = useCallback(() => setCount(0), []);
  
  // 将业务逻辑的操作 export 出去供调用者使用
  return { count, increment, decrement, reset };
}
```
```jsx
import React from 'react';

function Counter() {
  // 调用自定义 Hook
  const { count, increment, decrement, reset } = useCounter();

  // 渲染 UI
  return (
    <div>
      <button onClick={decrement}> - </button>
      <p>{count}</p>
      <button onClick={increment}> + </button>
      <button onClick={reset}> reset </button>
    </div>
  );
}
```
2. 封装通用逻辑
```jsx
// 封装接口请求逻辑
import { useState } from 'react';

const useAsync = (asyncFunction) => {
  // 设置三个异步逻辑相关的 state
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // 定义一个 callback 用于执行异步逻辑
  const execute = useCallback(() => {
    // 请求开始时，设置 loading 为 true，清除已有数据和 error 状态
    setLoading(true);
    setData(null);
    setError(null);
    return asyncFunction()
      .then((response) => {
        // 请求成功时，将数据写进 state，设置 loading 为 false
        setData(response);
        setLoading(false);
      })
      .catch((error) => {
        // 请求失败时，设置 loading 为 false，并设置错误状态
        setError(error);
        setLoading(false);
      });
  }, [asyncFunction]);

  return { execute, loading, data, error };
};
```
```jsx
import React from "react";
import useAsync from './useAsync';

export default function UserList() {
  // 通过 useAsync 这个函数，只需要提供异步逻辑的实现
  const {
    execute: fetchUsers,
    data: users,
    loading,
    error,
  } = useAsync(async () => {
    const res = await fetch("https://reqres.in/api/users/");
    const json = await res.json();
    return json.data;
  });
  
  return (
    // 根据状态渲染 UI...
  );
}
```
3. 监听浏览器状态
```jsx
// 窗口大小变化重新布局
import { useState, useEffect } from 'react';

// 获取横向，纵向滚动条位置
const getPosition = () => {
  return {
    x: document.body.scrollLeft,
    y: document.body.scrollTop,
  };
};
const useScroll = () => {
  // 定一个 position 这个 state 保存滚动条位置
  const [position, setPosition] = useState(getPosition());
  useEffect(() => {
    const handler = () => {
      setPosition(getPosition(document));
    };
    // 监听 scroll 事件，更新滚动条位置
    document.addEventListener("scroll", handler);
    return () => {
      // 组件销毁时，取消事件监听
      document.removeEventListener("scroll", handler);
    };
  }, []);
  return position;
};
```
```jsx
// 返回顶部
import React, { useCallback } from 'react';
import useScroll from './useScroll';

function ScrollTop() {
  const { y } = useScroll();

  const goTop = useCallback(() => {
    document.body.scrollTop = 0;
  }, []);

  const style = {
    position: "fixed",
    right: "10px",
    bottom: "10px",
  };
  // 当滚动条位置纵向超过 300 时，显示返回顶部按钮
  if (y > 300) {
    return (
      <button onClick={goTop} style={style}>
        Back to Top
      </button>
    );
  }
  // 否则不 render 任何 UI
  return null;
}

```
4. 拆分复杂组件
```jsx
import React, { useEffect, useCallback, useMemo, useState } from "react";
import { Select, Table } from "antd";
import _ from "lodash";
import useAsync from "./useAsync";

const endpoint = "https://myserver.com/api/";
const useArticles = () => {
  // 使用上面创建的 useAsync 获取文章列表
  const { execute, data, loading, error } = useAsync(
    useCallback(async () => {
      const res = await fetch(`${endpoint}/posts`);
      return await res.json();
    }, []),
  );
  // 执行异步调用
  useEffect(() => execute(), [execute]);
  // 返回语义化的数据结构
  return {
    articles: data,
    articlesLoading: loading,
    articlesError: error,
  };
};
const useCategories = () => {
  // 使用上面创建的 useAsync 获取分类列表
  const { execute, data, loading, error } = useAsync(
    useCallback(async () => {
      const res = await fetch(`${endpoint}/categories`);
      return await res.json();
    }, []),
  );
  // 执行异步调用
  useEffect(() => execute(), [execute]);

  // 返回语义化的数据结构
  return {
    categories: data,
    categoriesLoading: loading,
    categoriesError: error,
  };
};
const useCombinedArticles = (articles, categories) => {
  // 将文章数据和分类数据组合到一起
  return useMemo(() => {
    // 如果没有文章或者分类数据则返回 null
    if (!articles || !categories) return null;
    return articles.map((article) => {
      return {
        ...article,
        category: categories.find(
          (c) => String(c.id) === String(article.categoryId),
        ),
      };
    });
  }, [articles, categories]);
};
const useFilteredArticles = (articles, selectedCategory) => {
  // 实现按照分类过滤
  return useMemo(() => {
    if (!articles) return null;
    if (!selectedCategory) return articles;
    return articles.filter((article) => {
      console.log("filter: ", article.categoryId, selectedCategory);
      return String(article?.category?.name) === String(selectedCategory);
    });
  }, [articles, selectedCategory]);
};

const columns = [
  { dataIndex: "title", title: "Title" },
  { dataIndex: ["category", "name"], title: "Category" },
];

export default function BlogList() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  // 获取文章列表
  const { articles, articlesError } = useArticles();
  // 获取分类列表
  const { categories, categoriesError } = useCategories();
  // 组合数据
  const combined = useCombinedArticles(articles, categories);
  // 实现过滤
  const result = useFilteredArticles(combined, selectedCategory);

  // 分类下拉框选项用于过滤
  const options = useMemo(() => {
    const arr = _.uniqBy(categories, (c) => c.name).map((c) => ({
      value: c.name,
      label: c.name,
    }));
    arr.unshift({ value: null, label: "All" });
    return arr;
  }, [categories]);

  // 如果出错，简单返回 Failed
  if (articlesError || categoriesError) return "Failed";

  // 如果没有结果，说明正在加载
  if (!result) return "Loading...";

  return (
    <div>
      <Select
        value={selectedCategory}
        onChange={(value) => setSelectedCategory(value)}
        options={options}
        style={{ width: "200px" }}
        placeholder="Select a category"
      />
      <Table dataSource={result} columns={columns} />
    </div>
  );
}
```

## 函数组件中使用 Redux
Redux 作为一款状态管理框架，是 React 开发人员必须掌握的一项技能。需要说明的是，Redux 作为一套独立的框架，虽然可以和任何 UI 框架结合起来使用。但是因为它基于不可变数据的机制，可以说，基本上就是为 React 量身定制的。

#### Redux 出现的背景
随着对 React 使用的深入，会发现组件级别的 state，和从上而下传递的 props 这两个状态机制，无法满足复杂功能的需要。例如跨层级之间的组件的数据共享和传递。
单个 React 组件，它的状态可以用内部的 state 来维护，而且这个 state 在组件外部是无法访问的。Redux 用全局唯一的 Store 维护了整个应用程序的状态。可以说，对于页面的多个组件，都是从这个 Store 来获取状态的，保证组件之间能够共享状态。

#### Redux Store 的两个特点
1. Redux Store 是全局唯一的。即整个应用程序一般只有一个 Store。
2. Redux Store 是树状结构，可以更天然地映射到组件树的结构，虽然不是必须的。

我们通过把状态放在组件之外，就可以让 React 组件成为更加纯粹的表现层，那么很多对于业务数据和状态数据的管理，就都可以在组件之外去完成。同时这也天然提供了状态共享的能力，有两个场景可以典型地体现出这一点。
1. 跨组件的状态共享：当某个组件发起一个请求时，将某个 Loading 的数据状态设为 True，另一个全局状态组件则显示 Loading 的状态。
2. 同组件多个实例的状态共享：某个页面组件初次加载时，会发送请求拿回了一个数据，切换到另外一个页面后又返回。这时数据已经存在，无需重新加载。设想如果是本地的组件 state，那么组件销毁后重新创建，state 也会被重置，就还需要重新获取数据。

#### 理解 Redux 的三个基本概念
Redux 引入的概念其实并不多，主要就是三个：State、Action 和 Reducer。
* 其中 State 即 Store，一般就是一个纯 JavaScript Object。
* Action 也是一个 Object，用于描述发生的动作。
* 而 Reducer 则是一个函数，接收 Action 和 State 并作为参数，通过计算得到新的 Store。
![redux](https://github.com/lujiajian1/study-notes/blob/main/img/redux.png)
在 Redux 中，所有对于 Store 的修改都必须通过这样一个公式去完成，即通过 Reducer 完成，而不是直接修改 Store。这样的话，一方面可以保证数据的不可变性（Immutable），同时也能带来两个非常大的好处。
1. 可预测性（Predictable）：即给定一个初始状态和一系列的 Action，一定能得到一致的结果，同时这也让代码更容易测试。
2. 易于调试：可以跟踪 Store 中数据的变化，甚至暂停和回放。因为每次 Action 产生的变化都会产生新的对象，而我们可以缓存这些对象用于调试。Redux 的基于浏览器插件的开发工具就是基于这个机制，非常有利于调试。
```js
// 实现计数器，+1 -1 的逻辑
// 第一步：先创建 Store
// 第二步：再利用 Action 和 Reducer 修改 Store
// 第三步：最后利用 subscribe 监听 Store 的变化
import { createStore } from 'redux'

// 定义 Store 的初始值
const initialState = { value: 0 }

// Reducer，处理 Action 返回新的 State
function counterReducer(state = initialState, action) {
  switch (action.type) {
    case 'counter/incremented':
      return { value: state.value + 1 }
    case 'counter/decremented':
      return { value: state.value - 1 }
    default:
      return state
  }
}

// 利用 Redux API 创建一个 Store，参数就是 Reducer
const store = createStore(counterReducer)

// Store 提供了 subscribe 用于监听数据变化
store.subscribe(() => console.log(store.getState()))

// 计数器加 1，用 Store 的 dispatch 方法分发一个 Action，由 Reducer 处理
const incrementAction = { type: 'counter/incremented' };
store.dispatch(incrementAction);
// 监听函数输出：{value: 1}

// 计数器减 1
const decrementAction = { type: 'counter/decremented' };
store.dispatch(decrementAction)
// 监听函数输出：{value: 0}
```

#### 在 React 中使用 Redux（建立 Redux 和 React 的联系）
1. React 组件能够在依赖的 Store 的数据发生变化时，重新 Render。
2. 在 React 组件中，能够在某些时机去 dispatch 一个 action，从而触发 Store 的更新。
要实现这两点，我们需要引入 Facebook 提供的 react-redux 这样一个工具库，工具库的作用就是建立一个桥梁，让 React 和 Redux 实现互通。
在 react-redux 的实现中，为了确保需要绑定的组件能够访问到全局唯一的 Redux Store，利用了 React 的 Context 机制去存放 Store 的信息。通常我们会将这个 Context 作为整个 React 应用程序的根节点。因此，作为 Redux 的配置的一部分，我们通常需要如下的代码：
```js
import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import store from './store'

import App from './App'

const rootElement = document.getElementById('root')
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
)
```
这里使用了 Provider 这样一个组件来作为整个应用程序的根节点，并将 Store 作为属性传给了这个组件，这样所有下层的组件就都能够使用 Redux 了。
完成了这样的配置之后，在函数组件中使用 Redux 就非常简单了：利用 react-redux 提供的 useSelector 和 useDispatch 这两个 Hooks。
Hooks 用到 Redux 时可变的对象就是 Store，而 useSelector 则让一个组件能够在 Store 的某些数据发生变化时重新 render。
```js

import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

export function Counter() {
  // 从 state 中获取当前的计数值
  const count = useSelector(state => state.value)

  // 获得当前 store 的 dispatch 方法
  const dispatch = useDispatch()

  // 在按钮的 click 时间中去分发 action 来修改 store
  return (
    <div>
      <button
        onClick={() => dispatch({ type: 'counter/incremented' })}
      >+</button>
      <span>{count}</span>
      <button
        onClick={() => dispatch({ type: 'counter/decremented' })}
      >-</button>
    </div>
  )
}
```
我们无需关心 View 是如何绑定到 Store 的某一部分数据的，因为 React-Redux 帮我们做了这件事情。总结来说，通过这样一种简单的机制，Redux 统一了更新数据状态的方式，让整个应用程序更加容易开发、维护、调试和测试。
![reactRedux](https://github.com/lujiajian1/study-notes/blob/main/img/reactRedux.png)

#### 使用 Redux 处理异步逻辑
在 Redux 中，处理异步逻辑也常常被称为异步 Action，在 Redux 的 Store 中，我们不仅维护着业务数据，同时维护着应用程序的状态。比如对于发送请求获取数据这样一个异步的场景，我们来看看涉及到 Store 数据会有哪些变化：
1. 请求发送出去时：设置 state.pending = true，用于 UI 显示加载中的状态。
2. 请求发送成功时：设置 state.pending = false, state.data = result。即取消 UI 的加载状态，同时将获取的数据放到 store 中用于 UI 的显示。
3. 请求发送失败时：设置 state.pending = false, state.error = error。即取消 UI 的加载状态，同时设置错误的状态，用于 UI 显示错误的内容。
前面提到，任何对 Store 的修改都是由 action 完成的。那么对于一个异步请求，上面的三次数据修改显然必须要三个 action 才能完成。那么假设我们在 React 组件中去做这个发起请求的动作，代码逻辑应该类似如下：
```js
function DataList() {
  const dispatch = useDispatch();
  // 在组件初次加载时发起请求
  useEffect(() => {
    // 请求发送时
    dispatch({ type: 'FETCH_DATA_BEGIN' });
    fetch('/some-url').then(res => {
      // 请求成功时
      dispatch({ type: 'FETCH_DATA_SUCCESS', data: res });
    }).catch(err => {
      // 请求失败时
      dispatch({ type: 'FETCH_DATA_FAILURE', error: err });
    })
  }, []);
  
  // 绑定到 state 的变化
  const data = useSelector(state => state.data);
  const pending = useSelector(state => state.pending);
  const error = useSelector(state => state.error);
  
  // 根据 state 显示不同的状态
  if (error) return 'Error.';
  if (pending) return 'Loading...';
  return <Table data={data} />;
}
```
从这段代码可以看到，我们使用了三个（同步）Action 完成了这个异步请求的场景。这里我们将 Store 完全作为一个存放数据的地方，至于数据哪里来， Redux 并不关心。尽管这样做是可行的。
但是很显然，发送请求获取数据并进行错误处理这个逻辑是不可重用的。假设我们希望在另外一个组件中也能发送同样的请求，就不得不将这段代码重新实现一遍。因此，Redux 中提供了 middleware 这样一个机制，让我们可以巧妙地实现所谓异步 Action 的概念。
简单来说，middleware 可以让你提供一个拦截器在 reducer 处理 action 之前被调用。在这个拦截器中，你可以自由处理获得的 action。无论是把这个 action 直接传递到 reducer，或者构建新的 action 发送到 reducer，都是可以的。Middleware 正是在 Action 真正到达 Reducer 之前提供的一个额外处理 Action 的机会。
![middleware](https://github.com/lujiajian1/study-notes/blob/main/img/middleware.png)
Redux 中的 Action 不仅仅可以是一个 Object，它可以是任何东西，也可以是一个函数。利用这个机制，Redux 提供了 redux-thunk 这样一个中间件，它如果发现接受到的 action 是一个函数，那么就不会传递给 Reducer，而是执行这个函数，并把 dispatch 作为参数传给这个函数，从而在这个函数中你可以自由决定何时，如何发送 Action。
假设我们在创建 Redux Store 时指定了 redux-thunk 这个中间件：
```js
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducer'

const composedEnhancer = applyMiddleware(thunkMiddleware)
const store = createStore(rootReducer, composedEnhancer)
```
那么在我们 dispatch action 时就可以 dispatch 一个函数用于来发送请求，通常，我们会写成如下的结构：
```js
import fetchData from './fetchData';
function fetchData() {
  return dispatch => {
    dispatch({ type: 'FETCH_DATA_BEGIN' });
    fetch('/some-url').then(res => {
      dispatch({ type: 'FETCH_DATA_SUCCESS', data: res });
    }).catch(err => {
      dispatch({ type: 'FETCH_DATA_FAILURE', error: err });
    })
  }
}
function DataList() {
  const dispatch = useDispatch();
  // dispatch 了一个函数由 redux-thunk 中间件去执行
  dispatch(fetchData());
}
```
可以看到，通过这种方式，我们就实现了异步请求逻辑的重用。那么这一套结合 redux-thunk 中间件的机制，我们就称之为异步 Action。所以说异步 Action 并不是一个具体的概念，而可以把它看作是 Redux 的一个使用模式。它通过组合使用同步 Action ，在没有引入新概念的同时，用一致的方式提供了处理异步逻辑的方案。

## 复杂状态处理：保证状态一致性


