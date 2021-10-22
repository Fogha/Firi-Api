const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const Business = mongoose.model("Business")
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/keys.js')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const { SENDGRID_API, EMAIL } = require('../config/keys.js')

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: SENDGRID_API
  }
}))

router.post('/signup', (req, res) => {
  const { name, email, password, pic, role } = req.body
  if (!email || !password || !name || !role) {
    return res.status(422).json({ error: "please add all the fields" })
  }
  role === 'user' ?
    User.findOne({ email: email })
      .then((savedUser) => {
        if (savedUser) {
          return res.status(422).json({ error: "user already exists with that email" })
        }
        bcrypt.hash(password, 12)
          .then(hashedpassword => {
            const user = new User({
              email,
              password: hashedpassword,
              name,
              role,
              pic
            })

            user.save()
              .then(user => {
                const token = jwt.sign({ _id: user._id }, JWT_SECRET)
                const { _id, name, email, favorites, location, pic } = user
                res.json({ token, user: { _id, name, email, favorites, location, pic, role } })
                res.json({ message: "user created successfully" })
              })
              .catch(err => {
                console.log(err)
              })
          })

      })
      .catch(err => {
        console.log(err)
      }) : Business.findOne({ email })
        .then((savedBusiness) => {
          if (savedBusiness) {
            return res.status(422).json({ error: "Business already exists with that email" })
          }
          bcrypt.hash(password, 12)
            .then(hashedpassword => {
              const business = new Business({
                email,
                password: hashedpassword,
                name,
                role,
                pic
              })

              business.save()
                .then(business => {
                  const token = jwt.sign({ _id: business._id }, JWT_SECRET)
                  const { _id, name, email, location, pic } = business
                  res.json({ token, business: { _id, name, email, location, pic, role } })
                  res.json({ message: "business created successfully" })
                })
                .catch(err => {
                  console.log(err)
                })
            })
        })
})

router.post('/signin', (req, res) => {
  const { email, password, role } = req.body
  console.log(req.body);
  if (!email || !password || !role) {
    return res.status(422).json({ error: "please add email or password" })
  }
  role === 'user' ?
    (
      User.findOne({ email: email })
        .then(savedUser => {
          if (!savedUser) {
            return res.status(422).json({ errorMessage: "User not found" })
          }
          bcrypt.compare(password, savedUser.password)
            .then(doMatch => {
              if (doMatch) {
                // res.json({message:"successfully signed in"})
                const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                const { _id, name, email, favorites, location, pic } = savedUser
                res.status(200).json({ token, user: { _id, name, email, favorites, pic, location, role } })
              }
              else {
                return res.status(422).json({errorMessage: "Invalid Email or password" })
              }
            })
            .catch(err => {
              console.log(err)
            })
        })
    ) : (
      Business.findOne({ email: email })
        .then(savedBusiness => {
          if (!savedBusiness) {
            return res.status(422).json({ errorMessage: "Business not found" })
          }
          bcrypt.compare(password, savedBusiness.password)
            .then(doMatch => {
              if (doMatch) {
                // res.json({message:"successfully signed in"})
                const token = jwt.sign({ _id: savedBusiness._id }, JWT_SECRET)
                res.status(200).json({ token, business: savedBusiness })
              }
              else {
                return res.status(422).json({errorMessage: "Invalid Email or password" })
              }
            })
            .catch(err => {
              console.log(err)
            })
        })
    )
})

router.post('/reset-password', (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        return res.status(200).json({ userFound: true })
      }
      return res.status(422)
    }).catch(err => {
      return res.status(404).json({ error: "User not found" })
    })
})


router.post('/new-password', (req, res) => {
  const newPassword = req.body.password
  console.log(req.body);
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(422).json({ error: "User not found" })
      }
      bcrypt.hash(newPassword, 12).then(hashedpassword => {
        user.password = hashedpassword
        user.resetToken = undefined
        user.save().then((saveduser) => {
          res.status(200).json({ message: "password updated success" })
        })
      })
    }).catch(err => {
      console.log(err)
    })
})


module.exports = router
