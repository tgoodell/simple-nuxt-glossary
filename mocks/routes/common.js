// Use this file only as a guide for first steps using middleware variants. You can delete it when you have understood the concepts.
// For a detailed explanation about using middlewares, visit:
// https://mocks-server.org/docs/usage/variants/middlewares

const definitions = require('../fixtures/definitions')

module.exports = [
  {
    id: "add-headers", //route id
    url: "*", // url in express format
    method: ["GET", "POST", "PUT", "PATCH"], // HTTP methods
    variants: [
      {
        id: "enabled", // variant id
        type: "middleware", // variant handler id
        options: {
          // Express middleware to execute
          middleware: (_req, res, next, core) => {
            res.set("x-mocks-server-example", "some-value");
            core.logger.info("Custom header added by route variant middleware");
            next();
          },
        },
      },
      {
        id: "disabled", // variant id
        disabled: true,
      },
    ],
  },
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
                const termIndex = definitions.findIndex((termDef) => termDef.id == req.query.id)
                if (termIndex >= 0) {
                  definitions[termIndex] = req.query
                  res.status(204);
                  res.send();
                } else {
                  res.status(404);
                  res.send();
                }
              },
            },
        },
    ]
  }
];
