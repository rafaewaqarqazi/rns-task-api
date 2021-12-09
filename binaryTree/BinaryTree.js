const {Node} = require('./Node')
class BinaryTree{
  constructor(){
    this.root = null
  }

  insert(value){
    let newNode = new Node(value);
    if(this.root === null){
      this.root = newNode;
      return this;
    }
    let current = this.root;
    while(current){
      if(value.price === current.value.price) return undefined;

      if(value.price < current.value.price){
        if(current.left === null){
          current.left = newNode;
          return this;
        }
        current = current.left;
      } else {
        if(current.right === null){
          current.right = newNode;
          return this;
        }
        current = current.right;
      }
    }
  }
  find(value){
    if(!this.root) return false

    let current = this.root
    let found = false
    while(current && !found){
      if(value < current.value.price){
        current = current.left
      } else if(value > current.value.price){
        current = current.right
      } else {
        found = current
      }

    }

    if(!found) return undefined;
    return found
  }
  // this function calls removeNode

  remove(value){
    this.root = this.removeNode(this.root, value)
  }
  // a recursive function to insert a new value in binary tree

  removeNode(current, value) {

    // base case, if the tree is empty

    if(current === null) return current

    // when value is the same as current's value, this is the node to be deleted

    if (value === current.value.price) {



      if (current.left === null && current.right === null){  // for case, node without child

        return null

      }else if(current.left === null){  // for case, node with one child

        return current.right

      }else if(current.right === null){ // for case, node with one child

        return current.left

      }else{

        /// node with two children

        let tempNode = this.smallestNode(current.right)
        current.value = tempNode.value

        current.right = this.removeNode(current.right, tempNode.value.price)
        return current
      }

      // recur down the tree

    }else if(value < current.value.price) {

      current.left = this.removeNode(current.left, value)
      return current

    }else{

      current.right = this.removeNode(current.right, value)
      return current
    }
  }

  /// helper function to find the smallest node

  smallestNode(node) {
    while(!node.left )
      node = node.left

    return node
  }
}
class BinaryTreeSingleton{
  static instance = null

  static getInstance = () => {
    if (this.instance) {
      return this.instance
    } else {
      this.instance = new BinaryTree()
      return this.instance
    }
  }
}
module.exports = { BinaryTree, BinaryTreeSingleton };
