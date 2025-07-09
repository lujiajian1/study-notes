## React 组件生命周期

React 组件生命周期分为以下三个阶段。

**挂载阶段**：这是组件首次被创建并插入到 DOM 中的阶段。

**更新阶段**：当组件的 props 或 state 发生变化时，就会触发更新阶段。

**卸载阶段**：组件从 DOM 中移除时进入卸载阶段。

函数组件是没有明确的生命周期方法，但可以通过 `useEffect` 来模拟生命周期行为。

模拟**挂载阶段**的生命周期方法：

- 只需要在 `useEffect` 的依赖数组中传入一个空数组 `[]`。这样，该副作用只会在组件挂载后运行一次。

  ```js
  useEffect(() => {
    console.log('代码只会在组件挂载后执行一次')
  }, [])
  ```

模拟**更新阶段**的生命周期方法：

- 通过将依赖项放入依赖数组中，`useEffect` 可以在依赖项更改时执行。如果你省略了依赖数组，副作用将在每次渲染后执行。
  ```js
  // 注意这里没有提供依赖数组
  useEffect(() => {
    console.log('代码会在组件挂载后以及每次更新后执行')
  })
  // 特定依赖更新时执行
  useEffect(() => {
    console.log('代码会在 count 更新后执行')
  }, [count])
  ```

模拟**卸载阶段**的生命周期方法：

- 在 `useEffect` 的函数中返回一个函数，该函数会在组件卸载前执行。

  ```js
  useEffect(() => {
    return () => {
      console.log('代码会在组件卸载前执行')
    }
  }, [])
  ```

## React 父子组件生命周期调用顺序

函数组件的生命周期通过 `useEffect` 模拟，其调用顺序如下：

**挂载阶段**

- **父组件**：执行函数体（首次渲染）
- **子组件**：执行函数体（首次渲染）
- **子组件**：`useEffect`（挂载阶段）
- **父组件**：`useEffect`（挂载阶段）

**更新阶段**

- **父组件**：执行函数体（重新渲染）
- **子组件**：执行函数体（重新渲染）
- **子组件**：`useEffect` 清理函数（如果依赖项变化）
- **父组件**：`useEffect` 清理函数（如果依赖项变化）
- **子组件**：`useEffect`（如果依赖项变化）
- **父组件**：`useEffect`（如果依赖项变化）

**卸载阶段**

- **父组件**：`useEffect` 清理函数
- **子组件**：`useEffect` 清理函数

## React 组件通讯方式

- **通过props向子组件传递数据**

```js
//父组件
const Parent = () => {
  const message = 'Hello from Parent'
  return <Child message={message} />
}

// 子组件
const Child = ({ message }) => {
  return <div>{message}</div>
}
```

- **通过回调函数向父组件传递数据**

```js
//父组件
const Parent = () => {
  const handleData = (data) => {
    console.log('Data from Child:', data)
  }
  return <Child onSendData={handleData} />
}

// 子组件
const Child = ({ message }) => {
  return <button onClick={() => onSendData('Hello from Child')}>Send Data</button>
}
```

- **使用refs调用子组件暴露的方法**

```js
import React, { useRef, forwardRef, useImperativeHandle } from 'react'

// 子组件
const Child = forwardRef((props, ref) => {
  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    sayHello() {
      alert('Hello from Child Component!')
    },
  }))

  return <div>Child Component</div>
})

// 父组件
function Parent() {
  const childRef = useRef(null)

  const handleClick = () => {
    if (childRef.current) {
      childRef.current.sayHello()
    }
  }

  return (
    <div>
      <Child ref={childRef} />
      <button onClick={handleClick}>Call Child Method</button>
    </div>
  )
}

export default Parent
```

- **通过Context进行跨组件通信**

```js
import React, { useState } from 'react'

// 创建一个 Context
const MyContext = React.createContext()

// 父组件
function Parent() {
  const [sharedData, setSharedData] = useState('Hello from Context')

  const updateData = () => {
    setSharedData('Updated Data from Context')
  }

  return (
    // 提供数据和更新函数
    <MyContext.Provider value={{ sharedData, updateData }}>
      <ChildA />
    </MyContext.Provider>
  )
}

// 子组件 A（引用子组件 B）
function ChildA() {
  return (
    <div>
      <ChildB />
    </div>
  )
}

// 子组件 B（使用 useContext）
function ChildB() {
  const { sharedData, updateData } = React.useContext(MyContext)
  return (
    <div>
      <div>ChildB: {sharedData}</div>
      <button onClick={updateData}>Update Data</button>
    </div>
  )
}

export default Parent
```

- **使用状态管理库进行通信**

  - **React Context + useReducer**

    ```js
    import React, { useReducer } from 'react'

    const initialState = { count: 0 }

    function reducer(state, action) {
      switch (action.type) {
        case 'increment':
          return { count: state.count + 1 }
        case 'decrement':
          return { count: state.count - 1 }
        default:
          throw new Error()
      }
    }

    const CounterContext = React.createContext()

    function CounterProvider({ children }) {
      const [state, dispatch] = useReducer(reducer, initialState)
      return <CounterContext.Provider value={{ state, dispatch }}>{children}</CounterContext.Provider>
    }

    function Counter() {
      const { state, dispatch } = React.useContext(CounterContext)
      return (
        <div>
          Count: {state.count}
          <button onClick={() => dispatch({ type: 'increment' })}>+</button>
          <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
        </div>
      )
    }

    function App() {
      return (
        <CounterProvider>
          <Counter />
        </CounterProvider>
      )
    }

    export default App
    ```

  - **Redux**：使用 `Redux Toolkit` 简化 Redux 开发。

    ```js
    import { createSlice, configureStore } from '@reduxjs/toolkit'

    const counterSlice = createSlice({
      name: 'counter',
      initialState: { value: 0 },
      reducers: {
        increment: (state) => {
          state.value += 1
        },
        decrement: (state) => {
          state.value -= 1
        },
      },
    })

    const { increment, decrement } = counterSlice.actions

    const store = configureStore({
      reducer: counterSlice.reducer,
    })

    store.subscribe(() => console.log(store.getState()))

    store.dispatch(increment())
    store.dispatch(decrement())
    ```

  - **MobX**

  ```js
  import { makeAutoObservable } from 'mobx'
  import { observer } from 'mobx-react-lite'

  class CounterStore {
    count = 0

    constructor() {
      makeAutoObservable(this)
    }

    increment() {
      this.count += 1
    }

    decrement() {
      this.count -= 1
    }
  }

  const counterStore = new CounterStore()

  const Counter = observer(() => {
    return (
      <div>
        Count: {counterStore.count}
        <button onClick={() => counterStore.increment()}>+</button>
        <button onClick={() => counterStore.decrement()}>-</button>
      </div>
    )
  })

  export default Counter
  ```

  - **Zustand**

  ```
  import create from "zustand";

  const useStore = create((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
  }));

  function Counter() {
    const { count, increment, decrement } = useStore();
    return (
      <div>
        Count: {count}
        <button onClick={increment}>+</button>
        <button onClick={decrement}>-</button>
      </div>
    );
  }

  export default Counter;
  ```

- **使用事件总线（Event Bus）进行通信**

可以使用第三方库如 pubsub-js 来实现父子组件间通信。在父组件中订阅一个事件，子组件在特定情况下发布这个事件并传递数据。

```js
import React from 'react'
import PubSub from 'pubsub-js'

const ParentComponent = () => {
  React.useEffect(() => {
    const token = PubSub.subscribe('childData', (msg, data) => {
      console.log('Received data from child:', data)
    })
    return () => {
      PubSub.unsubscribe(token)
    }
  }, [])

  return <ChildComponent />
}

const ChildComponent = () => {
  const sendData = () => {
    PubSub.publish('childData', { message: 'Hello from child' })
  }

  return <button onClick={sendData}>Send data from child</button>
}

export default ParentComponent
```

## state 和 props 有什么区别？

在 React 中，props 和 state 都用于管理组件的数据和状态。

**Props（属性）：**

props 是组件之间传递数据的一种方式，用于从父组件向子组件传递数据。
props 是只读的，即父组件传递给子组件的数据在子组件中不能被修改。
props 是在组件的声明中定义，通过组件的属性传递给子组件。
props 的值由父组件决定，子组件无法直接改变它的值。
当父组件的 props 发生变化时，子组件会重新渲染。

**State（状态）：**

state 是组件内部的数据，用于管理组件的状态和变化。
state 是可变的，组件可以通过 setState 方法来更新和修改 state。
state 是在组件的构造函数中初始化的，通常被定义为组件的类属性。
state 的值可以由组件自身内部改变，通过调用 setState 方法触发组件的重新渲染。
当组件的 state 发生变化时，组件会重新渲染。

**总结：**

props 是父组件传递给子组件的数据，是只读的，子组件无法直接修改它。
state 是组件内部的数据，是可变的，组件可以通过 setState 方法来修改它。
props 用于组件之间的数据传递，而 state 用于管理组件自身的状态和变化。

## React 有哪些内置 Hooks ？

React 目前有多个 Hooks API，可以参考[官方文档 Hooks](https://zh-hans.react.dev/reference/react/hooks)，可以按照功能进行分类:

**1. 状态管理 Hooks**

- useState: 用于在函数组件中添加局部状态。
- useReducer: 用于管理复杂的状态逻辑，类似于 Redux 的 reducer。

**2. 副作用 Hooks**

- useEffect: 用于在函数组件中执行副作用操作（如数据获取、订阅、手动 DOM 操作等）。
- useLayoutEffect: 与 useEffect 类似，但在 DOM 更新后同步执行，适用于需要直接操作 DOM 的场景。

**3. 上下文 Hooks**

- useContext: 用于访问 React 的上下文（Context）。

**4. 引用 Hooks**

- useRef: 用于创建一个可变的引用对象，通常用于访问 DOM 元素或存储可变值。

**5. 性能优化 Hooks**

- useMemo: 用于缓存计算结果，避免在每次渲染时都重新计算。
- useCallback: 用于缓存回调函数，避免在每次渲染时都创建新的回调。

**6. 其他 Hooks**

- useDeferredValue: 延迟更新 UI 的某些部分。
- useActionState: 根据某个表单动作的结果更新 state。
- useImperativeHandle: 用于自定义暴露给父组件的实例值，通常与 forwardRef 一起使用。
- useDebugValue: 用于在 React 开发者工具中显示自定义 Hook 的标签。
- useOptimistic 帮助你更乐观地更新用户界面
- useTransition: 用于标记某些状态更新为“过渡”状态，允许你在更新期间显示加载指示器。
- useId: 用于生成唯一的 ID，可以生成传递给无障碍属性的唯一 ID。
- useSyncExternalStore: 用于订阅外部存储（如 Redux 或 Zustand）的状态。
- useInsertionEffect: 为 CSS-in-JS 库的作者特意打造的，在布局副作用触发之前将元素插入到 DOM 中

## useEffect 和 useLayoutEffect 的区别

**1. 执行时机**

- **useEffect**:

  - **执行时机**: 在浏览器完成绘制（即 DOM 更新并渲染到屏幕）之后异步执行。
  - **适用场景**: 适用于大多数副作用操作，如数据获取、订阅、手动 DOM 操作等，因为这些操作通常不需要阻塞浏览器的渲染。

- **useLayoutEffect**:
  - **执行时机**: 在 DOM 更新之后，但在浏览器绘制之前同步执行。
  - **适用场景**: 适用于需要在浏览器绘制之前同步执行的副作用操作，如测量 DOM 元素、同步更新 DOM 等。由于它是同步执行的，可能会阻塞浏览器的渲染，因此应谨慎使用。

**2. 对渲染的影响**

- **useEffect**:

  - 由于是异步执行，不会阻塞浏览器的渲染过程，因此对用户体验的影响较小。
  - 如果副作用操作导致状态更新，React 会重新渲染组件，但用户不会看到中间的闪烁或不一致的状态。

- **useLayoutEffect**:
  - 由于是同步执行，会阻塞浏览器的渲染过程，直到副作用操作完成。
  - 如果副作用操作导致状态更新，React 会立即重新渲染组件，用户可能会看到中间的闪烁或不一致的状态。

**3. 总结**

- **useEffect**: 异步执行，不阻塞渲染，适合大多数副作用操作。
- **useLayoutEffect**: 同步执行，阻塞渲染，适合需要在绘制前同步完成的副作用操作。

## 为何 dev 模式下 useEffect 执行两次？

React 官方文档其实对这个问题进行了[解答](https://zh-hans.react.dev/reference/react/useEffect#my-effect-runs-twice-when-the-component-mounts)：

在开发环境下，如果开启严格模式，React 会在实际运行 setup 之前额外运行一次 setup 和 cleanup。

这是一个压力测试，用于验证 Effect 的逻辑是否正确实现。如果出现可见问题，则 cleanup 函数缺少某些逻辑。cleanup 函数应该停止或撤消 setup 函数所做的任何操作。一般来说，用户不应该能够区分 setup 被调用一次（如在生产环境中）和调用 setup → cleanup → setup 序列（如在开发环境中）。

借助严格模式的目标是帮助开发者提前发现以下问题：

1. 不纯的渲染逻辑：例如，依赖外部状态或直接修改 DOM。
2. 未正确清理的副作用：例如，未在 useEffect 的清理函数中取消订阅或清除定时器。
3. 不稳定的组件行为：例如，组件在多次挂载和卸载时表现不一致。

通过强制组件挂载和卸载两次，React 可以更好地暴露这些问题。

## React 闭包陷阱

让我们举个例子：

```jsx
function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      console.log(count) // 每次打印的都是初始值 0
    }, 1000)

    return () => clearInterval(timer)
  }, []) // 依赖数组为空，effect 只运行一次

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

在这个例子中：

- `useEffect` 只在组件挂载时运行一次。
- `setInterval` 的回调函数形成了一个闭包，捕获了初始的 `count` 值（即 0）。
- 即使 `count` 状态更新了，`setInterval` 中的回调函数仍然访问的是旧的 `count` 值。

闭包陷阱的根本原因是 JavaScript 的闭包机制：

- 当一个函数被定义时，它会捕获当前作用域中的变量。
- 如果这些变量是状态或 props，它们的值在函数定义时被“固定”下来。
- 当状态或 props 更新时，闭包中的值并不会自动更新。

为了避免闭包陷阱，可以将依赖的状态或 props 添加到 useEffect 的依赖数组中，这样每次状态更新时，useEffect 都会重新运行，闭包中的值也会更新。

```jsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log(count) // 每次打印最新的 count 值
  }, 1000)

  return () => clearInterval(timer)
}, [count]) // 将 count 添加到依赖数组
```

## React state 不可变数据

在 React 中，**状态（state）的不可变性** 是指你不能直接修改状态的值，而是需要创建一个新的值来替换旧的状态。

使用不可变数据可以带来如下好处：

1. **性能优化**

React 使用浅比较（shallow comparison）来检测状态是否发生变化。如果状态是不可变的，React 只需要比较引用（即内存地址）是否变化，而不需要深度遍历整个对象或数组。

2. **可预测性**

- 不可变数据使得状态的变化更加可预测和可追踪。
- 每次状态更新都会生成一个新的对象或数组，这样可以更容易地调试和追踪状态的变化历史。

3. **避免副作用**

- 直接修改状态可能会导致意外的副作用，尤其是在异步操作或复杂组件中。
- 不可变数据确保了状态的更新是纯函数式的，避免了副作用。

**关于如何实现不可变数据？**

1. **更新对象时使用新的对象**

```jsx
// ❌ 错误：直接修改状态
state.name = 'new name'
setState(state)
```

```jsx
// ✅ 正确：创建新对象
setState({
  ...state, // 复制旧状态
  name: 'new name', // 更新属性
})
```

2. **更新数组时使用新的数组**

```jsx
// ❌ 错误：直接修改数组
state.items.push(newItem)
setState(state)
```

```jsx
// ✅ 正确：创建新数组
setState({
  ...state,
  items: [...state.items, newItem], // 添加新元素
})
```

3. **使用工具库简化不可变更新**

常用的库有：

1. **Immer.js**
   [Immer](https://immerjs.github.io/immer/) 是一个流行的库，它允许你以可变的方式编写代码，但最终生成不可变的数据。

```jsx
import produce from 'immer'

setState(
  produce(state, (draft) => {
    draft.user.profile.name = 'new name' // 直接修改
    draft.items.push(newItem) // 直接修改
  })
)
```

2. **Immutable.js**

[Immutable.js](https://immutable-js.com/) 提供了不可变的数据结构（如 `List`、`Map` 等），可以更方便地处理不可变数据。

```jsx
import { Map } from 'immutable'

const state = Map({ name: 'John', age: 30 })
const newState = state.set('name', 'Jane')
```

## React state 异步更新

在 React 18 之前，React 采用批处理策略来优化状态更新。在批处理策略下，React 将在事件处理函数结束后应用所有的状态更新，这样可以避免不必要的渲染和 DOM 操作。

然而，这个策略在异步操作中就无法工作了。因为 React 没有办法在适当的时机将更新合并起来，所以结果就是在异步操作中的每一个状态更新都会导致一个新的渲染。

例如，当你在一个 onClick 事件处理函数中连续调用两次 setState，React 会将这两个更新合并，然后在一次重新渲染中予以处理。

然而，在某些场景下，如果你在事件处理函数之外调用 setState，React 就无法进行批处理了。比如在 setTimeout 或者 Promise 的回调函数中。在这些场景中，每次调用 setState，React 都会触发一次重新渲染，无法达到批处理的效果。

React 18 引入了自动批处理更新机制，让 React 可以捕获所有的状态更新，并且无论在何处进行更新，都会对其进行批处理。这对一些异步的操作，如 Promise，setTimeout 之类的也同样有效。

这一新特性的实现，核心在于 React 18 对渲染优先级的管理。React 18 引入了一种新的协调器，被称为“React Scheduler”。它负责管理 React 的工作单元队列。每当有一个新的状态更新请求，React 会创建一个新的工作单元并放入这个队列。当 JavaScript 运行栈清空，Event Loop 即将开始新的一轮循环时，Scheduler 就会进入工作，处理队列中的所有工作单元，实现了批处理。

## React state 的“合并”特性

React **状态的“合并”特性** 是指当使用 `setState` 更新状态时，React 会将新状态与旧状态进行浅合并（shallow merge），而不是直接替换整个状态对象。

合并特性在类组件中尤为明显，而在函数组件中需要手动实现类似的行为。

1. **类组件中的状态合并**

在类组件中，`setState` 会自动合并状态对象。例如：

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: 'John',
      age: 30,
    }
  }

  updateName = () => {
    this.setState({ name: 'Jane' }) // 只更新 name，age 保持不变
  }

  render() {
    return (
      <div>
        <p>Name: {this.state.name}</p>
        <p>Age: {this.state.age}</p>
        <button onClick={this.updateName}>Update Name</button>
      </div>
    )
  }
}
```

在这个例子中：

- 调用 `this.setState({ name: 'Jane' })` 只会更新 `name` 属性，而 `age` 属性保持不变。
- React 会自动将新状态 `{ name: 'Jane' }` 与旧状态 `{ name: 'John', age: 30 }` 进行浅合并，结果是 `{ name: 'Jane', age: 30 }`。

2. **函数组件中的状态替换**

在函数组件中，`useState` 的 setter 函数不会自动合并状态。如果你直接传递一个新对象，它会完全替换旧状态。

```jsx
function MyComponent() {
  const [state, setState] = useState({
    name: 'John',
    age: 30,
  })

  const updateName = () => {
    setState({ name: 'Jane' }) // ❌ 直接替换，age 会丢失
  }

  return (
    <div>
      <p>Name: {state.name}</p>
      <p>Age: {state.age}</p>
      <button onClick={updateName}>Update Name</button>
    </div>
  )
}
```

在这个例子中：

- 调用 `setState({ name: 'Jane' })` 会完全替换状态对象，导致 `age` 属性丢失。
- 最终状态变为 `{ name: 'Jane' }`，而不是 `{ name: 'Jane', age: 30 }`。

3. **如何在函数组件中实现状态合并？**

在函数组件中，如果需要实现类似类组件的状态合并特性，可以手动合并状态：

方法 1：使用扩展运算符

```jsx
function MyComponent() {
  const [state, setState] = useState({
    name: 'John',
    age: 30,
  })

  const updateName = () => {
    setState((prevState) => ({
      ...prevState, // 复制旧状态
      name: 'Jane', // 更新 name
    }))
  }

  return (
    <div>
      <p>Name: {state.name}</p>
      <p>Age: {state.age}</p>
      <button onClick={updateName}>Update Name</button>
    </div>
  )
}
```

方法 2：使用 `useReducer`
`useReducer` 可以更灵活地管理复杂状态，并实现类似合并的行为。

```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_NAME':
      return {
        ...state,
        name: action.payload,
      }
    default:
      throw new Error()
  }
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, {
    name: 'John',
    age: 30,
  })

  const updateName = () => {
    dispatch({ type: 'UPDATE_NAME', payload: 'Jane' })
  }

  return (
    <div>
      <p>Name: {state.name}</p>
      <p>Age: {state.age}</p>
      <button onClick={updateName}>Update Name</button>
    </div>
  )
}
```

## 什么是 React 受控组件？

在 React 中，受控组件（Controlled Component） 是指表单元素（如 `<input>`、`<textarea>`、`<select>` 等）的值由 React 的状态（state）控制，而不是由 DOM 自身管理。换句话说，表单元素的值通过 value 属性绑定到 React 的状态，并通过 onChange 事件处理函数来更新状态。

这是一个简单的受控组件示例：

```jsx
function ControlledInput() {
  const [value, setValue] = useState('')

  const handleChange = (event) => {
    setValue(event.target.value) // 更新状态
  }

  return (
    <div>
      <input
        type="text"
        value={value} // 绑定状态
        onChange={handleChange} // 监听输入变化
      />
      <p>Current value: {value}</p>
    </div>
  )
}
```

受控组件的优点：

1. 完全控制表单数据：React 状态是表单数据的唯一来源，可以轻松地对数据进行验证、格式化或处理。
2. 实时响应输入：可以在用户输入时实时更新 UI 或执行其他操作（如搜索建议）。
3. 易于集成：与其他 React 状态和逻辑无缝集成。

## 使用 React Hook 实现 useCount

```js
// count 从 0 计数，每一秒 +1 （可使用 setInterval）
const { count } = useTimer()
```

```jsx
import { useState, useEffect } from 'react'

function useTimer() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // 设置定时器，每秒钟增加 count
    const intervalId = setInterval(() => {
      setCount((prevCount) => prevCount + 1)
    }, 1000)

    // 清理定时器
    return () => clearInterval(intervalId)
  }, []) // 空数组表示仅在组件挂载时执行一次

  return { count }
}

export default function TimerComponent() {
  const { count } = useTimer()

  return (
    <div>
      <p>Count: {count}</p>
    </div>
  )
}
```

## 使用 React Hook 实现 useRequest

```js
const { loading, data, error } = useRequest(url) // 可只考虑 get 请求
```

```jsx
import { useState, useEffect } from 'react'
import axios from 'axios'

function useRequest(url) {
  const [data, setData] = useState(null) // 存储请求的数据
  const [loading, setLoading] = useState(true) // 加载状态
  const [error, setError] = useState(null) // 错误信息

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true) // 设置加载状态为 true
      setError(null) // 清空先前的错误

      try {
        const response = await axios.get(url)
        if (!response.ok) {
          throw new Error('请求失败!')
        }
        setData(response.data) // 设置数据
      } catch (err) {
        setError(err.message) // 捕获错误并设置错误信息
      } finally {
        setLoading(false) // 请求结束，设置加载状态为 false
      }
    }

    fetchData()
  }, [url]) // 依赖于 url，当 url 改变时重新发起请求

  return { loading, data, error }
}

// 使用示例
export default function RequestComponent() {
  const { loading, data, error } = useRequest('https://xxx.xxxx.com/data')

  if (loading) return <p>Loading...</p>
  if (error) return <p>错误信息: {error}</p>
  return (
    <div>
      <h3>请求结果:</h3>
      <pre>{JSON.stringify(data)}</pre>
    </div>
  )
}
```

## React 项目可做哪些性能优化？

1. `useMemo`: 用于缓存昂贵的计算结果，避免在每次渲染时重复计算。

```jsx
function ExpensiveComponent({ items, filter }) {
  const filteredItems = useMemo(() => {
    return items.filter((item) => item.includes(filter))
  }, [items, filter]) // 仅在 items 或 filter 变化时重新计算

  return (
    <ul>
      {filteredItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}
```

2.  `useCallback`: 用于缓存回调函数，避免在每次渲染时创建新的函数实例。
    `useCallback`

```jsx
function ParentComponent() {
  const [count, setCount] = useState(0)

  const handleClick = useCallback(() => {
    setCount((prevCount) => prevCount + 1)
  }, []) // 空依赖数组，函数不会重新创建

  return (
    <div>
      <ChildComponent onClick={handleClick} />
      <p>Count: {count}</p>
    </div>
  )
}

const ChildComponent = React.memo(({ onClick }) => {
  console.log('ChildComponent rendered')
  return <button onClick={onClick}>Click me</button>
})
```

3.  `React.memo`: 是一个高阶组件，用于缓存组件的渲染结果，避免在 props 未变化时重新渲染

```jsx
const MyComponent = React.memo(({ value }) => {
  console.log('MyComponent rendered')
  return <div>{value}</div>
})

function ParentComponent() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <MyComponent value="Hello" /> {/* 不会因 count 变化而重新渲染 */}
    </div>
  )
}
```

4.  `Suspense`: 用于在异步加载数据或组件时显示加载状态，可以减少初始加载时间，提升用户体验

```jsx
const LazyComponent = React.lazy(() => import('./LazyComponent'))

function MyComponent() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </React.Suspense>
  )
}
```

5.  `路由懒加载`：通过动态导入（dynamic import）将路由组件拆分为单独的代码块，按需加载。可以减少初始加载的代码量，提升页面加载速度

```jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import React, { Suspense } from 'react'

const Home = React.lazy(() => import('./Home'))
const About = React.lazy(() => import('./About'))

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
    </Router>
  )
}
```

## 如何统一监听 React 组件报错

1. Error Boundaries（错误边界）

默认情况下，如果你的应用程序在渲染过程中抛出错误，React 将从屏幕上删除其 UI。为了防止这种情况，你可以将 UI 的一部分包装到 错误边界 中。错误边界是一个特殊的组件，可让你显示一些后备 UI，而不是显示例如错误消息这样崩溃的部分。

要实现错误边界组件，你需要提供 static getDerivedStateFromError，它允许你更新状态以响应错误并向用户显示错误消息。你还可以选择实现 componentDidCatch 来添加一些额外的逻辑，例如将错误添加到分析服务。

```jsx
import * as React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // 更新状态，以便下一次渲染将显示后备 UI。
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    logErrorToMyService(
      error,
      // 示例“组件堆栈”：
      // 在 ComponentThatThrows 中（由 App 创建）
      // 在 ErrorBoundary 中（由 APP 创建）
      // 在 div 中（由 APP 创建）
      // 在 App 中
      info.componentStack,
      // 仅在 react@canary 版本可用
      // 警告：Owner Stack 在生产中不可用
      React.captureOwnerStack()
    )
  }

  render() {
    if (this.state.hasError) {
      // 你可以渲染任何自定义后备 UI
      return this.props.fallback
    }

    return this.props.children
  }
}
```

然后你可以用它包装组件树的一部分：

```jsx
<ErrorBoundary fallback={<p>Something went wrong</p>}>
  <Profile />
</ErrorBoundary>
```

如果 Profile 或其子组件抛出错误，ErrorBoundary 将“捕获”该错误，然后显示带有你提供的错误消息的后备 UI，并向你的错误报告服务发送生产错误报告。

2. 全局错误监听

为了捕获 Error Boundaries 无法处理的错误（如事件处理器或异步代码中的错误），可以使用 JavaScript 的全局错误监听机制。

- 使用 window.onerror 监听全局错误。
- 使用 window.addEventListener('error', handler) 监听未捕获的错误。
- 使用 window.addEventListener('unhandledrejection', handler) 监听未处理的 Promise 拒绝。

```jsx
import React, { useEffect } from 'react'

function GlobalErrorHandler() {
  useEffect(() => {
    // 监听全局错误
    const handleError = (error) => {
      console.error('Global error:', error)
    }

    // 监听未捕获的错误
    window.onerror = (message, source, lineno, colno, error) => {
      handleError(error)
      return true // 阻止默认错误处理
    }

    // 监听未处理的 Promise 拒绝
    window.addEventListener('unhandledrejection', (event) => {
      handleError(event.reason)
    })

    // 清理监听器
    return () => {
      window.onerror = null
      window.removeEventListener('unhandledrejection', handleError)
    }
  }, [])

  return null
}

// 在应用的根组件中使用
function App() {
  return (
    <div>
      <GlobalErrorHandler />
      <MyComponent />
    </div>
  )
}
```

注意事项：

1. 全局错误监听可以捕获 Error Boundaries 无法处理的错误，但无法阻止组件崩溃。
2. 需要确保在生产环境中正确处理错误信息，避免暴露敏感信息。

## React19 升级了哪些新特性？

React 19 的更新内容可以参考 React [官方更新博客](https://zh-hans.react.dev/blog/2024/12/05/react-19)

1. Actions 相关

按照惯例，使用异步过渡的函数被称为 “Actions”。 在 Actions 的基础上，React 19 引入了 useOptimistic 来管理乐观更新，以及一个新的 Hook React.useActionState 来处理 Actions 的常见情况。在 react-dom 中添加了 `<form>` Actions 来自动管理表单和 useFormStatus 来支持表单中 Actions 的常见情况。

2. 新的 API: use

在 React 19 中，我们引入了一个新的 API 来在渲染中读取资源：use。

例如，你可以使用 use 读取一个 promise，React 将挂起，直到 promise 解析完成：

```jsx
import { use } from 'react'

function Comments({ commentsPromise }) {
  // `use` 将被暂停直到 promise 被解决.
  const comments = use(commentsPromise)
  return comments.map((comment) => <p key={comment.id}>{comment}</p>)
}

function Page({ commentsPromise }) {
  // 当“use”在注释中暂停时,
  // 将显示此悬念边界。
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Comments commentsPromise={commentsPromise} />
    </Suspense>
  )
}
```

3. 服务端组件和动作

React 服务端组件现已稳定，允许提前渲染组件。与服务端动作（通过“use server”指令启用）配对后，客户端组件可以无缝调用异步服务端函数。

此外，还有一些 React 19 中的改进：

4. ref 作为一个属性

从 React 19 开始，你现在可以在函数组件中将 ref 作为 prop 进行访问：

```jsx
function MyInput({ placeholder, ref }) {
  return <input placeholder={placeholder} ref={ref} />
}

//...
;<MyInput ref={ref} />
```

新的函数组件将不再需要 forwardRef。

5. 改进了水合错误的错误报告

6. `<Context>` 作为提供者

在 React 19 中，你可以将 `<Context>` 渲染为提供者，就无需再使用 `<Context.Provider>` 了：

```jsx
const ThemeContext = createContext('')

function App({ children }) {
  return <ThemeContext value="dark">{children}</ThemeContext>
}
```

新的 Context 提供者可以使用 `<Context>`，我们将发布一个 codemod 来转换现有的提供者。在未来的版本中，我们将弃用 `<Context.Provider>`。

更多更新请参考[官方更新博客](https://zh-hans.react.dev/blog/2024/12/05/react-19)

## 简述 Redux 单向数据流

这是 Redux 单向数据流的典型流程：

```
View -> Action -> Reducer -> State -> View
```

1. **View**：
   - 用户在界面（View）上触发一个事件（如点击按钮）。
2. **Action**：
   - 事件触发一个 `action`，并通过 `store.dispatch(action)` 分发。
3. **Reducer**：
   - `store` 调用 `reducer`，传入当前的 `state` 和 `action`，生成一个新的 `state`。
4. **State**：
   - `store` 更新 `state`，并通知所有订阅了 `store` 的组件。
5. **View**：
   - 组件根据新的 `state` 重新渲染界面。

**Redux 单向数据流的特点**

1. **可预测性**：
   - 由于状态更新是通过纯函数（`reducer`）完成的，相同的 `state` 和 `action` 总是会生成相同的新的 `state`。
2. **集中管理**：
   - 所有状态都存储在单一的 `store` 中，便于调试和管理。
3. **易于测试**：
   - `reducer` 是纯函数，没有副作用，易于测试。
4. **时间旅行调试**：
   - 通过记录 `action` 和 `state`，可以实现时间旅行调试（如 Redux DevTools）。

**示例代码**

以下是一个完整的 Redux 示例：

```javascript
// 1. 定义 Action Types
const ADD_TODO = 'ADD_TODO'

// 2. 定义 Action Creator
function addTodo(text) {
  return {
    type: ADD_TODO,
    payload: text,
  }
}

// 3. 定义 Reducer
function todoReducer(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [...state, action.payload]
    default:
      return state
  }
}

// 4. 创建 Store
const store = Redux.createStore(todoReducer)

// 5. 订阅 Store
store.subscribe(() => {
  console.log('Current State:', store.getState())
})

// 6. 分发 Action
store.dispatch(addTodo('Learn Redux'))
store.dispatch(addTodo('Build a project'))
```

## 用过哪些 Redux 中间件？

Redux 中间件（Middleware）允许你在 `action` 被分发（`dispatch`）到 `reducer` 之前或之后执行额外的逻辑。中间件通常用于处理异步操作、日志记录、错误处理等任务。

常用的 Redux 中间件有

**1. Redux Thunk**

- **描述**: Redux Thunk 是最常用的中间件之一，用于处理异步操作（如 API 调用）。
- **特点**:
  - 允许 `action` 是一个函数（而不仅仅是一个对象）。
  - 函数可以接收 `dispatch` 和 `getState` 作为参数，从而在异步操作完成后手动分发 `action`。
- **使用场景**: 处理异步逻辑（如数据获取）。
- **示例**:
  ```javascript
  const fetchData = () => {
    return (dispatch, getState) => {
      dispatch({ type: 'FETCH_DATA_REQUEST' })
      fetch('/api/data')
        .then((response) => response.json())
        .then((data) => dispatch({ type: 'FETCH_DATA_SUCCESS', payload: data }))
        .catch((error) => dispatch({ type: 'FETCH_DATA_FAILURE', error }))
    }
  }
  ```

**2. Redux Saga**

- **描述**: Redux Saga 是一个基于生成器函数（Generator）的中间件，用于管理复杂的异步流程和副作用。
- **特点**:
  - 使用 ES6 的生成器函数来处理异步逻辑。
  - 提供强大的副作用管理（如取消任务、并发执行等）。
- **使用场景**: 复杂的异步流程（如竞态条件、任务取消等）。
- **示例**:

  ```javascript
  import { call, put, takeEvery } from 'redux-saga/effects'

  function* fetchData() {
    try {
      const data = yield call(fetch, '/api/data')
      yield put({ type: 'FETCH_DATA_SUCCESS', payload: data })
    } catch (error) {
      yield put({ type: 'FETCH_DATA_FAILURE', error })
    }
  }

  function* watchFetchData() {
    yield takeEvery('FETCH_DATA_REQUEST', fetchData)
  }
  ```

**3. Redux Logger**

- **描述**: Redux Logger 是一个用于记录 `action` 和 `state` 变化的中间件。
- **特点**:
  - 在控制台中打印每个 `action` 的分发和 `state` 的变化。
  - 便于调试和开发。
- **使用场景**: 开发环境中的调试。
- **示例**:
  ```javascript
  const store = createStore(rootReducer, applyMiddleware(logger))
  ```

**4. Redux Promise**

- **描述**: Redux Promise 是一个用于处理 Promise 的中间件。
- **特点**:
  - 自动处理 Promise 类型的 `action`。
  - 当 Promise 完成时，自动分发成功的 `action`；当 Promise 失败时，自动分发失败的 `action`。
- **使用场景**: 简单的异步操作。
- **示例**:
  ```javascript
  const fetchData = () => ({
    type: 'FETCH_DATA',
    payload: fetch('/api/data').then((response) => response.json()),
  })
  ```
  :::

## 你用过哪些 React 状态管理库？

根据自己实际的使用情况作答：

1. Redux

Redux 是最流行的 React 状态管理库之一。它提供了一个全局的状态容器，允许你在应用的任何地方访问和更新状态。特点包括: 单向数据流、中间件支持、时间旅行调试。

2. MobX

MobX 是一个响应式状态管理库，它通过自动追踪状态的变化来更新 UI。特点包括: 响应式编程、简单易用、自动依赖追踪。

3. Recoil

Recoil 是 Facebook 推出的一个实验性状态管理库，专为 React 设计。特点包括: 原子状态管理、派生状态、与 React 深度集成。适用于需要细粒度状态管理的应用。

4. zustand

Zustand 是一个轻量级的状态管理库，API 简单且易于使用。特点包括: 轻量、简单、支持中间件。适用于需要轻量级状态管理的应用。

5. Jotai

Jotai 是一个基于原子状态管理的库，类似于 Recoil，但更加轻量。特点包括: 原子状态、简单易用、与 React 深度集成。适用于需要细粒度状态管理的应用。

6. XState

XState 是一个基于状态机的状态管理库，适用于复杂的状态逻辑和流程管理。特点包括: 状态机、可视化工具、复杂状态管理。适用于需要复杂状态逻辑和流程管理的应用。

## 是否用过 SSR 服务端渲染？

**SSR**

服务端渲染（Server-Side Rendering, SSR）是一种在服务器端生成 HTML 并将其发送到客户端的技术。与传统的客户端渲染（CSR）相比，SSR 可以提供更快的首屏加载速度、更好的 SEO 支持以及更友好的用户体验。

**SSR 的核心优势**

1. **更快的首屏加载**：
   - SSR 在服务器端生成 HTML，用户无需等待 JavaScript 加载完成即可看到页面内容。
2. **更好的 SEO**：
   - 搜索引擎可以抓取服务器渲染的完整 HTML 内容，而不是空的 `<div id="root"></div>`。
3. **更好的用户体验**：
   - 对于低性能设备或网络较差的用户，SSR 可以提供更快的初始渲染。

**SSR 的基本原理**

1. **服务器端**：
   - 使用 `ReactDOMServer` 将 React 组件渲染为 HTML 字符串。
   - 将生成的 HTML 字符串嵌入到 HTML 模板中，并发送给客户端。
2. **客户端**：
   - 客户端接收到 HTML 后，React 会“接管”页面（hydration），使其成为可交互的 SPA（单页应用）。

**React SSR 的框架支持**

最常用的框架就是 Next.js，它是一个基于 React 的全栈开发框架，集成了最新的 React 特性，内置 SSR 支持，可以帮助你快速创建全栈应用。

## React项目中组件销毁有哪几种方式？

1. **条件渲染（动态卸载）**

通过 状态控制 决定是否渲染组件，当条件为 false 时，React 会自动卸载并销毁该组件。
特点：

- 适用于 动态显示/隐藏组件。
- 组件销毁后，状态会被重置（重新挂载时是新实例）。

2. **路由切换**

在使用 React Router 时，当路由切换时，当前页面组件会被卸载，导致其子组件销毁。
特点：

- 适用于 SPA（单页应用），路由切换时自动卸载旧组件。

3. **父组件卸载（连带子组件销毁）**

如果 父组件被卸载（如路由切换、条件渲染父组件），其所有子组件也会被销毁。
特点：

- 适用于 父组件被移除时，子组件自动销毁。

4. **useEffect 清理函数（资源释放）**

如果组件内部有 副作用（如定时器、订阅、事件监听），需要在组件销毁时清理，可以使用 useEffect 的 清理函数。
特点：

- 适用于 组件卸载时释放资源（如取消 API 请求、移除事件监听等）。

5. **修改 key 强制重新挂载（重置组件）**

通过改变 key 可以强制 React 销毁并重新创建组件（适用于需要重置状态的场景）。
特点：

- 适用于 需要完全重置组件状态 的情况。

6. **手动卸载（Portal 或第三方库）**

在某些特殊情况下（如使用 ReactDOM.createPortal 或某些 UI 库），可能需要手动调用卸载方法。
特点：

- 适用于 手动控制组件卸载（较少使用）。

## JSX 的本质是什么？

**JSX（JavaScript XML）** 是一个 JavaScript 的语法扩展，允许在 JavaScript 代码中通过类 HTML 语法创建 React 元素。它需要通过 Babel 等工具编译为标准的 JavaScript 代码，最终生成 **React 元素对象**（React Element），这些元素共同构成虚拟 DOM（Virtual DOM）树。

**核心原理**

1. **JSX 编译为 React 元素**
   JSX 会被转换为 `React.createElement()` 调用（或 React 17+ 的 `_jsx` 函数），生成描述 UI 结构的对象（React 元素），而非直接操作真实 DOM。

   ```jsx
   // JSX
   const element = <h1 className="title">Hello, world!</h1>

   // 编译后（React 17 之前）
   const element = React.createElement('h1', { className: 'title' }, 'Hello, world!')

   // 编译后（React 17+，自动引入 _jsx）
   import { jsx as _jsx } from 'react/jsx-runtime'
   const element = _jsx('h1', { className: 'title', children: 'Hello, world!' })
   ```

2. **虚拟 DOM 的运作**
   - React 元素组成虚拟 DOM 树，通过 Diff 算法对比新旧树差异，最终高效更新真实 DOM。
   - 虚拟 DOM 是内存中的轻量对象，避免频繁操作真实 DOM 的性能损耗。

**JSX 的核心特性**

1. **类 HTML 语法与 JavaScript 的融合**

   - **表达式嵌入**：通过 `{}` 嵌入 JavaScript 表达式（如变量、函数调用、三元运算符）：
     ```jsx
     const userName = 'Alice'
     const element = <p>Hello, {userName.toUpperCase()}</p>
     ```
   - **禁止语句**：`{}` 内不支持 `if`/`for` 等语句，需改用表达式（如三元运算符或逻辑与）：
     ```jsx
     <div>{isLoggedIn ? 'Welcome' : 'Please Login'}</div>
     ```

2. **语法规则**

   - **属性命名**：使用驼峰命名（如 `className` 代替 `class`，`htmlFor` 代替 `for`）。
   - **闭合标签**：所有标签必须显式闭合（如 `<img />`）。
   - **单一根元素**：JSX 必须有唯一根元素（或用 `<></>` 空标签包裹）。

3. **安全性**
   - **默认 XSS 防护**：JSX 自动转义嵌入内容中的特殊字符（如 `<` 转为 `&lt;`）。
   - **例外场景**：如需渲染原始 HTML，需显式使用 `dangerouslySetInnerHTML`（需谨慎）：
     ```jsx
     <div dangerouslySetInnerHTML={{ __html: userContent }} />
     ```

**编译与工具链**

1. **编译流程**
   JSX 需通过 **Babel** 编译为浏览器可执行的 JavaScript。典型配置如下：

   ```json
   // .babelrc
   {
     "presets": ["@babel/preset-react"]
   }
   ```

2. **React 17+ 的优化**
   - 无需手动导入 React：编译器自动引入 `_jsx` 函数。
   - 更简洁的编译输出：减少代码体积，提升可读性。

参考资料: https://juejin.cn/post/7348651815759282226

## 如何理解 React Fiber 架构？

1. **Fiber 架构的本质与设计目标**

Fiber 是 React 16+ 的**核心算法重写**，本质是**基于链表的增量式协调模型**。其核心目标并非单纯提升性能，而是重构架构以实现：

- **可中断的异步渲染**：将同步递归的调和过程拆解为可暂停/恢复的异步任务。
- **优先级调度**：高优先级任务（如用户输入）可打断低优先级任务（如数据更新）。
- **并发模式基础**：为 `Suspense`、`useTransition` 等特性提供底层支持。

2. **Fiber 节点的核心设计**

每个组件对应一个 **Fiber 节点**，构成**双向链表树结构**，包含以下关键信息：

- **组件类型**：函数组件、类组件或原生标签。
- **状态与副作用**：Hooks 状态（如 `useState`）、生命周期标记（如 `useEffect`）。
- **调度信息**：任务优先级（`lane` 模型）、到期时间（`expirationTime`）。
- **链表指针**：`child`（子节点）、`sibling`（兄弟节点）、`return`（父节点）。

```javascript
// Fiber 节点结构简化示例
const fiberNode = {
  tag: FunctionComponent, // 组件类型
  stateNode: ComponentFunc, // 组件实例或 DOM 节点
  memoizedState: {
    /* Hooks 链表 */
  },
  pendingProps: {
    /* 待处理 props */
  },
  lanes: Lanes.HighPriority, // 任务优先级
  child: nextFiber, // 子节点
  sibling: null, // 兄弟节点
  return: parentFiber, // 父节点
}
```

3. **Fiber 协调流程（两阶段提交）**

**阶段 1：Reconciliation（协调/渲染阶段）**

- **可中断的增量计算**：
  React 将组件树遍历拆解为多个 **Fiber 工作单元**，通过循环（而非递归）逐个处理。
  - 每次循环执行一个 Fiber 节点，生成子 Fiber 并连接成树。
  - 通过 `requestIdleCallback`（或 Scheduler 包）在浏览器空闲时段执行，避免阻塞主线程。
- **对比策略**：
  根据 `key` 和 `type` 复用节点，标记 `Placement`（新增）、`Update`（更新）、`Deletion`（删除）等副作用。

**阶段 2：Commit（提交阶段）**

- **不可中断的 DOM 更新**：
  同步执行所有标记的副作用（如 DOM 操作、生命周期调用），确保 UI 一致性。
- **副作用分类**：
  - **BeforeMutation**：`getSnapshotBeforeUpdate`。
  - **Mutation**：DOM 插入/更新/删除。
  - **Layout**：`useLayoutEffect`、`componentDidMount`/`Update`。

4. **优先级调度机制**

React 通过 **Lane 模型** 管理任务优先级（共 31 个优先级车道）：

- **事件优先级**：
  ```javascript
  // 优先级从高到低
  ImmediatePriority（用户输入）
  UserBlockingPriority（悬停、点击）
  NormalPriority（数据请求）
  LowPriority（分析日志）
  IdlePriority（非必要任务）
  ```
- **调度策略**：
  - 高优先级任务可抢占低优先级任务的执行权。
  - 过期任务（如 Suspense 回退）会被强制同步执行。

5. **Fiber 架构的优势与局限性**

**优势**

- **流畅的用户体验**：异步渲染避免主线程阻塞，保障高优先级任务即时响应。
- **复杂场景优化**：支持大规模组件树的高效更新（如虚拟滚动、动画串联）。
- **未来特性基础**：为并发模式（Concurrent Mode）、离线渲染（SSR）提供底层支持。

**局限性**

- **学习成本高**：开发者需理解底层调度逻辑以优化性能。
- **内存开销**：Fiber 树的双向链表结构比传统虚拟 DOM 占用更多内存。

6. **与旧架构的关键差异**

| 特性           | Stack Reconciler（React 15-） | Fiber Reconciler（React 16+） |
| -------------- | ----------------------------- | ----------------------------- |
| **遍历方式**   | 递归（不可中断）              | 循环（可中断 + 恢复）         |
| **任务调度**   | 同步执行，阻塞主线程          | 异步分片，空闲时段执行        |
| **优先级控制** | 无                            | 基于 Lane 模型的优先级抢占    |
| **数据结构**   | 虚拟 DOM 树                   | Fiber 链表树（含调度信息）    |

## Fiber 结构和普通 VNode 区别

1. **本质差异**

| 维度         | 普通 VNode（虚拟 DOM）          | Fiber 结构                           |
| ------------ | ------------------------------- | ------------------------------------ |
| **设计目标** | 减少真实 DOM 操作，提升渲染性能 | 实现可中断的异步渲染 + 优先级调度    |
| **数据结构** | 树形结构（递归遍历）            | 双向链表树（循环遍历）               |
| **功能范畴** | 仅描述 UI 结构                  | 描述 UI 结构 + 调度任务 + 副作用管理 |

2. **数据结构对比**

**普通 VNode（React 15 及之前）**

```javascript
const vNode = {
  type: 'div', // 节点类型（组件/原生标签）
  props: { className: 'container' }, // 属性
  children: [vNode1, vNode2], // 子节点（树形结构）
  key: 'unique-id', // 优化 Diff 性能
  // 无状态、调度、副作用信息
}
```

- **核心字段**：仅包含 UI 描述相关属性（type、props、children）。

**Fiber 节点（React 16+）**

```javascript
const fiberNode = {
  tag: HostComponent, // 节点类型（函数组件/类组件/DOM元素）
  type: 'div', // 原生标签或组件构造函数
  key: 'unique-id', // Diff 优化标识
  stateNode: domNode, // 关联的真实 DOM 节点
  pendingProps: { className: 'container' }, // 待处理的 props
  memoizedProps: {}, // 已生效的 props
  memoizedState: {
    // Hooks 状态（函数组件）
    hooks: [state1, effectHook],
  },
  updateQueue: [], // 状态更新队列（类组件）
  lanes: Lanes.HighPriority, // 调度优先级（Lane 模型）
  child: childFiber, // 第一个子节点
  sibling: siblingFiber, // 下一个兄弟节点
  return: parentFiber, // 父节点（构成双向链表）
  effectTag: Placement, // 副作用标记（插入/更新/删除）
  nextEffect: nextEffectFiber, // 副作用链表指针
}
```

- **核心扩展**：
  - **调度控制**：`lanes` 优先级、任务到期时间。
  - **状态管理**：Hooks 链表（函数组件）、类组件状态队列。
  - **副作用追踪**：`effectTag` 标记和副作用链表。
  - **遍历结构**：`child`/`sibling`/`return` 构成双向链表。

3. **协调机制对比**

| 流程           | VNode（Stack Reconciler） | Fiber Reconciler              |
| -------------- | ------------------------- | ----------------------------- |
| **遍历方式**   | 递归遍历（不可中断）      | 循环遍历链表（可中断 + 恢复） |
| **任务调度**   | 同步执行，阻塞主线程      | 异步分片，空闲时间执行        |
| **优先级控制** | 无                        | Lane 模型（31 个优先级车道）  |
| **副作用处理** | 统一提交 DOM 更新         | 构建副作用链表，分阶段提交    |

- **Fiber 两阶段提交**：
  1. **协调阶段**（可中断）：
     - 增量构建 Fiber 树，标记副作用（`effectTag`）。
     - 通过 `requestIdleCallback` 或 Scheduler 包分片执行。
  2. **提交阶段**（同步不可中断）：
     - 遍历副作用链表，执行 DOM 操作和生命周期方法。

4. **能力扩展示例**

   **a. 支持 Hooks 状态管理**

- Fiber 节点通过 `memoizedState` 字段存储 Hooks 链表：

```javascript
// 函数组件的 Hooks 链表
fiberNode.memoizedState = {
  memoizedState: 'state value', // useState 的状态
  next: {
    // 下一个 Hook（如 useEffect）
    memoizedState: { cleanup: fn },
    next: null,
  },
}
```

- VNode 无状态管理能力，仅描述 UI。

**b. 优先级调度实战**

- **高优先级任务抢占**：
  ```javascript
  // 用户输入触发高优先级更新
  input.addEventListener('input', () => {
    React.startTransition(() => {
      setInputValue(e.target.value) // 低优先级
    })
    // 高优先级更新立即执行
  })
  ```
- VNode 架构无法实现任务中断和优先级插队。

**c. 副作用批处理**

- Fiber 通过 `effectList` 链表收集所有变更，统一提交：
  ```javascript
  // 提交阶段遍历 effectList
  let nextEffect = fiberRoot.firstEffect
  while (nextEffect) {
    commitWork(nextEffect)
    nextEffect = nextEffect.nextEffect
  }
  ```
- VNode 架构在 Diff 后直接操作 DOM，无批处理优化。

5. **性能影响对比**

| 场景                      | VNode 架构         | Fiber 架构                   |
| ------------------------- | ------------------ | ---------------------------- |
| **大型组件树渲染**        | 主线程阻塞导致掉帧 | 分片渲染，保持 UI 响应       |
| **高频更新（如动画）**    | 多次渲染合并困难   | 基于优先级合并或跳过中间状态 |
| **SSR 水合（Hydration）** | 全量同步处理       | 增量水合，优先交互部分       |

## 简述 React diff 算法过程

React Diff 算法通过 **分层对比策略** 和 **启发式规则** 减少树对比的时间复杂度（从 O(n³) 优化至 O(n)）。其核心流程如下：

**1. 分层对比策略**

React 仅对 **同一层级的兄弟节点** 进行对比，若节点跨层级移动（如从父节点 A 移动到父节点 B），则直接 **销毁并重建**，而非移动。
**原因**：跨层操作在真实 DOM 中成本极高（需递归遍历子树），而实际开发中跨层移动场景极少，此策略以概率换性能。

**2. 节点类型比对规则**

**a. 元素类型不同**

若新旧节点类型不同（如 `<div>` → `<span>` 或 `ComponentA` → `ComponentB`），则：

1. 销毁旧节点及其子树。
2. 创建新节点及子树，并插入 DOM。

```jsx
// 旧树
<div>
  <ComponentA />
</div>

// 新树 → 直接替换
<span>
  <ComponentB />
</span>
```

**b. 元素类型相同**

若类型相同，则复用 DOM 节点并更新属性：

- **原生标签**：更新 `className`、`style` 等属性。
- **组件类型**：
  - 类组件：保留实例，触发 `componentWillReceiveProps` → `shouldComponentUpdate` 等生命周期。
  - 函数组件：重新执行函数，通过 Hooks 状态判断是否需更新。

```jsx
// 旧组件（保留实例并更新 props）
<Button className="old" onClick={handleClick} />

// 新组件 → 复用 DOM，更新 className 和 onClick
<Button className="new" onClick={newClick} />
```

**3. 列表节点的 Key 优化**

处理子节点列表时，React 依赖 **key** 进行最小化更新：

**a. 无 key 时的默认行为**

默认使用 **索引匹配**（index-based diff），可能导致性能问题：

```jsx
// 旧列表
;[<div>A</div>, <div>B</div>][
  // 新列表（首部插入）→ 索引对比导致 B 被误判更新
  ((<div>C</div>), (<div>A</div>), (<div>B</div>))
]
```

此时 React 会认为索引 0 从 A → C（更新），索引 1 从 B → A（更新），并新增索引 2 的 B，实际应仅插入 C。

**b. 使用 key 的优化匹配**

通过唯一 key 标识节点身份，React 可精准识别移动/新增/删除：

```jsx
// 正确使用 key（如数据 ID）
<ul>
  {items.map((item) => (
    <li key={item.id}>{item.text}</li>
  ))}
</ul>
```

**匹配规则**：

1. 遍历新列表，通过 key 查找旧节点：

   - 找到且类型相同 → 复用节点。
   - 未找到 → 新建节点。

2. 记录旧节点中未被复用的节点 → 执行删除。

**c. 节点移动优化**

若新旧列表节点仅顺序变化，React 通过 key 匹配后，仅执行 **DOM 移动操作**（非重建），例如：

```jsx
// 旧列表：A (key=1), B (key=2)
// 新列表：B (key=2), A (key=1)
// React 仅交换 DOM 顺序，而非销毁重建
```

**4. 性能边界策略**

- **子树跳过**：若父节点类型变化，其子节点即使未变化也会被整体销毁。
- **相同组件提前终止**：若组件 `shouldComponentUpdate` 返回 `false`，则跳过其子树 Diff。

## React 和 Vue diff 算法的区别

React 和 Vue 的 Diff 算法均基于虚拟 DOM，但在实现策略、优化手段和设计哲学上存在显著差异：

**1. 核心算法策略对比**

| **维度**     | **React**                     | **Vue 2/3**                          |
| ------------ | ----------------------------- | ------------------------------------ |
| **遍历方式** | 单向递归（同层顺序对比）      | 双端对比（头尾指针优化）             |
| **节点复用** | 类型相同则复用，否则销毁重建  | 类型相同则尝试复用，优先移动而非重建 |
| **静态优化** | 需手动优化（如 `React.memo`） | 编译阶段自动标记静态节点             |
| **更新粒度** | 组件级更新（默认）            | 组件级 + 块级（Vue3 Fragments）      |

**2. 列表 Diff 实现细节**

**a. React 的索引对比策略**

- **无 key 时**：按索引顺序对比，可能导致无效更新
  ```jsx
  // 旧列表：[A, B, C]
  // 新列表：[D, A, B, C]（插入头部）
  // React 对比结果：更新索引 0-3，性能低下
  ```
- **有 key 时**：通过 key 匹配节点，减少移动操作
  ```jsx
  // key 匹配后，仅插入 D，其他节点不更新
  ```

**b. Vue 的双端对比策略**

分四步优化对比效率（Vue2 核心逻辑，Vue3 优化为最长递增子序列）：

1. **头头对比**：新旧头指针节点相同则复用，指针后移
2. **尾尾对比**：新旧尾指针节点相同则复用，指针前移
3. **头尾交叉对比**：旧头 vs 新尾，旧尾 vs 新头
4. **中间乱序对比**：建立 key-index 映射表，复用可匹配节点

```js
// 旧列表：[A, B, C, D]
// 新列表：[D, A, B, C]
// Vue 通过步骤3头尾对比，仅移动 D 到头部
```

**3. 静态优化机制**

**a. Vue 的编译时优化**

- **静态节点标记**：
  模板中的静态节点（无响应式绑定）会被编译为常量，跳过 Diff

  ```html
  <!-- 编译前 -->
  <div>Hello Vue</div>

  <!-- 编译后 -->
  _hoisted_1 = createVNode("div", null, "Hello Vue")
  ```

- **Block Tree（Vue3）**：
  动态节点按区块（Block）组织，Diff 时仅对比动态部分

**b. React 的运行时优化**

- **手动控制更新**：
  需通过 `React.memo`、`shouldComponentUpdate` 或 `useMemo` 避免无效渲染
  ```jsx
  const MemoComp = React.memo(() => <div>Static Content</div>)
  ```

**4. 响应式更新触发**

| **框架** | **机制**                   | **Diff 触发条件**                |
| -------- | -------------------------- | -------------------------------- |
| React    | 状态变化触发组件重新渲染   | 父组件渲染 → 子组件默认递归 Diff |
| Vue      | 响应式数据变更触发组件更新 | 依赖收集 → 仅受影响组件触发 Diff |

```javascript
// Vue：只有 data.value 变化才会触发更新
const vm = new Vue({ data: { value: 1 } })

// React：需显式调用 setState
const [value, setValue] = useState(1)
```

**5. 设计哲学差异**

| **维度**     | **React**                  | **Vue**                    |
| ------------ | -------------------------- | -------------------------- |
| **控制粒度** | 组件级控制（开发者主导）   | 细粒度依赖追踪（框架主导） |
| **优化方向** | 运行时优化（Fiber 调度）   | 编译时优化（模板静态分析） |
| **适用场景** | 大型动态应用（需精细控制） | 中小型应用（快速开发）     |

## React JSX 循环为何使用 `key` ？

1. **元素的高效识别与复用**

React 通过 `key` 唯一标识列表中的每个元素。当列表发生变化（增删改排序）时，React 会通过 `key` 快速判断：

- **哪些元素是新增的**（需要创建新 DOM 节点）
- **哪些元素是移除的**（需要销毁旧 DOM 节点）
- **哪些元素是移动的**（直接复用现有 DOM 节点，仅调整顺序）

如果没有 `key`，React 会默认使用数组索引（`index`）作为标识，这在动态列表中会导致 **性能下降** 或 **状态错误**。

2. **避免状态混乱**

如果列表项是 **有状态的组件**（比如输入框、勾选框等），错误的 `key` 会导致状态与错误的内容绑定。例如：

```jsx
// 如果初始列表是 [A, B]，用索引 index 作为 key：
<ul>
  {items.map((item, index) => (
    <li key={index}>{item}</li>
  ))}
</ul>

// 在头部插入新元素变为 [C, A, B] 时：
// React 会认为 key=0 → C（重新创建）
// key=1 → A（复用原 key=0 的 DOM，但状态可能残留）
// 此时，原本属于 A 的输入框状态可能会错误地出现在 C 中。
```

3. **提升渲染性能**

通过唯一且稳定的 `key`（如数据 ID），React 可以精准判断如何复用 DOM 节点。如果使用随机数或索引，每次渲染都会强制重新创建所有元素，导致性能浪费。

## React 事件和 DOM 事件区别

1. **事件绑定方式**

- **React 事件**
  使用**驼峰命名法**（如 `onClick`、`onChange`），通过 JSX 属性直接绑定函数：

  ```jsx
  <button onClick={handleClick}>点击</button>
  ```

- **DOM 事件**
  使用**全小写命名**（如 `onclick`、`onchange`），通过字符串或 `addEventListener` 绑定：
  ```html
  <button onclick="handleClick()">点击</button>
  ```
  ```javascript
  button.addEventListener('click', handleClick)
  ```

2. **事件对象（Event Object）**

- **React 事件**
  使用**合成事件（SyntheticEvent）**，是原生事件对象的跨浏览器包装。

  - 通过 `e.nativeEvent` 访问原生事件。
  - 事件对象会被复用（事件池机制），异步访问需调用 `e.persist()`。

  ```jsx
  const handleClick = (e) => {
    e.persist() // 保持事件对象引用
    setTimeout(() => console.log(e.target), 100)
  }
  ```

- **DOM 事件**
  直接使用浏览器原生事件对象，无复用机制。
  ```javascript
  button.addEventListener('click', (e) => {
    console.log(e.target) // 直接访问
  })
  ```

3. **事件传播与默认行为**

- **React 事件**

  - **阻止默认行为**：必须显式调用 `e.preventDefault()`。
  - **阻止冒泡**：调用 `e.stopPropagation()`。

  ```jsx
  const handleSubmit = (e) => {
    e.preventDefault() // 阻止表单默认提交
    e.stopPropagation() // 阻止事件冒泡
  }
  ```

- **DOM 事件**
  - **阻止默认行为**：可调用 `e.preventDefault()` 或 `return false`（在 HTML 属性中）。
  - **阻止冒泡**：调用 `e.stopPropagation()` 或 `return false`（仅部分情况）。
  ```html
  <form onsubmit="return false">
    <!-- 阻止默认提交 -->
    <button onclick="event.stopPropagation()">按钮</button>
  </form>
  ```

4. **性能优化**

- **React 事件**
  采用**事件委托**机制：

  - React 17 之前将事件委托到 `document` 层级。
  - React 17+ 改为委托到渲染的根容器（如 `ReactDOM.render` 挂载的节点）。
  - 减少内存占用，动态添加元素无需重新绑定事件。

- **DOM 事件**
  直接绑定到元素，大量事件监听时可能导致性能问题。

5. **跨浏览器兼容性**

- **React 事件**
  合成事件抹平了浏览器差异（如 `event.target` 的一致性），无需处理兼容性问题。

- **DOM 事件**
  需手动处理浏览器兼容性（如 IE 的 `attachEvent` vs 标准 `addEventListener`）。

6. **`this` 绑定**

- **React 事件**
  类组件中需手动绑定 `this` 或使用箭头函数：

  ```jsx
  class MyComponent extends React.Component {
    handleClick() {
      console.log(this) // 需绑定，否则为 undefined
    }

    render() {
      return <button onClick={this.handleClick.bind(this)}>点击</button>
    }
  }
  ```

- **DOM 事件**
  事件处理函数中的 `this` 默认指向触发事件的元素：
  ```javascript
  button.addEventListener('click', function () {
    console.log(this) // 指向 button 元素
  })
  ```

| 特性             | React 事件                   | DOM 事件                               |
| ---------------- | ---------------------------- | -------------------------------------- |
| **命名规则**     | 驼峰命名（`onClick`）        | 全小写（`onclick`）                    |
| **事件对象**     | 合成事件（`SyntheticEvent`） | 原生事件对象                           |
| **默认行为阻止** | `e.preventDefault()`         | `e.preventDefault()` 或 `return false` |
| **事件委托**     | 自动委托到根容器             | 需手动实现                             |
| **跨浏览器兼容** | 内置处理                     | 需手动适配                             |
| **`this` 指向**  | 类组件中需手动绑定           | 默认指向触发元素                       |

React 事件系统通过抽象和优化，提供了更高效、一致的事件处理方式，避免了直接操作 DOM 的繁琐和兼容性问题。

## 简述 React batchUpdate 机制

React 的 **batchUpdate（批处理更新）机制** 是一种优化策略，旨在将多个状态更新合并为一次渲染，减少不必要的组件重新渲染次数，从而提高性能。

**核心机制**

1. **异步合并更新**
   当在 **同一执行上下文**（如同一个事件处理函数、生命周期方法或 React 合成事件）中多次调用状态更新（如 `setState`、`useState` 的 `setter` 函数），React 不会立即触发渲染，而是将多个更新收集到一个队列中，最终合并为一次更新，统一计算新状态并渲染。

2. **更新队列**
   React 内部维护一个更新队列。在触发更新的代码块中，所有状态变更会被暂存到队列，直到代码执行完毕，React 才会一次性处理队列中的所有更新，生成新的虚拟 DOM，并通过 Diff 算法高效更新真实 DOM。

**触发批处理的场景**

1. **React 合成事件**
   如 `onClick`、`onChange` 等事件处理函数中的多次状态更新会自动批处理。

   ```jsx
   const handleClick = () => {
     setCount(1) // 更新入队
     setName('Alice') // 更新入队
     // 最终合并为一次渲染
   }
   ```

2. **React 生命周期函数**
   在 `componentDidMount`、`componentDidUpdate` 等生命周期方法中的更新会被批处理。

3. **React 18+ 的自动批处理增强**
   React 18 引入 `createRoot` 后，即使在异步操作（如 `setTimeout`、`Promise`、原生事件回调）中的更新也会自动批处理：
   ```jsx
   setTimeout(() => {
     setCount(1) // React 18 中自动批处理
     setName('Alice') // 合并为一次渲染
   }, 1000)
   ```

**绕过批处理的场景**

1. **React 17 及之前的异步代码**
   在 `setTimeout`、`Promise` 或原生事件回调中的更新默认**不会**批处理，每次 `setState` 触发一次渲染：

   ```jsx
   // React 17 中会触发两次渲染
   setTimeout(() => {
     setCount(1) // 渲染一次
     setName('Alice') // 渲染第二次
   }, 1000)
   ```

2. **手动强制同步更新**
   使用 `flushSync`（React 18+）可强制立即更新，绕过批处理：

   ```jsx
   import { flushSync } from 'react-dom'

   flushSync(() => {
     setCount(1) // 立即渲染
   })
   setName('Alice') // 再次渲染
   ```

**设计目的**

1. **性能优化**
   避免频繁的 DOM 操作，减少浏览器重绘和回流，提升应用性能。

2. **状态一致性**
   确保在同一个上下文中多次状态变更后，组件最终基于最新的状态值渲染，避免中间状态导致的 UI 不一致。

**示例对比**

- **自动批处理（React 18+）**

  ```jsx
  const handleClick = () => {
    setCount((prev) => prev + 1) // 更新入队
    setCount((prev) => prev + 1) // 更新入队
    // 最终 count 增加 2，仅一次渲染
  }
  ```

- **非批处理（React 17 异步代码）**
  ```jsx
  setTimeout(() => {
    setCount((prev) => prev + 1) // 渲染一次
    setCount((prev) => prev + 1) // 再渲染一次
    // React 17 中触发两次渲染，count 仍为 2
  }, 1000)
  ```

| 场景                  | React 17 及之前 | React 18+（使用 `createRoot`） |
| --------------------- | --------------- | ------------------------------ |
| **合成事件/生命周期** | 自动批处理      | 自动批处理                     |
| **异步操作**          | 不批处理        | 自动批处理                     |
| **原生事件回调**      | 不批处理        | 自动批处理                     |

React 的批处理机制通过合并更新减少了渲染次数，但在需要即时反馈的场景（如动画）中，可通过 `flushSync` 强制同步更新。

## 简述 React 事务机制

React 的 **事务机制（Transaction）** 是早期版本（React 16 之前）中用于 **批量处理更新** 和 **管理副作用** 的核心设计模式，其核心思想是通过“包装”操作流程，确保在更新过程中执行特定的前置和后置逻辑（如生命周期钩子、事件监听等）。随着 React Fiber 架构的引入，事务机制逐渐被更灵活的调度系统取代。

**核心概念**

1. **事务的定义**
   事务是一个包含 **初始化阶段**、**执行阶段** 和 **收尾阶段** 的流程控制单元。每个事务通过 `Transaction` 类实现，提供 `initialize` 和 `close` 方法，用于在操作前后插入逻辑。例如：

   ```javascript
   const MyTransaction = {
     initialize() {
       /* 前置操作（如记录状态） */
     },
     close() {
       /* 后置操作（如触发更新） */
     },
   }
   ```

2. **包装函数**
   事务通过 `perform` 方法执行目标函数，将其包裹在事务的生命周期中：
   ```javascript
   function myAction() {
     /* 核心逻辑（如调用 setState） */
   }
   MyTransaction.perform(myAction)
   ```

**在 React 中的应用场景**

1. **批量更新（Batching Updates）**
   在事件处理或生命周期方法中，多次调用 `setState` 会被事务合并为一次更新。例如：

   ```javascript
   class Component {
     onClick() {
       // 事务包裹下的多次 setState 合并为一次渲染
       this.setState({ a: 1 })
       this.setState({ b: 2 })
     }
   }
   ```

2. **生命周期钩子的触发**
   在组件挂载或更新时，事务确保 `componentWillMount`、`componentDidMount` 等钩子在正确时机执行。

3. **事件系统的委托**
   合成事件（如 `onClick`）的处理逻辑通过事务绑定和解绑，确保事件监听的一致性和性能优化。

**事务的工作流程**

1. **初始化阶段**
   执行所有事务的 `initialize` 方法（如记录当前 DOM 状态、锁定事件监听）。
2. **执行目标函数**
   运行核心逻辑（如用户定义的 `setState` 或事件处理函数）。
3. **收尾阶段**
   执行所有事务的 `close` 方法（如对比 DOM 变化、触发更新、解锁事件）。

**事务机制的局限性**

1. **同步阻塞**
   事务的执行是同步且不可中断的，无法支持异步优先级调度（如 Concurrent Mode 的时间切片）。
2. **复杂性高**
   事务的嵌套和组合逻辑复杂，难以维护和扩展。

**Fiber 架构的演进**
React 16 引入的 **Fiber 架构** 替代了事务机制，核心改进包括：

1. **异步可中断更新**
   通过 Fiber 节点的链表结构，支持暂停、恢复和优先级调度。
2. **更细粒度的控制**
   将渲染拆分为多个阶段（如 `render` 和 `commit`），副作用管理更灵活。
3. **替代批量更新策略**
   使用调度器（Scheduler）和优先级队列实现更高效的批处理（如 React 18 的自动批处理）。

| 特性           | 事务机制（React <16）  | Fiber 架构（React 16+）        |
| -------------- | ---------------------- | ------------------------------ |
| **更新方式**   | 同步批量更新           | 异步可中断、优先级调度         |
| **副作用管理** | 通过事务生命周期控制   | 通过 Effect Hook、提交阶段处理 |
| **复杂度**     | 高（嵌套事务逻辑复杂） | 高（但更模块化和可扩展）       |
| **适用场景**   | 简单同步更新           | 复杂异步渲染（如动画、懒加载） |

事务机制是 React 早期实现批量更新的基石，但其同步设计无法满足现代前端应用的复杂需求。Fiber 架构通过解耦渲染过程，为 Concurrent Mode 和 Suspense 等特性奠定了基础，成为 React 高效渲染的核心。

## 理解 React concurrency 并发机制

React 的并发机制（Concurrency）是 React 18 引入的一项重要特性，旨在提升应用的响应性和性能。

**1. 什么是 React 的并发机制？**

React 的并发机制允许 React 在渲染过程中根据任务的优先级进行调度和中断，从而确保高优先级的更新能够及时渲染，而不会被低优先级的任务阻塞。

**2. 并发机制的工作原理：**

- **时间分片（Time Slicing）：** React 将渲染任务拆分为多个小片段，每个片段在主线程空闲时执行。这使得浏览器可以在渲染过程中处理用户输入和其他高优先级任务，避免长时间的渲染阻塞用户交互。

- **优先级调度（Priority Scheduling）：** React 为不同的更新分配不同的优先级。高优先级的更新（如用户输入）会被优先处理，而低优先级的更新（如数据预加载）可以在空闲时处理。

- **可中断渲染（Interruptible Rendering）：** 在并发模式下，React 可以中断当前的渲染任务，处理更高优先级的任务，然后再恢复之前的渲染。这确保了应用在长时间渲染过程中仍能保持响应性。

**3. 并发机制的优势：**

- **提升响应性：** 通过优先处理高优先级任务，React 能够更快地响应用户输入，提升用户体验。

- **优化性能：** 将渲染任务拆分为小片段，避免长时间的渲染阻塞，提升应用的整体性能。

- **更好的资源利用：** 在主线程空闲时处理低优先级任务，充分利用系统资源。

**4. 如何启用并发模式：**

要在 React 应用中启用并发模式，需要使用 `createRoot` API：

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
```

在并发模式下，React 会自动根据任务的优先级进行调度和渲染。

## React reconciliation 协调的过程

React 的 **协调（Reconciliation）** 是用于高效更新 UI 的核心算法。当组件状态或属性变化时，React 会通过对比新旧虚拟 DOM（Virtual DOM）树，找出最小化的差异并应用更新。以下是协调过程的详细步骤：

1. **生成虚拟 DOM 树**

- 当组件状态或属性变化时，React 会重新调用组件的 `render` 方法，生成新的**虚拟 DOM 树**（一个轻量级的 JavaScript 对象，描述 UI 结构）。
- 虚拟 DOM 是实际 DOM 的抽象表示，操作成本远低于直接操作真实 DOM。

2. **Diffing 算法（差异对比）**
   React 使用 **Diffing 算法** 比较新旧两棵虚拟 DOM 树，找出需要更新的部分。对比规则如下：

**规则一：不同类型的元素**

- 如果新旧元素的 `type` 不同（例如从 `<div>` 变为 `<span>`），React 会**销毁旧子树**，**重建新子树**。
  - 旧组件的生命周期方法（如 `componentWillUnmount`）会被触发。
  - 新组件的生命周期方法（如 `constructor`、`componentDidMount`）会被触发。

**规则二：相同类型的元素**

- 如果元素的 `type` 相同（例如 `<div className="old">` → `<div className="new">`），React 会**保留 DOM 节点**，仅更新变化的属性。
  - 对比新旧属性，仅更新差异部分（例如 `className`）。
  - 组件实例保持不变，生命周期方法（如 `componentDidUpdate`）会被触发。

**规则三：递归处理子节点**

- 对于子节点的对比，React 默认使用**逐层递归**的方式。
- **列表对比优化**：
  - 当子元素是列表（例如通过 `map` 生成的元素）时，React 需要唯一 `key` 来标识元素，以高效复用 DOM 节点。
  - 若未提供 `key`，React 会按顺序对比子节点，可能导致性能下降或状态错误（例如列表顺序变化时）。

3. **更新真实 DOM**

- 通过 Diffing 算法找出差异后，React 将生成一系列**最小化的 DOM 操作指令**（例如 `updateTextContent`、`replaceChild`）。
- 这些指令会被批量应用到真实 DOM 上，以减少重绘和重排的次数，提高性能。

4. **协调的优化策略**

- **Key 的作用**：为列表元素提供唯一的 `key`，帮助 React 识别元素的移动、添加或删除，避免不必要的重建。
- **批量更新（Batching）**：React 会将多个状态更新合并为一次渲染，减少重复计算。
- **Fiber 架构**（React 16+）：
  - 将协调过程拆分为可中断的“工作单元”（Fiber 节点），允许高优先级任务（如动画）优先处理。
  - 支持异步渲染（Concurrent Mode），避免长时间阻塞主线程。

## React 组件渲染和更新的全过程

React 组件的渲染和更新过程涉及多个阶段，包括 **初始化、渲染、协调、提交、清理** 等。以下是 React 组件渲染和更新的全过程，结合源码逻辑和关键步骤进行详细分析。

**1. 整体流程概述**
React 的渲染和更新过程可以分为以下几个阶段：

1. **初始化阶段**：创建 Fiber 树和 Hooks 链表。
2. **渲染阶段**：生成新的虚拟 DOM（Fiber 树）。
3. **协调阶段**：对比新旧 Fiber 树，找出需要更新的部分。
4. **提交阶段**：将更新应用到真实 DOM。
5. **清理阶段**：重置全局变量，准备下一次更新。

**2. 详细流程分析**

**（1）初始化阶段**

- **触发条件**：组件首次渲染或状态/属性更新。
- **关键函数**：`render`、`createRoot`、`scheduleUpdateOnFiber`。
- **逻辑**：
  1. 通过 `ReactDOM.render` 或 `createRoot` 初始化应用。
  2. 创建根 Fiber 节点（`HostRoot`）。
  3. 调用 `scheduleUpdateOnFiber`，将更新任务加入调度队列。

**（2）渲染阶段**

- **触发条件**：调度器开始执行任务。
- **关键函数**：`performSyncWorkOnRoot`、`beginWork`、`renderWithHooks`。
- **逻辑**：
  1. 调用 `performSyncWorkOnRoot`，开始渲染任务。
  2. 调用 `beginWork`，递归处理 Fiber 节点。
  3. 对于函数组件，调用 `renderWithHooks`，执行组件函数并生成新的 Hooks 链表。
  4. 对于类组件，调用 `instance.render`，生成新的虚拟 DOM。
  5. 对于 Host 组件（如 `div`），生成对应的 DOM 节点。

**（3）协调阶段**

- **触发条件**：新的虚拟 DOM 生成后。
- **关键函数**：`reconcileChildren`、`diff`。
- **逻辑**：
  1. 调用 `reconcileChildren`，对比新旧 Fiber 节点。
  2. 根据 `diff` 算法，找出需要更新的节点。
  3. 为需要更新的节点打上 `Placement`、`Update`、`Deletion` 等标记。

**（4）提交阶段**

- **触发条件**：协调阶段完成后。
- **关键函数**：`commitRoot`、`commitWork`。
- **逻辑**：
  1. 调用 `commitRoot`，开始提交更新。
  2. 调用 `commitWork`，递归处理 Fiber 节点。
  3. 根据节点的标记，执行 DOM 操作（如插入、更新、删除）。
  4. 调用生命周期钩子（如 `componentDidMount`、`componentDidUpdate`）。

**（5）清理阶段**

- **触发条件**：提交阶段完成后。
- **关键函数**：`resetHooks`、`resetContext`。
- **逻辑**：
  1. 重置全局变量（如 `currentlyRenderingFiber`、`currentHook`）。
  2. 清理上下文和副作用。
  3. 准备下一次更新。

## 为何 Hooks 不能放在条件或循环之内？

一个组件中的 hook 会以链表的形式串起来， FiberNode 的 memoizedState 中保存了 Hooks 链表中的第一个 Hook。

在更新时，会复用之前的 Hook，如果通过了条件或循环语句，增加或者删除 hooks，在复用 hooks 过程中，会产生复用 hooks状态和当前 hooks 不一致的问题。

## useEffect 的底层是如何实现的（美团）

useEffect 是 React 用于管理副作用的 Hook，它在 commit 阶段 统一执行，确保副作用不会影响渲染。

在 React 源码中，useEffect 通过 Fiber 机制 在 commit 阶段 进行处理：

**(1) useEffect 存储在 Fiber 节点上**

React 组件是通过 Fiber 数据结构 组织的，每个 useEffect 都会存储在 fiber.updateQueue 中。

**(2) useEffect 何时执行**

React 组件更新后，React 在 commit 阶段 统一遍历 effect 队列，并执行 useEffect 副作用。

React 使用 `useEffectEvent()` 注册 effect，在 commitLayoutEffect 之后，异步执行 useEffect，避免阻塞 UI 渲染。

**(3) useEffect 依赖变化的处理**

依赖数组的比较使用 `Object.is()`，只有依赖变化时才重新执行 useEffect。

在更新阶段，React 遍历旧 effect，并先执行清理函数，然后再执行新的 effect。

**简化的 useEffect 实现如下：**

```js
function useEffect(callback, dependencies) {
  const currentEffect = getCurrentEffect() // 获取当前 Fiber 节点的 Effect

  if (dependenciesChanged(currentEffect.dependencies, dependencies)) {
    cleanupPreviousEffect(currentEffect) // 先执行上次 effect 的清理函数
    const cleanup = callback() // 执行 useEffect 传入的回调
    currentEffect.dependencies = dependencies
    currentEffect.cleanup = cleanup // 存储清理函数
  }
}
```

相比 useLayoutEffect，useEffect 是 异步执行，不会阻塞 UI 渲染。