// Use this file only as a guide for first steps using middleware variants. You can delete it when you have understood the concepts.
// For a detailed explanation about using middlewares, visit:
// https://mocks-server.org/docs/usage/variants/middlewares

const definitions = require('../fixtures/definitions')

function queryEntry(entry, search) {
  const termMatch = entry.term.toLowerCase().includes(search)
  const definitionMatch = entry.definition.toLowerCase().includes(search)
  return termMatch || definitionMatch
}

module.exports = [
  {
    id: 'get-terms', // route id
    url: '/api/glossary', // url in express format
    method: 'GET', // HTTP method
    variants: [
      {
        id: 'success', // variant id
        type: 'middleware', // variant handler id
        options: {
          middleware: (req, res, next, core) => {
            let search = req.query.search
            if (search) {
              search = search.toLowerCase()
              const matchedData = definitions.filter(entry => queryEntry(entry, search))
              res.status(200)
              res.send(matchedData)
            }
            else {
              res.status(200)
              res.send(definitions)
            }
          },
        },
      },
    ],
  },
  {
    id: 'edit-term', // route id
    url: '/api/glossary', // url in express format
    method: 'POST', // HTTP method
    variants: [
      {
        id: 'success', // variant id
        type: 'middleware', // variant handler id
        options: {
          middleware: (req, res, next, core) => { // Search for the user and remove it
            const termIndex = definitions.findIndex(termDef => termDef.id == req.body.id)
            if (termIndex >= 0) {
              definitions[termIndex] = req.body
              res.status(200) // Okay
              res.send()
            }
            else {
              res.status(404)
              res.send()
            }
          },
        },
      },
    ],
  },
  {
    id: 'add-term', // route id
    url: '/api/add', // url in express format
    method: 'POST', // HTTP method
    variants: [
      {
        id: 'success', // variant id
        type: 'middleware', // variant handler id
        options: {
          middleware: (req, res, next, core) => { // Search for the user and remove it
            // Find the next id to use
            const lastEntry = definitions.reduce(
              (prev, current) => {
                return prev.id > current.id ? prev : current
              },
            )
            const nextId = lastEntry.id + 1

            // Add new entry to definitions
            definitions[nextId] = {
              id: nextId,
              term: req.body.term,
              definition: req.body.definition,
            }
            console.log(definitions[nextId])
            res.status(201) // Created
            res.send()
          },
        },
      },
    ],
  },
  {
    id: 'bulk-upload', // route id
    url: '/api/bulk-upload', // url in express format
    method: 'POST', // HTTP method
    variants: [
      {
        id: 'success', // variant id
        type: 'middleware', // variant handler id
        options: {
          middleware: (req, res, next, core) => { // Search for the user and remove it
            // Find the next id to use
            const lastEntry = definitions.reduce(
              (prev, current) => {
                return prev.id > current.id ? prev : current
              },
            )
            let nextId = lastEntry.id + 1

            const base64String = req.body.data.split(',')[1]
            const binaryData = atob(base64String)
            const csvImport = binaryData.split('\n')
            for (let i = 0; i < csvImport.length; i++) {
              const pair = csvImport[i].split(',').map(entry => entry = entry.replaceAll('"', ''))
              // We only care if there is a valid pair
              if (pair.length == 2) {
                definitions[nextId] = {
                  id: nextId,
                  term: pair[0],
                  definition: pair[1],
                }
              }
              nextId++
            }

            res.status(200) // Created
            res.send()
          },
        },
      },
    ],
  },
]
