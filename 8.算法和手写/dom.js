var dom = {
    tag: 'A',
    children: [
        {
            tag: 'B',
            children: [
                {tag: 'D'},
                {tag: 'E'},
            ]
        },
        {
            tag: 'C',
            children: [
                {
                    tag: 'F',
                    children: [
                        {tag: 'H'},
                        {tag: 'I'},
                    ]
                },
                {tag: 'G'},
            ]
        }
    ]
}

//深度优先
function dfs(dom){
    let nodeList = [];
    nodeList.push(dom);
    if (dom.children && dom.children.length) {
        for (let i = 0; i < dom.children.length; i++) {
            nodeList = nodeList.concat(dfs(dom.children[i]))
        }
    }
    return nodeList;
};
console.log(dfs(dom));

//广度优先
function bfs(dom){
    if (!(dom instanceof Array)) {
        dom = [dom];
    }
    let nodeList = [];
    let childrenArr = [];
    for (let i = 0; i<dom.length; i++) {
        nodeList.push(dom[i]);
        if (dom[i].children && dom[i].children.length) {
            childrenArr = childrenArr.concat(dom[i].children)
        }
    }
    if (childrenArr.length > 0) {
        nodeList = nodeList.concat(bfs(childrenArr));
    }
    return nodeList
}
console.log(bfs(dom));