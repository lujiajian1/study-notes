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
##### $nextTick、refs
Vue是异步渲染，data改变之后，DOM不会立刻渲染，会整合一次渲染，this.$nextTick(()=>{})会在DOM渲染之后被触发，以获取最新DOM节点。
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
缓存组件，适用于频繁切换，不需要重复渲染的组件，\<keep-alive\>\</keep-alive\>
##### mixin
多个组件有相同的逻辑，抽离出来，但mixin并不是完美的，首先变量来源不明确，不利于阅读，多mixin可能会造成命名冲突，另外mixin和组件可能出现多对多的关系，复杂度较高。

### vuex
* state
* getters
* action
* mutation
![vuex](https://github.com/lujiajian1/study-notes/blob/main/img/vuex.png)

### Vue-router
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

### Vue 响应式

* 核心API Object.defineProperty
* Object.defineProperty的一些缺点 （Vue3.0启用Proxy）
    * 深度监听，需要递归到底，一次性计算量大
    * 无法监听新增属性/删除属性（Vue.set Vue.delete）
    * 无法原生监听数组，需要特殊处理

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


### render函数

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
### 查漏补缺

1. v-for比v-if优先级高，一起使用v-for循环了多少次，v-if就判断了多少次
2. @click="btnClick('dsds', $event)" $event参数放最后
3. v-for中key的好处：如果没有key就全部删掉节点然后再插入，有key就可以移动过来，不用再做销毁处理，这也是key作为标识符的好处。key不能是随机数，因为新老产生的随机数不一样，所以不能作为新老对比的标识，而且index也不能作为标识符，如果是有排序功能话，就会出现问题，最好使用业务中的key值，如id，字符串等等。

