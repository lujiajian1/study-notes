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

console.log(ta)

//前序遍历
function treeFrontEach(tree) {
    if (!tree || tree.value == null) {
        return;
    }
    console.log(tree.value)
    treeFrontEach(tree.left)
    treeFrontEach(tree.right)
}
console.log(treeFrontEach(ta))


//中序遍历
function treeMiddleEach(tree) {
    if (!tree || tree.value == null) {
        return;
    }
    treeMiddleEach(tree.left)
    console.log(tree.value)
    treeMiddleEach(tree.right)
}
console.log(treeMiddleEach(ta))

//后序遍历
function treeEndEach(tree) {
    if (!tree || tree.value == null) {
        return;
    }
    treeEndEach(tree.left)
    treeEndEach(tree.right)
    console.log(tree.value)
}
console.log(treeEndEach(ta))