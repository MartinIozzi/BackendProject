import mongoose, { mongo } from "mongoose";

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true, 
    },
    purchase_datatime: {
        type: Date,
        required: true, 
    },
    amount: {
        type: Number,
        required: true, 
    },
    purchaser: {
        type: String,
        required: true, 
    }
})

const ticketModel = mongoose.model('ticket', ticketSchema);
export default ticketModel;