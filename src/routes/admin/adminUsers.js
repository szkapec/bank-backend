import jwt from "jsonwebtoken";
import express from "express";
import { authenticate } from "../../config/authenticate";
import User from "../../schemas/User";

const app = express();

app.post("/admin/users", authenticate, async (req, res) => {
  const { lastName, email, id } = req.body;

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  jwt.verify(token, process.env.TOKEN_SECRET, async (err, user) => {
    if (err) return res.sendStatus(403);
    if (!user.id) {
      res.send({
        error: true,
        message: "Nie jesteś zalogowany!",
      });
      return res.sendStatus(403);
    }
    try {
      const isAdmin = await User.findById(user.id);
      if (!isAdmin.premium) {
        return res.status(500).send({ message: "Nie jesteś adminem!" });
      }
    } catch (error) {
      return res
        .status(500)
        .send({ message: "Coś poszło nie tak, przepraszamy" });
    }
  });

  try {
    let users = await User.find()
      .select("-password")
      .select("-savedRecipients")
      .select("-refreshToken")
      .select("-money")
      .select("-bankAccountNumber");
    console.log(`id`, id);
    try {
      if (id) {
        users = users.filter((user) => user.id === id);
        if (users.length) {
          res.send({ users });
        } else {
          res
            .status(500)
            .send({ message: "Nie ma takiego użytkownika o podanym ID" });
        }
      } else {
        if (lastName || email) {
          let emailSearch = users.filter((user) => user.email === email);
          users = users.filter((user) => user.id !== emailSearch[0].id);
          let lastNameSearch = users.filter(
            (user) => user.lastName === lastName
          );
          res.send({ users: [...emailSearch, ...lastNameSearch] });
        } else {
          res.send({ users });
        }
      }
    } catch (error) {
      return res.status(500).send({ message: "Nie ma takiego użytkownika" });
    }
  } catch (error) {
    return res.status(500).send({ message: "Coś poszło nie tak" });
  }
});


app.post("/admin/ban", authenticate, async (req, res) => {
  const { lastName, email, id } = req.body;

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  jwt.verify(token, process.env.TOKEN_SECRET, async (err, user) => {
    if (err) return res.sendStatus(403);
    if (!user.id) {
      res.send({
        error: true,
        message: "Nie jesteś zalogowany!",
      });
      return res.sendStatus(403);
    }
    try {
      const isAdmin = await User.findById(user.id);
      if (!isAdmin.premium) {
        return res.status(500).send({ message: "Nie jesteś adminem!" });
      }
    } catch (error) {
      return res
        .status(500)
        .send({ message: "Coś poszło nie tak, przepraszamy" });
    }
  });

  try {
    let users = await User.find()
      .select("-password")
      .select("-savedRecipients")
      .select("-refreshToken")
      .select("-money")
      .select("-bankAccountNumber");
    console.log(`id`, id);
    try {
      if (id) {
        users = users.filter((user) => user.id === id);
        if (users.length) {
          res.send({ users });
        } else {
          res
            .status(500)
            .send({ message: "Nie ma takiego użytkownika o podanym ID" });
        }
      } else {
        if (lastName || email) {
          let emailSearch = users.filter((user) => user.email === email);
          users = users.filter((user) => user.id !== emailSearch[0].id);
          let lastNameSearch = users.filter(
            (user) => user.lastName === lastName
          );
          res.send({ users: [...emailSearch, ...lastNameSearch] });
        } else {
          res.send({ users });
        }
      }
    } catch (error) {
      return res.status(500).send({ message: "Nie ma takiego użytkownika" });
    }
  } catch (error) {
    return res.status(500).send({ message: "Coś poszło nie tak" });
  }
});

module.exports = app;
