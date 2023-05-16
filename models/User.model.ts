import mongoose,{Document, Schema} from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
  email: string;
  password: string;
}

const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
})

interface IUserDocument extends IUser, Document {
  isValidPassword(password: string): Promise<boolean>;
}


UserSchema.methods.isValidPassword = async function(password:string){
    try {
       return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw(error) ;
    }
}

//mongoose middlewares
UserSchema.pre('save', async function(next){
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password,salt);
        this.password = hashedPassword;
        console.log(this.email, this.password);
        next();
    } catch (error:any) {
        next(error);
    }
})



// UserSchema.post('save', async function(next){
//     try {
//         console.log('called after saving user');
//     } catch (error:any) {
//         console.log(error);
//     }
// })

export const User = mongoose.model<IUserDocument>('user', UserSchema)
