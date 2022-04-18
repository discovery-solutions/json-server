import Server from "../src/";

// TODO: Socket server

// TODO: vinculate server to specific database using key

const server = new Server({
  name: "my-server",
  config: [{
    port: 3501,             // * required
    type: "rest",           // * required
    format: "json", // csv  // * required
    database: "my-db-1",
    request: {
      limit: 10,
    },
  }, {
    port: 3500,
    type: "socket",
  }],
  database: {
    type: "mongo",          // * required
    key: "my-db-1",         // * required
    name: "json-test",      // * required
    uri: "mongodb+srv://default-user:user-password@cluster0.dr81f.gcp.mongodb.net/test?retryWrites=true&w=majority", // * required
  },
  entities: [{
    name: "user",           // * required
    alias: "User",          // * required
    identifyer: "myid",
    fields: {               // * required
      name: "string",
      email: "string",
      phone: "string",
      password: "string",
      birthdate: "date",
      avatar: "image",
      type: {
        relation: "user-types",
      }
    },
    auth: {
      type: "jwt", // oauth | token
      fields: ["login", "password"],    // * required
      permission: { // default "*"
        "*": {
          create: false,
          update: false,
          delete: false,
          list: false,
          get: false,
        },
        "user-types": {
          create: true,
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

// server.setup({
//   request: {
//     limit: 5
//   }
// })

server.run();
