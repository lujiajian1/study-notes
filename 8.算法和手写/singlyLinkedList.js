class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class SinglyLinkedList{
    constructor(data){
        this.head = new Node(data);
    }
    add(data){
        let node = new Node(data);
        let current = this.head;
        while (current.next) {
            current = current.next;
        }
        current.next = node;
    }
    addAt(data, index){
        let node = new Node(data);
        let current = this.head;
        let currentIndex = 1;
        while(currentIndex < index) {
            current = current.next;
            currentIndex++;  
        }
        node.next = current.next
        current.next = node;
    }
    removeAt(index){
        let current = this.head;
        let currentIndex = 1;
        let pre = null;
        while(currentIndex < index) {
            pre = current;
            current = current.next;
            currentIndex++;  
        }
        pre.next = current.next;
    }
    reverse(){
        let pre = this.head;
        let current = this.head.next;
        pre.next = null;
        while (current) {
            let next = current.next;
            current.next = pre;
            pre = current;
            current = next;
        }
        this.head = pre;
    }
}