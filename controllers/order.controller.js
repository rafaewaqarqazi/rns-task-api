const { Orders } = require('../models/orders');
const { Sequelize } = require('sequelize');
const { BinaryTreeSingleton} = require('../binaryTree/BinaryTree')
const redis = require("redis")
require('dotenv').config();

const publisher = redis.createClient()
exports.createOrder = async (req, res) => {
  try {
    const { order } = req.body;
    let tree =  BinaryTreeSingleton.getInstance()
    const found= tree.find(order.price)
    if (found && found.value.side !== order.side){ // When Price is same but side is not same
      await Orders.destroy({where:{price: Sequelize.cast(order.price, 'float')}})
      publisher.publish("remove-order", order.price)
      tree.remove(order.price) // remove from tree
      res.json({
        message: 'Order removed Successfully',
        tree
      });

    } else {
      if (!found) {
        const exist = await Orders.findOne({where:{price: Sequelize.cast(order.price, 'float')}})
        let newOrder = null
        if (!exist){
          const { id, side, price } = await Orders.create(order);
          newOrder = {id, side, price}
        }
        publisher.publish("add-order", order.price)
        tree.insert(order)
        res.json({
          order: newOrder || {id: exist.id, side: exist.side, price: exist.price},
          message: 'Order created Successfully',
          tree
        });
      } else {
        res.json({
          message: 'Price and side is same, new order will not be created',
          tree
        });
      }

    }
  } catch (e) {
    return res.status(400).json({
      error: 'Could not create order',
      message: e.message,
    });
  }
};
