import express from "express";
import User from "../schemas/User";
import Transfer from "../schemas/Transfers";
import { authenticate } from "../config/authenticate";

const app = express();

app.post('/transfer', authenticate, async(req, res) => {
 try {
  // console.log(`req.body`, req.body)
  const users = [{id: 1, name: 'Matix'}]
  const { numberSend, numberReceived, username, howMuchMoney, myIdUser, body } = req.body


  const findFinalClientAccount = await User.findOne({bankAccountNumber: numberReceived});
  if(findFinalClientAccount) {
    console.log(`użytkownik istnieje`)
  } else {
    console.log(`Nie ma takiego użytkownika o podanym numerze konta!!`)
    res.send({error: true, message: "Nie ma takiego użytkownika o podanym numerze konta!!"})
    return res.status(401).send("Nie ma takiego użytkownika o podanym numerze konta!!");
  }
  
  if(howMuchMoney > 0) {

  } else {
    console.log(`Przelew na mniej niż 0zł`)
    res.send({error: true, message: "Przelew na mniej niż 0zł"})
    return res.status(401).send("Przelew na mniej niż 0zł");
  }

  const findUserAccountNumber = await User.findOne({bankAccountNumber: numberSend});
  const findUserIdNumber = await User.findById(myIdUser);

  if(findUserAccountNumber && findUserIdNumber) {
    if(findUserIdNumber.bankAccountNumber === findUserAccountNumber.bankAccountNumber) {
      console.log(`Ten sam user`)
    } else {
      console.log(`Nie można zrobić przelewu z nie ze swojego konta!!`)
      res.send({error: true, message: "Nie można zrobić przelewu z nie ze swojego konta!!"})
      return res.status(401).send("Nie można zrobić przelewu z nie ze swojego konta!!");
      
    }
  } else {
    console.log(`Coś poszło nie tak`, )
    res.send({error: true, message: 'Coś poszło nie tak'})
    return res.status(500).send("Coś poszło nie tak");
  }

  const valueMoney = Number(findUserAccountNumber.money) - Number(howMuchMoney);
  if(valueMoney>=0){
    findUserAccountNumber.money = valueMoney;
  } else {
    res.send({error: true, message: 'Brak wystarczającej ilości pięniędzy!'})
    return res.status(500).send("Brak wystarczającej ilości pięniędzy!");
  }
  console.log(`dziala!`, findUserAccountNumber)

  if(Number(howMuchMoney)>0){
    findFinalClientAccount.money = Number(findFinalClientAccount.money) + Number(howMuchMoney)
  } else {
    res.send({error: true, message: 'Coś poszło nie tak, przepraszamy ;('})
    return res.status(500).send("Coś poszło nie tak, przepraszamy ;(");
  }

  const newUserTransfer = new Transfer({
    fromUser: {
      bankAccountNumber: findUserAccountNumber.bankAccountNumber,
      email: findUserAccountNumber.email,
      id: findUserAccountNumber._id
    },
    toUser: {
      bankAccountNumber: findFinalClientAccount.bankAccountNumber,
      email: findFinalClientAccount.email,
      id: findFinalClientAccount._id
    },
    body,
    howMuchMoney,
    createdAt: new Date().toISOString(),
  });


  
  if(findFinalClientAccount && findUserAccountNumber) {
    await newUserTransfer.save();
    const newTransfer = await findUserAccountNumber.save();
    await findFinalClientAccount.save();
    return res.send({transfer: newTransfer, message: 'Jest w pyte!'})
  } else {
    res.send({error: true, message: 'Błąd podczas zapisu danych'})
    return res.status(500).send("Błąd podczas zapisu danych");
  }
  
 } catch (error) {
   console.log(`error`, error)
   res.send(error)
 }
})

module.exports = app;