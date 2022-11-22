import express from "express";
import sse from "../sse";
import User from "../../schemas/User";
const app = express();

app.post("/event/logout", async (req, res) => {
  let { id, adminId } = req.body;
  console.log(`req.body`, id);
  console.log(`adminId`, adminId)
  try {
    sse.send(id + '||' + adminId, "logout_user");
    res.json({text: 'Użytkownik został wylogowany!', logout: true});
  } catch (error) {
    console.error(error);
    return res.status(500).send("Serwer error login!!!!.");
  }
});

app.post("/event/ban", async (req, res) => {
  let { id, adminId, ban } = req.body;
  console.log(`req.body`, id);
  console.log(`adminId`, adminId)
  try {
    const findFinalClientAccount = await User.findOne({_id: req.body.id});
    console.log(`findFinalClientAccount`, findFinalClientAccount)
    
    if(ban) {
      findFinalClientAccount.ban = true;
      sse.send(id + '||' + adminId, "ban_user");
      res.json({text: 'Użytkownik został zbanowany!', ban: true});
      return await findFinalClientAccount.save();
    } else {
      const { _id, firstName, email, lastName, bankAccountNumber } = findFinalClientAccount
      res.json({_id, firstName, email, lastName, bankAccountNumber});
    }
    console.log(`findFinalClientAccount`, findFinalClientAccount)
    
  } catch (error) {
    console.error(error);
    return res.status(500).send("Serwer error login!!!!.");
  }
});

module.exports = app;
