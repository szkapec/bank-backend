import jwt from "jsonwebtoken";
import express from "express";
import User from "../../schemas/User";
import bcryptjs from "bcryptjs";
import { authenticate } from "../../config/authenticate";

const app = express();

app.post("/check-password", authenticate, async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      // res.send({
      //   error: true,
      //   message: "Nie ma takiego użytkownika o takim e-mail",
      // });
      return res.status(500).send({ message: "Nie ma takiego uzytkownika o takim adresie" });
    }

    const doPasswordsMatch = await bcryptjs.compare(password, user.password);
    if (!doPasswordsMatch) {
      return res.status(500).send("Hasło nie prawidłowe!");
    } else {
      return res.json({ message: email });
    }

  } catch (error) {
    console.error('errorx2', error);
    return res.status(500).send("Serwer error login!!!!.");
  }
});

module.exports = app;
