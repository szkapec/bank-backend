import jwt from "jsonwebtoken";
import express from "express";
import User from "../../schemas/User";
import bcryptjs from "bcryptjs";

const app = express();

app.post("/new-connect-account", async (req, res) => {
  try {
    const { email, password } = req.body;
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
      let callBackNewConnectionToUser = await User.findOne({
        //uzytkownik na ktorym jestesmy zalogowani
        email: userAuth.email,
      });
      let newConnectionToUser = await User.findOne({ email }); //uzytkownik do ktorego chcemy sie polaczyc
      if (!newConnectionToUser) {
        return res
          .status(400)
          .send({ message: "Nie ma takiego użytkownika o takim e-mail" });
      }
      if (newConnectionToUser.ban) {
        return res
          .status(400)
          .send({ message: "Twoje konto zostało zbanowane" });
      }
      let doPasswordsMatch = await bcryptjs.compare(
        password,
        newConnectionToUser.password
      );
      if (!doPasswordsMatch) {
        return res.status(400).send({ message: "Hasło nie pasuje" });
      }
      const isSelected = newConnectionToUser.connectAccount.find(
        (account) => account.accountId === callBackNewConnectionToUser.id
      );
      const isSelectedMyAccount =
        callBackNewConnectionToUser.id === newConnectionToUser.id;

      if (isSelected || isSelectedMyAccount) {
        return res.status(400).send({ message: "Połączenie już istnieje" });
      }

      // const allConnectAccounts = [
      //   ...newConnectionToUser.connectAccount,
      //   ...callBackNewConnectionToUser.connectAccount,
      // ];
      // const uniqueAccounts = new Map(
      //   allConnectAccounts.map((account) => {
      //     return [account._id, account];
      //   })
      // );
      // const uniqueConnectAccounts = [...uniqueAccounts.values()];
    
      // newConnectionToUser.connectAccount = uniqueConnectAccounts;
      // callBackNewConnectionToUser.connectAccount = uniqueConnectAccounts

      newConnectionToUser.connectAccount.unshift({
        accountId: userAuth.id,
        accountName: callBackNewConnectionToUser.account,
        accountEmail: callBackNewConnectionToUser.email,
      });
      callBackNewConnectionToUser.connectAccount.unshift({
        accountId: newConnectionToUser.id,
        accountName: newConnectionToUser.account,
        accountEmail: newConnectionToUser.email,
      });

      newConnectionToUser.save();
      callBackNewConnectionToUser.save();

      // Moim celem zawodowym jest dalszy rozwój w technolgiach frontendowych oraz 
      return res.json({
        message: "Dodano konto",
        newAccount: callBackNewConnectionToUser,
      });
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
