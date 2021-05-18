const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Business = mongoose.model("Business")

router.get('/businesses', (req, res) => {
  Business.find()
    .then((businesses) => {
      res.json({businesses})
    })
    .catch((error) => {
      console.log(error)
    })
})

router.get('/business/:id', (req, res) => {
  Business.findOne({ _id: req.params.id })
    .then(business => {
      res.json({ business })
    }).catch(err => {
      return res.status(404).json({ error: "Business not found "})
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

module.exports = router;