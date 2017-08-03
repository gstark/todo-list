// require the pgPromise library
const pgPromise = require('pg-promise')()

// Connect to our database and give us a `database` object
const database = pgPromise({ database: 'tiy-todos' })

// ---- BOILERPLATE STOPS HERE ----

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
