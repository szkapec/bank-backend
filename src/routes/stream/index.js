import express from "express";
import sse from "../sse";

const app = express();

app.post("/event", async (req, res) => {
  let { id } = req.body;
  console.log(`req.body`, id);
  try {
    sse.send(id, "logout_user");
    res.json(id);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Serwer error login!!!!.");
  }
});

module.exports = app;
