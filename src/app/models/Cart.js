const Product = require("../models/products");


module.exports = function Cart(oldCart) {
  this.items = oldCart.items || {};
  this.totalQty = oldCart.totalQty || 0;
  // oldCart.totalPrice = 0
  this.totalPrice = oldCart.totalPrice || 0;
  this.add = async function (item, id) {
    try {
      var storedItem = this.items[id]
      if (!storedItem) {
        storedItem = this.items[id] = { item: item, qty: 0, price: 0, sale: 0 }
      }
      storedItem.qty++;
      storedItem.sale = storedItem.item.sale
      storedItem.price = storedItem.item.price * storedItem.qty * (100 - storedItem.item.sale) / 100;
      this.totalQty++;
      this.totalPrice = Number(this.totalPrice) + Number(storedItem.item.price)* (100 - storedItem.item.sale) / 100;
      this.totalPrice = parseInt(this.totalPrice);

    }
    catch (error) {
      console.log(error)
    }
  }

  this.reduceByOne = function (id) {
    this.items[id].qty--;
    this.items[id].price -= this.items[id].item.price*(100 - this.items[id].sale)/100;
    this.totalQty--;
    this.totalPrice -= this.items[id].item.price*(100 - this.items[id].sale)/100;
    if (this.items[id].qty <= 0) {
      delete this.items[id]
    }
  }

  this.increaseByOne = function (id) {
    this.items[id].qty++;
    // this.items[id].price = Number(this.items[id].price) + Number(this.items[id].item.price);
    this.items[id].price += this.items[id].item.price*(100 - this.items[id].sale)/100;
    
    this.totalQty++;
    this.totalPrice = Number(this.totalPrice) + Number(this.items[id].item.price)*(100 - this.items[id].sale)/100;

  }

  this.removeItem = function (id) {
    this.totalQty -= this.items[id].qty;
    this.totalPrice -= this.items[id].price;
    delete this.items[id];
  }

  this.generateArray = function () {
    var arr = [];
    for (var id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  }

  //lay thong tin Product hien tai
  this.getProduct = function (id) {
    var arr = []
    for (var i in this.items) {
      if (i == id) {
        arr.push(this.items[i]);
      }
    }
    return arr;
  }
  this.getAllProduct = function () {
    var arr = [];
    for (var id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  }
}

