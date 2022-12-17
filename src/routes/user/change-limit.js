import jwt from "jsonwebtoken";
import express from "express";
import User from "../../schemas/User";

const app = express();

app.post("/change-limit", async (req, res) => {
  try {
    const { limitDay, limitMouth, limitFull } = req.body;
    
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
      if (user) {
        if (limitDay) {
          user.limit.limitDay = limitDay;
        }

        if (limitMouth) {
          user.limit.limitMouth = limitMouth;
        }

        if (limitFull) {
          user.limit.limitFull = limitFull;
        }

        await user.save();
        return res.json({ message: "Zmieniono limit", limit: user.limit });
      } else {
        return res.status(500).send({ message: "Nie ma takiego użytkownika" });
      }
    } catch (error) {
      console.log(`error`, error);
      return res
        .status(500)
        .send({ message: "Coś poszło nie tak", password: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Serwer error change-limit!");
  }
});

module.exports = app;
