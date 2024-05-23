import jwt from "jsonwebtoken";
import express from "express";
import User from "../../schemas/User";
import bcryptjs from "bcryptjs";

const app = express();

app.post("/separate-account", async (req, res) => {
  try {
    const { email, password } = req.body;
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
      if (!userAuth) {
        return res.status(500).send({ message: "global.noAuthorization" });
      }
      let loggedUser = await User.findOne({
        email: userAuth.email,
      });

      let disconnectUser = await User.findOne({ email });
      if (!disconnectUser) {
        return res
          .status(400)
          .send({ message: "global.noUser" });
      }
      if (disconnectUser.ban) {
        return res
          .status(400)
          .send({ message: "global.bannedAccount" });
      }

      let doPasswordsMatch = await bcryptjs.compare(
        password,
        disconnectUser.password
      );
      if (!doPasswordsMatch) {
        return res.status(400).send({ message: "global.passwordDoesntMatch" });
      }
      const isSelected = disconnectUser.connectAccount.find(
        (account) => account.accountId === loggedUser.id
      );

      if (!isSelected) {
        return res.status(400).send({ message: "offer.connectDoesntExist" });
      }

      disconnectUser.connectAccount = disconnectUser.connectAccount.filter(
        (connect) => connect.accountId !== loggedUser.id
      );

      loggedUser.connectAccount = loggedUser.connectAccount.filter(
        (connect) => connect.accountId !== disconnectUser.id
      );

      disconnectUser.save();
      loggedUser.save();

      return res.json({
        message: "offer.accountDisconnected",
        connectAccount: loggedUser.connectAccount,
      });
    } catch (error) {
      console.log(`error`, error);
      return res
        .status(500)
        .send({ message: "global.somethingWentWrong", password: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Serwer error separate-account!");
  }
});

module.exports = app;
