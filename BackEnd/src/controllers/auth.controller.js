require('dotenv').config;
const userModel=require("../models/user.model");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const tokenBlackListModel=require("../models/blacklist.model")


async function registerUserController(req,res){
    const{username,email,password}=req.body

    if(!username || !email || !password){
        return res.status(400).json({
            success: fail,
            message:"Please provide all values"
        })
    }

    const isUserExists=await userModel.findOne({
        $or:[{username},{email}]
    })

    if(isUserExists){
        return res.status(400).json({
            message:"Account already Exists"
        })
    }

    const hash=await bcrypt.hash(password, 10)

    const user=await userModel.create({
        username,
        email,
        password:hash
    })

    const token=jwt.sign(
        {id:user._id ,username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1h"}
    )


    res.cookie("token",token);

    res.status(201).json({
        message:"User regsitered succesfully",
        userid:user._id,
        username:user.username,
    })
    


 }

async function loginController(req,res){
    const{email, password}=req.body;

    const user=await userModel.findOne({email});

    if(!user){
        res.status(401).json({
            message:"Invalid Email or Password"
        })
    }
    const isMatch=await bcrypt.compare(password,user.password);

    if(!isMatch){
        return res.status(400).json({
            message:"Invalid Email or Password"
        })
    }

    const token=jwt.sign(
        {id:user._id, username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:'1h'}
    )

    res.cookie("token",token);

    res.status(200).json({
        message:"✅Logged in succesfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
    
}

async function logoutUserController(req,res){
    const token =req.cookies.token

    if(token){
        await tokenBlackListModel.create({token})
    }
    res.clearCookie("token");

    res.status(200).json({
        message:"Logged Out Succesfully"
    })
}

async function getMeController(req,res){
    
    const user=await userModel.findById(req.user.id);

    res.status(200).json({
        message:"User details fetched succesfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

module.exports={
    registerUserController,
    loginController,
    logoutUserController,
    getMeController
}