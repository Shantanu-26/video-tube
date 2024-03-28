import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if(!videoId){
        throw new ApiError(400, "Video Id is missing")
    }

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Video Id is invalid")
    }

    const alreadyLiked=await Like.findOne({
        video: videoId,
        likedBy: req.user?._id
    })

    if(alreadyLiked){
        await findByIdAndDelete(alreadyLiked._id)
        return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Video has been unliked")
        )
    } else {
        const like=await Like.create({
            video: videoId,
            likedBy: req.user?._id
        })
    
        const likedVideo=await Like.findById(like._id)
    
        if(!likedVideo){
            throw new ApiError(400, "Video could not be liked")
        }
    
        return res
        .status(200)
        .json(
            new ApiResponse(200, likedVideo, "The video has been liked successfully")
        )
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if(!commentId){
        throw new ApiError(401, "Comment Id is missing")
    }

    if(!commentId?.trim()){
        throw new ApiError(401, "Comment Id is invalid")
    }

    const alreadyLiked=await Like.findOne({
        comment: commentId,
        likedBy: req.user?._id
    })

    if(!alreadyLiked){
        await Like.findByIdAndDelete(alreadyLiked._id)
        return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Comment has been unliked")
        )
    } else{
        const like=await Like.create({
            comment:commentId,
            likedBy: req.user?._id
        })

        const likedComment=await Like.findById(like._id)

        if(!likedComment){
            throw new ApiError(401, "Comment could not be liked")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(201, likedComment, "Comment liked successfully")
        )
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if(!tweetId){
        throw new ApiError(402, "Tweet Id is missing")
    }

    if(!isValidObjectId(tweetId)){
        throw new ApiError(402, "Tweet Id is invalid")
    }

    const alreadyLiked=await Like.findOne({
        tweet: tweetId,
        likedBy: req.user?._id
    })

    if(!alreadyLiked){
        await Like.findByIdAndDelete(alreadyLiked._id)
        return res
        .status(201)
        .json(
            new ApiResponse(201, {}, "Tweet has been unliked")
        )
    } else{
        const like=await Like.create({
            tweet: tweetId,
            likedBy: req.user?._id
        })
    
        const likedTweet=await Like.findById(like._id)
    
        if(!likedTweet){
            throw new ApiError(402, "Tweet could not be liked")
        }
    
        return res
        .status(200)
        .json(
            new ApiResponse(202, likedTweet, "Tweet Liked Successfully")
        )
    }
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const likedVideos=await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user._id)
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videos"
            },
        },
        {
            $unwind: "$videos",
        },
        {
            $lookup: {
                from: "likes",
                localField: "videos_.id",
                foreignField: "video",
                as: "likes"
            },
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$likes",
                },
            },
        },
        {
            $project: {
                _id: "$videos_.id",
                title: "videos.title",
                description: "$videos.description",
                videoFile: "$videos.videoFile",
                thumbnail: "$videos.thumbnail",
                duration: "$videos.duration",
                views: "$videos.views",
                owner: "$videos.owner",
                likesCount: "$likesCount"
            },
        },
    ])

return res
       .status(203)
       .json(
        new ApiResponse(203, likedVideos, "Liked videos fetched successfully")
    )



    //alternate code:
    // const getLikedVideos = asyncHandler(async (req, res) => {
    //     // Get the current user's ID from the request
    //     const userId = req.user._id;
    
    //     // Query the Like collection to find all likes by the current user
    //     const likes = await Like.find({ likedBy: userId });
    
    //     // If there are no likes, return an empty array
    //     if (!likes || likes.length === 0) {
    //         return res.status(200).json(new ApiResponse(200, [], "No liked videos found"));
    //     }
    
    //     // Extract the video IDs from the likes
    //     const videoIds = likes.map(like => like.video);
    
    //     // Query the Video collection to find all videos with the extracted video IDs
    //     const likedVideos = await Video.find({ _id: { $in: videoIds } });
    
    //     // Return the list of liked videos
    //     return res.status(200).json(new ApiResponse(200, likedVideos, "Liked videos retrieved successfully"));
    // });
    
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}