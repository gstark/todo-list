const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')

const app = express()

// Teach express that we are using url encoded parsing (forms)
app.use(bodyParser.urlencoded({ extended: false }))

// When our Todo List gets famous and we have that sweet iPhone app
// that uses JSON to send us data, lets enable json body parsing
//
// Teach express that we are using JSON as our input (API clients)
app.use(bodyParser.json())

// Configure mustache to be present in our app
app.engine('mustache', mustacheExpress())
app.set('views', './templates')
app.set('view engine', 'mustache')

const todoList = ['Clean dishes', 'Walk the dog', 'Make my lunch', 'Pack my umbrella', 'Commit my code to github']
const completedList = ['Get ready for lecture', 'Grade homework']

// When the user asks for `/`, say "Hello world"
app.get('/', (req, res) => {
  console.log(`${req.connection.remoteAddress} connected to me and asked for /`)

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

app.post('/addTodo', (req, res) => {
  // Algorithm for what to do here:
  // Get the descrption of the new todo item
  const descriptionForNewTodo = req.body.description

  // Add it to the list of todos
  todoList.push(descriptionForNewTodo)
  console.log(todoList)

  // Show the user the new list of todos
  // Go back to the / URL. We don't mention templates here
  res.redirect('/')
})

app.post('/markComplete', (req, res) => {
  // Get the description
  const descriptionOfTheTaskWeAreCompleting = req.body.descriptionOfTheTaskWeAreCompleting

  // Add the description to the completed List
  completedList.push(descriptionOfTheTaskWeAreCompleting)

  // Using indexOf and splice
  // remove the description from the todo List
  const indexOfItem = todoList.indexOf(descriptionOfTheTaskWeAreCompleting)
  // returns -1 if not found, otherwise the index of that item in the array
  todoList.splice(indexOfItem, 1)

  // Woot, filter for the win! (Slower, but easier to read/undertand?)
  // todoList = todoList.filter(description => description !== descriptionOfTheTaskWeAreCompleting)

  // send the user back to the / page
  res.redirect('/')
})

app.listen(3000, () => {
  console.log('Wow! Listening on port 3000.')
})
