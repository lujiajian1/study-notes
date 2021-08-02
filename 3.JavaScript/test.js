let obj = {
    a: {
        a_1: {
            a_1_1: 'a11',
            a_1_2: 'a12'
        },
        a_2: {
            a_2_1: 'a21',
            a_2_2: 'a22'
        }
    },
    b: {
        b_1: 'b1',
        b_2: 'b2'
    },
    c: 'c'
} 
function findPath(obj, val) {
    let keys = Object.keys(obj);
    let result = [];
    for (let i = 0; i < keys.length; i++) {
        let _ = keys[i];
        if (typeof obj[_] === 'object' && obj[_] !== null) {
            let res = findPath(obj[_], val);
            if (res.length > 0) {
                result = result.concat([_], res);
            }
        } else if (obj[_] === val) {
            result = result.concat([_]);
            break;
        }
    }
    return result;
}
console.log(findPath(obj, 'a22')); // ['a', 'a_2', 'a_2_2']