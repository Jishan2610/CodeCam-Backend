const express=require('express');
const {authMiddleware}=require("../Middlewares/authMiddleware")
const {createRoom}=require("../Controllers/room")

const router=express.Router();

////<<--------------Room creation-------------->>
router.post("/create",authMiddleware,createRoom)


module.exports=router

