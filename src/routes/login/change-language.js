import jwt from "jsonwebtoken";
import express from "express";
import User from "../../schemas/User";
import bcryptjs from "bcryptjs";

const app = express();

app.post("/change-language", async (req, res) => {
  try {
    const { language } = req.body;
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      const userAuth = jwt.verify(
        token,
        process.env.TOKEN_SECRET,
        (err, userAuth) => {
          console.log(err);
          if (userAuth) return userAuth;
          else false;
        }
      );

      const user = await User.findOne({ email: userAuth.email });
      if (user && language) {
        user.language = language;
        await user.save();
        return res.json({ message: "Zmieniono język", language });
      } else {
        return res.status(500).send({ message: "Nie wybrano języka" });
      }
    } catch (error) {
      console.log(`error`, error);
      return res
        .status(500)
        .send({ message: "Coś poszło nie tak", password: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Serwer error change-password!");
  }
});

module.exports = app;
