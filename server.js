const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const expressSession = require('express-session')
const pgPromise = require('pg-promise')()

const app = express()

// Connect to our database and give us a `database` object
const database = pgPromise({ database: 'tiy-todos' })


// Database structure
//
// table: "todos"
// - id           - SERIAL primary key
// - description  - VARCHAR / TEXT
// - completed    - BOOLEAN
// - when         - DATETIME
//

/*  DATABASE SCHEMA (tiy-todos)

    CREATE TABLE "todos" (
      "id" SERIAL PRIMARY KEY,
      "description" VARCHAR(300) NOT NULL,
      "completed" BOOLEAN NOT NULL,
      "when_completed" TIMESTAMP
    );
*/

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

// Matches /todo/1 and /todo/2 and /todo/3, etc.
app.get('/todo/:id_in_the_url', (req, res) => {
  // Pull out the ID from the url
  const idFromTheParamsWeGotFromTheURL = parseInt(req.params.id_in_the_url)

  // Go find the todo with this ID in the database
  //database.one('SELECT * FROM "todos" WHERE id = $1', idFromTheParamsWeGotFromTheURL)
  database.one('SELECT * FROM "todos" WHERE id = $(idForTheDatabase)',
   { idForTheDatabase: idFromTheParamsWeGotFromTheURL })
    // Bring back its details!
    .then(todo => {
      // Render a template
      res.render('tododetail', todo)
    })
})

// When the user asks for `/`, say "Hello world"
app.get('/', (req, res) => {
  // Lets see if we can access the database
  database.any('SELECT * FROM "todos"').then(rows => {
    // Sends a *STRING* to the user
    // res.send('Hello world')

    const templateData = {
      //    What                 Where
      //   mustache               the
      //   template              data
      //    sees               comes from
      //     |                     |
      //     v                     v
      uncompleted: rows.filter(todo => !todo.completed),
      completed: rows.filter(todo => todo.completed)
    }

    //                     The object with our data inside
    //                         |
    //                         v
    res.render('homepage', templateData)
  })
})

app.post('/addTodo', (req, res) => {
  // Algorithm for what to do here:
  // Get the descrption of the new todo item
  const descriptionForNewTodo = req.body.description

  const newTodo = { completed: false, description: descriptionForNewTodo }
  
  database
    // Ask the database to run a query that returns ONE thing (in this case the ID)
    // The query is INSERT INTO ......
    // The second argument is an array that fills in the placeholders $1 and $2
    //    that avoids the "Little Bobby Tables" SQL Injection problem
    //    $1 => 'Learn about SQL Injection' => description
    //    $2 => false => completed
    // ... and as the INSERT to *RETURN* the newly created `id`
    .one(`INSERT INTO "todos" (completed, description)
             VALUES($(completed), $(description)) RETURNING id`,
             newTodo)
    .then(newTodo => {
      // Show the user the new list of todos
      // Go back to the / URL. We don't mention templates here
      res.redirect(`/todo/${newTodo.id}`)
    })
})

app.post('/markComplete', (req, res) => {
  // Get the id
  const id = parseInt(req.body.id)

  // Database, please update a todo, we don't care about the data that comes back
  database
    // Change the completed to the FIRST ($1) in the array
    // Change the when_completed to the SECOND ($2) value in the array
    // WHERE the ID is the THIRD ($3) value in the array
    .none(`UPDATE "todos"
           SET completed = $(completed),
               when_completed = $(when_completed)
           WHERE id = $(id)`,
            // Completed is true
            // when_completed is the current date and time
            // the id is 4
            { id: id, completed: true, when_completed: new Date() })
    .then(() => {
      // send the user back to the / page
      res.redirect('/')
    })
})

app.listen(3000, () => {
  console.log('Wow! Listening on port 3000.')
})
