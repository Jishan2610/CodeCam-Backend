const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 1,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxLength: 50,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  roomsCreated: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  }],
  roomsJoined: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
