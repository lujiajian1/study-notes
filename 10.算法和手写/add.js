function add(...args) {
    let allArg = args;
    var _adder = function (){
        allArg.push(...arguments);
        return _adder;
    }
    _adder.toString = function() {
        return allArg.reduce(function (a, b) {
            return a + b;
        }, 0);
    }
    return _adder
}
console.log(add(1)(2)(3).toString())
console.log(add(1, 2, 3)(4).toString())
console.log(add(1)(2)(3)(4)(5).toString())
console.log(add(2, 6)(1).toString())
