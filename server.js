const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const jsonfile = require('jsonfile')
const expressSession = require('express-session')

const app = express()

app.use(
  expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  })
)

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

// When the user asks for `/`, say "Hello world"
app.get('/', (req, res) => {
  console.log(`${req.connection.remoteAddress} connected to me and asked for /`)

  const todoList = req.session.todoList || []

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
    uncompleted: todoList.filter(todo => !todo.completed),
    completed: todoList.filter(todo => todo.completed)
    // completed:   todoList.filter(function(todo) {
    //   return todo.completed
    // })
  }

  //                     The object with our data inside
  //                         |
  //                         v
  res.render('homepage', templateData)
})

app.post('/addTodo', (req, res) => {
  const todoList = req.session.todoList || []

  // Algorithm for what to do here:
  // Get the descrption of the new todo item
  const descriptionForNewTodo = req.body.description

  console.log(`The user is ${req.session.userName}`)

  // Add it to the list of todos
  todoList.push({ id: todoList.length + 1, completed: false, description: descriptionForNewTodo })
  console.log(todoList)

  // Place the todolist back in the session
  req.session.todoList = todoList

  // Show the user the new list of todos
  // Go back to the / URL. We don't mention templates here
  res.redirect('/')
})

app.post('/markComplete', (req, res) => {
  //
  //              The todoList from       Default
  //               our session object     empty todolist
  //                   |                   |
  //                   v                   v
  const todoList = req.session.todoList || []

  // Get the id
  const id = parseInt(req.body.id)

  const todo = todoList.find(todo => todo.id === id)

  if (todo) {
    todo.completed = true
    todo.when = new Date()

    // Place the todolist back in the session
    req.session.todoList = todoList
  }

  // send the user back to the / page
  res.redirect('/')
})

app.listen(3000, () => {
  console.log('Wow! Listening on port 3000.')
})
