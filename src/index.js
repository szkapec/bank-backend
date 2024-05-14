import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import express from "express";
import connectToDatabase from "./config/connectToDataBase";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import ServerlessHttp from "serverless-http";

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

const Register = require("./routes/login/register");
app.use("/api/users", Register);

const login = require("./routes/login/login");
app.use("/api/users", login);

const remindPassword = require('./routes/login/remind-password');
app.use("/api/users", remindPassword)

const remindCode = require('./routes/login/remind-code');
app.use("/api/users", remindCode)

const changePassword = require('./routes/login/change-password');
app.use("/api/users", changePassword)

const checkPassword = require('./routes/login/check-password');
app.use("/api/users", checkPassword)

const setNewPassword = require('./routes/login/set-new-password');
app.use("/api/users", setNewPassword)

const newConnectAccount = require('./routes/user/new-connect-account');
app.use("/api/users", newConnectAccount)

const connectAccount = require('./routes/user/connect-account');
app.use("/api/users", connectAccount)

const switchAccount = require('./routes/user/switch-account');
app.use("/api/users", switchAccount)

const refresh = require("./routes/auth/refreshToken");
app.use("/api/auth", refresh);

const languageChange = require("./routes/login/change-language")
app.use("/api/users", languageChange)

const limitChange = require("./routes/user/change-limit")
app.use("/api/users", limitChange)

const auth = require("./routes/auth/auth");
app.use("/api", auth);

const transfer = require("./routes/transfers/transfer");
app.use("/api", transfer);

const recipient = require("./routes/recipient/recipient");
app.use("/api", recipient);

const admin = require("./routes/admin/adminUsers");
app.use("/api", admin);

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

app.listen(5005, () => {
  console.log(`wake up! xd`);
});

module.exports = app;
module.exports.handler = ServerlessHttp(app);