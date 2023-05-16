import express from "express";
import morgan from "morgan";
import createError from "http-errors";
import dotenv from "dotenv";
import {router as AuthRoute} from "./routes/Auth.route";
import { connectDB } from "./helpers/init_mongodb";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
connectDB();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.get('/',async (req,res,next) => {
    res.send("Hello From Express 🙋");
})
app.use('/auth', AuthRoute);

app.use(async(req,res,next) => {
    next(createError.NotFound());
})

app.use((err,req,res,next) => {
    res.status(err.status || 500);
    res.send({
        error:{
            status: err.status || 500,
            message: err.message
        }
    })
})

app.listen(PORT,()=>{
    console.log('Server is Running at 3000 .... 🚀');
})

