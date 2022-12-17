import jwt from "jsonwebtoken";
import express from "express";
import User from "../../schemas/User";
import bcryptjs from "bcryptjs";

const app = express();

app.post("/change-password", async (req, res) => {
  try {
    const { code, email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if(user.remind.key === code) {
        const salt = await bcryptjs.genSalt(10);
        let hashedPassword = await bcryptjs.hash(password, salt);
        user.password = hashedPassword;
        await user.save();
        return res.json({ message: 'Zmieniono hasło', password: true });
      }
    } catch (error) {
      console.log(`error`, error)
      return res.status(500).send({ message: "Coś poszło nie tak", password: false });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).send("Serwer error change-password!");
  }
});

module.exports = app;
