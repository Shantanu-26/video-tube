import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary, deleteFromCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    let filter={}

    if(isValidObjectId(userId)){
        throw new ApiError(400, "User Id invalid")
    }

    if(query){
        filter.$or=[
            {
                title: {
                    $regex: query,
                    $options: 'i'
                },
            },
            {
                description: {
                    $regex: query,
                    $options: 'i'
                },
            },
        ]
    }

    if(userId){
        filter.owner=userId
    }

    let sortingCriteria={}
    if(sortBy){
        sortingCriteria[sortBy]=sortType==='desc'?-1:1              // If sortType is 'desc', it sets the sorting order to -1 (descending), otherwise, it sets it to 1 (ascending)
    }

    const videos=await Video.find(filter)
                            .sort(sortingCriteria)
                            .skip((page-1)*limit)
                            .limit(parseInt(limit))

    const totalCount=await Video.countDocuments(filter)                        

    return res
    .status(200)
    .json(
        new ApiResponse(200, videos, "All videos fetched successfully")
    )
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    if(!title || !description){
        throw new ApiError(401, "All fields are required")
    }

    const thumbnailLocalPath=req.files?.thumbnail[0]
    if(!thumbnailLocalPath){
        throw new ApiError(401, "Thumbnail file missing")
    }

    const videoLocalPath=req.files?.thumbnail[0]
    if(!videoLocalPath){
        throw new ApiError(401, "Video file is missing")
    }

    const thumbnail=await uploadOnCloudinary(thumbnailLocalPath)
    
    if(!thumbnail){
        throw new ApiError(401, "Video cannot be uploaded without thumbnail")
    }

    const video=await uploadOnCloudinary(videoLocalPath)

    if(!video){
        throw new ApiError(401, "Video is missing")
    }

    const data=await Video.create({
        video: video?.url,
        thumbnail: thumbnail?.url,
        title,
        description,
        duration: video?.duration,
        owner: req.user._id
    })

    const uploadedVideo=await Video.findById(video._id)

    if(!uploadedVideo){
        throw new ApiError(401, "Video could not be uploaded")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(201, uploadedVideo, "Video uploaded successfully")
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if(!videoId?.trim()){
        throw new ApiError(402, "Video Id is missing")
    }

    if(isValidObjectId(videoId)){
        throw new ApiError(402, "Video Id invalid")
    }

    const video=await Video.findById(videoId)

    if(!video){
        throw new ApiError(402, "Video is missing")
    }

    //Video needs to be added to watch history of user
    const user=User.findById(req.user?._id)

    user.watchHistory.push(videoId)

    await user.save({ validateBeforeSave: false})

    //incrementing number if views on video
    video.views+=1

    const view=await video.save({ validateBeforeSave: false})

    if(!view){
        throw new ApiError(402, "Number of views could not be incremented")
    }

    return res
    .status(202)
    .json(
        new ApiResponse(202, video, "Video fetched successfully")
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}