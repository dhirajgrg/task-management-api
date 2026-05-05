import { Schema ,model} from "mongoose";


const commentSchema=new Schema({
    taskId:{
        type:Schema.Types.ObjectId,
        ref:"Task",
        required:true,
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    text:{
        type:String,
        required:true,
    }

},{
    timestamps:true
})

const Comment= model('Comment',commentSchema)
export default Comment