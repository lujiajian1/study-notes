### CSS
* at-rules（css@规则）
    * [@charset](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@charset)（指定样式表中使用的字符编码）
    * [@import](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@import)（用于从其他样式表导入样式规则）
    * [@media](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media)（重要，媒体查询）
    * [@page](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@page)（用于在打印文档时修改某些CSS属性）
    * [@counter-style](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@counter-style)（可以自定义counter的样式）
    * [@keyframes](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@keyframes)（重要，可以控制动画序列的中间步骤）
    * [@font-face](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@font-face)（重要，指定一个用于显示文本的自定义字体）
    * [@supports](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@supports)（不推荐，指定依赖于浏览器中的一个或多个特定的CSS功能的支持声明）
    * [@namespace](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@namespace)（定义使用在CSS样式表中的XML命名空间的@规则）
* rule（CSS普通规则）
    * 选择器（Selector）
        * selector_group（组）
        ```css
        /* no grouping */
        h1 {color:blue;}
        h2 {color:blue;}
        h3 {color:blue;}
        h4 {color:blue;}
        h5 {color:blue;}
        h6 {color:blue;}
        /* grouping */
        h1, h2, h3, h4, h5, h6 {color:blue;}
        ```
        * selector
            * \> (子元素)
            * \<sp\> (空格，后代选择器)
            * \+ (相邻兄弟选择器)
            * \~ (普通兄弟选择器)
        * simple_selector
            * type (div|a)
            * \* (全部)
            * \. (clas)
            * \# (id)
            * \[\] (属性选择器)
            * : ([伪类](https://www.runoob.com/cssref/css-selectors.html))伪类是操作文档中已有的元素
                * :any-link
                * :visited（选择所有访问过的链接，a:visited）
                * :hover（选择鼠标在链接上面时，a:hover）
                * :active（选择活动链接，a:active）
                * :focus（选择具有焦点的输入元素，input:focus）
                * :target (选取当前活动的目标元素)
                * :empty (选择没有子元素的元素)
                * :nth-child(n) (匹配父元素下指定子元素，在所有子元素中排序第n)
                * :nth-last-child(n)（选择其父级的第n个子元素，从最后一个子项计数）
                * :first-child（匹配父元素下第一个子级的样式）
                * :last-child（匹配父元素下最后一个子级的样式）
                * :only-child（匹配父元素下唯一子元素）
                * :not(selector) (选择除 selector 元素意外的元素)
                * :root (选择文档的根元素，等同于html元素)
            * :: ([伪元素选择器](https://www.w3school.com.cn/css/css_pseudo_elements.asp))伪元素是创建了一个文档外的元素
                * ::before（在当前元素之前插入内容）
                * ::after（在当前元素之后插入内容）
                * ::first-line（选择当前元素的首行）
                * ::first-letter（选择当前元素的首字母）
    * 声明（Declaration）
        * Key
            * Properties（属性的名）
            * [Variables](http://www.ruanyifeng.com/blog/2017/05/css-variables.html)（变量）
            ```css
            body{
                --bg-color: lightblue;
                background-color: var(--bg-color);
            }
            ```
        * Value
            * calc（函数，width:calc(100% - 100px)）
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

### 网页视口尺寸：
* window.screen.height // 屏幕高度
* window.innerHeight // 网页视口高度
* document.body.clientHeight // body 高度

### [常见的页面布局实现](https://juejin.cn/post/7063066630422528030/)
* 两栏布局（边栏定宽主栏自适应）
* 三栏布局（两侧栏定宽主栏自适应）
* 多列等高布局
* 三行布局（头尾定高主栏自适应）

### [响应式布局方案](https://juejin.cn/post/6844903990669361165)
* 媒体查询
* 百分比%
* vw/vh
* rem
    * media-query，根据不同屏幕宽度设置根元素font-size
    * js根据设计稿和屏幕宽度设置根元素font-size
* 利用UI框架实现响应式布局（比如；elementUi的\<row\>\<col\>）

### 盒模型
就是用来装页面上的元素的矩形区域。CSS盒子模型组成：外边距（margin）、边框（border）、内边距（padding）、内容（content）。CSS 中的盒子模型包括 IE 盒子模型和标准的 W3C 盒子模型。W3C模型中：CSS中的宽（width）=内容（content）的宽，CSS中的高（height）=内容（content）的高。IE模型中：CSS中的宽（width）= 内容（content）的宽 +（border + padding）* 2，CSS中的高（height）= 内容（content）的高 +（border + padding）* 2。

### CSS排版（layout）技术
* 1代 正常流（放置盒的格式化上下文）
    * 行为：依次排列，排不下了换行。
        * 当遇到块级盒：排入块级格式化上下文，没有块格式化上下文，则创建一个
        * 当遇到行内级盒或者文字：首先尝试排入行内级格式化上下文，如果排不下，那么创建一个行盒，先将行盒排版（行盒是块级，由一行中所有的内联元素所组成，所以到第一种情况），行盒会创建一个行内级格式化上下文。
        * 遇到float：把盒的顶部跟当前行内级上下文上边缘对齐，然后根据float的方向把盒的对应边缘对到块级格式化上下文的边缘，之后重排当前行盒。
    * 原理：块级格式化上下文（Block Formatting Contexts）和行内级格式化上下文（Inline Formatting Contexts）
        * [BFC](https://blog.csdn.net/sinat_36422236/article/details/88763187)：块级排布，一个独立的布局环境，其中的元素布局是不受外界的影响
            * BFC布局规则
                * 内部的Box会在垂直方向，一个接一个地放置。
                * Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠。
                * 每个盒子（块盒与行盒）的margin box的左边，与包含块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。
                * BFC的区域不会与float box重叠。
                * BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。
                * 计算BFC的高度时，浮动元素也参与计算。
            * 设置方法
                * 根元素（<html>），这里就可以理解正常流的逻辑
                * float的值不是none
                * position 是 absolute 或者 fixed
                * display的值是inline-block、table-cell、flex、table-caption或者inline-flex
                * overflow 不是 visible
            * 应用
                * 避免外边距折叠
                * 清除浮动
                * 自适应两栏布局
        * IFC：行内排布，盒子在水平方向的 内外边距+边框 所占用的空间都会被考虑
* 2代 flex（弹性布局）
    * FFC(自适应格式上下文)
* 3代 grid
    * GFC(网格布局格式化上下文)
* 3.5代 [CSS Houdini](https://juejin.cn/post/6844903701971206158)

### [flex](https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)常用语法
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
    * wrap：换行，第一行在上方
    * wrap-reverse：换行，第一行在下方
* align-self：允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。默认值为auto，表示继承父元素的align-items属性，如果没有父元素，则等同于stretch
    * 该属性可能取6个值，除了auto，其他都与align-items属性完全一致

### [视觉格式化模型](https://juejin.cn/post/6844903855847637005)
CSS 的视觉格式化模型(visual formatting model) 是根据 基础盒模型(CSS basic box model) 将 文档(doucment) 中的元素转换一个个盒子的实际算法。官方说法就是： 它规定了用户端在媒介中如何处理文档树( document tree )。

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

### 优雅降级和渐进增强
* 渐进增强：一开始就针对低版本浏览器进行构建页面，完成基本的功能，然后再针对高级浏览器进行效果、交互、追加功能达到更好的体验。
* 优雅降级：一开始就构建站点的完整功能，然后针对浏览器测试和修复。比如一开始使用 CSS3 的特性构建了一个应用，然后逐步针对各大浏览器进行 hack 使其可以在低版本浏览器上正常浏览。


### 实现动画requestAnimationFrame和setTimeout有什么[区别](https://blog.csdn.net/weixin_40851188/article/details/89669416)？
* 引擎层面：
    * setTimeout 属于 JS 引擎，存在事件轮询，存在事件队列。
    * requestAnimationFrame 属于 GUI 引擎，发生在渲 染过程的中重绘重排部分，与电脑分辨路保持一致。
* 性能层面：
    * 当页面被隐藏或最小化时，定时器 setTimeout 仍在后台执行动画任 务。
    * 当页面处于未激活的状态下，该页面的屏幕刷新任 务会被系统暂停，requestAnimationFrame 也会停止。
* 应用层面：
    * 利用 setTimeout，这种定时机制去做动画，模拟固定时间刷新页面。
    * requestAnimationFrame 由浏览器专门为动画提供 的 API，在运行时浏览器会自动优化方法的调用，在特定性环境下可以有效节省了 CPU 开销。
