const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const BusinessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  businessType: {
    type: String,
    default: ""
  },
  description: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    required: true
  },
  location: {
    type: String,
    default: "Everywhere"
  },
  services: {
    type: Object,
    default: {}
  },
  password: {
    type: String,
    required: true
  },
  reviews: {
    type: Array,
    default: []
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
  }
})

mongoose.model("Business", BusinessSchema)