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
### 查漏补缺

1. v-for比v-if优先级高，一起使用v-for循环了多少次，v-if就判断了多少次
2. @click="btnClick('dsds', $event)" $event参数放最后

