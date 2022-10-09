import dotenv from 'dotenv';
import jwt  from 'jsonwebtoken';
import express from 'express';
import User from './schemas/User';
import connectToDatabase from './config/connectToDataBase';
import cors from 'cors'

dotenv.config();

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
connectToDatabase();



const Register = require('./routes/register');
app.use('/api/users', Register)

const login = require('./routes/login');
app.use('/api/users', login)


const refresh = require('./routes/refreshToken');
app.use('/api/auth', refresh)

const users = require('./routes/users');
app.use('/api', users)

const auth = require('./routes/auth');
app.use('/api', auth)

const transfer = require('./routes/transfer');
app.use('/api', transfer)


app.post('/api/auth/login', (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    console.log(`req.body`, req.body)
    console.log(`email`, email)

    if(email === "") {
      return res.sendStatus(403)
    }
    // const validPassword = await bcrypt.compare(password, user[0].password)
  
    const accessToken = jwt.sign({ id: 1, name: 'matix' }, process.env.TOKEN_SECRET, { expiresIn: 325000 }) //stworz token
  
    //zapisac do bazy danych
    const refreshToken = jwt.sign({ id: 1, name: 'matix' }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: 625000 })
    console.log(`accessToken `, accessToken )
    res.send({ accessToken, refreshToken })
  } catch (error) {
    return res.sendStatus(403)
  }

})



// function authenticate(req, res, next) {

//   console.log(`req.body`, req.body)
//   const authHeader = req.headers['authorization']
//   const token = authHeader && authHeader.split(' ')[1]

//   if(token === null) return res.sendStatus(401)
//   //weryfikacja tokena
//   jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
//     if(err) return res.sendStatus(403)
//     req.user = user;
//     next() // zadanie dalej przetwarzane
//   })

// }








app.listen(5000, () => {
  console.log(`wake up! xd`, )
})