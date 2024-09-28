const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User who created the room
    required: true,
  },
  language: {
    type: String,
    default: 'JavaScript',  // Default language for the room
  },
  code: {
    type: String,
    default: '',  // Room code, empty initially
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // Users who have joined the room
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
