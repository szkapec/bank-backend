import jwt from "jsonwebtoken";
import express from "express";
import User from "../../schemas/User";


const app = express();

app.post("/remind-code", async (req, res) => {
  try {
    const { code } = req.body;
    console.log(code);
    const users = await User.find()
      .select("-password")
      .select("-savedRecipients");
    console.log(`users`, users)
    const user = users.filter(user => user && user.remind && user.remind.key === code)
    console.log(`user`, user);
    if (user.length === 0) {
      return res.status(500).send({ message: "Kod jest nie prawidłowy" });
    } else {
      res.send({ code, email: user[0].email });
      // await user.save();
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Serwer error login!!!!.");
  }
});

module.exports = app;
