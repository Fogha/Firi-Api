const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  resetToken: String,
  expireToken: Date,
  pic: {
    type: String,
    default: "https://images.pexels.com/photos/718261/pexels-photo-718261.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
  },
  location: {
    type: String,
    default: "Anywhere"
  },
  favorites: {
    type: Array,
    default: []
  }
})

mongoose.model("User", userSchema)