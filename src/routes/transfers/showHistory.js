import express from "express";
import { authenticate } from "../../config/authenticate";
import User from "../../schemas/User";
import Transfer from "../../schemas/Transfers";

const jwt = require("jsonwebtoken");
const app = express();

app.get("/", authenticate, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      console.log(err);
      if (user) return user;
      else false;
    });

    if (!user) {
      return res.status(500).send({ message: "Błędna autoryzacja" });
    }

    const userFind = await User.findById(user.id).select("-password");

    if (!userFind && !userFind.bankAccountNumber) {
      return res
        .status(400)
        .send({ message: "Nie ma takiego użytkownika o takim numerze konta!" });
    }
    // const fromClient = await Transfer.find({ fromNumber: userFind.bankAccountNumber })
    // console.log(`userFind.bankAccountNumber`, userFind.bankAccountNumber)
    let setOldDate = new Date();
    let setNewDate = new Date().setFullYear(new Date().getFullYear() - 1);

    console.log(`setOldDate`, setOldDate);
    console.log(`setNewDate`, setNewDate);

    const fromNumber = await Transfer.find({
      $or: [{ fromNumber: userFind.bankAccountNumber }],
    })
      .select("-body")
      .select("-toUser")
      .select("-fromUser");

    const toNumber = await Transfer.find({
      $and: [
        { date: { $gte: new Date(1372801816000) } },
        { date: { $lt: new Date(1373061846000) } },
      ],
      $or: [{ toNumber: userFind.bankAccountNumber }],
    })
      .select("-body")
      .select("-toUser")
      .select("-fromUser");

    let fromClient = {};
    fromNumber.forEach((transfer) => {
      const dataTransfer = transfer.createdAt.split("T")[0];
      if (fromClient[dataTransfer.substr(0,7)]) {
        fromClient[dataTransfer.substr(0,7)] =
          Number(fromClient[dataTransfer.substr(0,7)]) + Number(transfer.howMuchMoney);
      } else {
        fromClient[dataTransfer.substr(0,7)] = Number(transfer.howMuchMoney);
      }
    });

    let saveValue = 0;
    fromClient = Object.entries(fromClient).map(valueTransfer => {
      const newValue = ({
        [valueTransfer[0]]: valueTransfer[1] + saveValue
      })
      saveValue = valueTransfer[1] + saveValue
      return newValue;
    })


    let toClient = {};
    toNumber.forEach((transfer) => {
      const dataTransfer = transfer.createdAt.split("T")[0];
      if (toClient[dataTransfer.substr(0,7)]) {
        toClient[dataTransfer.substr(0,7)] =
          Number(toClient[dataTransfer.substr(0,7)]) + Number(transfer.howMuchMoney);
      } else {
        toClient[dataTransfer.substr(0,7)] = Number(transfer.howMuchMoney);
      }
    });
    saveValue = 0;
    toClient = Object.entries(toClient).map(valueTransfer => {
      const newValue = ({
        [valueTransfer[0]]: valueTransfer[1] + saveValue
      })
      saveValue = valueTransfer[1] + saveValue
      return newValue;
    })

    return res.send({ fromClient, toClient });
  } catch (error) {
    console.error("errorx2", error);
    return res.status(500).send("Serwer error login!!!!.");
  }
});

module.exports = app;
