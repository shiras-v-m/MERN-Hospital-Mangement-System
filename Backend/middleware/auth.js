import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import jwt from 'jsonwebtoken'
import ErrorHandler from "./errorMiddleware.js";
export const isAdminAuthenticated = catchAsyncErrors( async (req,res,next)=>{
    const token = req.cookies.adminToken
    if(!token){
        return next(new ErrorHandler("Admin not authenticated!",400))
    }
    // The generated token is check with jwt secret key for authorization
    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)

    // we store the id of the user at the time of generating token which specified in the userSchema . That id is decoded.id
    req.user = await User.findById(decoded.id)

    if(req.user.role !== "Admin" ){
        return next(new ErrorHandler(`${req.user.role} is not authorized for this resources`,403))
    }
    next()
})
export const isPatientAuthenticated = catchAsyncErrors( async (req,res,next)=>{
    const token = req.cookies.patientToken
    if(!token){
        return next(new ErrorHandler("Patient not authenticated!",400))
    }
    // The generated token is check with jwt secret key for authorization
    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)

    // we store the id of the user at the time of generating token which specified in the userSchema . That id is decoded.id
    req.user = await User.findById(decoded.id)

    if(req.user.role !== "Patient" ){
        return next(new ErrorHandler(`${req.user.role} is not authorized for this resources`,403))
    }
    next()
})