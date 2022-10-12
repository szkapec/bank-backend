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
    fromNumber: findUserAccountNumber.bankAccountNumber,
    toNumber: findFinalClientAccount.bankAccountNumber,
    body,
    howMuchMoney,
    createdAt: new Date().toISOString(),
  });


  
  if(findFinalClientAccount && findUserAccountNumber) {
    await newUserTransfer.save();
    const newTransfer = await findUserAccountNumber.save();
    newTransfer.message = "Przelew wykonany!"
    newTransfer.error = false
    await findFinalClientAccount.save();
    return res.send(newTransfer)
  } else {
    res.send({error: true, message: 'Błąd podczas zapisu danych'})
    return res.status(500).send("Błąd podczas zapisu danych");
  }
  
 } catch (error) {
   console.log(`error`, error)
   res.send(error)
 }
})

app.get('/transfers', authenticate, async(req, res) => { 
  try {
    const { bankAccountNumber } = req.body
    console.log(`bankAccountNumber`, bankAccountNumber)
    const fromClient = await Transfer.find({$or: [{fromNumber: bankAccountNumber}, {toNumber: bankAccountNumber}]}).limit(20);//.limit(10)
    // const toClient = await Transfer.find({toNumber: bankAccountNumber});

    console.log(`fromClient`, fromClient)
    // console.log(`toClient`, toClient)

    return res.send({fromClient, message: 'Jest w pyte!'})
  } catch (error) {
    console.log(`error`, error)
    res.send(error)
  }
})

module.exports = app;