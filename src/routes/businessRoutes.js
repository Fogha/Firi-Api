const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Business = mongoose.model("Business")

router.get('/businesses', (req, res) => {
  Business.find()
    .then((businesses) => {
      res.json({ businesses })
    })
    .catch((error) => {
      console.log(error)
    })
})

router.get('/business/:id', (req, res) => {
  console.log(req.params.id);
  Business.findById({ _id: req.params.id })
    .then(business => {
      res.json({ business })
    }).catch(err => {
      console.log(err);
      return res.status(404).json({ error: "Business not found " })
    })
})

router.post('/search-business', (req, res) => {
  let businessPattern = new RegExp("^" + req.body.query)
  Business.find({ name: { $regex: businessPattern } })
    .select("_id name")
    .then(business => {
      res.json({ business })
    }).catch(err => {
      console.log(err);
    })
})

router.put('/add-review/:id', (req, res) => {
  let userName = req.body.userName;
  let review = req.body.review;
  let userId = req.body.userId;
  let userImg = req.body.userImg;
  console.log(userImg);
  let d = new Date();
  Business.findByIdAndUpdate(req.params.id, {
    $push: {
      reviews: {
        userName,
        userId,
        userImg,
        review,
        time: `${d.getHours() + ":" + d.getMinutes()}`,
        date: `${d.getFullYear() + "-" + d.getMonth() + "-" + d.getDay()}`
      }
    }
  }, { new: true, useFindAndModify: false }).select("-password")
    .then(result => {
      console.log(result);
      res.json(result)
    }).catch(err => {
      console.log(err);
      return res.status(422).json({ error: err })
    })
})

module.exports = router;