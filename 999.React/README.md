## React 基本概念
总的来说：React 的中文含义是“反应”或“响应”，它描述了 React 这样一个前端框架的核心原理：当数据发生变化时，UI 能够自动把变化反映出来。在react之前，更新 UI 的方式是通过基于浏览器 DOM 的 API，去精细地控制 DOM 节点的创建、修改和删除，为了保证 UI 和数据的一致性，我们需要非常繁琐并且小心的处理 DOM 节点的变更。

React核心的三个概念：组件、状态和 JSX。下面我们分别来看。
## JSX 简介
### 什么是JSX
这个有趣的标签语法既不是字符串也不是 HTML，它是 JSX，是一个 JavaScript 的语法扩展，JSX 可以生成 React “元素”
```jsx
const element = <h1>Hello, world!</h1>;
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

## Refs 转发
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





















