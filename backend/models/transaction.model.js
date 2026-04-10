const mongoose=require('mongoose');
const TransactionSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    receipt:{
        type:String
    },
    category: {
        type: String,
        default: "Other"
    },
    description:{
        type:String,
        required:true
    }
},
{timestamps:true});
module.exports=mongoose.model("Transaction",TransactionSchema);