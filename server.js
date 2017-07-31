const express = require('express')

const app = express()

// When the user asks for `/`, say "Hello world"
app.get('/', (req, res) => {
  console.log(`${req.connection.remoteAddress} connected to me and asked for /`)
  res.send('Hello world')
})

app.listen(3000, () => {
  console.log('Wow! Listening on port 3000.')
})
