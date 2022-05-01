import Server from "../src/";

// TODO: Socket server

// TODO: vinculate server to specific database using key

const server = new Server({
  name: "my-server",
  config: [{
    port: 3501,             // * required
    type: "rest",           // * required
    format: "json", // csv  // * required
    request: {
      limit: 10,
    },
  }, {
    port: 3500,
    type: "socket",
  }],
  database: {
    type: "custom",          // * required
    key: "my-db-1",         // * required
    name: "json-test",      // * required
  },
  entities: [{
    name: "user",           // * required
    alias: "User",          // * required
    identifyer: "myid",
    fields: {               // * required
      name: {
        type: "string",
        required: true
      },
      email: {
        type: "string",
        required: true
      },
      password: {
        type: "string",
        required: true
      },
      phone: "string",
      birthdate: "date",
      avatar: "image",
      type: {
        type: "id",
        relation: "user-types",
      }
    },
    auth: {
      type: "jwt", // jwt | token
      fields: ["email", "password"],    // * required
      secret: "MY-SECRET-FOR-AUTH",     // required for JWT
      permission: { // default "*"
        "*": {
          insert: false,
          update: false,
          delete: false,
          list: true,
          get: false,
        },
        "user-types": {
          insert: true,
          update: true,
          delete: false,
          list: true,
          get: true,
        }
      }
    }
  }, {
    name: "user-types",
    alias: "UserTypes",
    fields: {
      label: "string",
    }
  }]
});

server.setup({
  request: {
    limit: 5
  }
});

// server.routes.get("/banana", (req, res) => {
//   res.code(200).json({ status: true });
// });

// server.getServerByPort(3501)

server.run();
