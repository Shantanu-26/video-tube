import mongoose, {Schema} from "mongoose"

const subscriptionSchema=new Schema({
    subscriber:{
        typeof: Schema.Types.ObjectId,      //The one who is subscribing
        ref: "User"
    },
    channel: {
        type: Schema.Types.ObjectId,   //One who is subscribed
        ref: "User"
    },
}, {timestamps: true})

export const Subscription=mongoose.model("Subscription", subscriptionSchema)