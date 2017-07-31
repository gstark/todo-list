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

  const todoList = ['Clean dishes', 'Walk the dog', 'Make my lunch', 'Pack my umbrella', 'Commit my code to github']
  const completedList = ['Get ready for lecture', 'Grade homework']

  console.log(todoList)

  // Sends a *STRING* to the user
  // res.send('Hello world')

  const templateData = {
    //    What                 Where
    //   mustache               the
    //   template              data
    //    sees               comes from
    //     |                     |
    //     v                     v
    todoListForTheBrowser: todoList,
    completedListForTheBrowser: completedList
  }

  //                     The object with our data inside
  //                         |
  //                         v
  res.render('homepage', templateData)
})

app.listen(3000, () => {
  console.log('Wow! Listening on port 3000.')
})
