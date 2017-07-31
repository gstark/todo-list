const express = require('express')
const mustacheExpress = require('mustache-express')

const app = express()

// Configure mustache to be present in our app
app.engine('mustache', mustacheExpress())
app.set('views', './templates')
app.set('view engine', 'mustache')

// When the user asks for `/`, say "Hello world"
app.get('/', (req, res) => {
  console.log(`${req.connection.remoteAddress} connected to me and asked for /`)

  // Sends a *STRING* to the user
  // res.send('Hello world')

  res.render('homepage')
})

app.listen(3000, () => {
  console.log('Wow! Listening on port 3000.')
})
