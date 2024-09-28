const express=require("express");
const userRouter=require("./user");
const roomRouter=require("./room")

const router=express.Router();



router.use("/user",userRouter);
router.use("/room",roomRouter);





module.exports=router;