const input1 = document.getElementById('input1')
function debounce(fn, time = 100){
    let timer = null;
    return function() {
        if (timer){
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn.apply(this, arguments);
            timer = null;
        }, time);
    }
}
function thr(fn, time = 100){
    let timer = null;
    return function() {
        if (timer){
            return;
        }
        timer = setTimeout(() => {
            fn.apply(this, arguments);
            timer = null;
        }, time);
    }
}
input1.addEventListener('keyup', debounce(function (e) {
    console.log('this', this)
    console.log(e.target)
    console.log(input1.value)
}, 600))