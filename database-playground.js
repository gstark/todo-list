// require the pgPromise library
const pgPromise = require('pg-promise')()

// Connect to our database and give us a `database` object
const database = pgPromise({ database: 'tiy-todos' })

// ---- BOILERPLATE STOPS HERE ----


// Insert someting into the Database
database
  // Ask the database to run a query that returns ONE thing (in this case the ID)
  // The query is INSERT INTO ......
  // The second argument is an array that fills in the placeholders $1 and $2
  //    that avoids the "Little Bobby Tables" SQL Injection problem
  //    $1 => 'Learn about SQL Injection' => description
  //    $2 => false => completed
  // ... and as the INSERT to *RETURN* the newly created `id`
  .one('INSERT INTO "todos" (description, completed) VALUES($1, $2) RETURNING id',
          ['Learn about SQL Injection', false])
  // THEN, give me that new information as the variable `data`
  .then(data => {
    // Print out that data
    console.log(`Our insert returned`, data)
  })

// Database, we are asking you for *ANY* number of rows
// for the query in the string variable `query`
// WHEN you have data, we are going to console log it
database.any('SELECT * FROM "todos"').then(rows => {
  console.log(rows)

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
