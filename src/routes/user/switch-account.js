import jwt from "jsonwebtoken";
import express from "express";
import User from "../../schemas/User";
import bcryptjs from "bcryptjs";

const app = express();

app.post("/switch-account", async (req, res) => {
  const { accountId } = req.body;
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
      try {
        const user = await User.findOne({ email: userAuth.email }).select('-password');

        const findUserAccount = user.connectAccount.find(userAccount => userAccount.accountId === accountId)
        console.log(`findUserAccount`, findUserAccount)
        console.log(`user`, user)
        console.log(`accountId`, accountId)
        const switchUser = await User.findById(accountId).select('-password')
        console.log(`switchUser`, switchUser)
        const token = jwt.sign(
          { id: switchUser._id, name: switchUser.name, email: switchUser.email },
          process.env.TOKEN_SECRET,
          { expiresIn: 325000 }
        );
        
        if(findUserAccount){
          return res.json({ message: "Wyświetlam id kont", connectAccount: switchUser, token });
        } else {
          return res.status(400).send({ message: "Nie prawidłowe ID" });
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
