import jwt from "jsonwebtoken";
import express from "express";
import User from '../../schemas/User'
import bcryptjs from "bcryptjs";

const app = express();

app.post("/register", async (req, res) => {
  try {
    console.log('reqxxxxxxxxxxd2', req.body)
    // console.log('resxxxxxxxxxxxxd', res)
    let { firstName, lastName, email, password, country, sex, account } = req.body;
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
    console.log('refreshTokenxxxxxxxxxxd', refreshToken)
    const randomNumber = '921240' + Math.floor(Math.random() *  100000000000000);
    let newUser = new User({
      firstName,
      lastName,
      // userName,
      email,
      country,
      language: country,
      account,
      permission: ['done'],
      sex,
      password,
      createdAt: new Date().toISOString(),
      refreshToken,
      // token,
      bankAccountNumber: randomNumber,
      savedRecipients: [],
      connectAccount: [],
      money: 10,
      premium: false,
      ban: false,
      color: 'light',
      limit: {
        limitDay: 50,
        limitMouth: 500,
        limitFull: 250,
      }
    });

    const salt = await bcryptjs.genSalt(10);
    let hashedPassword = await bcryptjs.hash(password, salt);
    newUser.password = hashedPassword;
    await newUser.save(); //zapis w bazie danych

    const token = jwt.sign({ id: newUser._id, firstName: newUser.firstName, email: newUser.email }, process.env.TOKEN_SECRET, { expiresIn: 86400 })
    console.log('token xxxxxxxxxxxxxxxxxxxxxxxxxxxx', token)
    let payload = {
        id: newUser._id,
        token,
        refreshToken,
        sex,
        country,
        email: newUser.email,
        language: newUser.language,
        country: newUser.country,
        permission: newUser.permission,
        error: false,
        bankAccountNumber: newUser.bankAccountNumber,
        savedRecipients: newUser.savedRecipients,
        premium: newUser.premium,
        money: newUser.money,
        ban: newUser.ban,
        color: newUser.color,
        limit: newUser.limit,
        account: newUser.account,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        connectAccount: newUser.connectAccount,
        message: 'Zalogowany',
    };

    res.json(payload);
  } catch (error) {
    return res.status(500).send("Serwer error!!!!.", error);
  }
});

module.exports = app;