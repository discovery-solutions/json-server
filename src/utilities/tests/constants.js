export const PORT = 3501;
export const DB = "test-database";

export const JSON_EXAMPLE = {
  name: "test-server",
  config: {
    port: PORT,
    type: "rest",
    format: "json"
  },
  database: {
    type: "custom",
    key: DB,
    name: DB
  },
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
    }
  }, {
    name: "post",
    alias: "Post",
    fields: {
      title: {
        type: "string",
        required: true
      },
      body: {
        type: "string",
        required: true
      }
    }
  }]
};

export const AUTH_EXAMPLE = {
  auth: {
    type: "jwt",
    fields: ["email", "password"],
    secret: "MY-SECRET-FOR-AUTH",
    permission: {
      "*": {
        insert: false,
        update: false,
        delete: false,
        list: false,
        get: false,
      }
    }
  }
}
