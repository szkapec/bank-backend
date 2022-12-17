import jwt from "jsonwebtoken";
import express from "express";
import User from "../../schemas/User";
import bcryptjs from "bcryptjs";
import { authenticate } from "../../config/authenticate";

const app = express();

app.post("/set-new-password", async (req, res) => {
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
    if (userAuth.email !== req.body.email) {
      return res.send({
        error: true,
        message: "Bledna autoryzacja!",
      });
    }
  } catch (error) {
    console.error("error", error);
    return res.status(500).send("Serwer error login!!!!.");
  }
  try {
    let { email, newPassword, oldPassword } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      res.send({
        error: true,
        message: "Nie ma takiego użytkownika o takim e-mail",
      });
      return res.status(401).send("Nie ma takiego użytkownika o takim e-mail");
    }
    const doPasswordsMatch = await bcryptjs.compare(oldPassword, user.password);
    if (!doPasswordsMatch) {
      return res.status(500).send("Hasło nie prawidłowe!");
    } else {
      const salt = await bcryptjs.genSalt(10);
      let hashedPassword = await bcryptjs.hash(newPassword, salt);
      user.password = hashedPassword;
      await user.save();
      return res.json({ message: "Zmieniono hasło", password: true });
    }
  } catch (error) {
    console.error("errorx2", error);
    return res.status(500).send("Serwer error login!!!!.");
  }
});

module.exports = app;
