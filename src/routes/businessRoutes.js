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
  let { userName, review, userId, userImg } = req.body;
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

router.post('/add-product/', (req, res) => {
  let { name, description, price, category, image, id } = req.body;
  console.log({ name, description, price, category, image, id });
  let d = new Date()

  Business.updateOne({ _id: id }, {
    $push: {
      "services.services": {
        name,
        price,
        description,
        category,
        image,
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
      res.status(422).json({ error: err })
    })
})

router.patch('/update-business-profile/:id', (req, res) => {
  console.log(req.body);
  console.log(req.params.id);
  let { name, email, pic, type, description, services } = req.body;
  Business.findByIdAndUpdate({_id: req.params.id}, {
    $set: {
      name,
      email,
      pic,
      type,
      description,
      'services.list': services
    }
  }, { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "pic cannot post" })
      }
      res.json(result)
    })
})
module.exports = router;