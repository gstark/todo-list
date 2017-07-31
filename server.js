const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const jsonfile = require('jsonfile')

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

const todoList = jsonfile.readFileSync('todos.json')

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
  // Algorithm for what to do here:
  // Get the descrption of the new todo item
  const descriptionForNewTodo = req.body.description

  // Add it to the list of todos
  todoList.push({ id: todoList.length + 1, completed: false, description: descriptionForNewTodo })
  console.log(todoList)

  // Use the jsonfile module to write a file named `todos.json` with the contents of our array
  jsonfile.writeFile('todos.json', todoList, { spaces: 2 }, err => {
    console.log(`todos.json error: ${err}`)
  })

  // Show the user the new list of todos
  // Go back to the / URL. We don't mention templates here
  res.redirect('/')
})

app.post('/markComplete', (req, res) => {
  // Get the id
  const id = parseInt(req.body.id)

  const todo = todoList.find(todo => todo.id === id)

  if (todo) {
    todo.completed = true
    todo.when = new Date()

    // Use the jsonfile module to write a file named `todos.json` with the contents of our array
    jsonfile.writeFile('todos.json', todoList, { spaces: 2 }, err => {
      console.log(`todos.json error: ${err}`)
    })
  }

  // send the user back to the / page
  res.redirect('/')
})

app.listen(3000, () => {
  console.log('Wow! Listening on port 3000.')
})
