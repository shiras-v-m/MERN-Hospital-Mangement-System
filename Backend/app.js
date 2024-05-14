import express from "express"
import { config } from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import fileUpload from "express-fileupload"
import { dbConnection } from "./database/dbConnection.js"
import messageRouter from './router/messageRouter.js'
import { errorMiddleware } from "./middleware/errorMiddleware.js"
import userRouter from './router/userRouter.js'
const app=express()

// for setting specific path for dotenv
config({path:"./config/config.env"})

// middleware to connect the frontend
app.use(cors({
    origin:[process.env.FRONTEND_URL,process.env.DASHBOARD_URL],
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}))

//Middleware to get cookies
app.use(cookieParser())

// middleware to get data in json format
app.use(express.json())

// middleware to get form data in correct form
app.use(express.urlencoded({extended:true}))

// Middleware to upload file
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/"
}))


app.use("/api/v1/message",messageRouter)
app.use("/api/v1/user",userRouter)
dbConnection()

app.use(errorMiddleware)
export default app