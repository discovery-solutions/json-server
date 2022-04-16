import Server from "../src/";

const servers = Server.run({
  name: "my-server",
  config: [{
    port: 3500,
    type: "rest",
    format: "json", // csv
  }, {
    port: 3501,
    type: "socket",
  }],
  entities: [{
    name: "user",
    alias: "User",
    identifyer: "myid",
    fields: {
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
      fields: ["login", "password"],
      permission: {
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

// console.log(servers);
