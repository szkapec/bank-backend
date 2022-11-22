import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import express from "express";
import connectToDatabase from "./config/connectToDataBase";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

dotenv.config();

const app = express();
app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
connectToDatabase();

const Stream = require("./routes/sse/sse.route");
app.use("/", Stream);

const Register = require("./routes/register");
app.use("/api/users", Register);

const login = require("./routes/login");
app.use("/api/users", login);

const refresh = require("./routes/refreshToken");
app.use("/api/auth", refresh);

const users = require("./routes/users");
app.use("/api", users);

const auth = require("./routes/auth");
app.use("/api", auth);

const transfer = require("./routes/transfer");
app.use("/api", transfer);

const recipient = require("./routes/recipient/recipient");
app.use("/api", recipient);

const admin = require("./routes/admin/adminUsers");
app.use("/api", admin);

app.use('/', (req, res) => {
  res.send('Hello ;)')
})

const stream = require("./routes/stream");
app.use("/api", stream);

app.post("/api/auth/login", (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (email === "") {
      return res.sendStatus(403);
    }
    // const validPassword = await bcrypt.compare(password, user[0].password)

    const accessToken = jwt.sign(
      { id: 1, name: "matix" },
      process.env.TOKEN_SECRET,
      { expiresIn: 325000 }
    ); //stworz token

    //zapisac do bazy danych
    const refreshToken = jwt.sign(
      { id: 1, name: "matix" },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: 625000 }
    );
    res.send({ accessToken, refreshToken });
  } catch (error) {
    return res.sendStatus(403);
  }
});

app.listen(5000, () => {
  console.log(`wake up! xd`);
});
