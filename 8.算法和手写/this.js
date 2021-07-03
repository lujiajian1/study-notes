Function.prototype.myapply = function(context, arr){
    context || (context = window);
    arr || (arr = []);
    let fnkey = Symbol();
    context[fnkey] = this;
    let res = context[fnkey](...arr);
    delete context[fnkey];
    return res;
}
Function.prototype.mycall = function(context, ...arr) {
    context || (context = window);
    arr || (arr = []);
    let fnkey = Symbol();
    context[fnkey] = this;
    let res = context[fnkey](...arr);
    delete context[fnkey];
    return res;
}
Function.prototype.bind = function(context, ...arr) {
    let fn = this;
    arr || (arr = []);
    return function() {
        fn.apply(context, arr);
    }
}