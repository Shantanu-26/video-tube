import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    if(!channelId){
        throw new ApiError(400, "Channel Id is missing")
    }

    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel ID")
    }

    if(channelId.toString()===req.user._id.toString()){             //Important corner case
        throw new ApiError(400, "User cannot subscribe himself")
    }

    const alreadySubscribed=await Subscription.findOne({
        channel: channelId,
        subscriber: req.user._id
    })

    if(alreadySubscribed){
        await Subscription.findByIdAndDelete(alreadySubscribed._id)
        return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Unsubscribed successfully")
        )
        } else {
            const subscription=await Subscription.create({
                channel: channelId,
                subscriber:req.user?._id
        })
        
        const subscribedUser= await Subscription.findById(subscription._id)

        if(!subscribedUser){
            throw new ApiError(400, "Could not subscribe")
        }

        return res
        .status(201)
        .json(
            new ApiResponse(200, subscribedUser, "Channel subscribed successfully")
        )
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!channelId){
        throw new ApiError(401, "Channel Id is missing")
    }

    if(!isValidObjectId(channelId)){
        throw new ApiError(401, "Inavlid Channel Id")
    }

    const subscribers=await Subscription.find({
        channel: channelId
    })

    return res
    .status(201)
    .json(
        new ApiResponse(201, subscribers, "Subscribers fetched successfully")
    )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if(!subscriberId){
        throw new ApiError(402, "Subscriber Id is missing")
    }

    if(!isValidObjectId(subscriberId)){
        throw new ApiError(402, "Subscriber Id invalid")
    }

    const subscribedChannels=await Subscription.find({
        subscriber: subscriberId
    })

    return res
    .status(202)
    .json(
        new ApiResponse(202, subscribedChannels, "Subscribed Channels fetched successfully")
    )

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}