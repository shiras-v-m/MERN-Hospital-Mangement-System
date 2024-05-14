import mongoose  from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:[3,"First Name Must Contain atleast 3 Characters~"]
    },
    lastName:{
        type:String,
        required:true,
        minLength:[1,"Last Name Must Contain atleast 1 Characters!"]
    },
    email:{
        type:String,
        required:true,
        validator:[validator.isEmail,"Please provide a valid email!"]
    },
    phone:{
        type:String,
        required:true,
        minLength:[10,"Phone Number must contain Exact 10 digits!"],
        maxLength:[10,"Phone Number must contain Exact 10 digits!"]
    },
    nic:{
        type:String,
        required:true,
        minLength:[13,"NIC Must contain Exact 13 Digits!"],
        maxLength:[13,"NIC Must contain Exact 13 Digits!"]

    },
    dob:{
        type:Date,  //mongodb accept 1997-02-14 in this format
        required:[true,"DOB is required!"]
    },
    gender:{
        type:String,
        required:true,
        enum:["Male", "Female"]
    },
    password:{
        type:String,
        required:true,
        minLength:[6,"Password must contain atleast 6 characters!"],
        select:false  // when use the get method it does not select the password
    },
    role:{
        type:String,
        required:true,
        enum:["Admin","Patient","Doctor"]
    },
    doctorDepartment:{
        type:String
    },
    docAvatar:{
        public_id:String,
        url:String
    }
})

// Before saving the user data to mongodb the password is get hashed
userSchema.pre("save",async function(next){
    // checks if the "password" field of the current document has been modified since it was last saved. If it hasn't been modified, the middleware calls next() to move to the next middleware or the save operation itself. Reduce unnecessary computation and database writes.
    if(!this.isModified("password")){
        next()
    }
    // 10 means the hardness factor of the password hashing. ie for more hardness factor increase the value
    this.password=await bcrypt.hash(this.password,10)
})


userSchema.methods.comparePassword= async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}
userSchema.methods.generateJsonWebToken= function (){
    // create the jwt token based on the jwt secret key from the .env file
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRES
    })
}
export const User=mongoose.model("User",userSchema)