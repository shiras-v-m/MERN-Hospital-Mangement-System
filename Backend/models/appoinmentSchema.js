import mongoose from 'mongoose'
import validator from 'validator'

const appointmentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: [3, "First Name Must Contain atleast 3 Characters~"]
    },
    lastName: {
        type: String,
        required: true,
        minLength: [1, "Last Name Must Contain atleast 1 Characters!"]
    },
    email: {
        type: String,
        required: true,
        validator: [validator.isEmail, "Please provide a valid email!"]
    },
    phone: {
        type: String,
        required: true,
        minLength: [10, "Phone Number must contain Exact 10 digits!"],
        maxLength: [10, "Phone Number must contain Exact 10 digits!"]
    },
    nic: {
        type: String,
        required: true,
        minLength: [13, "NIC Must contain Exact 13 Digits!"],
        maxLength: [13, "NIC Must contain Exact 13 Digits!"]

    },
    dob: {
        type: Date,  //mongodb accept 1997-02-14 in this format
        required: [true, "DOB is required!"]
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female"]
    },
    appointmentDate: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    doctor: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        hasVisited:{
            type:Boolean,
            default:false
        },
        doctorId:{
            // Creating relation with doctor objectId
            type:mongoose.Schema.ObjectId,
            requird:true
        },
        patientId:{
            // Creating relation 
            type:mongoose.Schema.ObjectId,
            requird:true
        },
        address:{
            type:String,
            required:true
        },
        status:{
            type:String,
            enum:["Pending","Accepted","Rejected"],
            default:"Pending"
        }

    }

})

export const Appointment = mongoose.model("Appointment",appointmentSchema)