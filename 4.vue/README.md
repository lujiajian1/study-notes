### 自定义事件实现兄弟组件通信
```js
//event.js
import Vue from 'vue';
export default new Vue(); //利用vue自定义事件的能力

//组件1
event.$emit('nameChange', name);

//组件2

mounted() {
    event.$on('nameChange', this.borNameChange) //绑定
}

beforeDestroy(){
    event.$off('nameChange', this.borNameChange) //解绑，销毁，否则可能造成内存泄漏
}
```

### 生命周期
![生命周期](https://github.com/lujiajian1/study-notes/blob/main/img/lifecycle.png)

### 父子组件生命周期
* 创建
    1. father created
    2. chid created
    3. chid mounted
    4. father mounted
* 更新
    1. father beforeUpdate
    2. chid beforeUpdate
    3. child updated
    4. father updated
* 销毁
    1. father beforeDestroy
    2. chid beforeDestroy
    3. chid destroyed
    4. father destroyed

### Vue高级特性
##### 自定义v-model
```html
<!-- 父组件 -->
<CustomVModel v-model="name"/>
```
```vue
<template>
    <!-- CustomVModel.vue -->
    <!-- 例如：vue 颜色选择 -->
    <input type="text"
        :value="text1"
        @input="$emit('change1', $event.target.value)"
    >
    <!--
        1. 上面的 input 使用了 :value 而不是 v-model
        2. 上面的 change1 和 model.event1 要对应起来
        3. text1 属性对应起来
    -->
</template>

<script>
export default {
    model: {
        prop: 'text1', // 对应 props text1
        event: 'change1'
    },
    props: {
        text1: String,
        default() {
            return ''
        }
    }
}
</script>
```
##### $nextTick
    * 使用：Vue是异步渲染，data改变之后，DOM不会立刻渲染，会整合一次渲染，this.$nextTick(()=>{})会在DOM渲染之后被触发，以获取最新DOM节点。
    * 原理：MutationObserver是HTML5新增的属性，用于监听DOM修改事件，能够监听到节点的属性、文本内容、子节点等的改动。
```js
// MutationObserver的使用方法
var observer = new MutationObserver(function(){
    //这里是回调函数
    console.log('DOM被修改了！');
});
var article = document.querySelector('article');
observer.observer(article);
```
![nextTick](https://github.com/lujiajian1/study-notes/blob/main/img/nextTick.png)
[nextTick实现原理](https://segmentfault.com/a/1190000008589736)



##### slot
```html
<!-- 作用域插槽、具名插槽 -->
<!-- 父组件 -->
<template v-slot:title="slotProps" >
    {{slotProps.slotData.title}}
</template>
<!-- 子组件 -->
<slot :slotData="website" name='title'></slot>
``` 
##### 动态组件、异步组件
```html
<!-- 动态组件 -->
<component :is="xxx"/>

<!-- 异步组件 -->
<script>
export default {
    components: {
        formDemo: () => import(../formDemo.vue) // import()按需异步加载
    },
}
</script>
```
##### keep-alive
* 概念：keep-alive是个抽象组件（或称为功能型组件），实际上不会被渲染在DOM树中。它的作用是在内存中缓存组件（不让组件销毁），等到下次再渲染的时候，还会保持其中的所有状态，并且会触发activated钩子函数。适用于频繁切换，不需要重复渲染的组件，\<keep-alive\>\</keep-alive\>
* 生命周期变化：这里的activated非常有用，因为页面被缓存时，created,mounted等生命周期均失效，你若想进行一些操作，那么可以在activated内完成。activated keep-alive组件激活时调用，该钩子在服务器端渲染期间不被调用。deactivated keep-alive组件停用时调用，该钩子在服务端渲染期间不被调用。
    * 正常生命周期：beforeRouteEnter --> created --> mounted --> updated -->destroyed
    * 首次进入缓存页面：beforeRouteEnter --> created --> mounted --> activated --> deactivated
    * 再次进入缓存页面：beforeRouteEnter --> activated --> deactivated
##### mixin
* 概念：mixins（混入），官方的描述是一种分发 Vue 组件中可复用功能的非常灵活的方式，mixins是一个js对象，它可以包含我们组件中script项中的任意功能选项，如data、components、methods 、created、computed等等。我们只要将共用的功能以对象的方式传入 mixins选项中，当组件使用 mixins对象时所有mixins对象的选项都将被混入该组件本身的选项中来，这样就可以提高代码的重用性，使你的代码保持干净和易于维护。但mixin并不是完美的，首先变量来源不明确，不利于阅读，多mixin可能会造成命名冲突，另外mixin和组件可能出现多对多的关系，复杂度较高。
* Mixins的特点：
    * 方法和参数在各组件中不共享，虽然组件调用了mixins并将其属性合并到自身组件中来了，但是其属性只会被当前组件所识别并不会被共享，也就是说当前组件修改mixin的data属性，不会引发其他组件的更改。
    * 值为对象(components、methods 、computed、data)的选项，混入组件时选项会被合并，键冲突时优先组件，组件中的键会覆盖混入对象的
    * 值为函数(created、mounted)的选项，混入组件时选项会被合并调用，混合对象里的钩子函数在组件里的钩子函数之前调用
* 与vuex的区别
    * vuex：用来做状态管理的，里面定义的变量在每个组件中均可以使用和修改，在任一组件中修改此变量的值之后，其他组件中此变量的值也会随之修改。
    * Mixins：可以定义共用的变量，在每个组件中使用，引入组件中之后，各个变量是相互独立的，值的修改在组件中不会相互影响。
* 与公共组件的区别
    * 在父组件中引入组件，相当于在父组件中给出一片独立的空间供子组件使用，然后根据props来传值，但本质上两者是相对独立的。
    * 则是在引入组件之后与组件中的对象和方法进行合并，相当于扩展了父组件的对象与方法，可以理解为形成了一个新的组件。

### vuex：专为 Vue.js 应用程序开发的状态管理模式
* 使用：
    * state
    * getters
    * action
    * mutation
* mutation和action的区别
    * Mutation：专注于修改State，理论上是修改State的唯一途径。Action：业务代码、异步请求。
    * mutation只支持同步操作。想要完成异步操作，比如与后端通信然后将数据赋值给state，就需要通过action的异步回调中再去commit store的mutation。
* [原理](https://juejin.cn/post/6855474001838342151)：
    1. Vuex本质是一个对象
    2. Vuex对象有两个属性，一个是install方法，一个是Store这个类
    3. install方法的作用是将store这个实例挂载到所有的组件上，注意是同一个store实例。
    4. Store这个类拥有commit，dispatch这些方法，Store类里将用户传入的state包装成data，作为new Vue的参数，从而实现了state 值的响应式。
```js
export default new Vuex.Store({
    state: { 
        // state 类似 data
        //这里面写入数据
    },
    getters:{ 
        // getters 类似 computed 
        // 在这里面写个方法
    },
    mutations:{ 
        // mutations 类似methods
        // 写方法对数据做出更改(同步操作)
    },
    actions:{
        // actions 类似methods
        // 写方法对数据做出更改(异步操作)
    }
})
this.$store.xxxx //获取
this.$store.commit('XXXXfn',value);//
```
![vuex](https://github.com/lujiajian1/study-notes/blob/main/img/vuex.png)

### Vue-router
* 基本使用
    * query方式传参和接收参数（query相当于get请求，页面跳转的时候，可以在地址栏看到请求参数）
    ```js
    //传参: 
    this.$router.push({
        path:'/xxx',
        query:{
        id:id
        }
    })
    
    //接收参数:
    this.$route.query.id
    ```
    * params方式传参和接收参数（相当于post请求，参数不会再地址栏中显示）
    ```js
    //传参: 
    this.$router.push({
        name:'xxx',
        params:{
          id:id
        }
      })
  
    //接收参数:
    this.$route.params.id
    ```
* 路由模式 hash 和 H5 history（需要server端支持）
* 动态路由
```js
const User = { template: '<div>User {{ $route.params.id }}</div>' }
const router = new VueRouter({
    // 动态路径参数 以冒号开头，能命中 `/user/10` `/user/20` 等格式的路由
    routes: [{path: '/user/:id', component: User}]
})
```
* 懒加载
```js
export default new VueRouter({
    routes: [
        {
            path: '/',
            component: ()=>import('./../components/Navigator')
        },
        {
            path: '/feedback',
            component: () => import('./../components/FeedBack')
        }
    ]
})
```
* 导航守卫
    * 全局守卫：异步执行,每个路由跳转都会按顺序执行
        * router.beforeEach 全局前置守卫
        * router.beforeResolve 全局解析守卫(2.5.0+) 在beforeRouteEnter调用之后调用.
        * router.afterEach 全局后置钩子 进入路由之后 注意:不支持next(),只能写成这种形式
    ```js
    //1,可以在main.js 或者在单独的路由配置文件router.js中进行设置
	router.beforeEach((to, from, next) => { 
	    ...
        next();
    });
	
    //2,也可以在组件内部设置
    this.$router.beforeEach((to, from, next) => { 
        ...
        next();
    });
    
    //3,对函数及next()的详细使用说明
    router.beforeEach((to, from, next) => { 
        //首先to和from 其实是一个路由对象,所以路由对象的属性都是可以获取到的(具体可以查看官方路由对象的api文档).
        //例如:我想获取获取to的完整路径就是to.path.获取to的子路由to.matched[0].
        next();//使用时,千万不能漏写next!!!
        //next()  表示直接进入下一个钩子.
        //next(false)  中断当前导航
        //next('/path路径')或者对象形式next({path:'/path路径'})  跳转到path路由地址
        //next({path:'/shotcat',name:'shotCat',replace:true,query:{logoin:true}...})  这种对象的写法,可以往里面添加很多.router-link 的 to prop 和 router.push 中的选项(具体可以查看api的官方文档)全都是可以添加进去的,再说明下,replace:true表示替换当前路由地址,常用于权限判断后的路由修改.
        //next(error)的用法,(需2.4.0+) 
    }).catch(()=>{
        //跳转失败页面
        next({ path: '/error', replace: true, query: { back: false }})
    })
    //如果你想跳转报错后,再回调做点其他的可以使用 router.onError()
    router.onError(callback => { 
        console.log('出错了!', callback);
    });
    ```
    * 路由独享的守卫: 即路由对象独享的守卫
        * beforeEnter 路由只独享这一个钩子，在rutes里配置
    ```js
    const router = new VueRouter({
        routes: [
            {
                path: '/foo',
                component: Foo,
                beforeEnter: (to, from, next) => {
                    // 使用方法和上面的beforeEach一毛一样
                }
            }
        ]
    })
    ```
    * 组件内的守卫: 注意:这类路由钩子是写在组件内部的
        * beforeRouteEnter 进入路由前,此时实例还没创建,无法获取到zhis
        * beforeRouteUpdate (2.2) 路由复用同一个组件时
        * beforeRouteLeave 离开当前路由,此时可以用来保存数据,或数据初始化,或关闭定时器等等
    ```js
    const Foo = {
        template: `...`,
        beforeRouteEnter (to, from, next) {
            // 在渲染该组件的对应路由被 confirm 前调用
            // 不！能！获取组件实例 `this`
            // 因为当守卫执行前，组件实例还没被创建
        },
        beforeRouteUpdate (to, from, next) {
            // 在当前路由改变，但是该组件被复用时调用
            // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
            // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
            // 可以访问组件实例 `this`
        },
        beforeRouteLeave (to, from, next) {
            // 导航离开该组件的对应路由时调用
            // 可以访问组件实例 `this`
        }
    }
    ```

### Vue 响应式
* 核心API Object.defineProperty
* Object.defineProperty的一些缺点 （Vue3.0启用Proxy）
    * 深度监听，需要递归到底，一次性计算量大
    * 无法监听新增属性/删除属性（Vue.set Vue.delete）
    * 无法原生监听数组，需要特殊处理
```js
// 触发更新视图
function updateView() {
    console.log('视图更新')
}

// 重新定义数组原型
const oldArrayProperty = Array.prototype
// 创建新对象，原型指向 oldArrayProperty ，再扩展新的方法不会影响原型
const arrProto = Object.create(oldArrayProperty);
['push', 'pop', 'shift', 'unshift', 'splice'].forEach(methodName => {
    arrProto[methodName] = function () {
        updateView() // 触发视图更新
        oldArrayProperty[methodName].call(this, ...arguments)
        // Array.prototype.push.call(this, ...arguments)
    }
})

// 重新定义属性，监听起来
function defineReactive(target, key, value) {
    // 深度监听
    observer(value)

    // 核心 API
    Object.defineProperty(target, key, {
        get() {
            return value
        },
        set(newValue) {
            if (newValue !== value) {
                // 深度监听
                observer(newValue)

                // 设置新值
                // 注意，value 一直在闭包中，此处设置完之后，再 get 时也是会获取最新的值
                value = newValue

                // 触发更新视图
                updateView()
            }
        }
    })
}

// 监听对象属性
function observer(target) {
    if (typeof target !== 'object' || target === null) {
        // 不是对象或数组
        return target
    }

    // 污染全局的 Array 原型
    // Array.prototype.push = function () {
    //     updateView()
    //     ...
    // }

    if (Array.isArray(target)) {
        target.__proto__ = arrProto
    }

    // 重新定义各个属性（for in 也可以遍历数组）
    for (let key in target) {
        defineReactive(target, key, target[key])
    }
}

// 准备数据
const data = {
    name: 'zhangsan',
    age: 20,
    info: {
        address: '北京' // 需要深度监听
    },
    nums: [10, 20, 30]
}

// 监听数据
observer(data)

// 测试
// data.name = 'lisi'
// data.age = 21
// // console.log('age', data.age)
// data.x = '100' // 新增属性，监听不到 —— 所以有 Vue.set
// delete data.name // 删除属性，监听不到 —— 所有已 Vue.delete
// data.info.address = '上海' // 深度监听
data.nums.push(4) // 监听数组
```

### 虚拟DOM（Virtual DOM）和 diff
* vdom是实现vue和React的重要基石。DOM操作非常耗费性能，js执行速度很快，vdom用JS模拟DOM结构，计算出最小的变更，操作DOM
* diff算法是vdom中最核心、最关键的部分
    * 只比较同一层级
    * tag不同，则直接删掉重建，不再深度比较
    * tag和key，两者都相同，则认为是相同节点，不再深度比较
* vue参考[snabbdom](https://github.com/snabbdom/snabbdom)实现的vdom和diff

### 模板编译（模板转JS代码）
1. vue-template-complier（with 语法） 将模板编译为render函数（template先转成AST树，然后AST树再转成render函数，render函数再转成VNode）
2. 执行render函数生成vnode

### 组件 渲染/更新 过程
* 初次渲染过程
    1. 解析模板为render函数
    2. 触发响应式，监听data属性getter setter
    3. 执行render函数，生成vnode，patch(elem, vnode)
* 更新过程
    1. 修改data，触发setter（此前在getter中已被监听）
    2. 重新执行render函数，生成newVnode
    3. patch(vnode, newVnode)
* 异步渲染
    * $nextTick
    * 汇总data的修改，一次性更新视图
    * 减少DOM操作次数，提高性能
![渲染/更新](https://github.com/lujiajian1/study-notes/blob/main/img/render.png)

### 前端路由原理
* 稍微复杂一点的SPA（single page app 单页面应用），都需要路由
* vue-router也是vue全家桶的标配之一
* hash的特点：
    * hash变化会 触发网页跳转，即浏览器的前进、后退
    * hash 变化不会刷新页面，SPA必需的特点
    * hash 永远不会提交到 server 端（前端自生自灭）
```js
// vue-router hosh 原理
// hash 变化，包括：
// a. JS 修改 url
// b. 手动修改 url 的 hash
// c. 浏览器前进、后退
window.onhashchange = (event) => {
    console.log('old url', event.oldURL)
    console.log('new url', event.newURL)

    console.log('hash:', location.hash)
}

// 页面初次加载，获取 hash
document.addEventListener('DOMContentLoaded', () => {
    console.log('hash:', location.hash)
})

// JS 修改 url
document.getElementById('btn1').addEventListener('click', () => {
    location.href = '#/user'
})
```
* H5 history
    * history.pushState 和 window.onpopstate
    * 需要后端支持（将所有的路由拦截返回 index.html）
```js
 // 页面初次加载，获取 path
document.addEventListener('DOMContentLoaded', () => {
    console.log('load', location.pathname)
})

// 打开一个新的路由
// 【注意】用 pushState 方式，浏览器不会刷新页面
document.getElementById('btn1').addEventListener('click', () => {
    const state = { name: 'page1' }
    console.log('切换路由到', 'page1')
    history.pushState(state, '', 'page1') // 重要！！
})

// 监听浏览器前进、后退
window.onpopstate = (event) => { // 重要！！
    console.log('onpopstate', event.state, location.pathname)
}

// 需要 server 端配合，可参考
// https://router.vuejs.org/zh/guide/essentials/history-mode.html#%E5%90%8E%E7%AB%AF%E9%85%8D%E7%BD%AE%E4%BE%8B%E5%AD%90
```

### Vue 常见的性能优化方式
* 合理使用v-show和v-if
* 合理使用computed（缓存，提高计算的性能）
* v-for时加key，以及避免和v-if同时使用（v-for的优先级更高，每次v-for 时 v-if 都要重新计算一遍）
* 自定义事件、DOM时间及时销毁（可能会导致内存泄漏）
* 合理使用异步组件（大组件）
* 合理使用keep-alive（不需要重复渲染的地方将其缓存下来）
* data 层级不要太深（深度监听需要一次性遍历完成，太深会导致做监听的时候递归的次数比较多），层级尽量设计地扁平一些
* 使用vue-loader 在开发环境中做模板编译（预编译）
* webpack层面的优化
* 前端通用的性能优化，如图片懒加载
* 使用SSR（服务端渲染）

### 谈一下你对Vue组件化的理解
* 定义：组件是可复用的 Vue 实例，准确讲它们是VueComponent的实例，继承自Vue。
```js
Vue.component('my-component', {
  template: '<p>我是被全局注册的组件</p>'
})
/*
  Vue.component(组件名称[字符串], 组件对象)
*/ 
new Vue({
  el: '#app',
  template: '<my-component></my-component>'
})
```
* 官方定义：vue组件系统提供了一种抽象，让我们可以使用独立可复用的组件来构建大型应用，任意类型的应用界面都可以抽象为一个组件树。组件化能提高开发效率，方便重复使用（复用），简化调试步骤，提升项目可维护性，便于多人协同开发。
* 优点：组件化可以增加代码的复用性、可维护性和可测试性。

### Vue 源码谈谈发布-订阅模式
* 发布函数，发布的时候执行相应的回调
    * observer每个对象的属性，添加到订阅者容器Dependency(Dep)中，当数据发生变化的时候发出notice通知。
* 订阅函数，添加订阅者,传入发布时要执行的函数,可能会携额外参数
    * Watcher：某个属性数据的监听者/订阅者，一旦数据有变化，它会通知指令(directive)重新编译模板并渲染UI
* 一个缓存订阅者以及订阅者的回调函数的列表
    * Dep对象: 订阅者容器，负责维护watcher
(从vue源码看发布订阅模式和观察者模式)[https://www.jianshu.com/p/2571d170191e]

### Vue和React[区别](https://juejin.cn/post/6844903668446134286)
* 监听数据变化的实现原理不同：Vue 通过 getter/setter 以及一些函数的劫持，能精确知道数据变化，不需要特别的优化就能达到很好的性能。React 默认是通过比较引用的方式进行的，如果不优化（PureComponent/shouldComponentUpdate）可能导致大量不必要的VDOM的重新渲染。
* 数据流的不同：Vue中默认是支持双向绑定的，React 从诞生之初就不支持双向绑定，React一直提倡的是单向数据流，他称之为 onChange/setState()模式。
* HoC 和 mixins：在 Vue 中我们组合不同功能的方式是通过 mixin，而在React中我们通过 HoC (高阶组件）。
* 组件通信的区别：React 本身并不支持自定义事件，Vue中子组件向父组件传递消息有两种方式：事件和回调函数，而且Vue更倾向于使用事件。但是在 React 中我们都是使用回调函数的，这可能是他们二者最大的区别。
* 模板渲染方式的不同：React 是通过JSX渲染模板，而Vue是通过一种拓展的HTML语法进行渲染。


### 查漏补缺
1. v-for比v-if优先级高，一起使用v-for循环了多少次，v-if就判断了多少次
2. @click="btnClick('dsds', $event)" $event参数放最后
3. v-for中key的好处：如果没有key就全部删掉节点然后再插入，有key就可以移动过来，不用再做销毁处理，这也是key作为标识符的好处。key不能是随机数，因为新老产生的随机数不一样，所以不能作为新老对比的标识，而且index也不能作为标识符，如果是有排序功能话，就会出现问题，最好使用业务中的key值，如id，字符串等等。
4. AST：抽象语法树

