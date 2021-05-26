const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const User = mongoose.model("User")

router.get('/users', (req, res) => {
  User.find()
    .then((users) => {
      res.json({users})
    })
    .catch(err => {
      console.error(err)
    })
})

router.get('/user/:id', requireLogin, (req, res) => {
  User.findOne({ _id: req.params.id })
    .then(user => {
      res.json({ user })
    }).catch(err => {
      return res.status(404).json({ error: "User not found" })
    })
})

router.put('/add-favorite', requireLogin, (req, res) => {

  User.findByIdAndUpdate(req.user._id, {
    $push: { favorites: req.user._id }
  }, { new: true }).select("-password").then(result => {
    res.json(result)
  }).catch(err => {
    return res.status(422).json({ error: err })
  })
  
})

router.put('/remove-favorite', requireLogin, (req, res) => {  
  User.findByIdAndUpdate(req.user._id, {
    $pull: { favorites: req.business.unfollowId }
  }, { new: true }).select("-password").then(result => {
    res.json(result)
  }).catch(err => {
    return res.status(422).json({ error: err })
  })
})

router.put('/updatepic', requireLogin, (req, res) => {
  User.findByIdAndUpdate(req.user._id, { $set: { pic: req.body.pic } }, { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "pic canot post" })
      }
      res.json(result)
    })
})

router.post('/search-users', (req, res) => {
  let userPattern = new RegExp("^" + req.body.query)
  User.find({ email: { $regex: userPattern } })
    .select("_id email")
    .then(user => {
      res.json({ user })
    }).catch(err => {
      console.log(err)
    })

})

module.exports = router