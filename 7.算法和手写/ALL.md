## 算法概念
算法（Algorithm）， 是指解决问题的思想与方案，最终是为了解决现实问题服务的。
## 数据结构 
Data Structure，指计算机中存储、组织数据的方式。 例如链表、二叉树、堆栈、红黑树等。
## 算法复杂度 
不同算法也有优劣之分，如消耗时间的长短、占用内存的大小，这也就是我们常说的算法复杂 度。算法复杂度分为时间复杂度和空间复杂度。 
#### 时间复杂度 
Time Complexity，又叫时间复杂性，用来描述该算法的运行时间。常用大O符号表述，如 O(1)、O(n)等。常见的时间复杂度量级有： 
* 常数时间O(1)
* 对数时间O(logN)
* 线性时间O(n)
* 线性对数（准线性）时间O(nlogN)
* 平方时间O(n²)
* 立方时间O(n³) 
如访问数组中的某个下标的元素，时间复杂度就是O(1)；查找乱序数组中的最小值，时间复杂 度就是O(n)，二分搜索的时间复杂度就是O(logN)。 
相同大小的不同输入值仍可能造成算法的运行时间不同，因此时间复杂度又有三种场景区分：最 优情况的时间复杂度、最差情况的时间复杂度以及平均情况时间复杂度。通常情况下，某个算法 的时间复杂度，我们说的都是平均情况时间复杂度。
#### 空间复杂度
Space Complexity，描述该算法或程序运行所需要的存储空间大小。和时间复杂度一样，也常 用大O符号表述，如O(1)、O(n)等。
#### [位运算](https://juejin.cn/post/6900710763657166855?searchId=20241015114937C95E27017F9CC318B3BB)
* 按位非 NOT（~）：按位非的最终结果始终是对原数值取反并减一，~x = (-x) - 1，即 0 变为 -1，1 变为 -2，2变为 -3，以此类推。取整：~~3.14 == 3。
* 按位与 AND（&）：判断奇偶性 偶数 & 1 == 0  奇数 & 1 === 1。
* 按位或 OR（|）：取整 1.111 | 0 === 1  2.234 | 0 === 2。
* 按位异或 XOR（^）：判断整数部分是否相等 2.1 ^ 2.5 === 0  2.2 ^ 2.6 === 0  2.1 ^ 3.1 === 1。判断两数符号是否相同  (a ^ b) >= 0 === true。
* 左移（<<）：x << y 等同于 x * 2^y。
* 有符号右移（>>）：x >> y 等同于 x / 2^y。
* 无符号右移（>>>）：对于正数，无符号右移会给空位都补 0 ，不管符号位是什么，这样的话正数的有符号右移和无符号右移结果都是一致的，负数就不一样了，当把一个负数进行无符号右移时也就是说把负数的二进制码包括符号为全部右移，向右被移出的位被丢弃，左侧用0填充，由于符号位变成了 0，所以结果总是非负的。
## 冒泡排序
遍历整个数组，将数组的每一项与其后一项进行对比，如果不符合要求就交换位置，一共遍历 n 轮，n 为数组的长度。n 轮之后，数组得以完全排序。时间复杂度 O(n^2)。
```js
function bubbleSort(arr) {
  //console.time('BubbleSort');
  // 获取数组长度，以确定循环次数。
  let len = arr.length;
  // 遍历数组len次，以确保数组被完全排序。
  for (let i = 0; i < len; i++) {
    // 遍历数组的前len-i项，忽略后面的i项（已排序部分）。
    for (let j = 0; j < len - 1 - i; j++) {
      // 将每一项与后一项进行对比，不符合要求的就换位。
      if (arr[j] > arr[j + 1]) {
        //从小到大排序
        [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]];
      }
    }
  }
  //console.timeEnd('BubbleSort');
  return arr;
}
```
## 快速排序
在数组中选取一个参考点（pivot），然后对于数组中的每一项，大于 pivot 的项都放到数组右边，小于 pivot 的项都放到左边，左右两边的数组项可以构成两个新的数组（left 和 right），然后继续分别对 left 和 right 进行分解，直到数组长度为 1，最后合并（其实没有合并，因为是在原数组的基础上操作的，只是理论上的进行了数组分解）。
```js
//递归
function quickSort(arr) {
  // 当数组长度不大于1时，返回结果，防止callstack溢出。
  if (arr.length <= 1) return arr;
  return [
    // 递归调用quickSort，通过Array.prototype.filter方法过滤小于arr[0]的值，注意去掉了arr[0]以防止出现死循环。
    ...quickSort(arr.slice(1).filter((item) => item < arr[0])),
    arr[0],
    ...quickSort(arr.slice(1).filter((item) => item >= arr[0])),
  ];
}
//非递归
const quickSort1 = (arr) => {
  if (arr.length <= 1) {
    return arr;
  }
  //取基准点
  const midIndex = Math.floor(arr.length / 2);
  //取基准点的值，splice(index,1) 则返回的是含有被删除的元素的数组。
  const valArr = arr.splice(midIndex, 1);
  const midIndexVal = valArr[0];
  const left = []; //存放比基准点小的数组
  const right = []; //存放比基准点大的数组
  //遍历数组，进行判断分配
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < midIndexVal) {
      left.push(arr[i]); //比基准点小的放在左边数组
    } else {
      right.push(arr[i]); //比基准点大的放在右边数组
    }
  }
  //递归执行以上操作，对左右两个数组进行操作，直到数组长度为 <= 1
  return quickSort1(left).concat(midIndexVal, quickSort1(right));
};
const array2 = [5, 4, 3, 2, 1];
console.log("quickSort1 ", quickSort1(array2));
// quickSort1: [1, 2, 3, 4, 5]
```
## 二分
#### 二分查找
Binary Search，也称折半查找，它是一种效率较高的查找方法。但是，折半查找要求线性表必须采用顺序存储结构，而且表中元素按关键字有序排列。
```js
/**
 * 给定一个 n 个元素有序的（升序）整型数组 nums 和一个目标值 target ，写一个函数搜 索 nums 中的 target，如果目标值存在返回下标，否则返回 -1。
 * @param {number[]} nums
 * @param {number} target
 * @return {number} 
*/ 
var search = function(nums, target) { 
    let low = 0, high = nums.length-1;
    while(low<=high) { 
        const mid = (low + high)>>1;
        const num = nums[mid];
        if(num===target) { 
            return mid;
        } else if(num>target) {
            // 值在左边
            high = mid - 1;
        } else {
            // 值在右边
            low = mid + 1;
        } 
    }
    return -1;
};
```
#### 二分法插入排序
相关的还有二分法插入排序，简称二分排序，是在插入第i个元素时，对前面的0～i-1元素进行 折半，先跟他们中间的那个元素比，如果小，则对前半再进行折半，否则对后半进行折半，直到 left \< right，然后再把第i个元素前1位与目标位置之间的所有元素后移，再把第i个元素放在目标 位置上。 动态规划经常会用到二分思想来做优化。
```js
// 给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数 组中，返回它将会被按顺序插入的位置。 请必须使用时间复杂度为 O(log n) 的算法。
var searchInsert = function(nums, target) {
    const n = nums.length;
    let left = 0, right = n - 1, ans = n;
    while (left <= right) {
        let mid = ((right - left) >> 1) + left;
        if (target <= nums[mid]) {
            ans = mid; right = mid - 1;
        } else {
            left = mid + 1;
        } 
    }
    return ans;
};
```
## 递推
递推是按照一定的规律来计算序列中的每个项，通常是通过计算前面的一些项来得出序列中的指定项的值。其思想是把一个复杂的庞大的计算过程转化为简单过程的多次重复，该算法利用了计算机速度快和不知疲倦的机器特点。
#### 递推关系式
递推关系（Recurrence relation），在数学上也就是差分方程（Difference equation），是一种递推地定义一个序列的方程：序列的每一项目是定义为前若干项的函数。像斐波那契数即为递推关系：
```math
\chi _{n+2} = \chi _{n=1} + \chi _{n}
```
#### 与递归的区别
Recursion，指程序调用自身的编程技巧。有递推使用上有一定的交叉点。
```js
/**
 * 斐波那契数列
 * 写一个函数，输入 n ，求斐波那契（Fibonacci）数列的第 n 项（即 F(N)）。斐波那契数列的 定义如下： F(0) = 0, F(1) = 1 F(N) = F(N - 1) + F(N - 2), 其中 N > 1。斐波那契数列由 0 和 1 开始，之 后的斐波那契数就是由之前的两数相加而得出。 答案需要取模 1e9+7（1000000007），如计算初始结果为：1000000008，请返回 1。
 * @param {number} n 
 * @return {number}
*/
var fib = function(n) {
    const arr = [0, 1];
    for(let i=2; i<=n; i++) {
        arr[i] = arr[i-1] + arr[i-2];
        arr[i] %= (1e9+7);
    }
    return arr[n];
}
```
```js
/**
 * 爬楼梯
 * 假设你正在爬楼梯。需要 n 阶你才能到达楼顶。 每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？
 * @param {number} n
 * @return {number} 
*/ 
var climbStairs = function(n) {
    if(n<=3) {
        return n;
    }
    // n>=4 
    //return climbStairs(n-1) + climbStairs(n-2)
    let a = [0, 1, 2, 3];
    for(let i=4; i<n; i++) {
        a[i] = a[i-1] + a[i-2];
    }
    return a[n-1] + a[n-2];
};
```
```c++
/**
 * 放苹果
 * 把M个同样的苹果放在N个同样的盘子里，允许有的盘子空着不放，问共有多少种不同的分法？ （用K表示）5，1，1和1，5，1 是同一种分法。 1<=M，N<=10。
*/
// 简版
#include <iostream>
using namespace std;
int recursion(int m, int n) {//m个苹果， n个盘子 [1,10]
    if(m<0) return 0;
    if(m==0 || n==1) return 1;
    // 1. 每个盘子放置一个苹果
    // 2. 1个盘子空着，也就是m个苹果放到n-1个盘子里
    return recursion(m-n, n) + recursion(m, n-1); 
}
int main() {
    int t;
    int m, n;
    cin>>t;//[0,20]
    while(t--) {
        cin>>m>>n;
        cout<<dp(m, n)<<endl;
    }
    return 0;
}
```
```c++
// 优化版
#include <iostream>
using namespace std;
int recursion(int m, int n) {//m个苹果， n个盘子 [1,10]
    if(m==1 || n==1) return 1;
    if(n>m) n = m;
    //1个和2个盘子的方法
    int k = 1 + (m>>1);
    // i个盘子，逐个递加
    for(int i=3; i<=n; i++) {
        if(m==i) k++;
        else k += recursion(m-n, i);
    }
    return k;
}
int main() {
    int t;
    int m, n;
    cin>>t;//[0,20]
    while(t--) {
        cin>>m>>n;
        cout<<recursion(m, n)<<endl;
    }
    return 0;
}
```
#### 递推套路总结 
遇到大数据量的题，不知道从哪里下手，通常离不开递归与递推公式。 
原则：大事化小小事化了
1. 找隐藏条件，理解题意。 
2. 找极值，比如0或者1的情况下结果是多少。 
3. 拆解找规律，写公式，（缩小数据范围）。
f(m,n) = f(m-n, n) + f(m, n-1) 
1. 所有盘子放满了，f(m-n, n) 
2. 有1个盘子空着，f(m, n-1)
## 动态规划
Dynamic Programming，简称DP，是一种在数学、管理科学、计算机科学、经济学和生物信息学中使用的，通过把原问题分解为相对简单的子问题的方式求解复杂问题的方法。通常会有暴力解决以及优化解决方案，二者用时差别较大。
#### 与递推、递归
动态规划，通常离不开递推公式、递归。
#### 与数学
求值单个数值的dp题，通常会有数学公式求解法，当然这个需要较高的数学功底，这个通常在竞赛中常见，但是面试一般不做要求，面试中更多考察dp的优化版解法。
#### 动态规划解题套路
1. 大事化小：其实就是把大问题拆解成小问题，多会用到递归。其实就是求状态转移方程。
2. 小事化了：设置边界条件或者求初始值，如n=0时，答案值？
3. 优化：记忆求值、有效求值等：暴力求解时间复杂度通常 \>=O(n^2)。因此经常需要优化，记忆求值经常用到数组和Map，有效求值经常用到二分查找。
```js
/**
 * 使用最小花费爬楼梯 https://leetcode.cn/problems/min-cost-climbing-stairs/
 * 给你一个整数数组 cost ，其中 cost[i] 是从楼梯第 i 个台阶向上爬需要支付的费用。一旦你支 付此费用，即可选择向上爬一个或者两个台阶。 你可以选择从下标为 0 或下标为 1 的台阶开始爬楼梯。 请你计算并返回达到楼梯顶部的最低花费。
*/
var minCostClimbingStairs = function (cost) {
    const len = cost.length;
    let prev = 0, current = 0, next;
    for (let i = 2; i <= len; i++) {
        next = Math.min(current + cost[i - 1], prev + cost[i - 2]);
        prev = current;
        current = next;
    }
    return current;
};
```
```js
/**
 * 买卖股票的最佳时机 https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/
*/
var maxProfit = function (prices) {
    let max = 0;
    const len = prices.length;
    let minPrice = prices[0]; // 记录最低点
    for (let i = 1; i < len; i++) {
        // 遍历每一天
        if (prices[i] < minPrice) { 
            minPrice = prices[i];
        } else {
            // 可以卖出
            max = Math.max(max, prices[i] - minPrice);
        }
    }
    return max;
};
```
```js
/**
 * 最长公共子序列 https://leetcode.cn/problems/qJnOS7/
*/
var longestCommonSubsequence = function (text1, text2) {
    const m = text1.length;
    const n = text2.length;
    const dp = [new Array(n + 1).fill(0)];
    for (let i = 1; i <= m; i++) {
        const c1 = text1[i - 1];
        dp[i] = [0];
        for (let j = 1; j <= n; j++) {
            const c2 = text2[j - 1];
            if (c1 === c2) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        } 
    }
    return dp[m][n];
};
```
```js
/**
 * 最长递增子序列 https://leetcode.cn/problems/longest-increasing-subsequence/
*/
// 暴力解
var lengthOfLIS = function(nums) {
    let n = nums.length;
    if(n<=1){
        return n;
    }
    let max = 1;
    let dp = new Array(n).fill(1);
    for(let i=1; i<n; i++){
        for(let j=i-1; j>=0; j--){
            if(nums[i]>nums[j]){
                dp[i] = Math.max(dp[j]+1, dp[i]);
            }
        }
        max = Math.max(dp[i], max);
    }
    return max;
};
// 二分优化
var lengthOfLIS = function (nums) {
    let n = nums.length;
    if (n <= 1) {
        return n;
    }
    let len = 1;
    let dp = [null, nums[0]];
    for (let i = 1; i < n; i++) {
        if (dp[len] < nums[i]) {
            dp[++len] = nums[i];
            continue;
        }
        // 否则去dp中二分查找，判读插入位置
        let left = 1, right = len, mid, pos = 0; 
        while (left <= right) {
            mid = (left + right) >> 1;
            if (nums[i] > dp[mid]) {
                // 元素在右边
                left = mid + 1;
                pos = mid;
            } else {
                right = mid - 1;
            }
        }
        dp[pos + 1] = nums[i];
    }
    return len;
};
```
![最长递增子序列](https://github.com/lujiajian1/study-notes/blob/main/img/lengthOfLIS1.jpg)
![最长递增子序列](https://github.com/lujiajian1/study-notes/blob/main/img/lengthOfLIS2.jpg)
```js
/**
 * 鸡蛋掉落-两枚鸡蛋 https://leetcode.cn/problems/egg-drop-with-2-eggs-and-n-floors/
 * https://mp.weixin.qq.com/s/qYOi0DeHo_OLmI7GHAAa2w
*/
var twoEggDrop = function(n) {
    // dp[i][j]代表有i+1个鸡蛋，共j层楼，得到f需要的最小操作次数
    // const dp = [0, 1, 2, ]
    const dp = [[],[]]
    dp[0][0] = dp[1][0] = 0；
    for(let j=0; j<=n; j++) {
        dp[0][j] = j;
    }
    for(let j=1; j<=n; j++) {
        for(let k=1; k<=j; k++) {
            if(isNaN(dp[1][j])) {
                dp[1][j] = Math.max(dp[0][k - 1] + 1, dp[1][j-k] + 1);
            } else {
                dp[1][j] = Math.min(dp[1][j], Math.max(dp[0][k - 1] + 1, d p[1][j-k] + 1));
            }
        }
    }
    return dp[1][n]
};
```
```js
/**
 * 鸡蛋掉落 https://leetcode.cn/problems/super-egg-drop/
 * @param {number} k 个鸡蛋，n层楼
 * @param {number} n 层楼
 * @return {number}
*/
var superEggDrop = function(k, n) {
    const memo = new Map()
    return dp(k, n)
    function dp(k, n){
        if(!(memo.has(n*100+k))) {
            // 计算
            let ans = null
            if(k===0||n===0) {
                ans = 0
            } else if(k===1) {
                ans = n
            } else if(n===1) {
                ans = 1
            } else {
                // 二分查找最优的x
                let low = 1, high = n, ans1, ans2
                while(low+1<high){
                    let x = (low + high) >> 1
                    ans1 = dp(k-1, x-1)
                    ans2 = dp(k, n-x)
                    if(ans1<ans2) {
                        low = x
                    } else if(ans1>ans2) {
                        high = x
                    } else {
                        low = high = x
                    }
                }
                ans1 = Math.max(dp(k-1, low-1), dp(k ,n-low))
                ans2 = Math.max(dp(k-1, high-1), dp(k ,n-high))
                ans = 1 + Math.min(ans1, ans2)
            }
            memo.set(n*100+k, ans)
        }
        return memo.get(n*100+k)
    }
}
```
## 栈与队列
stack，又叫堆栈。一种运算受限的线性表。限定仅在表尾进行插入和删除操作的线性表。常见 操作：进栈、出栈。
队列是一种特殊的线性表，特殊之处在于它只允许在表的前端进行删除操作，而在表的后端进行 插入操作，和栈一样，队列是一种操作受限制的线性表。 
队列是先进先出，栈是先进后出。
```js
/**
 * 有效括号 https://leetcode.cn/problems/valid-parentheses/
 * 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。有效字符串需满足：1.左括号必须用相同类型的右括号闭合。2.左括号必须以正确的顺序闭合。3.每个右括号都有一个对应的相同类型的左括号。
 * @param {string} s
 * @return {boolean}
*/
function isLeft (char) {
    return char === '(' || char === '[' || char === '{';
}
var isValid = function(s) {
    const len = s.length;
    if(len%2===1) {
        return false;
    }
    const stack = [ s[0] ];
    for(let i=1; i<len; i++) {
        let char = s[i];
        if(isLeft(char)) {
            stack.push(char);
            continue;
        }
        let prev = stack.pop();
        if((prev==='(' && char===')') || (prev==='[' && char===']') || (pr ev==='{' && char==='}')) {
            continue;
        } else {
            return false;
        }
    }
    return stack.length===0;
}
```
```js
/**
 * 最长有效括号 https://leetcode.cn/problems/longest-valid-parentheses/
 * 给你一个只包含 '(' 和 ')' 的字符串，找出最长有效（格式正确且连续）括号子串的长度。
 * @param {string} s
 * @return {number}
*/
var longestValidParentheses = function(s) {
    let len = s.length;
    if(len<=1) {
        return 0;
    }
    let maxlen = 0;
    const stack = [-1];
    for(let i=0;i<len;i++) {
        if(s[i]==='(') {
            stack.push(i);
        } else {
            stack.pop();
            let stack_len = stack.length;
            if(stack_len===0) {
                stack.push(i);
            } else {
                maxlen = Math.max(maxlen, i - stack[stack_len-1]);
            }
        }
    }
    return maxlen;
};
```
```js
/**
 * 函数的独占时间 https://leetcode.cn/problems/exclusive-time-of-functions/
*/
var exclusiveTime = function(n, logs) {
    const len = logs.length;
    const res = new Array(n).fill(0);
    const stack = [];
    let s = logs[0].split(':');
    let prev = s[0];
    let i = 1;
    stack[0] = s[0];
    while(i<len) {
        s = logs[i].split(':');
        if(s[1]==='start') {
            res[ stack[stack.length-1] ] += s[2] - prev;
            stack.push(s[0]) prev = s[2];
        } else {
            const tem = stack.pop();
            res[tem] += s[2] - prev + 1;
            prev = s[2] - 0 + 1;
        }
        i++;
    }
    return res;
}
```
```js
/**
 * 用两个栈实现队列 https://leetcode.cn/problems/yong-liang-ge-zhan-shi-xian-dui-lie-lcof/
*/
var CQueue = function() {
    this.inStack = [];
    this.outStack = [];
};
/** 
 * @param {number} value
 * @return {void}
*/
CQueue.prototype.appendTail = function(value) {
    this.inStack.push(value)
};
/**
 * @return {number}
*/
CQueue.prototype.deleteHead = function() {
    if (this.outStack.length===0) {
        if (this.inStack.length===0) {
            return -1;
        } else {
            this.in2out();
        }
    }
    return this.outStack.pop();
};
CQueue.prototype.in2out = function() {
    while (this.inStack.length) {
        this.outStack.push(this.inStack.pop());
    }
};
```
## 线性表
Linear List，是n个数据元素的有限序列。
在数据结构逻辑层次上细分，线性表可分为一般线性表和受限线性表。一般线性表也就是我们通 常所说的“线性表”，可以自由的删除或添加结点。受限线性表主要包括栈和队列，受限表示对 结点的操作受限制。
我们说“线性”和“非线性”，只在逻辑层次上讨论，而不考虑存储层次，所以双向链表和循环链 表依旧是线性表。
#### 存储结构
顺序表：是在计算机内存中以数组的形式保存的线性表，是指用一组地址连续的存储单元依次存储数据元 素的线性结构，使得线性表中在逻辑结构上相邻的数据元素存储在相邻的物理存储单元中，即通 过数据元素物理存储的相邻关系来反映数据元素之间逻辑上的相邻关系。
链表：Linked list，是一种线性表，但是并不会按线性的顺序存储数据，而是在每一个节点里存到下一 个节点的指针(Pointer)。由于不必须按顺序存储，链表在插入的时候可以达到O(1)的复杂度，比 另一种线性表顺序表快得多，但是查找一个节点或者访问特定编号的节点则需要O(n)的时间，而 顺序表相应的时间复杂度分别是O(logn)和O(1)。
使用链表结构可以克服数组链表需要预先知道数据大小的缺点，链表结构可以充分利用计算机内 存空间，实现灵活的内存动态管理。但是链表失去了数组随机读取的优点，同时链表由于增加了 结点的指针域，空间开销比较大。
单链表：即单向链表，特点是链表的链接方向是单向的，对链表的访问要通过从头部开始，依序往下读 取。React中有个典型的应用场景就是Fiber children。
双链表：即双向链表，它的每个数据结点中都有两个指针，分别指向直接后继和直接前驱。所以，从双向 链表中的任意一个结点开始，都可以很方便地访问它的前驱结点和后继结点。
循环链表：最后一个结点指向头结点，形成一个环。因此，从循环链表中的任何一个结点出发都能找到任何其他结点。循环链表的操作和单链表的操 作基本一致，差别仅仅在于算法中的循环条件有所不同。循环链表根据单向与双向，又可以分为单向循环链表与双向环形链表。
![链表](https://github.com/lujiajian1/study-notes/blob/main/img/linked.jpg)
```js
/**
 * 两数相加 https://leetcode.cn/problems/add-two-numbers/
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
*/
var addTwoNumbers = function(l1, l2) {
    let current1 = l1, current2 = l2;
    let tem = 0;
    let res = cur = {next: null};
    while(current1!=null || current2!=null) {
        let sum = 0;
        if(current1 && current1.val) {
            sum += current1.val;
        }
        if(current2 && current2.val) {
            sum += current2.val;
        }
        sum += tem;
        tem = Math.floor(sum/10);
        cur.next = {
            val: sum % 10,
            next: null
        }
        cur = cur.next
        if(current1) {
            current1 = current1.next;
        }
        if(current2) {
            current2 = current2.next;
        }
    }
    if(tem!==0) {
        cur.next = {
            val: tem,
            next: null
        }
    }
    return res.next;
};
```
```js
/**
 * 反转链表 https://leetcode.cn/problems/reverse-linked-list-ii/
 * @param {ListNode} head
 * @param {number} left
 * @param {number} right
 * @return {ListNode}
*/
var reverseBetween = function(head, left, right) {
    let prev = dummyNode = {next: head};
    for(let i=0; i<left-1; i++ ) {
        prev = prev.next;
    }
    let cur = prev.next;
    for(let i=0; i<right-left; i++ ) {
        const next = cur.next;
        cur.next = next.next;
        next.next = prev.next;
        prev.next = next;
    }
    return dummyNode.next;
};
```
```js
/**
 * 合并K个升序链表 https://leetcode-cn.com/problems/merge-k-sorted-lists/
 * @param {ListNode[]} lists
 * @return {ListNode}
*/
var mergeKLists = function(lists) {
    const k = lists.length;
    if(k==0) {
        return null;
    }
    if(k===1) {
        return lists[0];
    }
    let dummyNode = current = {next: null};
    let min;
    let minI;
    const a = new Array(k).fill(0);
    while(1) {
        if(a.reduce((x,y)=>x+y)===k) {
            break;
        }
        minI = 0;
        min = Math.pow(-10, 4) - 1;
        for(let i=0; i<k; i++) {
            if(a[i]===1) {
                continue;
            }
            let cur = lists[i];
            if(cur==null) {
                a[i] = 1;
                continue;
            }
            if(min>cur.val) {
                min = cur.val;
                minI = i;
            }
        }
        if(min!==Math.pow(-10, 4) - 1) {
            current.next = lists[minI];
            current = current.next;
            lists[minI] = lists[minI].next;
            if(lists[minI]==null) {
                a[minI] = 1;
            }
        }
    }
    return dummyNode.next;
};
```
## 哈希表
哈希表：也叫做散列表。是根据关键字和值（Key-Value）直接进行访问的数据结构。也就是说，它通过关键字 key 和一个映射函数 Hash(key) 计算出对应的值 value，然后把键值对映射到表中一个位置来访问记录，以加快查找的速度。这个映射函数叫做哈希函数（散列函数），用于存放记录的数组叫做 哈希表（散列表）。 哈希表的关键思想是使用哈希函数，将键 key 和值 value 映射到对应表的某个区块中。可以将算法思想分为两个部分：
* 向哈希表中插入一个关键字：哈希函数决定该关键字的对应值应该存放到表中的哪个区块，并将对应值存放到该区块中
* 在哈希表中搜索一个关键字：使用相同的哈希函数从哈希表中查找对应的区块，并在特定的区块搜索该关键字对应的值
![哈希表](https://github.com/lujiajian1/study-notes/blob/main/img/hash.jpg)
```js
/**
 * LRU 缓存 https://leetcode.cn/problems/lru-cache/
*/
/**
 * @param {number} capacity
*/
var LRUCache = function(capacity) {
    this.map = new Map();
    this.capacity = capacity;
};
/**
 * @param {number} key
 * @return {number}
*/
LRUCache.prototype.get = function(key) {
    let value = this.map.get(key)
    if(value!==undefined) {
        this.map.delete(key)
        this.map.set(key, value)
        return value
    }
    return -1
};
/**
 * @param {number} key
 * @param {number} value
 * @return {void}
*/
LRUCache.prototype.put = function(key, value) {
    if(this.map.has(key)) {
        this.map.delete(key)
    }
    // 检查是否超载
    if(this.capacity===this.map.size) {
        const {value: key} = this.map.keys().next()
        this.map.delete(key)
    }
    this.map.set(key, value)
};
```
## 双指针
从广义上来说，是指用两个变量在线性结构上遍历而解决的问题。狭义上说，
* 对于数组，指两个变量在数组上相向移动解决的问题，如二分；
* 对于链表，指两个变量在链表上同向移动解决的问题，也称为「快慢指针」问题。 
双指针算法通常不难，通常是基于暴力解法的优化。
```js
/**
 * 环形链表 https://leetcode-cn.com/problems/linked-list-cycle/
 * @param {ListNode} head
 * @return {boolean}
*/
// 哈希解法
var hasCycle = function(head) {
    const s = new Set();
    let current = head;
    while(current) {
        if(s.has(current)) {
            return true;
        }
        s.add(current);
        current = current.next;
    }
    return false;
};
// 快慢指针解法
var hasCycle = function(head) {
    if(head===null || head.next===null) {
        return false;
    }
    let slow = head, fast = head.next;
    while(slow!==fast) {
        if(fast===null || fast.next===null) {
            return false;
        }
        slow = slow.next;
        fast = fast.next.next;
    }
    return true;
};
```
```js
/**
 * 环形链表II https://leetcode.cn/problems/linked-list-cycle-ii/
 * @param {ListNode} head
 * @return {ListNode}
*/
// 哈希
var detectCycle = function(head) {
    const record = new Set();
    while(head) {
        if(record.has(head)) {
            return head;
        }
        record.add(head);
        head = head.next;
    }
    return null;
};
// 快慢指针解法
var detectCycle = function(head) {
    if(head===null || head.next===null){
        return null;
    }
    let slow = head, fast = head;
    while(fast) {
        slow = slow.next;
        if(fast.next) {
            fast = fast.next.next;
        } else {
            return null;
        }
        if(fast===slow) {
            let cur = head;
            while(cur!==slow) {
                cur = cur.next;
                slow = slow.next;
            }
            return cur;
        }
    }
    return null;
};
```
```js
/**
 * 三数之和 https://leetcode.cn/problems/3sum/
 * @param {number[]} nums
 * @return {number[][]}
*/
var threeSum = function(nums) {
    const res = [];
    const len = nums.length;
    if(len<3) {
        return res;
    }
    // a + b + c = 0
    // a<=0
    nums.sort((a,b)=>a-b);
    for(let first=0; first<len-2; first++) {
        if(nums[first]>0) {
            break;
        }
        if(first>0 && nums[first]===nums[first-1] ) {
            continue;
        }
        let third = len-1;
        for(let second=first+1; second<len-1; second++) {
            if(second>first+1 && nums[second]===nums[second-1] ) {
                continue;
            }
            while((second<third) && (nums[first]+nums[second]+nums[third]> 0) ) {
                third--;
            }
            if(second===third) {
                break;
            }
            if(nums[first]+nums[second]+nums[third]===0) {
                res.push([nums[first], nums[second], nums[third]]);
            }
        }
    }
    return res;
};
```
```js
/**
 * 盛最多水的容器 https://leetcode.cn/problems/container-with-most-water/
 * @param {number[]} height
 * @return {number}
*/
var maxArea = function(height) {
    let ans = 0
    let left = 0, right = height.length-1
    while(left<right) {
        let area = (right-left) * Math.min(height[left], height[right])
        ans = Math.max(area, ans)
        if(height[left]<=height[right]) {
            left++
        } else {
            right--
        }
    }
    return ans
};
```
```js
/**
 * 接雨水 https://leetcode.cn/problems/trapping-rain-water/
 * @param {number[]} height
 * @return {number}
*/
var trap = function(height) {
    let ans = 0;
    let left = 0, right = height.length - 1;
    let leftMax = 0, rightMax = 0;
    while(left<right) {
        leftMax = Math.max(leftMax, height[left]);
        rightMax = Math.max(rightMax, height[right]);
        if(height[left]<height[right]) {
            ans += leftMax-height[left];
            left ++;
        } else {
            ans += rightMax-height[right];
            right--;
        }
    }
    return ans;
};
```
## 二叉树
#### 资源
[LeetCode介绍](https://leetcode.cn/tag/tree/problemset/)
[维基百科](https://zh.m.wikipedia.org/zh-hans/树_(数据结构))
#### 树
tree，是一种抽象数据类型（ADT）或是实作这种抽象数据类型的数据结构，用来模拟具有树状 结构性质的数据集合。它是由n（n>0）个有限节点组成一个具有层次关系的集合。把它叫 做“树”是因为它看起来像一棵倒挂的树，也就是说它是根朝上，而叶朝下的。它具有以下的特点：
* 每个节点都只有有限个子节点或无子节点；
* 没有父节点的节点称为根节点；
* 每一个非根节点有且只有一个父节点；
* 除了根节点外，每个子节点可以分为多个不相交的子树；
* 树里面没有环路(cycle)。
![树](https://github.com/lujiajian1/study-notes/blob/main/img/tree.jpg)
#### 常见术语
1. 节点的度：一个节点含有的子树的个数称为该节点的度；
2. 树的度：一棵树中，最大的节点度称为树的度；
3. 叶节点或终端节点：度为零的节点；
4. 非终端节点或分支节点：度不为零的节点；
5. 父亲节点或父节点：若一个节点含有子节点，则这个节点称为其子节点的父节点；
6. 孩子节点或子节点：一个节点含有的子树的根节点称为该节点的子节点；
7. 兄弟节点：具有相同父节点的节点互称为兄弟节点；
8. 节点的层次（深度、高度)：从根开始定义起，根为第1层，根的子节点为第2层，以此类 推；
9. 深度： 对于任意节点n,n的深度为从根到n的唯一路径长，根的深度为0；
10. 堂兄弟节点：父节点在同一层的节点互为堂兄弟；
11. 节点的祖先：从根到该节点所经分支上的所有节点；
12. 子孙：以某节点为根的子树中任一节点都称为该节点的子孙。
13. 森林：由m（m>=0）棵互不相交的树的集合称为森林；
#### 树的种类
* 无序树：树中任意节点的子节点之间没有顺序关系，这种树称为无序树，也称为自由树。
* 有序树：树中任意节点的子节点之间有顺序关系，这种树称为有序树；
    * 二叉树：每个节点最多含有两个子树的树称为二叉树；
        * 完全二叉树：对于一棵二叉树，假设其深度为d（d>1）。除了第d层外，其它各层的 节点数目均已达最大值，且第d层所有节点从左向右连续地紧密排列，这样的二叉树 被称为完全二叉树；
        * 满二叉树：所有叶节点都在最底层的完全二叉树；
        * 平衡二叉树（AVL树）：当且仅当任何节点的两棵子树的高度差不大于1的二叉树；
        * 排序二叉树(二叉查找树（英语：Binary Search Tree))：也称二叉搜索树、有序二叉 树；
    * 霍夫曼树、哈夫曼树：带权路径最短的二叉树称为哈夫曼树或最优二叉树；
    * B树：一种对读写操作进行优化的平衡查找树。
#### 二叉树
是指树中节点的度不大于2的有序树，它是一种最简单且最重要的树。
#### 满二叉树
除最后一层无任何子节点外，每一层上的所有结点都有两个子结点的二叉树。 从图形形态上看，满二叉树外观上是一个三角形。 如果一个二叉树的层数为K，且结点总数是(2^k) -1 ，则它就是满二叉树。 
![树](https://github.com/lujiajian1/study-notes/blob/main/img/tree1.jpg)
注意： 关于满二叉树定义这里，国内外定义有分歧，本文采用的是国内定义。满二叉树英文是 Full Binary Tree，是指所有的节点的度只能是0或者2。 如下图，国外也认为是Full Binary Tree：
![树](https://github.com/lujiajian1/study-notes/blob/main/img/tree2.jpg)
而对于我们本文所说的满二叉树，国外的概念叫完美二叉树。
#### 完全二叉树
一棵深度为k的有n个结点的二叉树，对树中的结点按从上至下、从左到右的顺序进行编号，如 果编号为i（1≤i≤n）的结点与满二叉树中编号为i的结点在二叉树中的位置相同，则这棵二叉树 称为完全二叉树。叶子结点只可能在最大的两层出现。
#### 最小堆
是一种经过排序的完全二叉树，其中任一非终端节点的数据值均不大于其左子节点和右子节点的 值。
![树](https://github.com/lujiajian1/study-notes/blob/main/img/tree3.jpg)
#### 最大堆
最大值在根节点，任意节点值总是大于该子树的最大值，而最小堆则相反
```js
/**
 * 二叉树的最大深度 https://leetcode.cn/problems/maximum-depth-of-binary-tree/
*/
var maxDepth = function(root) {
    if(root===null) {
        return 0;
    }
    return 1 + Math.max( maxDepth(root.left), maxDepth(root.right));
};
```
```js
/**
 * 数据流中的第K大元素
*/
var KthLargest = function(k, nums) {
    this.k = k;
    this.heap = new MinHeap();
    for (const x of nums) {
        this.add(x);
    }
};

KthLargest.prototype.add = function(val) {
    this.heap.offer(val);
    if (this.heap.size() > this.k) {
        this.heap.poll();
    }
    return this.heap.peek();
};

class MinHeap {
    constructor(data = []) {
        this.data = data;
        this.comparator = (a, b) => a - b;
        this.heapify();
    }

    heapify() {
        if (this.size() < 2) return;
        for (let i = 1; i < this.size(); i++) {
        this.bubbleUp(i);
        }
    }

    peek() {
        if (this.size() === 0) return null;
        return this.data[0];
    }

    offer(value) {
        this.data.push(value);
        this.bubbleUp(this.size() - 1);
    }

    poll() {
        if (this.size() === 0) {
            return null;
        }
        const result = this.data[0];
        const last = this.data.pop();
        if (this.size() !== 0) {
            this.data[0] = last;
            this.bubbleDown(0);
        }
        return result;
    }

    bubbleUp(index) {
        while (index > 0) {
            const parentIndex = (index - 1) >> 1;
            if (this.comparator(this.data[index], this.data[parentIndex]) < 0) {
                this.swap(index, parentIndex);
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    bubbleDown(index) {
        const lastIndex = this.size() - 1;
        while (true) {
            const leftIndex = index * 2 + 1;
            const rightIndex = index * 2 + 2;
            let findIndex = index;
            if (
                leftIndex <= lastIndex &&
                this.comparator(this.data[leftIndex], this.data[findIndex]) < 0
            ) {
                findIndex = leftIndex;
            }
            if (
                rightIndex <= lastIndex &&
                this.comparator(this.data[rightIndex], this.data[findIndex]) < 0
            ) {
                findIndex = rightIndex;
            }
            if (index !== findIndex) {
                this.swap(index, findIndex);
                index = findIndex;
            } else {
                break;
            }
        }
    }

  swap(index1, index2) {
        [this.data[index1], this.data[index2]] = [this.data[index2], this.data[index1]];
    }

    size() {
        return this.data.length;
    }
}
```

