class _Node {
  constructor(value, next) {
    this.value = value,
    this.next = next
  }
}

class LinkedList {
  constructor(){
    this.head = null;
  }

  makeLinkedList(words, head){
    console.log(words)
    this.head = new _Node(words[head-1], null)  
    let currentNode = this.head
    for(let i = 1; i< words.length; i++){
      console.log(currentNode)
      currentNode.next = new _Node(words[(currentNode.value.next)-1], null)
      currentNode = currentNode.next
    }
  }

  checkGuess(guess){
    const answer = this.head.value.translation
    if(answer === guess) {

      this.head.value.correct_count+=1
      this.head.value.memory_value*=2

      const data = this.shiftWord(this.head.value.memory_value)

      return { correct: true, data, answer }
    } else {
      console.log('did this')
      this.head.value.incorrect_count+=1
      this.head.value.memory_value = 1

      const data = this.shiftWord(this.head.value.memory_value)

      return { correct: false, data, answer }  
    }
  }

  shiftWord(shifts){
    // console.log(this.head.value.translation, 'translation before shifts')
    if(this.head.next === null) return

    let current = this.head

    while(shifts > 0 && current.next){
      current = current.next
      shifts--
    }
    this.head.value.next = current.next? current.next.value.id : null 
    console.log('new head value ', this.head.value.next)
    current.next = new _Node(this.head.value, current.next)
    
    current.value.next = current.next.value.id
    // current.next.value.next = current.next.next ? current.next.next.value.id : null 

    // console.log(current.value, ' current val after shifts', current.next.value, ' val of head')

    let data = {
      old_head : this.head.value,
      prev_node_id : current.value.id,
      prev_node_next : current.value.next,
    }

    // console.log(data.prev_node_next)
    this.head = this.head.next

    data['new_head'] = this.head.value
    console.log(data.old_head.next, 'old head next')
    // return this.head.value

    return data
  }

  printList(){
    let node = this.head
    while(node.next) {
      console.log(node.value)
      node = node.next
    }
    console.log(node.value)
    console.log('list done')
  }
}

module.exports = LinkedList