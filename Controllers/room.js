const Room = require("../Db/room")
const User = require('../Db/user');
const  zod  =require( "zod");

const roomSchema = zod.object({
  name: zod.string()
    .min(1, "Room name is required")
    .max(50, "Room name cannot exceed 50 characters")
 
});

const createRoom = async (req, res) => {
    try{
  const { name, language } = req.body;
  const userId = req.userId;  
  const {success} = roomSchema.safeParse({name});
  console.log(success)
  if (!success) {
    return res.status(411).json({
      message: "Room creation unsuccessfull , try other room names",
    });
  }

  
    // Create a new room
    const newRoom = await Room.create({
      name,
      creator: userId,
      language: language || 'JavaScript',  // Default language is JavaScript if not provided
    });

    // Add the room to the user's roomsCreated and roomsJoined arrays
    await User.findByIdAndUpdate({_id:userId}, {
      $push: { roomsCreated: newRoom._id, roomsJoined: newRoom._id },
    });

    res.status(201).json({
      message: 'Room created successfully',
      name:name,
      roomId: newRoom._id,  // Returning the roomId for future use
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server error, could not create room',
    });
  }
};
//Get rooms for specific userId
const getUserSpecificRooms=async (req,res)=>{
  try{
    const userId=req.userId?req.userId:req.body.userId;
    console.log(userId+" userId from controller ")
    // Step 1: Find the user by their userId
    const user = await User.findOne({ _id:userId });

    if (!user) {
      throw new Error('User not found');
    }
    console.log(user+" user from controller ")

    // Step 2: Get all room IDs (createdRooms + joinedRooms)
    const roomIds = [...user.roomsCreated, ...user.roomsJoined];

    if (roomIds.length === 0) {
      return res.status(400).json({
        rooms:[]
     })
    }

    // Step 3: Find all rooms that match the room IDs
    const allRooms = await Room.find({ _id: { $in: roomIds } });
    const rooms=allRooms.map(({_id,name,language,code,participants,
      lastUpdated})=>{
      return {_id,name,language,code,participants,lastUpdated};
    })
    res.status(200).json({
       rooms
    }) // Returning the room details
  }catch(err){

  }
}

module.exports = { createRoom ,getUserSpecificRooms};
