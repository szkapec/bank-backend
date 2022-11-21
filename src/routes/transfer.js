import express from "express";
import User from "../schemas/User";
import Transfer from "../schemas/Transfers";
import { authenticate } from "../config/authenticate";
const jwt = require("jsonwebtoken");

const app = express();

app.post("/transfer", authenticate, async (req, res) => {
  try {
    // console.log(`req.body`, req.body)
    const {
      numberSend,
      numberReceived,
      email,
      howMuchMoney,
      myIdUser,
      body,
    } = req.body;

    const findFinalClientAccount = await User.findOne({
      bankAccountNumber: numberReceived,
    });
    if (findFinalClientAccount) {
      console.log(`użytkownik istnieje`);
    } else {
      console.log(`Nie ma takiego użytkownika o podanym numerze kontaa!!`);
      return res.status(500).send({message: 'Nie ma takiego użytkownika o podanym numerze kontaa!'});
    }

    if (howMuchMoney > 0) {
    } else {
      console.log(`Przelew na mniej niż 0zł`);
      res.send({ error: true, message: "Przelew na mniej niż 0zł" });
      return res.status(401).send("Przelew na mniej niż 0zł");
    }

    const findUserAccountNumber = await User.findOne({
      bankAccountNumber: numberSend,
    });
    const findUserIdNumber = await User.findById(myIdUser);

    if (findUserAccountNumber && findUserIdNumber) {
      if (
        findUserIdNumber.bankAccountNumber ===
        findUserAccountNumber.bankAccountNumber
      ) {
        console.log(`Ten sam user`);
      } else {
        console.log(`Nie można zrobić przelewu z nie ze swojego konta!!`);
        res.send({
          error: true,
          message: "Nie można zrobić przelewu z nie ze swojego konta!!",
        });
        return res
          .status(401)
          .send("Nie można zrobić przelewu z nie ze swojego konta!!");
      }
    } else {
      console.log(`Coś poszło nie tak`);
      res.send({ error: true, message: "Coś poszło nie tak" });
      return res.status(500).send("Coś poszło nie tak");
    }

    const valueMoney =
      Number(findUserAccountNumber.money) - Number(howMuchMoney);
    if (valueMoney >= 0) {
      findUserAccountNumber.money = valueMoney;
    } else {
      return res.status(500).send({ message: "Brak wystarczającej ilości pięniędzy!" });
    }
    if (Number(howMuchMoney) > 0) {
      findFinalClientAccount.money =
        Number(findFinalClientAccount.money) + Number(howMuchMoney);
    } else {
      res.send({ error: true, message: "Coś poszło nie tak, przepraszamy ;(" });
      return res.status(500).send("Coś poszło nie tak, przepraszamy ;(");
    }

    const newUserTransfer = new Transfer({
      fromUser: {
        bankAccountNumber: findUserAccountNumber.bankAccountNumber,
        email: findUserAccountNumber.email,
        id: findUserAccountNumber._id,
        firstName: findUserAccountNumber.firstName,
        lastName: findUserAccountNumber.lastName,
        
      },
      toUser: {
        bankAccountNumber: findFinalClientAccount.bankAccountNumber,
        email: findFinalClientAccount.email,
        id: findFinalClientAccount._id,
        firstName: findFinalClientAccount.firstName,
        lastName: findFinalClientAccount.lastName,
      },
      fromNumber: findUserAccountNumber.bankAccountNumber,
      toNumber: findFinalClientAccount.bankAccountNumber,
      body,
      howMuchMoney,
      createdAt: new Date().toISOString(),
    });

    if (findFinalClientAccount && findUserAccountNumber) {
      await newUserTransfer.save();
      const newTransfer = await findUserAccountNumber.save();
      newTransfer.message = "Przelew wykonany!";
      newTransfer.error = false;
      await findFinalClientAccount.save();
      return res.send(newUserTransfer);
    } else {
      res.send({ error: true, message: "Błąd podczas zapisu danych" });
      return res.status(500).send("Błąd podczas zapisu danych");
    }
  } catch (error) {
    console.log(`error`, error);
    res.send(error);
  }
});

app.get("/transfers/:bankAccountNumber/:pageNumber", authenticate, async (req, res) => {

  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      console.log(err);
      if (user) return user;
      else false
    });

    if(!user) {
      return res.send({
        error: true,
        message: "Bledna autoryzacja!",
      });
    }

    const userFind = await User.findById(user.id);
    
    if(!userFind && !userFind.bankAccountNumber) {
      return res.send({
        error: true,
        message: "NIe ma takiego użytkownika o tym numerze konta",
      });
    }
    // console.log(`req.params.bankAccountNumber`, req.params.bankAccountNumber)
    // console.log(`userFind.bankAccountNumber`, userFind.bankAccountNumber)
    // console.log(` req.params.pageNumber`,  req.params.pageNumber )
    if (userFind.bankAccountNumber === req.params.bankAccountNumber) {
      let skip = (req.params.pageNumber - 1) * 5
      console.log(`skip`, skip)
      const fromClient = await Transfer.find({
        $or: [
          { fromNumber: req.params.bankAccountNumber },
          { toNumber: req.params.bankAccountNumber },
        ],
        // $slice: [1,4]
      }).sort({ $natural: -1 } ).skip(skip).limit(5)//{fromClient:{$slice: [2, 10]}}   .limit(10) 
      return res.send({ fromClient, message: "Jest w pyte!" });
    } else {
      res.send({
        error: true,
        message: "Nie możesz zobaczyć nie swojej historii przelewów!!",
      });
      return res
        .status(401)
        .send("Nie możesz zobaczyć nie swojej historii przelewów!!");
    }
  } catch (error) {
    console.log(`error`, error);
    res.send(error);
  }
});

module.exports = app;
