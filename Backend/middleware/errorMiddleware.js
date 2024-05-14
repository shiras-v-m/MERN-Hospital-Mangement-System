class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message)
        this.statusCode=statusCode;
    }
}

// function ErrorHandler(message, statusCode) {
//     const error = new Error(message);
//     error.statusCode = statusCode;
//     return error;
// }

export const errorMiddleware=(err,req,res,next)=>{
    err.message=err.message || "Internal server error",
    err.statusCode=err.statusCode || 500;

    if(err.name === "CaseError"){
        const message=`Resource not Invalid ${err.path}`;
        err= new ErrorHandler (message,400)
    }
    if(err.name === 11000){
        const message=`Duplicate ${Object.keys(err.keyValue)} Entered`;
        err= new ErrorHandler (message,400)
    }
    if(err.name === "JsonWebTokenError"){
        const message=`Json web token is Invalid, Try Again`;
        err= new ErrorHandler (message,400)
    }
    if(err.name === "TokenExpiredError"){
        const message=`Json Web Token is expired . Try Again!`;
        err= new ErrorHandler (message,400)
    }

    // when enter data type is not matched.
    if(err.name === "CaseError"){
        const message=`Invalid ${err.path}`;
        err= new ErrorHandler (message,400)
    }

    // To remove the comma between more than one errors. Use a space between errors
    const errorMessage= err.errors?Object.values(err.errors)
    .map((error)=>error.message)
    .join(" ") : err.message

    //Any other error occur ie, error specified in model schema
    return res.status(err.statusCode).json(
        {
            success:false,
            message:errorMessage
        }
    )
}

export default ErrorHandler