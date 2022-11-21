import jwt from "jsonwebtoken";
import express from "express";
import bcryptjs from "bcryptjs";
const {
  check,
  validationResult
} = require("express-validator")
import User from '../schemas/User';

const refresh = express();

refresh.post('/refresh',   [
  check('refreshToken', "Name is empty").not().isEmpty(),
],
  async(req,res) => {
  
  // na frontend trzymamy caly czas refreshToken
  const user = await User.findOne({ refreshToken: req.body.refreshToken }).select("-password");
  const email = req.body.email === user.email
  if(!email) {
    return res.status(404).send("Zły token!");
  }
  // const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.TOKEN_SECRET, { expiresIn: 86400 })

  // console.log(`newToken`, newToken)
  // res.json({ token });
  // console.log(`refreshToken`, refreshToken)

  // if(!refreshToken){
  //   return res.status(404)
  // }

  try {
    const token = await jwt.verify(req.body.refreshToken, process.env.REFRESH_TOKEN_SECRET)
    console.log(`true`, token)
    res.json({ token });
  } catch(err) {
    return res.sendStatus(403)
  }
})

module.exports = refresh;