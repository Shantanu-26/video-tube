import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    if(!content){
        throw new ApiError(400, "All fields are required")
    }

    const tweet=await Tweet.create({
        content,
        owner: req.user._id
    })

    const postedTweet=await Tweet.findById(tweet._id)
    
    if(!postedTweet){
        throw new ApiError(400, "Tweet could not be posted")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, postedTweet, "Tweet has been posted successfully")
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId}=req.params

    if(!userId){
        throw new ApiError(401, "userId not found")
    }

    if(isValidObjectId(userId)){
        throw new ApiError(401, "userId is invalid")
    }

    const tweets=await Tweet.find({
        owner: userId
    })

    if(!tweets){
        throw new ApiError(401, "Tweets could not be fetched")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(201, tweets, "User's tweets fetched successfully")
    )
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId}=req.params
    const {tweetContent}=req.body
    
    if(!tweetId?.trim()){
        throw new ApiError(402, "Tweet id is missing")
    }

    if(isValidObjectId(tweetId)){
        throw new ApiError(402, "Tweet id is invalid")
    }

    if(!tweetContent){
        throw new ApiError(400, "Tweet content is required")
    }
    
    const updatedTweet=await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content,
            },
        },
        {
            new: true
        }
    )

    if(!updatedTweet){
        throw new ApiError(402, "Tweet could not be updated")
    }

    return res
    .status(202)
    .json(
        new ApiResponse(202, updatedTweet, "Tweet was updated successfully")
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId}=req.params

    if(!tweetId?.trim()){
        throw new ApiError(403, "Tweet Id is missing")
    }

    if(!isValidObjectId(tweetId)){
        throw new ApiError(403, "Tweet Id is invalid")
    }

    const deletedTweet=await Tweet.findByIdAndDelete(tweetId)

    if(!deletedTweet){
        throw new ApiError(403, "Tweet could not be deleted")
    }

    return res
    .status(203)
    .json(
        new ApiResponse(203, deletedTweet, "Tweet deleted successfully")
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}