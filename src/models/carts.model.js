import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products'
        },
        quantity: {
          type: Number,
          default: 1,
        }
      }
    ]
  });

const cartModel = mongoose.model('carts', cartSchema)

export default cartModel;