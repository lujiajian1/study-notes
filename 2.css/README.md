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
                * :visited
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

### px，em，rem，vw，vh，vmax，vmin

* px：相对长度单位。像素px是相对于显示器屏幕分辨率而言的
* em：相对长度单位，相对于父元素设定font-size的尺寸
* rem：相对于根元素，常用语响应式布局
* vh：网页视口高度的 1 / 100
* vw：网页视口宽度的 1 / 100
* vmax 取两者最大值，vmin 取两者最小值

### 设置rem的方法

* media-query，根据不同屏幕宽度设置根元素font-size
* js根据设计稿和屏幕宽度设置根元素font-size

### 网页视口尺寸：
* window.screen.height // 屏幕高度
* window.innerHeight // 网页视口高度
* document.body.clientHeight // body 高度

### 常见的页面布局实现

* 两栏布局（边栏定宽主栏自适应）
* 三栏布局（两侧栏定宽主栏自适应）
* 多列等高布局
* 三行布局（头尾定高主栏自适应）

### 响应式布局方案
### CSS排版（layout）技术

* 1代 正常流
* 2代 flex
* 3代 grid
* 3.5代 CSS Houdini

### flex常用语法

* flex-direction：决定主轴的方向（即项目的排列方向）
    * row（默认值）：主轴为水平方向，起点在左端
    * row-reverse：主轴为水平方向，起点在右端
    * column：主轴为垂直方向，起点在上沿
    * column-reverse：主轴为垂直方向，起点在下沿
* justify-content：定义了项目在主轴上的对齐方式
    * flex-start（默认值）：左对齐
    * flex-end：右对齐
    * center： 居中
    * space-between：两端对齐，项目之间的间隔都相等
    * space-around：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍
* align-items：定义项目在交叉轴上如何对齐
    * flex-start：交叉轴的起点对齐
    * flex-end：交叉轴的终点对齐
    * center：交叉轴的中点对齐
    * baseline: 项目的第一行文字的基线对齐
    * stretch（默认值）：如果项目未设置高度或设为auto，将占满整个容器的高度
* flex-wrap：定义，如果一条轴线排不下，如何换行
    * nowrap（默认）：不换行
    * 换行，第一行在上方
    * wrap-reverse：换行，第一行在下方
* align-self：允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。默认值为auto，表示继承父元素的align-items属性，如果没有父元素，则等同于stretch
    * 该属性可能取6个值，除了auto，其他都与align-items属性完全一致


###  BFC、IFC、GFC、FFC

### 形成BFC的常见条件

Block formmat context，块级格式化上下文。它是一块独立的区域，内部元素的渲染不会影响边界以外的元素。
* float 不是 none
* position 是 absolute 或者 fixed
* overflow 不是 visible
* display 是 flex 或者 inline-block等

### 视觉格式化模型

### 预处理器，如：less，sass，stylus语法

### 后处理器， 如：postCss

### CSS模块化（BEM，css-in-js）

### line-height的继承问题

* 写具体数值，如30px， 则继承该值
* 写比例，如2/1.5,则继承该比例
* 写百分比，如200%，则继承计算出来的值

### 手写clearFloat

```css
.clear-float::after{
    content: '';
    display: table;
    clear: both;
}
```

### 12px问题
```css
/* Chrome支持小于12px 的文字 */
.shrink {
    -webkit-transform: scale(0.8);
    -o-transform: scale(1);
    display: inilne-block;
}
```
### margin负值问题

* margin-left和margin-top负值，元素向左和向上移动
* margin-right负值，右侧元素左移，自身不受影响
* margin-bottom负值，下方元素上移，自身不受影响

### 水平居中

* inine 元素: text-align: center
* block元素: margin: auto;
* absolute元素: left 50% + margin-left 负值
* display: flex, justify-content: center

### 垂直居中

* inline元素: line-height 的值等于height值
* absolute元素: top 50% +margin-top负值
* absolute元素: transform:translate(-50%, -50%)
* absolute元素: top, left, bottom, right = 0 + margin: auto
* display: flex; align-items: center;

### 1px边框解决方案

* 产生的原因是DPR（设备像素比，window.devicePixelRatio=物理像素 /CSS像素）
* IOS 8+，非安卓：border:0.5px solid #E5E5E5
* 使用边框图片：border-image: url('./../../image/96.jpg') 2 repeat;
* 使用box-shadow：0  -1px 1px -1px #e5e5e5, 
* 使用伪元素+缩放（-webkit-transform: scale(.5);）
```css
.border(
    @borderWidth: 1px; 
    @borderStyle: solid; 
    @borderColor: @lignt-gray-color; 
    @borderRadius: 0) {
    position: relative;
    &:before {
        content: '';
        position: absolute;
        width: 98%;
        height: 98%;
        top: 0;
        left: 0;
        transform-origin: left top;
        -webkit-transform-origin: left top;
        box-sizing: border-box;
        pointer-events: none;
    }
    @media (-webkit-min-device-pixel-ratio: 2) {
        &:before {
            width: 200%;
            height: 200%;
            -webkit-transform: scale(.5);
        }
    }
    @media (-webkit-min-device-pixel-ratio: 2.5) {
        &:before {
            width: 250%;
            height: 250%;
            -webkit-transform: scale(.4);
        }
    }
    @media (-webkit-min-device-pixel-ratio: 2.75) {
        &:before {
            width: 275%;
            height: 275%;
            -webkit-transform: scale(1 / 2.75);
        }
    }
    @media (-webkit-min-device-pixel-ratio: 3) {
        &:before {
            width: 300%;
            height: 300%;
            transform: scale(1 / 3);
            -webkit-transform: scale(1 / 3);
        }
    }
    .border-radius(@borderRadius);
    &:before {
        border-width: @borderWidth;
        border-style: @borderStyle;
        border-color: @borderColor;
    }
}

.border-all(
	@borderWidth: 1px; 
	@borderStyle: solid; 
	@borderColor: @lignt-gray-color; 
	@borderRadius: 0) {
    .border(@borderWidth; @borderStyle; @borderColor; @borderRadius);
}
```