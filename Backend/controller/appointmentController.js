import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import { Appointment } from "../models/appoinmentSchema.js";
import { User } from "../models/userSchema.js";

export const postAppointment= catchAsyncErrors(async (req,res,next)=>{
    const {

        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointmentDate,
        department,
        doctor_firstName,
        doctor_lastName,
        hasVisited,
        address
    }=req.body
    if(!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !appointmentDate || !department || !doctor_firstName || !doctor_lastName || !address){
        return next(new ErrorHandler("Please fill full  form!",400))
    }


    // check if user requested doctor exist
    const isConflict = await User.find({
        firstName:doctor_firstName,
        lastName :doctor_lastName,
        role:"Doctor",
        doctorDepartment:department
    })

    // if there is doctors with same firstName and lastname 
    if(isConflict.length ===0){
        return next(new ErrorHandler("Doctor not found!",404))
    }
    if(isConflict.length >1){
        return next(new ErrorHandler("Doctor Conflict! Please contact through Email or phone!",404))
    }
   
    // get the doctor as array so take the id of the doctor
    const doctorId=isConflict[0]._id

    const patientId =req.user._id

    const appointment= await Appointment.create({
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointmentDate,
        department,
        doctor:{
            firstName:doctor_firstName,
            lastName:doctor_lastName,
            address

        },
        hasVisited,
        doctorId,
        patientId
    })
    res.status(200).json({
       success:true,
       message:"Appointment Send successfully!" ,
       appointment
    })

})


export const getAllAppointments= catchAsyncErrors(async (req,res,next)=>{
    const appointments=await Appointment.find()
    res.status(200).json({
        success:true,
        appointments
    })
})


// update the status : rejected, visited ..
export const updateAppointmentStatus = catchAsyncErrors(async (req,res,next)=>{
    // value get from the address bar
    const { status } = req.body; // Assuming status is in the request body
    const {id}=req.params
    let appointment = await Appointment.findById(id); // Find the appointment by ID
    
    if (!appointment) {
        return next(new ErrorHandler("Appointment Not found!", 404));
    }
    
    appointment.doctor.status = status; // Update the status field in the doctor object
    
    await appointment.save(); // Save the updated appointment
    
    res.status(200).json({
        success: true,
        message: "Appointment Status updated",
        appointment
    });
    
  
})


export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    try {
        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return next(new ErrorHandler("Appointment Not Found!", 404));
        }

        await appointment.deleteOne();

        res.status(200).json({
            success: true,
            message: "Appointment Deleted!"
        });
    } catch (error) {
        return next(new ErrorHandler("Error deleting appointment", 500));
    }
});
