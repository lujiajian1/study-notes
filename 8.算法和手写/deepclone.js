function deepclone(obj = {}) {
    if (typeof obj !== 'object' || obj == null) {
        return obj;
    }
    let res = {};
    if (obj instanceof Array) {
        res = [];
    }
    for(let key in obj) {
        if (obj.hasOwnProperty(key)){
            res[key] = deepclone(obj[key]);
        }
    }
    return res;
}
deepclone();