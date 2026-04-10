const User=require("../models/user.model");

exports.getMyProfile=async(req,res)=>{
    try{
        const userId=req.user.id;
        const user=await User.findById(userId).select("-password");
        if(!user){
            return res.status(404).json({error:"User not found"});
        }
        return res.json(user);
    }
    catch(err){
        console.error("getMyProfile error", err);
        return res.status(500).json({error:"Something went wrong"});
    }
}

exports.getAllUsers=async(req,res)=>{
    try{
        const users=await User.find().select("-password");
        return res.json(users);
    }
    catch(err){
        console.error("getAllUsers error", err);
        return res.status(500).json({error:"Something went wrong"});
    }
}

exports.getUserById=async(req,res)=>{
    try{
        const user=await User.findById(req.params.id).select("-password");
        if(!user){
            return res.status(404).json({error:"User not found"});
        }
        return res.json(user);
    }
    catch(err){
        console.error("getUserById error", err);
        return res.status(500).json({error:"Something went wrong"});
    }
}

exports.updateUserById=async(req,res)=>{
    try{
        const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true}).select("-password");
        if(!user){
            return res.status(404).json({error:"User not found"});
        }
        return res.json(user);
    }
    catch(err){
        console.error("updateUserById error", err);
        return res.status(500).json({error:"Something went wrong"});
    }
}

exports.deleteUserById=async(req,res)=>{
    try{
        const user=await User.findByIdAndDelete(req.params.id).select("-password");
        if(!user){
            return res.status(404).json({error:"User not found"});
        }
        return res.json({message:"User deleted successfully", user});
    }
    catch(err){
        console.error("deleteUserById error", err);
        return res.status(500).json({error:"Something went wrong"});
    }
}