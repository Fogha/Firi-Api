const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const BusinessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  businessType: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  services: {
    type: Object,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  expireToken: Date,
  pic: {
    type: String,
    default: "https://images.pexels.com/photos/718261/pexels-photo-718261.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
  }
})

mongoose.model("Business", BusinessSchema)