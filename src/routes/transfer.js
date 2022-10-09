import jwt from "jsonwebtoken";
import express from "express";
import User from "../schemas/User";
import bcryptjs from "bcryptjs";
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


  const findUserIdNumber = await User.findById(myIdUser);
  const findUserAccountNumber = await User.findOne({bankAccountNumber: numberSend});
  if(findUserAccountNumber && findUserIdNumber) {
    if(findUserIdNumber.bankAccountNumber === findUserAccountNumber.bankAccountNumber) {
      console.log(`Ten sam user`)
      // res.send(
      //   {
      //     findUserIdNumber: findUserIdNumber.bankAccountNumber, 
      //     findUserAccountNumber: findUserAccountNumber.bankAccountNumber
      //   })
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

  findUserAccountNumber.transfers.unshift({
    body,
    username,
    howMuchMoney,
    numberSend,
    numberReceived,
    send: true,
    createdAt: new Date().toISOString(),
  })
  const valueMoney = Number(findUserAccountNumber.money) - Number(howMuchMoney);
  if(valueMoney>=0){
    findUserAccountNumber.money = valueMoney;
  } else {
    res.send({error: true, message: 'Brak wystarczającej ilości pięniędzy!'})
    return res.status(500).send("Brak wystarczającej ilości pięniędzy!");
  }
  console.log(`dziala!`, findUserAccountNumber)
  
  findFinalClientAccount.transfers.unshift({
    body,
    username,
    howMuchMoney,
    numberSend,
    numberReceived,
    send: false,
    createdAt: new Date().toISOString(),
  })
  if(Number(howMuchMoney)>0){
    findFinalClientAccount.money = Number(findFinalClientAccount.money) + Number(howMuchMoney)
  } else {
    res.send({error: true, message: 'Coś poszło nie tak, przepraszamy ;('})
    return res.status(500).send("Coś poszło nie tak, przepraszamy ;(");
  }

  
  if(findFinalClientAccount && findUserAccountNumber) {
    const newTransfer = await findUserAccountNumber.save();
    await findFinalClientAccount.save();
    return res.send({transfer: newTransfer, message: 'Jest w pyte!'})
  } else {
    res.send({error: true, message: 'Błąd podczas zapisu danych'})
    return res.status(500).send("Błąd podczas zapisu danych");
  }

  // if(findUserAccountNumber.bankAccountNumber == findUserIdNumber.bankAccountNumber){
  //   console.log(`Przelew!`)
  // } else {
  //   console.log(`Nie można zrobić przelewu z nie ze swojego konta!!`, )
  // }

  

  // console.log(`findUserAccountNumber`, findUserAccountNumber)
  // console.log(`findUserAccountNumber`, findUserAccountNumber.bankAccountNumber)
  // console.log(`findUserIdNumber`, findUserIdNumber.bankAccountNumber)
  // try {
  //   if(findUserAccountNumber.bankAccountNumber !== findUserIdNumber.bankAccountNumber) {
  //     throw Error('Nie możesz zrobić przelewu z nie swojego konta')
  //   }
  // } catch (error) {
    
  // }
 
  // let sendUser = await User.findById(user.id);

  
 } catch (error) {
   console.log(`error`, error)
   res.send(error)
 }
})

module.exports = app;








// async addTransfer(_, { body, numberSend, numberReceived, username, howMuchMoney }, context ){
//   const user = checkAuth(context) //jest autoryzacja
//   console.log(`user :>>`, user )
//   if(!user){
//     errors.general = 'User not founds'
//     throw new UserInputError('Wrong transfer', {errors})
//   }
//   let sendUserFind = await User.findOne({bankAccountNumber: numberSend});
//   let sendUser = await User.findById(user.id);
//   console.log(`sendUser`, sendUser.bankAccountNumber) //92124074620448811439
//   console.log(`sendUserFind`, sendUserFind.bankAccountNumber) //92124062942001479231
//   if(sendUser.bankAccountNumber !== sendUserFind.bankAccountNumber){
//     throw Error('Nie możesz zrobić przelewu z nie swojego konta')
//   }
//   sendUserFind.transfers.unshift({
//     body,
//     username,
//     howMuchMoney,
//     numberSend,
//     numberReceived,
//     send: true,
//     createdAt: new Date().toISOString(),
//   })
//   let valueMoney = Number(sendUserFind.money) - Number(howMuchMoney);
//   if(valueMoney>=0){
//     sendUserFind.money = valueMoney;
//   } else {
//     throw Error('Brak wystarczającej ilości pieniędzy')
//   }
  
//   let receivedUserFind = await User.findOne({bankAccountNumber: numberReceived})
//   receivedUserFind.transfers.unshift({
//     body,
//     username,
//     howMuchMoney,
//     numberSend,
//     numberReceived,
//     send: false,
//     createdAt: new Date().toISOString(),
//   })
//   if(Number(howMuchMoney)>0){
//     receivedUserFind.money = Number(receivedUserFind.money) + Number(howMuchMoney)
//   } else {
//     throw Error('Wysyłasz ujemną wartość')
//   }
  

//   if(sendUserFind && receivedUserFind && valueMoney>=0) {
//     const newTransfer = await sendUserFind.save();
//     await receivedUserFind.save();
//     return newTransfer;
//   } else {
//     throw Error('Błąd podczas zapisu danych')
//   }
// },