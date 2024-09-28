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
      roomId: newRoom._id,  // Returning the roomId for future use
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server error, could not create room',
    });
  }
};

module.exports = { createRoom };
