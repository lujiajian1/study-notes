# 常见的页面布局实现

#### 两栏布局（边栏定宽主栏自适应）
1. 左侧栏宽度固定，并设置左浮动。右侧栏使用 margin-left 留出左侧栏的宽度，宽度无须设置，自动填满剩下的宽度。
```html
<div class="left"></div><div class="right"></div>
<style type="text/css">
.left{
    float: left;
    width: 200px;
    height: 200px;
    background: #ff0000;
}
.right{
    margin-left: 200px;
    height: 200px;
    background: #00ff00;
}
</style>
```
2. 左侧栏右侧栏浮动定位，右侧宽度设置100%，右侧栏内容设置 margin-left 留出左侧栏的空间，然后左侧栏设置 margin-right 负外边距
```html
<div class="left"></div>
<div class="right">
    <div class="content"></div>
</div>
<style type="text/css">
.left{
    width: 300px;
    height: 100px;
    background: #ff0000;
    margin-right: -100%; // margin-right负值，右侧元素左移，自身不受影响
    float: left;
}
.right{
    width: 100%;
    float: left;
}
.content{
    margin-left: 300px;
    background: #00ff00;
}
</style>
```
3. 左侧栏绝对定位，右侧栏利用 margin-left 预留空间
```html
<div class="left"></div>
<div class="right"></div>
<style type="text/css">
.left{
    width: 200px;
    height: 200px;
    position: absolute;
    background: #ff0000;
}
.right{
    height: 200px;
    margin-left:200px; 
    background: #00ff00;
}
</style>
```
4. flex
```html
<div class="container">
    <div class="left"></div>
    <div class="right"></div>
</div>
<style type="text/css">
.container{
    display:flex;
}
.left{
    flex:0 0 200px;
}
.right{
    flex: 1 1;
}
</style>
```
#### 三栏布局（两侧栏定宽主栏自适应）
1. 分别设置左侧栏和右侧栏向左和向右浮动，中间栏设置左右外边距空出左右栏的位置
```html
<div class="left"></div>
<div class="right"></div>
<div class="main"></div>
<style type="text/css">
*{
  margin:0;
  padding:0;
  height:100%;
}
.left{
  width:300px;
  background-color: #ff0000;
  float:left;
}
.right{
  width:200px;
  background-color: #00ff00;
  float:right;
}
.main{
  background-color: #0000ff;
  margin-left:300px;
  margin-right:200px;
}
</style>
```
2. 浮动 + 负外边距
```html
<div class="main">
  <div class="content"></div>
</div>
<div class="left"></div>
<div class="right"></div>
<style type="text/css">
div{
  height:100%;
}
.main{
  background-color: #ff0000;
  width:100%;
  float:left;
}
.left{
  width:200px;
  background-color: #00ff00;
  float:left;
  margin-left:-100%;
}
.right{
  width:300px;
  background-color: #0000ff;
  float:left;
  margin-left:-300px;
}
.content{
  margin-left:200px;
  margin-right:300px;
}
</style>
```
3. 左侧栏和右侧栏分别用绝对定位固定在左侧和右侧，中间栏则利用 margin-left 和 margin-right 空出左右栏位置来
```html
<div class="left"></div>
<div class="main"></div>
<div class="right"></div>
<style type="text/css">
div{
  height:100%;
}
.left{
  width:200px;
  background-color: #ff0000;
  position:absolute;
  top:0;
  left:0;
}
.main{
  background-color: #00ff00;
  margin-left:200px;
  margin-right:300px;
}
.right{
  width:300px;
  background-color: #0000ff;
  position:absolute;
  top:0;
  right:0;
}
</style>
```
4. flex
```html
<div>
    <div class="left"></div>
    <div class="main"></div>
    <div class="right"></div>
</div>
<style type="text/css">
div{
  display:-webkit-flex;
  display:flex;
  margin:0;
  padding:0;
  height:800px;
}
.main{
  flex:1 1;
  order:2;  
  background-color:yellow;
}
.left{
  flex:0 0 200px;
  order:1;  
  background-color:blue;
}
.right{
  flex:0 0 200px;
  order:3;
  background-color:aqua;
}
</style>
```
#### 多列等高布局
1. flex
```html
<div class="box">
    <div class="left"></div>
    <div class="center"></div>
    <div class="right"></div>
</div>
<style type="text/css">
.box {
    display: flex;
}
.left {
    width: 300px;
    background-color: grey;
}
.center {
    flex: 1;
    background: red;
}
.right {
    width: 500px;
    background: yellow;
}
</style>
```
2. 利用table
```html
<div class="box">
    <div class="left"></div>
    <div class="center"></div>
    <div class="right"></div>
</div>
<style type="text/css">
.left {
    display: table-cell;
    width:30%;
    background-color: greenyellow;
}
.center {
    display: table-cell;
    width:30%;
    background-color: gray;
}
.right {
    display: table-cell;
    width:30%;
    background-color: yellowgreen;
}
</style>
```
#### 三行布局（头尾定高主栏自适应）
```html
<div class="layout">
    <header></header>
    <main>
        <div class="inner"></div>
    </main>
    <footer></footer>
</div>
<style type="text/css">
html,
body,
.layout {
    height: 100%;
}
body {
    margin: 0;
}
header, 
footer {
    height: 50px;
}
main {
    overflow-y: auto;
}
</style>
```
1. 绝对定位
```css
.layout {
    position: relative;
}
header {
    position: absolute;
    width: 100%;
}
main {
    height: 100%;
    padding: 50px 0;
    box-sizing: border-box;
}
footer {
    position: absolute;
    bottom: 0;
    width: 100%;
}
```
2. flex
```css
.layout {
    display: flex;
    flex-direction: column;
}
main {
    flex: 1;
}
```
3. calc
```css
main {
    height: calc(100% - 100px);
}
```
4. grid
```css
.layout {
    display: grid;
    grid-template-rows: 50px 1fr 50px;
}
```
