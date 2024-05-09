import jwt from "jsonwebtoken";
import express from "express";
import User from "../../schemas/User";
import bcryptjs from "bcryptjs";

const app = express();

app.get("/connect-account", async (req, res) => {
  try {
    try {
      const authHeader = req.headers["authorization"];
      console.log(`authHeader`, authHeader);
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
      if (!userAuth) {
        return res.status(500).send({ message: "Brak autoryzacji" });
      }
      let user = await User.findOne({
        email: userAuth.email,
      });

      console.log(`user`, user)
   

      return res.json({ message: "Wyświetlam id kont", connectAccount: user.connectAccount });
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
