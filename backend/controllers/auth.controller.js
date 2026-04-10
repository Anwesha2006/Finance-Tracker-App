const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User=require("../models/user.model");

exports.createUser=async(req,res)=>{
    try{
        const {firstName,lastName,email,password}=req.body;
        const name = `${firstName} ${lastName}`;
        const existingUser=await User.findOne({email});

        if(existingUser){
            return res.status(400).json({error:"User already exists"});
        }

        const hashedPassword=await bcrypt.hash(password,10);
        const user=await User.create({name,email,password:hashedPassword});
const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
        return res.status(201).json({message:"User created successfully", user: {
    id: user._id,
    name: user.name,
    email: user.email
  }, token});
    }
    catch(err){
        console.error("createUser error", err);
        return res.status(500).json({error:"Something went wrong"});
    }
}

exports.loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email});

        if(!user){
            return res.status(404).json({error:"User not found"});
        }

        const isMatched=await bcrypt.compare(password, user.password);

        if(!isMatched){
            return res.status(401).json({error:"Invalid password"});
        }

        const jwtSecret = process.env.JWT_SECRET;
        if(!jwtSecret){
            console.error("JWT_SECRET is missing in environment");
            return res.status(500).json({error:"Server configuration error"});
        }

        const token=jwt.sign({id:user._id}, jwtSecret,{expiresIn:"1d"});
        return res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                firstName: user.name.split(' ')[0],
                lastName: user.name.split(' ')[1] || ''
            }
        });
    }
    catch(err){
        console.error("loginUser error", err);
        return res.status(500).json({error:"Something went wrong"});
    }
}