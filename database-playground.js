// require the pgPromise library
const pgPromise = require('pg-promise')()

// Connect to our database and give us a `database` object
const database = pgPromise({ database: 'tiy-todos' })

// ---- BOILERPLATE STOPS HERE ----

// Update an existing todo

// Database, please update a todo, we don't care about the data that comes back
database
  // Change the completed to the FIRST ($1) in the array
  // Change the when_completed to the SECOND ($2) value in the array
  // WHERE the ID is the THIRD ($3) value in the array
  .none('UPDATE "todos" SET completed = $1, when_completed = $2 WHERE id = $3',
          // Completed is true
          // when_completed is the current date and time
          // the id is 4
          [true, new Date(), 4])

// Insert someting into the Database
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
          { 
            description: 'Learn about SQL Injection',
            completed: false
          })
  // THEN, give me that new information as the variable `data`
  .then(data => {
    // Print out that data
    console.log(`Our insert returned`, data)
  })

// Database, we are asking you for *ANY* number of rows
// for the query in the string variable `query`
// WHEN you have data, we are going to console log it
database.any('SELECT * FROM "todos"').then(rows => {
  // Since rows is an array, use forEach to go through them
  rows.forEach(row => {
    // This is each row at a time, row is an OBJECT
    console.log(`Today I need to ${row.description} -- it is task ${row.id}`)
  })
})

//
//
//
//
//
//
