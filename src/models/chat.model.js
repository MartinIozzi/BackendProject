import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    user: String,
    message: String
  });
  
const chatModel = mongoose.model('chat', chatSchema);

export default chatModel;
