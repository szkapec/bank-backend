import jwt from "jsonwebtoken";
import express from "express";
import User from "../../schemas/User";
import bcryptjs from "bcryptjs";

const app = express();

app.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      res.send({
        message: "Nie ma takiego użytkownika o takim e-mail",
      });
      return res.status(401).send("Nie ma takiego użytkownika o takim e-mail");
    }
    if (user.ban) {
      res.send({ message: "Twoje konto zostało zbanowane" });
      return res.status(401).send("Twoje konto zostało zbanowane");
    }

    let doPasswordsMatch = await bcryptjs.compare(password, user.password);
    if (!doPasswordsMatch) {
      res.send({ message: "Hasło nie pasuje" });
      return res.status(401).send("Hasło nie pasuje");
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.TOKEN_SECRET,
      { expiresIn: 325000 }
    );
    const refreshToken = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: 625000 }
    );
    let payload = {
      id: user._id,
      token,
      refreshToken,
      email: user.email,
      language: user.language,
      permission: user.permission,
      limit: user.limit,
      error: false,
      bankAccountNumber: user.bankAccountNumber,
      savedRecipients: user.savedRecipients,
      premium: user.premium,
      money: user.money,
      ban: user.ban,
      color: user.color,
      message: "Zalogowany",
    };

    res.json(payload);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Serwer error login!!!!.");
  }
});

module.exports = app;
