const express=require('express');
const {authMiddleware}=require("../Middlewares/authMiddleware")
const {createRoom,getUserSpecificRooms}=require("../Controllers/room");
const { getUser } = require('../Controllers/user');


const router=express.Router();

////<<--------------Room creation-------------->>
router.post("/create",authMiddleware,createRoom)
////<<--------------Get User Specific Rooms-------------->>
router.get("/getRooms",authMiddleware
    ,getUserSpecificRooms)

module.exports=router

