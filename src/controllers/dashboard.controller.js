import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const viewCount=await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $group: {
                _id: null,
                totalViews: {
                    $sum: "$views"
                }
            }
        }
    ])

    const subscriberCount=await Subscription.countDocuments({
        channel:req.user._id
    })

    const videoCount=await Video.countDocuments({
        channel:req.user._id
    })

    const likeCount=await Like.countDocuments({
        channel:req.user._id
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200,
            viewCount,
            subscriberCount,
            videoCount,
            likeCount
        ),
        "Channel stats have been fetched successfully"
    )
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const videos=await Video.find({
        owner: req.user._id
    })

    if(!videos){
        throw new ApiError(400, "Something went wrong")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, videos, "All videos fetched successfully")
    )
})

export {
    getChannelStats, 
    getChannelVideos
}