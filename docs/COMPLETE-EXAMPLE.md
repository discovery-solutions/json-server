# Complete Example

```js
import Server from "@discovery-solutions/json-server";

const server = new Server({
  name: "my-server",
  config: [{
    port: 3501,
    type: "rest",
    format: "json",
    database: "my-db-1",
    request: {
      limit: 10,
    },
  }, {
    port: 3500,
    type: "socket",
    format: "csv",
    database: "my-db-2",
    request: {
      limit: 1000,
    },
  }],
  database: [{
    type: "custom",
    key: "my-db-1",
    name: "my-custom-db"
  }, {
    type: "mongo",
    key: "my-db-2",
    name: "my-mongo-db",
    uri: "mongodb+srv://default-user:user-password@cluster0.dr81f.gcp.mongodb.net/test?retryWrites=true&w=majority",
  }],
  entities: [{
    name: "user",
    alias: "User",
    fields: {
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
      type: "jwt", // oauth | token
      fields: ["login", "password"],    // * required
      permission: { // default "*"
        "*": {
          insert: false,
          update: false,
          delete: false,
          list: true,
          get: true,
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
  database: {
    default: "my-project-default-name",
  },
  request: {
    limit: 5
  }
});

server.run();

```
