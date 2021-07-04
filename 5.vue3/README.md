### vue3比vue2的优势
* 性能更好
* 体积更小
* 更好的TS支持（vue3本身就是用TS开发的）
* 更好的代码组织
* 更好的逻辑抽离
* 更多新功能

### vue3 升级的功能
* createApp
* emits 属性
* 生命周期
* 多事件
* Fragment
* 移除 .sync
* 异步组件的写法
* 移除 filter
* Teleport
* Suspense
* Composition API

### 声明周期的更改
* beforeDestroy 修改为 beforeUnmount
* destroyed 修改为 unmouted

### vue2中Options API 和 vue3中Composition API
* 在vue2中如何组织代码的，我们会在一个vue文件中methods，computed，watch，data中等等定义属性和方法，共同处理页面逻辑，我们称这种方式为Options API。
* 在vue3 Composition API 中，我们的代码是根据逻辑功能来组织的，一个功能所定义的所有api会放在一起（更加的高内聚，低耦合），这样做，即时项目很大，功能很多，我们都能快速的定位到这个功能所用到的所有API。
* 生命周期写法不同
```js
// Composition API 的生命周期
import { onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted } from 'vue'

export default {
    name: 'XXXX',

    props: {},

    // 等于 beforeCreate 和 created 等
    setup() {
        console.log('setup')

        onBeforeMount(() => {
            console.log('onBeforeMount')
        })
        onMounted(() => {
            console.log('onMounted')
        })
        onBeforeUpdate(() => {
            console.log('onBeforeUpdate')
        })
        onUpdated(() => {
            console.log('onUpdated')
        })
        onBeforeUnmount(() => {
            console.log('onBeforeUnmount')
        })
        onUnmounted(() => {
            console.log('onUnmounted')
        })
    },
}
```
* Composition API 的优点
    * 更好的代码组织
    ```js
    //更好的代码组织
    ```
    * 更好的逻辑复用
    ```js
    //更好的逻辑复用
    ```
    * 更好的类型推导
    ```js
    //更好的类型推导
    ```
* 不建议共用，会引起混乱，小型项目、业务逻辑简单，用Options API，中大型项目、逻辑复杂，用Composition API

### ref toRef 和 toRefs
* ref
    * 生成值类型的响应式数据
    * 可用于模板和 reactive
    * 通过 .value 读取/修改 值（放在 template 或者 reactive 中不需要用 .value）
```vue
<template>
    <p>ref demo {{ageRef}} {{state.name}}</p>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
    name: 'Ref',
    setup() {
        const ageRef = ref(20) // 值类型 响应式
        const nameRef = ref('卢家坚')

        const state = reactive({ //reactive 是 Vue3 中提供的实现响应式数据的方法
            name: nameRef
        })

        setTimeout(() => {
            console.log('ageRef', ageRef.value) //读取

            ageRef.value = 25 // .value 修改值
            nameRef.value = 'lujiajain'
        }, 1500);

        return {
            ageRef,
            state
        }
    }
}
</script>
```
* toRef
    * 针对一个响应式对象（reactive封装）的prop
    * 创建一个 ref，具有响应式
    * 两者保持引用联系
```vue
<template>
    <p>toRef demo - {{ageRef}} - {{state.name}} {{state.age}}</p>
</template>

<script>
import { ref, toRef, reactive } from 'vue'

export default {
    name: 'ToRef',
    setup() {
        const state = reactive({
            age: 20,
            name: '卢家坚'
        })

        const age1 = computed(() => {
            return state.age + 1
        })

        // // toRef 如果用于普通对象（非响应式对象），产出的结果不具备响应式
        // const state = {
        //     age: 20,
        //     name: '双越'
        // }

        const ageRef = toRef(state, 'age')

        setTimeout(() => {
            state.age = 25
        }, 1500)

        setTimeout(() => {
            ageRef.value = 30 // .value 修改值
        }, 3000)

        return {
            state,
            ageRef
        }
    }
}
</script>
```
* toRefs
    * 将响应式对象（reactive封装）转化为普通对象
    * 对象的每个 prop 都是对应的 ref
    * 两者保持引用关系
```vue
<template>
    <p>toRefs demo {{age}} {{name}}</p>
</template>

<script>
import { ref, toRef, toRefs, reactive } from 'vue'

export default {
    name: 'ToRefs',
    setup() {
        const state = reactive({
            age: 20,
            name: '卢家坚'
        })

        const stateAsRefs = toRefs(state) // 将响应式对象，变成普通对象

        // const { age: ageRef, name: nameRef } = stateAsRefs // 每个属性，都是 ref 对象
        // return {
        //     ageRef,
        //     nameRef
        // }

        setTimeout(() => {
            state.age = 25
        }, 1500)

        return stateAsRefs
    }
}
</script>
```

### vue3 实现响应式（Proxy）
* Object.defineProperty 的缺点
    * 初始化的时候深度监听需要一次性递归，造成短暂的卡顿
    * 无法监听新增/删除属性
    * 无法原生监听数组，需要特殊处理
* Proxy 的基本使用
![proxy](https://github.com/lujiajian1/study-notes/blob/main/img/proxy.jpg)