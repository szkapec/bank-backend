import jwt from "jsonwebtoken";
import express from "express";
import User from "../schemas/User";
import bcryptjs from "bcryptjs";
import { authenticate } from "../config/authenticate";

const app = express();

app.post('/transfer', authenticate, async(req, res) => {
 try {
  console.log(`req.body`, req.body)
  const users = [{id: 1, name: 'Matix'}]
  const { numberSend, numberReceived, username, howMuchMoney, myIdUser } = req.body

  let findUserAccountNumber = []
  let findUserIdNumber = []
  findUserAccountNumber = await User.findOne({email: numberSend});
  findUserIdNumber = await User.findById(myIdUser);

  // console.log(`findUserAccountNumber.bankAccountNumber`, findUserAccountNumber)
  console.log(`findUserIdNumber.bankAccountNumber`, findUserIdNumber)

  // if(findUserAccountNumber.bankAccountNumber == findUserIdNumber.bankAccountNumber){
  //   console.log(`Przelew!`)
  // } else {
  //   console.log(`Nie można zrobić przelewu z nie ze swojego konta!!`, )
  // }
  res.send(
    {test: findUserIdNumber.bankAccountNumber})
  

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