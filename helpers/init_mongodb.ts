import mongoose, {connect} from "mongoose";

export const connectDB = async() => {
   
    connect('mongodb://0.0.0.0:27017',{
        dbName: 'auth-tut',
    }).then(() => {
    console.log('Connected to MongoDB ✅');
    })
    .catch((error) => {
    console.log("Failed to connect to MongoDB ❌:", error); 
    })

    mongoose.connection.on('connected', () => {
        console.log('Mongoose connected to DB ✔');
    })

    mongoose.connection.on('error', (err) =>{
        console.log(err.message, '⚠')
    })
    mongoose.connection.on('disconnected', ()=>{
        console.log('Mongoose Disconnected ❌❌')
    })
};
