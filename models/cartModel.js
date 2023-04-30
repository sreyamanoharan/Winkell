const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const cartSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: "User",
  },
  products: [
    {
      productId: {
        type: ObjectId,
        ref: 'Product'
      },
      quantity: {
        type: Number,
        default: 1,
      },
      productPrice: {
        type: Number,
        default: 0,
      },
      totalPrice: {
        type: Number,
        default: 0,
      }
     
    }
  ]
});


module.exports = mongoose.model('cart',cartSchema)

