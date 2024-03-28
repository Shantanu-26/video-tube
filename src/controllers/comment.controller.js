import mongoose, {isValidObjectId} from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if(!videoId?.trim()){
        throw new ApiError(400, "VideoId is missing")
    }

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Video Id is invalid")
    }

    const comments=await Comment.find({videoId})
    .skip((page-1)*limit)
    .limit(limit)

    return res
    .status(200)
    .json(
        new ApiResponse(200, Comment, "Comments fetched successfully")
    )

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId }=req.params
    const commentContent=req.body

    if(!videoId?.trim()){
        throw new ApiError(400, "Video Id is missing")
    }

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Video Id is invalid")
    }

    if(!commentContent){
        throw new ApiError(400, "Comment cannot be empty")
    }

    const comment=await Comment.create({              //creates a document called comment which is stored in the database
        content, 
        video: videoId,
        owner:req.body._id
    })

    const createdComment=await Comment.findById(comment._id)

    if(!createdComment){
        throw new ApiError(401, "Comment could not be uploaded")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(201, createdComment, "Comment added successfully")
    )

})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {content}=req.body
    const {commentId}=req.params

    if(!commentId?.trim()){
        throw new ApiError(400, "CommentId is missing")
    }

    if(isValidObjectId(commentId)){
        throw new ApiError(400, "Comment Id is invalid")
    }

    if(!content){
        throw new ApiError(400, "Content cannot be empty")
    }

    Comment.findOneAndUpdate({_id:commentId}, {})                    //This line is as such of no use as it just replaces the comment object with a blank object
    const updatedComment=await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content
            },
        },
        {
            new: true
        }
    )

    if(!updateComment){
        throw new ApiError(402, "Comment could not be updated")
    }

    return res
    .status(202)
    .json(
        202, updateComment, "Comment updated Successfully"
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId}=req.params
    
    if(!commentId?.trim()){
        throw new ApiError(403, "CommentId is missing")
    }

    if(!commentId){
        throw new ApiError(403, "Comment Id is invalid")
    }

    const deletedComment=await Comment.findByIdAndDelete(commentId)

    if(!deleteComment){
        throw new ApiError(403, "Comment could not be deleted")
    }

    return res
    .status(203)
    .json(
        new ApiResponse(203, "Comment updated successfully")
    )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
}