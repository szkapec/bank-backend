import jwt from "jsonwebtoken";
import express from "express";
import User from "../../schemas/User";
import nodemailer from 'nodemailer';


const app = express();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_NAME,
    pass: process.env.EMAIL_PASSWORD
  }
})

app.post("/remind-password", async (req, res) => {
  try {
    let { email } = req.body;
    console.log(email);
    let user = await User.findOne({ email })
      .select("-password")
      .select("-savedRecipients");
    console.log(`user`, user);
    if (user) {
      const newRemind = {
        createdAt: new Date().toISOString(),
        key: Math.floor(Math.random() * 1000000000),
      };

      const info = await transporter.sendMail({
        to: email,
        from: process.env.EMAIL_NAME,
        subject: "Subject",
        text: `This is the content ${newRemind.key}`
      })
      nodemailer.getTestMessageUrl(info)
   
      user.remind = newRemind;
      console.log(`user.remind`, newRemind)
      res.send({ email });
      await user.save();
    }
    return res.status(200).send();
    
  } catch (error) {
    console.error(error);
    return res.status(500).send("Serwer error login!!!!.");
  }
});

module.exports = app;
