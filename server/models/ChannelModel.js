import mongoose from "mongoose";
import User from "./UserModel.js";
import Message from "./MessagesModel.js";
const channelSchema = new mongoose.Schema({
    name :{
        type:String,
        required:true
    },
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }],
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    messages:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message",
        required:false,
    }],
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    updatedAt:{
        type:Date,
        default:Date.now(),
    },
})

channelSchema.pre("save" ,function (next) {
    this.set({updatedAt:Date.now()});
    next();
})
channelSchema.pre("findOneAndUpdate" ,function (next){
    this.set({updatedAt:Date.now()});
    next();
})
const Channel = mongoose.model("Channels", channelSchema);
export default Channel