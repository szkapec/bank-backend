import jwt from "jsonwebtoken";
import express from "express";
import User from "../schemas/User";
import bcryptjs from "bcryptjs";

const app = express();

app.post("/register", async (req, res) => {
  try {
    let { firstName, lastName, email, password, country, sex } = req.body;
    let user = await User.findOne({
      email: email,
    }).select("-password");

    // let fetchUserName = await User.findOne({
    //   fetchUserName: userName,
    // }).select("-password");

    if (user) {
      res.send("taki email juz jest");
      return res.status(401).send("Taki email juz istnieje");
    }
    // if (fetchUserName === userName) {
    //   return res.status(401).send("Taki username juz istnieje");
    // }

    const refreshToken = jwt.sign({ firstName, lastName, email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: 325000 })

    const randomNumber = '921240' + Math.floor(Math.random() *  100000000000000);
    let newUser = new User({
      firstName,
      lastName,
      // userName,
      email,
      country,
      sex,
      password,
      createdAt: new Date().toISOString(),
      refreshToken,
      // token,
      bankAccountNumber: randomNumber,
      savedRecipients: [],
      money: 10,
      premium: false,
      ban: false,
    });

    const salt = await bcryptjs.genSalt(10);
    let hashedPassword = await bcryptjs.hash(password, salt);
    newUser.password = hashedPassword;
    await newUser.save(); //zapis w bazie danych

    const token = jwt.sign({ id: newUser._id, firstName: newUser.firstName, email: newUser.email }, process.env.TOKEN_SECRET, { expiresIn: 86400 })

    let payload = {
        id: newUser._id,
        token,
        refreshToken,
        sex,
        country,
        email: newUser.email,
        error: false,
        bankAccountNumber: newUser.bankAccountNumber,
        savedRecipients: newUser.savedRecipients,
        premium: newUser.premium,
        money: newUser.money,
        ban: newUser.ban,
        message: 'Zalogowany',
    };

    res.json(payload);
  } catch (error) {
    return res.status(500).send("Serwer error!!!!.", error);
  }
});

module.exports = app;