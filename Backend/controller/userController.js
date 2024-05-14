import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js"
import ErrorHandler from "../middleware/errorMiddleware.js"

import { User } from "../models/userSchema.js"
import { generateToken } from "../utils/jwtToken.js"

export const patientRegister= catchAsyncErrors( async (req,res,next)=>{
    const {firstName,lastName,email,phone,password,gender,dob,nic,role}=req.body


    if(!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic || !role){
        return next(new ErrorHandler("Please fill all the fields!",400))
    }

    const user=await User.findOne({email})
    if(user){
        return next(new ErrorHandler("User already registered",400))
    }

    await User.create({
        firstName,lastName,email,phone,password,gender,dob,nic,role
    })
        generateToken(user,"User Registered!",200,res)
    // res.status(200).json({
    //     success:true,
    //     message:"User Registered!"
    // })
})


export const login= catchAsyncErrors(async(req,res,next)=>{
    const {email,password,confirmPassword,role}=req.body
    if(!email || !password || !confirmPassword || !role){
        return next(new ErrorHandler("Please fill all the fields!",400))
    }

    if(password != confirmPassword){
        return next(new ErrorHandler("Password and confirm password Do Not Match!",400))
    }

    const user = await User.findOne({email}).select("+password") //In the model user password select is set as false. so we don't get the password until we set the select
    if(!user){
        return next(new ErrorHandler("Invalid Email or password!",400))

    }
    const isPasswordMatched= await user.comparePassword(password)

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or password!",400))
    }
    if(role !== user.role){
        return next(new ErrorHandler("User with this role Not Found!",400))
    }
    generateToken(user,"User Logged In successfully!",200,res)

    // res.status(200).json({
    //     success:true,
    //     message:"User Logged In successfully!"
    // })
})

// Initially we add an admin to database so can only create new admin by login with the inital admin. Using auth.js
export const addAdminRegister= catchAsyncErrors( async (req,res,next)=>{
    const {firstName,lastName,email,phone,password,gender,dob,nic}=req.body


    if(!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic ){
        return next(new ErrorHandler("Please fill all the fields!",400))
    }

    const isRegistered=await User.findOne({email})
    if(isRegistered){
        return next(new ErrorHandler(`${isRegistered.role} with this email already exists!`,400))
    }

    const admin = await User.create({
        firstName,lastName,email,phone,password,gender,dob,nic,role:"Admin"
    })
        // generateToken(user,"User Registered!",200,res)
    res.status(200).json({
        success:true,
        message:"New Admin Registered!"
    })
})


export const getAllDoctors = catchAsyncErrors(async (req,res,next)=>{
    const doctors = await User.find({role:"Doctor"})
    res.status(200).json({
        success:true,
        doctors
    })
})

export const getUserDetails = catchAsyncErrors(async (req,res,next)=>{
    const user=req.user
    res.status(200).json({
        success:true,
        user
    })
})

