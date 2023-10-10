import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    owner: {
        type: String,
        ref: 'user',
        required: true,
        default: "admin"
    }
})

productSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model('products', productSchema);