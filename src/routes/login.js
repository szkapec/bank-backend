import jwt from "jsonwebtoken";
import express from "express";
import User from "../schemas/User";
import bcryptjs from "bcryptjs";

const app = express();

app.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    let user = await User.findOne({ email });
  
    if (!user) {
      // res.send("Nie ma taiego uzytkownika o takim e-mail");
      // return res.status(404).send("Nie ma taiego uzytkownika2 o takim e-mail");
      return res.status(401).json("Nie ma takiego użytkownika o takim e-mail");
    }

    let doPasswordsMatch = await bcryptjs.compare(password, user.password);
    console.log('user', user)
    if (!doPasswordsMatch) {
      return res.status(401).json("Hasło nie pasuje");
    }
    // const token = {
    //   const accessToken = jwt.sign({ id: 1, name: 'matix' }, process.env.TOKEN_SECRET, { expiresIn: 86400 }) //stworz token
    // }
    const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.TOKEN_SECRET, { expiresIn: 325000 })
    const refreshToken = jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: 625000 })
    let payload = {
        id: user._id,
        token,
        refreshToken,
        email: user.email,
        error: false,
        bankAccountNumber: user.bankAccountNumber,
        savedRecipients: user.savedRecipients,
        premium: user.premium,
        money: user.money,
        message: 'Zalogowany',
    };

    res.json(payload);

  } catch (error) {
    console.error(error);
    return res.status(500).send("Serwer error login!!!!.");
  }
});

module.exports = app;