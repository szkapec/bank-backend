import jwt from "jsonwebtoken";
import express from "express";
import User from "../schemas/User";
import bcryptjs from "bcryptjs";
import { authenticate } from "../config/authenticate";

const app = express();

app.get('/users', authenticate, (req, res) => {
  const users = [{id: 1, name: 'Matix'}]
  res.send(users)
})

module.exports = app;