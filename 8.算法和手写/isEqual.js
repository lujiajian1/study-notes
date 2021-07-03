function isObj(obj) {
    return typeof obj === 'object' && obj !== null;
}
function isEqual(obj1, obj2) {
    if (!isObj(obj1) || !isObj(obj2)) {
        return obj1 === obj2;
    }
    if (obj1 === obj2) {
        return true;
    }
    let obj1Keys = Object.keys(obj1);
    let obj2Keys = Object.keys(obj2);
    if (obj1Keys.length !== obj2Keys.length) {
        return false;
    }
    for (let i = 0; i < obj1Keys.length; i++) {
        let res = isEqual(obj1[obj1Keys[i]], obj2[obj1Keys[i]]);
        if (!res) {
            return false;
        }
    }
    return true;
}