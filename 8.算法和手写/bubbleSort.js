function bubbleSort(arr){
    let res = [];
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length -1 -i; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j+1]] = [arr[j+1], arr[j]]
            }
        }
    }
    return res;
}

function quickSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }
    let rest = arr.slice(1);
    return [
        ...quickSort(rest.filter(item => item < arr[0])),
        arr[0],
        ...quickSort(rest.filter(item => item >= arr[0])),
    ]
}