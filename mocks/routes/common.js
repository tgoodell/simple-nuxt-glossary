// Use this file only as a guide for first steps using middleware variants. You can delete it when you have understood the concepts.
// For a detailed explanation about using middlewares, visit:
// https://mocks-server.org/docs/usage/variants/middlewares

const definitions = require('../fixtures/definitions')

module.exports = [
  {
    id: "get-terms", // route id
    url: "/api/glossary", // url in express format
    method: "GET", // HTTP method
    variants: [
        {
            id: "success", // variant id
            type: "json", // variant handler id
            options: {
                status: 200, // status to send
                body: definitions, // body to send
            },
        },
    ]
  },
  {
    id: "edit-term", // route id
    url: "/api/glossary", // url in express format
    method: "POST", // HTTP method
    variants: [
        {
            id: "success", // variant id
            type: "middleware", // variant handler id
            options: {
              middleware: (req, res, next, core) => { // Search for the user and remove it
                const termIndex = definitions.findIndex((termDef) => termDef.id == req.body.id)
                if (termIndex >= 0) {
                  definitions[termIndex] = req.body
                  res.status(200); // Okay
                  res.send();
                } else {
                  res.status(404);
                  res.send();
                }
              },
            },
        },
    ]
  },
  {
    id: "add-term", // route id
    url: "/api/add", // url in express format
    method: "POST", // HTTP method
    variants: [
        {
            id: "success", // variant id
            type: "middleware", // variant handler id
            options: {
              middleware: (req, res, next, core) => { // Search for the user and remove it
                // Find the next id to use
                const lastEntry = definitions.reduce(
                  (prev, current) => {
                    return prev.id > current.id ? prev : current
                  }
                );
                const nextId = lastEntry.id + 1

                // Add new entry to definitions
                definitions[nextId] = {
                  id: nextId,
                  term: req.body.term,
                  definition: req.body.definition
                }
                console.log(definitions[nextId])
                res.status(201); // Created
                res.send();
              },
            },
        },
    ]
  }
];
