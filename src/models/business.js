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
  image: {
    type: String,
    default: "https://icon-library.com/images/business-owner-icon/business-owner-icon-15.jpg"
  }
})

mongoose.model("Business", BusinessSchema)