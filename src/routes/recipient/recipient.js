import jwt from "jsonwebtoken";
import express from "express";
import bcryptjs from "bcryptjs";
import { authenticate } from "../../config/authenticate";
import User from "../../schemas/User";

const app = express();

app.get("/recipient", authenticate, (req, res) => {
  console.log(`req.body`, req.body);
  const users = [{ id: 1, name: "Matix" }];

  res.send(users);
});

app.put("/recipient", authenticate, async (req, res) => {
  const {
    recipientsAccount,
    recipientsAdress,
    recipientsName,
    sum,
    title,
    toRecipient,
    trustedRecipient,
    id,
  } = req.body;

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    if (id !== user.id) {
      res.send({
        error: true,
        message: "Nie możesz dodać odbiorcy nie do swojego konta!",
      });
      return res.sendStatus(403);
    }
  });

  try {
    const user = await User.findById(id);
    if (!user) {
      res.send({
        error: true,
        message: "Nie ma takiego użytkownika",
      });
      return res.sendStatus(400);
    }
    const newRecipient = {
      recipientsAccount,
      recipientsAdress,
      recipientsName,
      sum,
      createdAt: new Date().toISOString(),
      title,
      toRecipient,
      trustedRecipient,
    };

    user.savedRecipients.unshift(newRecipient);
    res.send(user.savedRecipients);
    await user.save();
  } catch (error) {
    res.send({
      error: true,
      message: "Coś poszło nie tak",
    });
    return res.sendStatus(500);
  }
});

app.get("/recipient/:user_id", authenticate, async (req, res) => {
  const { user_id } = req.params;
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    if (user_id !== user.id) {
      res.send({
        error: true,
        message: "Nie możesz zobaczyć odbiorców",
      });
      return res.sendStatus(403);
    }
  });

  try {
    const user = await User.findById(user_id).select("-password");
    if (!user) {
      return res.status(403).send("Nie ma takiego uzytwkonika o tym ID");
    }
    return res.json(user.savedRecipients);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Serwer error login!!!!.");
  }
});

app.patch("/recipient/edit", authenticate, async (req, res) => {
  const {
    recipientsAccount,
    recipientsAdress,
    recipientsName,
    sum,
    title,
    toRecipient,
    trustedRecipient,
    _id,
  } = req.body;

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  let idUser;
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    console.log(`id`, _id);
    console.log(`user.id`, user.id);
    if (!user.id) {
      return res.status(403).send({ message: "Nie jestes zalogowany" });
    } else {
      idUser = user;
    }
  });

  try {
    const user = await User.findById(idUser.id);
    if (!user) {
      return res.status(400).send({ message: "Cos poszło nie tak" });
    }
    console.log(`id`, _id);
    let changeIndex;
    const newUsers = user.savedRecipients.find((saved, index) => {
      changeIndex = index;
      console.log(`saved._id.toString()`, saved._id.toString());
      return saved._id.toString() === _id;
    });
    if (!newUsers) {
      return res.status(400).send({ message: "Nie ma takiego zapisanego przelewu" });
    }
    console.log(`newUsers`, newUsers);
    const newRecipient = {
      recipientsAccount,
      recipientsAdress,
      recipientsName,
      sum,
      createdAt: new Date().toISOString(),
      title,
      toRecipient,
      trustedRecipient,
    };

    user.savedRecipients[changeIndex] = newRecipient;
    res.send(user.savedRecipients);
    await user.save();
  } catch (error) {
    return res.status(500).send({ message: "Coś poszło nie tak" });
  }
});

app.delete("/recipient/:recipient_id", authenticate, async (req, res) => {
  try {
    const { recipient_id } = req.params;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    let idUser;
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      if (!user.id) {
        res.send({
          error: true,
          message: "Nie jesteś zalogowany!",
        });
        return res.sendStatus(403);
      } else {
        idUser = user;
      }
    });
    let user = await User.findById(idUser.id);
    if (!user) {
      res.send({
        error: true,
        message: "Brak autoryzacji",
      });
      return res.sendStatus(400);
    }
    const filterUser = user.savedRecipients.filter(
      (recipient) => recipient._id.toString() !== recipient_id
    );
    user.savedRecipients = filterUser;
    res.send(user.savedRecipients);
    await user.save();
  } catch (error) {
    console.error(error);
    return res.status(500).json("Server Error...");
  }
});

module.exports = app;
