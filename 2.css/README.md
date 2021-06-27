### CSS

* at-rules（css@规则）
    * @charset
    * @import
    * @media(重要)
    * @page
    * @counter-style
    * @keyframes(重要)
    * @fontface(重要)
    * @supports(不推荐)
    * @namespace
* rule（CSS普通规则）
    * 选择器（Selector）
        * selector_group
        * selector
            * \> (子元素)
            * \<sp\> (空格，后代选择器)
            * \+ (相邻兄弟选择器)
            * \~ (普通兄弟选择器)
            * ||
        * simple_selector
            * type (div|a)
            * \* (全部)
            * \. (clas)
            * \# (id)
            * \[\] (属性选择器)
            * : (伪类)
                * :any-link
                * :link:visited
                * :hover
                * :active
                * :focus
                * :target (选取当前活动的目标元素)
                * :empty (选择没有子元素的元素)
                * :nth-child(n) ( 匹配父元素下指定子元素，在所有子元素中排序第n)
                * :nth-last-child()
                * :first-child:last-child:only-child
                * :not(selector) (选择除 selector 元素意外的元素)
                * :where:has
                * :root (选择文档的根元素，等同于html元素)
            * :: (伪元素选择器)
                * ::before
                * ::after
                * ::first-line
                * ::first-letter
    * 声明（Declaration）
        * Key
            * Properties
            * Variables
        * Value
            * calc
            * number
            * length
            * ......

### px，em，rem，vw，vh

### 常见的页面布局实现

* 两栏布局（边栏定宽主栏自适应）
* 三栏布局（两侧栏定宽主栏自适应）
* 多列等高布局
* 三行布局（头尾定高主栏自适应）

### 预处理器，如：less，sass，stylus语法

### 后处理器， 如： postCss

### CSS模块化（BEM，css-in-js）

### 响应式布局方案

### [css3新特性](https://juejin.cn/post/6844903518520901639#heading-13)

### [css性能](https://github.com/chokcoco/iCSS/issues/11)

### CSS排版（layout）技术

* 1代 正常流
* 2代 flex
* 3代 grid
* 3.5代 CSS Houdini

### float

###  BFC、IFC、GFC、FFC

### 视觉格式化模型

### 常见问题

#### 12px问题
```css
/* Chrome支持小于12px 的文字 */
.shrink {
    -webkit-transform: scale(0.8);
    -o-transform: scale(1);
    display: inilne-block;
}
```

#### 自定义属性

#### 1px边框解决方案

#### 清除浮动

#### 消除浏览器默认样式

#### 长文本处理

#### 水平垂直居中