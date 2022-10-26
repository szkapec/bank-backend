import express from "express";
import authenticateToken from './authenticateToken'
import User from "../schemas/User";

const app = express();

app.get("/auth/:user_id", authenticateToken, async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.params.user_id }).select("-password");

    if(!user) {
      return res.status(403).send('Nie ma takiego uzytwkonika o tym ID');
    }
    
    console.log(`user`, user)
    const { _id, token, refreshToken, email, bankAccountNumber, money, premium} = user
    let payload = {
        id: _id,
        token,
        refreshToken,
        email,
        error: false,
        bankAccountNumber,
        premium,
        money,
        message: 'Zalogowany',
    };
    console.log(`payload`, payload)
    res.json(payload);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Serwer error login!!!!.");
  }
});

module.exports = app;