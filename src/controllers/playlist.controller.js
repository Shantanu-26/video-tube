import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {Video} from "../models/video.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    //TODO: create playlist
    if(!name || !description){
        throw new ApiError(400, "All fields are required")
    }

    const playlist=await Playlist.create({
        name,
        description,
        owner: req.user._id
    })

    const createdPlaylist=await Playlist.findById(playlist._id)
    if(!createdPlaylist){
        throw new ApiError(400, "Playlist could not be created")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, createdPlaylist, "Playlist created successfully")
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if(!userId){
        throw new ApiError(401, "User Id is missing")
    }

    if(isValidObjectId(userId)){
        throw new ApiError(401, "Invalid User Id")
    }

    const playlists=await Playlist.find({
        owner: userId,
    })

    if(!playlists){
        throw new ApiError(401, "Playists could not be fetched")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(201, playlists, "Playlists fetched successfully")
    )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if(!playlistId){
        throw new ApiError(402, "Playlist Id is missing")
    }

    if(!isValidObjectId(playlistId)){
        throw new ApiError(402, "Invalid Playlist Id")
    }

    const playlist=await Playlist.findById((playlistId))
    if(!playlist){
        throw new ApiError(402, "Playlist could not be fetched")
    }

    return res
    .status(202)
    .json(202, playlist, "Playlist fetched successfully")
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!isValidObjectId(playlistId)){
        throw new ApiError(403, "Invalid Playlist Id")
    }

    if(!isValidObjectId(videoId)){
        throw new ApiError(403, "Invalid Video Id")
    }

    const playlist=await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(400, "Playlist not found")
    }

    const video=await Video.findById(videoId)

    if(!videoId){
        throw new ApiError(403, "Video not found")
    }

    playlist.videos.push(videoId)

    const updatedPlayList=await playlist.save({ validateBeforeSave: false })

    if(!updatedPlayList){
        throw new ApiError(403, "Could not add video to playlist")
    }

    return res
    .status(203)
    .json(
        new ApiResponse(203, updatedPlayList, "Video added to playlist successfully")
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if(!playlistId){
        throw new ApiError(404, "Invalid Playlist Id")
    }

    if(!videoId){
        throw new ApiError(404, "Invalid Video Id")
    }

    const playlist=await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }

    const video=await Video.findById(videoId)

    if(!video){
        throw new ApiError(404, "Video not found")
    }

    playlist.videos.pull(videoId)

    const updatedPlayList=await Playlist.save({ validateBeforeSave:false })

    if(!updatePlaylist){
        throw new ApiError(404, "Video could not be removed")
    }

    return res
    .status(204)
    .json(
        new ApiResponse(204, updatePlaylist, "Video removed from playlist successflly")
    )
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!isValidObjectId(playlistId)){
        throw new ApiError(405, "Playlist Id valid")
    }

    const deletedPlaylist=await Playlist.findByIdAndDelete(playlistId)
    
    if(!deletePlaylist){
        throw new ApiError(400, "Playlist could not be deleted")
    }

    return res
    .status(205)
    .json(
        new ApiResponse(205, {}, "Playlist deleted successfully")
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if(!isValidObjectId(playlistId)){
        throw new ApiError(406, "Playlist Id Invalid")
    }

    if(!name || !description){
        throw new ApiError(406, "All fields are required")
    }

    const updatedPlaylist=await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name,
                description,
            },
        },
        {
            new: true
        }
    )

    if(!updatedPlaylist){
        throw new ApiError(406, "Playlist could not be updated")
    }

    return res
    .status(206)
    .json(
        new ApiResponse(206, updatedPlaylist, "Playlist updated successfully")
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}