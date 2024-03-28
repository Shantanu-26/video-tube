import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,   //used to determine who is allowed to talk with our backend
    credentials: true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())    //used to keep secure cookies in the server



//routes import

import userRouter from './routes/user.routes.js'


//routes declaration
app.use("/api/v1/users", userRouter)        //api/v1 is industry standard

export { app }