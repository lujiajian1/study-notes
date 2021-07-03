function myinstanceof(leftVal, rightVal) {
    let leftPro = leftVal.___proto___;
    let rightPro = rightVal.prototype;
    while(true) {
        if (!leftPro) {
            return false;
        }
        if (leftPro === rightPro) {
            return true;
        }
        leftPro = leftPro.___proto___;
    }
}