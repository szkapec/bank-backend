const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  console.log(`authHeader`, authHeader)
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  console.log(`authHeader`, authHeader)
  console.log(`token`, token)
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(`user`, user)
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

export default authenticateToken;


// authHeader Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNDJkYjQ0NGFlMTkxOGE4ZGMxYjMwYiIsIm5hbWUiOiJhIiwiZW1haWwiOiJhQG8yLnBsIiwiaWF0IjoxNjY1MzI2NzU3LCJleHAiOjE2NjU5NTE3NTd9.CQqGHAAFoySpiJZm0qh_7IDFg6VNT_8UkiDAbv8GuFY
// token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNDJkYjQ0NGFlMTkxOGE4ZGMxYjMwYiIsIm5hbWUiOiJhIiwiZW1haWwiOiJhQG8yLnBsIiwiaWF0IjoxNjY1MzI2NzU3LCJleHAiOjE2NjU5NTE3NTd9.CQqGHAAFoySpiJZm0qh_7IDFg6VNT_8UkiDAbv8GuFY



// authHeader Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNDJkYjQ0NGFlMTkxOGE4ZGMxYjMwYiIsIm5hbWUiOiJhIiwiZW1haWwiOiJhQG8yLnBsIiwiaWF0IjoxNjY1MzI3NDE5LCJleHAiOjE2NjU2NTI0MTl9.O6waCEvsSmlKjJxxDBHznuKHAM40wVtZeMANOOkgVS8
// authHeader Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNDJkYjQ0NGFlMTkxOGE4ZGMxYjMwYiIsIm5hbWUiOiJhIiwiZW1haWwiOiJhQG8yLnBsIiwiaWF0IjoxNjY1MzI3NDE5LCJleHAiOjE2NjU2NTI0MTl9.O6waCEvsSmlKjJxxDBHznuKHAM40wVtZeMANOOkgVS8
// token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNDJkYjQ0NGFlMTkxOGE4ZGMxYjMwYiIsIm5hbWUiOiJhIiwiZW1haWwiOiJhQG8yLnBsIiwiaWF0IjoxNjY1MzI3NDE5LCJleHAiOjE2NjU2NTI0MTl9.O6waCEvsSmlKjJxxDBHznuKHAM40wVtZeMANOOkgVS8