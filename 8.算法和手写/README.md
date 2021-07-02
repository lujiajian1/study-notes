### 深拷贝
```js
function deepClone(obj = {}){    
    if(obj typeof !== 'object' || obj typeof == null) {
        return obj;
    }    
    let result = {};    
    if(obj instanceof Array) {
        result = [];
    }    
    for(let key in obj){        
        if(obj.hasOwnProperty(key)){            
            result[key] = deepClone(obj[key]);        
        }    
    }    
    return result;
}
```

### 手写apply
```js
Function.prototype.myapply = function (context, arr) {
    var context = context || window;
    context.fn = this; //this就是fn1

    var result;
    if (!arr) {
        result = context.fn();
    } else {
        var args = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            args.push('arr[' + i + ']');
        }
        result = eval('context.fn(' + args + ')')
    }

    delete context.fn
    return result;
}
function fn1(a, b, c){
    console.log('this', this);
    console.log(a,b,c);
    return 'this is fn1';
}
const fn2 = fn1.myapply({x:100}, []);
```
### 手写call
```js
Function.prototype.mycall = function (context) {
    var context = context || window;
    context.fn = this;

    var args = [];
    for(var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }

    var result = eval('context.fn(' + args +')');

    delete context.fn
    return result;
}
```
### 手写bind
```js
//手写bind
Function.prototype.mybind = function(){
    // 参数转化为数组
    const args = Array.prototype.slice.call(argument);
    // 获取this
    const t = args.shift();
    // 获取绑定mybind的function
    const self = this;
    // 返回一个函数
    return function(){
        return self.apply(t, args);
    }
}

function fn1(a, b, c){
    console.log('this', this);
    console.log(a,b,c);
    return 'this is fn1';
}

const fn2 = fn1.mybind({x:100}, 10. 20. 30);
const res = fn2():
console.log(res);
```

### 手写instanceof
```js
function new_instance_of(leftVaule, rightVaule) { 
    let rightProto = rightVaule.prototype; // 取右表达式的 prototype 值
    leftVaule = leftVaule.__proto__; // 取左表达式的__proto__值
    while (true) {
    	if (leftVaule === null) {
            return false;	
        }
        if (leftVaule === rightProto) {
            return true;	
        } 
        leftVaule = leftVaule.__proto__ 
    }
}
```

### 写一个简单的jQuery
```js
class jQuery {
    constructor(selector) {
        const result = document.querySelectorAll(selector)
        const length = result.length
        for (let i = 0; i < length; i++) {
            this[i] = result[i]
        }
        this.length = length
        this.selector = selector
    }
    get(index) {
        return this[index]
    }
    each(fn) {
        for (let i = 0; i < this.length; i++) {
            const elem = this[i]
            fn(elem)
        }
    }
    on(type, fn) {
        return this.each(elem => {
            elem.addEventListener(type, fn, false)
        })
    }
    // 扩展很多 DOM API
}

// 插件
jQuery.prototype.dialog = function (info) {
    alert(info)
}

// “造轮子”
class myJQuery extends jQuery {
    constructor(selector) {
        super(selector)
    }
    // 扩展自己的方法
    addClass(className) {

    }
    style(data) {

    }
}

const $p = new jQuery('p')
$p.get(1)
$p.each((elem) => console.log(elem.nodeName))
$p.on('click', () => alert('clicked'))
```

### 手写简易的ajax
```js
function ajax(url) {
    const p = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(
                        JSON.parse(xhr.responseText)
                    )
                } else if (xhr.status === 404 || xhr.status === 500) {
                    reject(new Error('404 not found'))
                }
            }
        }
        xhr.send(null)
    })
    return p
}

const url = '/data/test.json'
ajax(url)
.then(res => console.log(res))
.catch(err => console.error(err))
```

### 手写防抖 debounce
```js
const input1 = document.getElementById('input1')
function debounce(fn, delay = 500) {
    // timer 是闭包中的
    let timer = null

    return function () {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn.apply(this, arguments)
            timer = null
        }, delay)
    }
}

input1.addEventListener('keyup', debounce(function (e) {
    console.log(e.target)
    console.log(input1.value)
}, 600))
```
### 手写节流 throttle
```js
const div1 = document.getElementById('div1')
function throttle(fn, delay = 100) {
    let timer = null

    return function () {
        if (timer) {
            return
        }
        timer = setTimeout(() => {
            fn.apply(this, arguments)
            timer = null
        }, delay)
    }
}

div1.addEventListener('drag', throttle(function (e) {
    console.log(e.offsetX, e.offsetY)
}))
```

### 手写深度比较 isEqual
```js
// 判断是否是对象或数组
function isObject(obj) {
    return typeof obj === 'object' && obj !== null
}
// 全相等（深度）
function isEqual(obj1, obj2) {
    if (!isObject(obj1) || !isObject(obj2)) {
        // 值类型（注意，参与 equal 的一般不会是函数）
        return obj1 === obj2
    }
    if (obj1 === obj2) {
        return true
    }
    // 两个都是对象或数组，而且不相等
    // 1. 先取出 obj1 和 obj2 的 keys ，比较个数
    const obj1Keys = Object.keys(obj1)
    const obj2Keys = Object.keys(obj2)
    if (obj1Keys.length !== obj2Keys.length) {
        return false
    }
    // 2. 以 obj1 为基准，和 obj2 一次递归比较
    for (let key in obj1) {
        // 比较当前 key 的 val —— 递归！！！
        const res = isEqual(obj1[key], obj2[key])
        if (!res) {
            return false
        }
    }
    // 3. 全相等
    return true
}
```

### 手写数组 flatern（数组拍平）
```js
function flat(arr) {
    // 验证 arr 中，还有没有深层数组 [1, 2, [3, 4]]
    const isDeep = arr.some(item => item instanceof Array)
    if (!isDeep) {
        return arr // 已经是 flatern [1, 2, 3, 4]
    }

    const res = Array.prototype.concat.apply([], arr);
    return flat(res) // 递归
}

const res = flat( [1, 2, [3, 4, [10, 20, [100, 200]]], 5] )
console.log(res)
```

### 冒泡排序
遍历整个数组，将数组的每一项与其后一项进行对比，如果不符合要求就交换位置，一共遍历n轮，n为数组的长度。n轮之后，数组得以完全排序。时间复杂度O(n^2)。
```js
function bubbleSort(arr) {
    //console.time('BubbleSort');
    // 获取数组长度，以确定循环次数。
    let len = arr.length;
    // 遍历数组len次，以确保数组被完全排序。
    for(let i=0; i<len; i++) {
        // 遍历数组的前len-i项，忽略后面的i项（已排序部分）。
        for(let j=0; j<len - 1 - i; j++) {
            // 将每一项与后一项进行对比，不符合要求的就换位。
            if(arr[j] > arr[j+1]) {//从小到大排序
                [arr[j+1], arr[j]] = [arr[j], arr[j+1]];
            }
        }
    }
    //console.timeEnd('BubbleSort');
    return arr;
}
```

### 快速排序
在数组中选取一个参考点（pivot），然后对于数组中的每一项，大于pivot的项都放到数组右边，小于pivot的项都放到左边，左右两边的数组项可以构成两个新的数组（left和right），然后继续分别对left和right进行分解，直到数组长度为1，最后合并（其实没有合并，因为是在原数组的基础上操作的，只是理论上的进行了数组分解）。
```js
function quickSort(arr) {
    // 当数组长度不大于1时，返回结果，防止callstack溢出。
    if(arr.length <= 1) return arr;
    return [
        // 递归调用quickSort，通过Array.prototype.filter方法过滤小于arr[0]的值，注意去掉了arr[0]以防止出现死循环。
        ...quickSort(arr.slice(1).filter(item => item < arr[0])),
        arr[0],
        ...quickSort(arr.slice(1).filter(item => item >= arr[0]))
    ];
}
```

### 链表（插入，删除，反转）
```js
//节点类
class Node{
    constructor(data){
        this.data = data
        this.next = null
    }
}
//链表类
class SinglyLinkedList{
    constructor(){
        this.head = new Node() //head指向头节点
    }
    //在链表组后添加节点
    add(data){
        let node = new Node(data)
        let current = this.head
        while(current.next){
            current = current.next
        }
        current.next = node
    }
    //添加到指定位置
    addAt(index, data){
        let node = new Node(data)
        let current = this.head
        let counter = 1
        while(current){
            if(counter === index){
                node.next = current.next
                current.next = node
            }
            current = current.next
            counter++
        }
    }
    //删除某个位置的节点
    removeAt(index){
        let current = this.head
        let counter = 1
        while(current.next){
            if(counter === index){
                current.next = current.next.next
            }
            current = current.next
            counter++
        }
    }
    //反转链表
    reverse(){
        let current = this.head.next
        let prev = this.head
        while(current){
            let next = current.next
            //反转：改变当前节点指针。若当前节点是第一个（即头节点后面的）节点，
            //则此节点的next为null，否则next指向他的上一个节点
            current.next = prev===this.head ? null : prev
            prev = current
            current = next
        }
        this.head.next = prev
    }
}
```

### 二叉树前中后遍历
![二叉树前中后遍历](https://github.com/lujiajian1/study-notes/blob/main/img/nodetree.png)
```js
// 二叉树的生成
function NodeTree(value){
    this.value = value;
    this.left = null;
    this.right = null;
}

let ta = new NodeTree('a');
let tb = new NodeTree('b');
let tc = new NodeTree('c');
let td = new NodeTree('d');
let te = new NodeTree('e');
let tf = new NodeTree('f');
let tg = new NodeTree('g');

ta.left = tb;
ta.right = tc;
tb.left = td;
tb.right = te;
tc.left = tf;
tc.right = tg;

// 形如上面的这个格式，ta被称为一颗二叉树。 满二叉树， 完全二叉树

// 二叉树的遍历，分为三种，前序遍历，中序遍历，后续遍历（使用回调）
/**
 * 二叉树的前序遍历
 * @param treeList
 * @returns {null}
 */
function treeFrontEach(treeList){
    if (!treeList || treeList.value === null) return null;
    console.log(treeList.value);
    treeFrontEach(treeList.left);
    treeFrontEach(treeList.right);
}

treeFrontEach(ta); 输出的结果 a b d e c f g

/**
 * 中序遍历
 * @param treeList
 * @returns {null}
 */
function treeMiddleEach(treeList){
    if (!treeList || treeList.value === null) return null;
    treeMiddleEach(treeList.left);
    console.log(treeList.value);
    treeMiddleEach(treeList.right);
}
treeMiddleEach(ta); 输出的结果 d b e a c f c g

/**
 * 后序遍历
 * @param treeList
 * @returns {null}
 */
function treeEndEach(treeList){
    if (!treeList || treeList.value === null) return null;
    treeEndEach(treeList.left);
    treeEndEach(treeList.right);
    console.log(treeList.value);
}

treeEndEach(ta); 输出结果 d e b f g c a
```

```js
//不使用回调

//前序遍历
const preorderTraversal = function(root) {
    const stack = [], res = []
    root && stack.push(root)
    // 使用一个栈stack，每次首先输出栈顶元素，也就是当前二叉树根节点，之后依次输出二叉树的左孩子和右孩子
    while(stack.length > 0) {
        let cur = stack.pop()
        res.push(cur.val)
        // 先入栈的元素后输出，所以先入栈当前节点右孩子，再入栈左孩子
        cur.right && stack.push(cur.right)
        cur.left && stack.push(cur.left)
    }
    return res
};
//中序遍历
 const inorderTraversal = function(root) {
    const res = [], stack = []
    let node = root;
    while (stack.length > 0 || node !== null) {
        // 这里用当前节点node是否存在，简化代码，
        if (node) {
            stack.push(node);
            node = node.left
        } else {
            node = stack.pop();
            res.push(node.val);
            node = node.right;
        }
    }
    return res;
};
//后序遍历
const postorderTraversal = function(root) {
    let stack = [], res = []
    root && stack.push(root)
    while(stack.length > 0) {
        let cur = stack.pop()
        res.push(cur.val)
        cur.left && stack.push(cur.left)
        cur.right && stack.push(cur.right)
    }
    return res.reverse()
};
```

### 请写出一个可以生成整形随机数数组(内部元素不重复)的函数，并可以根据参数设置随机数生成的范围和数量，例如：函数madeRandomList(a, b, c)，可以生成 [a, b] 范围内，长度为 c 的随机数数组。
```js
function madeRandomList(a, b, c){
    if (b - a + 1 < c) {
        alert('长度过长');
        return false;
    }
    let res = [];
    for (let i = 0; i<c;i++) {
        let randomNum = random();
        if (res.indexOf(randomNum) === -1) {
            res.push(randomNum);
        } else {
            i--;
        }
    }
    return res;
    function random(min = a, max = b) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
```

### [函数柯里化](https://www.jianshu.com/p/2975c25e4d71)
```js
//add(1)(2)(3) = 6;
//add(1, 2, 3)(4) = 10;
//add(1)(2)(3)(4)(5) = 15;
function add() {
    // 第一次执行时，定义一个数组专门用来存储所有的参数
    var _args = Array.prototype.slice.call(arguments);

    // 在内部声明一个函数，利用闭包的特性保存_args并收集所有的参数值
    var _adder = function() {
        _args.push(...arguments);
        return _adder;
    };

    // 利用toString隐式转换的特性，当最后执行时隐式转换，并计算最终的值返回
    _adder.toString = function () {
        return _args.reduce(function (a, b) {
            return a + b;
        });
    }
    return _adder;
}

add(1)(2)(3)                // 6
add(1, 2, 3)(4)             // 10
add(1)(2)(3)(4)(5)          // 15
add(2, 6)(1)                // 9
```

### DOM树的DFS(深度优先遍历)
```js
const parentDOM = document.querySelector('#container');
function  deepTravalSal(node){
	const nodes = [];
	const stack = [];
	if(node){
		stack.push(node);
		while(stack.length){
			const item = stack.pop();
			const len = item.children.length;
			nodes.push(item);
			for(let i = len - 1; i >= 0; i--){
				stack.push(item.children[i])
			}
		}
	}
	return nodes;
}
console.log(deepTravalSal(parentDOM));
```
### DOM树的BFS(广度优先遍历)
```js
const parentDOM = document.getElementById('container');
function breathTravalSal(node){
	const nodes = [];
	const queue = [];
	if(node){
		queue.push(node);
		while(queue.length){
			const item = queue.shift();
			nodes.push(item);
			for(const v of item.children){
				queue.push(v);
			}
		}
	}
	return nodes;
}
console.log(breathTravalSal(parentDOM));
```