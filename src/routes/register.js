import jwt from "jsonwebtoken";
import express from "express";
import User from "../schemas/User";
import bcryptjs from "bcryptjs";

const app = express();

app.post("/register", async (req, res) => {
  try {
    let { name, lastName, userName, email, password } = req.body;
    let user = await User.findOne({
      email: email,
    }).select("-password");
    console.log(`user`, user);

    let fetchUserName = await User.findOne({
      fetchUserName: userName,
    }).select("-password");

    if (user) {
      res.send("taki email juz jest");
      return res.status(401).send("Taki email juz istnieje");
    }
    if (fetchUserName === userName) {
      return res.status(401).send("Taki username juz istnieje");
    }
    console.log(`userName`, userName);
    console.log(`email`, email)
    const refreshToken = jwt.sign({ name, userName, email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: 325000 })
    const token = jwt.sign({ name, userName, email }, process.env.TOKEN_SECRET, { expiresIn: 86400 })
    const randomNumber = '921240' + Math.floor(Math.random() *  100000000000000);
    let newUser = new User({
      name,
      lastName,
      userName,
      email,
      password,
      createdAt: new Date().toISOString(),
      refreshToken,
      token,
      bankAccountNumber: randomNumber,
      savedRecipients: [],
      money: 10,
      premium: false
    });
    console.log(`newUser`, newUser);

    const salt = await bcryptjs.genSalt(10);
    console.log(`salt`, salt);
    let hashedPassword = await bcryptjs.hash(password, salt);
    console.log(`hashedPassword`, hashedPassword);
    newUser.password = hashedPassword;

    await newUser.save(); //zapis w bazie danych

    let payload = {
        id: newUser._id,
        token,
        refreshToken,
        email: newUser.email,
        error: false,
        bankAccountNumber: newUser.bankAccountNumber,
        savedRecipients: newUser.savedRecipients,
        transfers: newUser.transfers,
        premium: newUser.premium,
        money: newUser.money,
        message: 'Zalogowany',
    };

    res.json(payload);
  } catch (error) {
    return res.status(500).send("Serwer error!!!!.", error);
  }
});

module.exports = app;